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

`form_location` values — **all four, verified against the call sites 2026-09-01**:
`home-hero` ([Hero.tsx:70](../components/marketing/Hero.tsx)) · `contact-page`
([contact/page.tsx:109](../app/contact/page.tsx)) · `service-page`
([service/[slug]/page.tsx:230](../app/service/[slug]/page.tsx)) · `city-page`
([locations/[city]/page.tsx:118](../app/locations/[city]/page.tsx)).

⚠️ This line previously listed only the first two. The form went from 2 pages to **24** on
2026-08-25 and the doc was never updated — a funnel dashboard built from the old line would have
charted 2 of 24 pages and missed the two highest-coverage placements. `unknown` is the component
default ([LeadForm.tsx:30](../components/forms/LeadForm.tsx)) and is currently unreachable; if it
ever appears in GA4, a placement is missing the prop.

**Two dimensions are not comparable across `form_location`, and reports must say so:**

- **`has_message` is structurally `false` for `city-page`.** The compact variant renders no
  textarea, so the field is absent by construction, not by visitor behaviour.
- **`service` is pre-filled for `service-page`** (`defaultService={card.name}`), so those leads are
  pre-attributed and not comparable with home/contact, where the visitor actively chose.

**No PII, ever.** `service` is the `<select>` value; `consent` is a boolean; the free-text message
is reduced to `has_message`. Name, phone and message text never enter the dataLayer.

## Call and WhatsApp clicks — no code needed

Every call/WhatsApp/email link carries a `data-cta` attribute. GTM reads it directly, which is why
these are **not** pushed from code:

`hero-call` · `hero-whatsapp` · `header-call` · `sticky-call` · `sticky-whatsapp` ·
`finalcta-call` · `finalcta-whatsapp` · `service-aside-call` · `service-aside-whatsapp` ·
`contact-call` · `contact-whatsapp` · `contact-email` · `footer-call` ·
**`footer-email`** · **`form-whatsapp`** · **`form-recovery-whatsapp`** · **`form-recovery-call`**

⚠️ The last four were added 2026-09-01. Until then this sentence claimed "every link already
carries one" while `LeadForm` carried **none** and the footer email carried none — so those clicks
resolved to `link_location = 'unknown'`, and the form's WhatsApp link (rendered on 24 of 36 pages,
the second-most-shown WhatsApp link on the site after the sticky bar) was indistinguishable from
the rare failure-recovery clicks. They were added **before** the tags were built precisely so the
`unknown` bucket does not visibly shrink mid-baseline; GA4 cannot re-attribute retroactively.

`form-recovery-*` render only inside the delivery-failure block, so they will be rare by design —
a nonzero count there is a signal worth reading alongside the `lead_submit_failed` alarm.

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

### 🔴 P0 — Enhanced Measurement settings, do these BEFORE the baseline opens

Both are per-data-stream on `G-BRZ0S93NFS`. They touch **no other fleet site** — only the GTM
container is shared, not the GA4 property. Neither is fixable retroactively once data lands.

**(a) Redact URL query parameters — this is a live PII exposure, not a hypothetical.**

`Admin → Data streams → skyshade → Enhanced measurement → Redact data → URL query parameters`, add:

```
text, name, phone, message, service
```

Why: `buildWhatsapp()` interpolates the visitor's **name, phone and free-text message** into the
WhatsApp deep link, and it is rendered as a real `<a href>` in the failure-recovery block. GA4
Enhanced Measurement's **Outbound clicks** is on by default and records the full destination URL as
`link_url` — which would write a real homeowner's name and mobile number into GA4. That breaks the
no-PII rule, the GA4 ToS, and what `/privacy/` tells the visitor. `text` is the parameter that
carries it; the other four are belt-and-braces against a native GET submit after a hydration
failure putting those same keys into `page_location`.

Verify in DebugView: force a delivery failure, click the recovery link, confirm `link_url` is
redacted.

**(b) Decide the "Form interactions" toggle, and write the decision down.**

GA4 auto-collects events literally named `form_start` and `form_submit`. If left on, GA4's own
`form_start` (once per **session**, no `form_location`) merges with the one this site pushes (once
per **mount**, with `form_location`) under a single event name — different scoping rules, with
roughly half the rows landing in `(not set)`.

**Check the current toggle state first — nobody has.** Preferred: **turn it off**, since the
site's own event is strictly richer. The honest trade-off: GA4's auto `form_submit` would fire even
here (the submit event bubbles before `preventDefault` takes effect), partially covering the
submit-attempt signal the site does not yet push. `form_location` is separable retroactively; the
headline `form_start` count is not.

Record whichever way it lands, or the next container builder silently undoes it.

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
