---
name: tracking-analytics
description: Measurement for skyshade — the GTM/GA4 event and dataLayer spec, the currently-broken lead tracking, consent mode sequencing, the no-PII rule, and the change-log discipline that keeps every SEO/CRO change attributable. Use when wiring events, debugging why GA4 shows nothing, or defining how a change will be measured. Triggers: "GA4", "GTM", "analytics", "tracking", "events", "dataLayer", "conversion tracking", "consent mode", "how do we measure".
---

# Measurement

## Current state — read this first

GTM `GTM-KWGGH438` is in `<head>` and fires. GA4 `G-BRZ0S93NFS` exists. **But the container has one
tag**, so every `trackEvent()` call in the code pushes into the dataLayer and dies there. GA4 has
page views and nothing else. Search Console is verified (2026-08-23) with no historical data.

That means: **there is no lead data yet.** Any claim about conversion rate today is unfounded, and
the first job of any measurement work is wiring the events below — everything else in the roadmap
depends on it.

## The event spec (`audit-roadmap-full.md` §6.3)

| Event | Fires on | Parameters (categorical only) |
|---|---|---|
| `form_start` | first input focus in `LeadForm` | `form_location` |
| `generate_lead` | successful Web3Forms submit | `form_location`, `service`, `consent` |
| `lead_submit_failed` | submit error | `form_location`, `error_type` — **alarm if > 0** |
| `phone_call_click` | any `tel:` click | `link_location` |
| `whatsapp_click` | any WhatsApp click | `link_location`, `prefilled` |
| `gallery_filter` | category change | `category` |
| `scroll_75` | 75% depth on guides | `page_type` |

`trackEvent()` from `@ishub/site-kit/analytics` is the only push path. In GTM: one Custom Event
trigger per event name, one GA4 Event tag each, parameters mapped explicitly.

**Never send PII.** No name, phone, email, message text, or anything derived from them. `service` is
the select value, not free text.

## Verifying a tag actually works

A snippet in the HTML proves nothing:

```bash
curl -sS -o /dev/null -w '%{http_code}\n' 'https://www.googletagmanager.com/gtm.js?id=GTM-KWGGH438'
```

Then GTM Preview → trigger the real interaction → confirm the GA4 tag fires → confirm it in GA4
DebugView. Only after all four does the event count as wired.

## Sequencing (non-negotiable, from `docs/measurement-plan.md`)

1. **Week 1:** events + GSC → then **4 clean weeks** of baseline. No other measurement change.
2. **Weeks 5–6:** Consent Mode v2 + banner. Write the expected **20–40% measured-session drop** down
   *before* shipping it, or it will read as a traffic collapse.
3. **Week 7+:** the GTM defer experiment.
4. **Title changes freeze for 90 days** after the Phase-1 final state.

## The KPI set

Leads/week by channel (`generate_lead` + `phone_call_click` + `whatsapp_click` — an intent proxy that
overcounts; always say so) · `form_start`→`generate_lead` rate per form location · GSC clicks and
position on the fixed ~30-keyword set · indexed-page count · `lead_submit_failed` · AI-assistant
referral sessions.

## The change-log rule

**No recommendation is "done" until its metric is named and its baseline value is written into
`docs/measurement-plan.md`, and every shipped change gets a dated row.** This exists because the
audit's biggest identified failure mode is simultaneous change making everything unattributable. One
substantive change per read window; if two must ship together, say in the log that they are
confounded.

## Attribution helper already in place

`app/layout.tsx` writes a first-touch object (`referrer` + landing path) to `sessionStorage` once per
session; `LeadForm` reads it on submit so the lead email carries its source. No cookie, no PII,
nothing sent to analytics. It is disclosed in `/privacy/` — keep both in sync.
