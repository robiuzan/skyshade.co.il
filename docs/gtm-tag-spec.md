# GTM tag spec — the exact container build

**Container:** `GTM-KWGGH438` (⚠️ fleet-shared) · **GA4:** `G-BRZ0S93NFS` · **Written:** 2026-08-24 ·
**Container inspected live:** 2026-08-25

This is W1 of [phase-2-improvement-plan.md](phase-2-improvement-plan.md), the step everything else
waits on. Until it is built, no conversion number on this site exists.

Building it is a dashboard task and cannot be done from the repo. **The site side is done:** the
events below are already firing into `window.dataLayer`, verified in the build of 2026-08-24.

## ⚠️ Read first — this container is SHARED across the fleet

Inspected live 2026-08-25. `GTM-KWGGH438` is **not a skyshade container**. It serves ten Israeli
fleet sites and picks the GA4 property with a hostname lookup table:

| | | | |
|---|---|---|---|
| betonplus.co.il | 3locksmiths.co.il | netomazganim.co.il | gagoline.co.il |
| visionsecurity.co.il | galbath.co.il | hambabait.co.il | myhomeplumber.co.il |
| dangates.co.il | **skyshade.co.il → G-BRZ0S93NFS** | | |

It contains exactly **one** real tag — the GA4 config (`googtag`). Verified absent: `form_start`,
`lead_submit_failed`, `phone_call_click`, `whatsapp_click`, `email_click`, and any `tel:` / `wa.me`
click trigger. (`generate_lead` does appear in the file, but only inside GA4's own library
boilerplate — it is not a configured tag. Do not read its presence as "already wired".)

**Consequence: an unscoped trigger added here fires on nine other clients' sites.** Choose one:

- **Option A — scope to skyshade (recommended first).** Add `Page Hostname equals skyshade.co.il`
  as a second condition on **every** trigger below, and hardcode `G-BRZ0S93NFS` on the tags. Safe,
  reversible, affects nobody else. Do this now.
- **Option B — fleet-wide.** Drop the hostname condition and set the tags' measurement ID from the
  existing hostname-lookup variable, so all ten sites get lead tracking from one build. Only after
  confirming every other site pushes these exact event names — they share `@ishub/site-kit`, so it
  is plausible but unverified. This is a fleet decision, not a skyshade one.

Everything below assumes Option A.

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

**Every trigger carries `Page Hostname equals skyshade.co.il` as an additional condition** (see the
shared-container warning above). Name them `SS - …` so they are distinguishable from any fleet-wide
triggers added later.

| Trigger name | Type | Conditions (all must match) |
|---|---|---|
| `SS - CE - form_start` | Custom Event | Event equals `form_start` · Page Hostname equals `skyshade.co.il` |
| `SS - CE - generate_lead` | Custom Event | Event equals `generate_lead` · Page Hostname equals `skyshade.co.il` |
| `SS - CE - lead_submit_failed` | Custom Event | Event equals `lead_submit_failed` · Page Hostname equals `skyshade.co.il` |
| `SS - Click - phone` | Click – Just Links (wait-for-tags off) | Click URL starts with `tel:` · Page Hostname equals `skyshade.co.il` |
| `SS - Click - whatsapp` | Click – Just Links | Click URL contains `wa.me` · Page Hostname equals `skyshade.co.il` |
| `SS - Click - email` | Click – Just Links | Click URL starts with `mailto:` · Page Hostname equals `skyshade.co.il` |

### 3. Tags

All are **GA4 Event** tags pointing at the existing GA4 Configuration tag (`G-BRZ0S93NFS`).

| Tag name | Event name | Parameters | Trigger |
|---|---|---|---|
| `SS - GA4 - form_start` | `form_start` | `form_location` = `{{dlv - form_location}}` | `SS - CE - form_start` |
| `SS - GA4 - generate_lead` | `generate_lead` | `form_location`, `service`, `consent`, `has_message` from their dlv variables | `SS - CE - generate_lead` |
| `SS - GA4 - lead_submit_failed` | `lead_submit_failed` | `form_location`, `error_type` | `SS - CE - lead_submit_failed` |
| `SS - GA4 - phone_call_click` | `phone_call_click` | `link_location` = `{{cjs - cta location}}` | `SS - Click - phone` |
| `SS - GA4 - whatsapp_click` | `whatsapp_click` | `link_location` = `{{cjs - cta location}}` | `SS - Click - whatsapp` |
| `SS - GA4 - email_click` | `email_click` | `link_location` = `{{cjs - cta location}}` | `SS - Click - email` |

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
5. **Shared-container safety:** open GTM Preview against a second fleet domain (e.g.
   `https://galbath.co.il/`) and confirm none of the six `SS - …` tags fire there. If one does, its
   hostname condition is missing and you are writing skyshade events into another client's property.

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
