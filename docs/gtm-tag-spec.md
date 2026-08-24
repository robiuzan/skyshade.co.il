# GTM tag spec — the exact container build

**Container:** `GTM-KWGGH438` · **GA4:** `G-BRZ0S93NFS` · **Written:** 2026-08-24

This is W1 of [phase-2-improvement-plan.md](phase-2-improvement-plan.md), the step everything else
waits on. The container currently has **one tag**, so every event the site pushes lands in the
dataLayer and dies there — GA4 has page views and nothing else. Until this is built, no conversion
number on this site exists.

Building it is a dashboard task and cannot be done from the repo. **The site side is done:** the
events below are already firing into `window.dataLayer`, verified in the build of 2026-08-24.

---

## What the site already pushes

Via `trackEvent()` (`@ishub/site-kit/analytics` → `dataLayer.push({event, ...params})`).
Source: [components/forms/LeadForm.tsx](../components/forms/LeadForm.tsx).

| dataLayer `event` | Fires when | Params |
|---|---|---|
| `form_start` | first focus in the lead form, once per mount | `form_location` |
| `generate_lead` | Web3Forms confirms delivery — **only** on real success | `form_location`, `service`, `consent`, `has_message` |
| `lead_submit_failed` | delivery failed, or the access key is missing | `form_location`, `error_type` |

`form_location` values: `home-hero`, `contact-page`. Add the value when a third form is placed.

**No PII, ever.** `service` is the `<select>` value; `consent` is a boolean; the free-text message
is reduced to `has_message`. Name, phone and message text never enter the dataLayer.

## Call and WhatsApp clicks — no code needed

Every call/WhatsApp/email link already carries a `data-cta` attribute. GTM reads it directly, which
is why these are **not** pushed from code:

`hero-call` · `hero-whatsapp` · `header-call` · `sticky-call` · `sticky-whatsapp` ·
`finalcta-call` · `finalcta-whatsapp` · `service-aside-call` · `service-aside-whatsapp` ·
`contact-call` · `contact-whatsapp` · `contact-email` · `footer-call`

---

## Build order in GTM

### 1. Variables

Enable the built-ins first: **Click Element**, **Click URL**, **Page Path**, **Page URL**.

Then create these Data Layer Variables (Variable Type → Data Layer Variable, version 2):

| Variable name | Data layer key |
|---|---|
| `dlv - form_location` | `form_location` |
| `dlv - service` | `service` |
| `dlv - consent` | `consent` |
| `dlv - error_type` | `error_type` |
| `dlv - has_message` | `has_message` |

One more, a **Custom JavaScript** variable named `cjs - cta location` — it reads the `data-cta`
attribute off the clicked element or its nearest link ancestor:

```js
function () {
  var el = {{Click Element}};
  if (!el) return 'unknown';
  var node = el.closest ? el.closest('[data-cta]') : null;
  return (node && node.getAttribute('data-cta')) || 'unknown';
}
```

### 2. Triggers

| Trigger name | Type | Condition |
|---|---|---|
| `CE - form_start` | Custom Event | Event name equals `form_start` |
| `CE - generate_lead` | Custom Event | Event name equals `generate_lead` |
| `CE - lead_submit_failed` | Custom Event | Event name equals `lead_submit_failed` |
| `Click - phone` | Click – Just Links (wait for tags off) | Click URL **starts with** `tel:` |
| `Click - whatsapp` | Click – Just Links | Click URL **contains** `wa.me` |
| `Click - email` | Click – Just Links | Click URL **starts with** `mailto:` |

### 3. Tags

All are **GA4 Event** tags pointing at the existing GA4 Configuration tag (`G-BRZ0S93NFS`).

| Tag name | Event name | Parameters | Trigger |
|---|---|---|---|
| `GA4 - form_start` | `form_start` | `form_location` = `{{dlv - form_location}}` | `CE - form_start` |
| `GA4 - generate_lead` | `generate_lead` | `form_location`, `service`, `consent`, `has_message` from their dlv variables | `CE - generate_lead` |
| `GA4 - lead_submit_failed` | `lead_submit_failed` | `form_location`, `error_type` | `CE - lead_submit_failed` |
| `GA4 - phone_call_click` | `phone_call_click` | `link_location` = `{{cjs - cta location}}` | `Click - phone` |
| `GA4 - whatsapp_click` | `whatsapp_click` | `link_location` = `{{cjs - cta location}}` | `Click - whatsapp` |
| `GA4 - email_click` | `email_click` | `link_location` = `{{cjs - cta location}}` | `Click - email` |

### 4. In GA4 itself

- **Admin → Events → Mark as conversion:** `generate_lead`, `phone_call_click`, `whatsapp_click`.
- **Admin → Custom definitions → Custom dimensions** (event-scoped): `form_location`, `service`,
  `link_location`, `error_type`. Without these the parameters are collected but never reportable.
- **Custom insight / alert:** `lead_submit_failed` count > 0 in a day → email. This is the alarm
  that catches silent lead loss; it is the single most valuable thing in this document.

---

## Verification — all four, or it is not wired

A snippet in the HTML proves nothing.

1. `curl -sS -o /dev/null -w '%{http_code}\n' 'https://www.googletagmanager.com/gtm.js?id=GTM-KWGGH438'` → **200**
2. GTM **Preview** on `https://skyshade.co.il/` → perform each real interaction → the trigger fires
3. …and the matching GA4 tag fires (not just the trigger)
4. GA4 **DebugView** shows the event with its parameters attached

Then, and only then, record the date in [measurement-plan.md](measurement-plan.md) and start the
**four clean weeks** of baseline. No other measurement change ships inside that window — that is
what makes everything after it attributable.

## What deliberately is not here

- **Consent Mode v2** — scheduled for weeks 5–6, *after* the baseline exists, with its expected
  20–40% measured-session drop written down first.
- **Scroll and engagement events** — add once the guides silo has traffic worth segmenting.
- **Any tag that sends PII, or any Ads/Meta pixel.** Adding one is also a CSP change: its host must
  go into `public/_headers` **before** the tag is published, or it breaks silently the day the CSP
  stops being report-only. Whoever edits this container owns that allowlist.
