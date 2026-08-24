---
name: conversion-cro
description: Conversion-rate work for skyshade — the call/WhatsApp/form hierarchy, LeadForm friction and its failure-recovery path, CTA placement per page type, trust-signal positioning, mobile behaviour, and how to propose a change so its effect is measurable. Use when improving lead volume, editing forms or CTAs, or auditing a page for conversion. Triggers: "conversion", "CRO", "lead form", "CTA", "more leads", "bounce", "user engagement", "friction", "sticky bar".
---

# Conversion

## The hierarchy

1. **Phone call** — highest intent, highest close rate for this category in Israel.
2. **WhatsApp** — the default for Israeli homeowners who don't want to talk yet. Often the top
   channel by volume.
3. **Lead form** — for after-hours and for people who want to send photos/dimensions.

Every page keeps a call and a WhatsApp action within reach. `MobileCtaBar` is sticky on mobile;
desktop keeps them in the header and in each section's `FinalCta`.

## LeadForm — what is load-bearing

- **Name + phone required, everything else optional.** Do not add a required field without an
  argument for the leads it will cost.
- **The WhatsApp recovery path** on submit failure — a deep link pre-filled with what the user
  typed. A silent failure here is a lost lead that nobody ever hears about. This is not optional
  polish; it was a shipped defect.
- **`lead_submit_failed`** must fire on failure. Alarm if it is ever > 0 (`docs/measurement-plan.md`).
- **The consent checkbox is unbundled and unchecked** (חוק הספאם). Never pre-check it, never bundle
  it with "I agree to the terms".
- Honeypot stays. Web3Forms key comes from the manifest.
- **No PII into the dataLayer.** Categorical parameters only.

## CTA placement by page type

| Page | Above fold | Mid | End |
|---|---|---|---|
| Home | call + WhatsApp in hero | after `WhyUs` | `FinalCta` + form |
| Service | call + "הצעת מחיר" | after the spec/benefits block | form with the service pre-selected |
| City | call | after the local proof | form |
| Guide | **no hard CTA** — a soft link to the service page | contextual service link | form after the answer is delivered |
| Gallery | WhatsApp ("שלחו לנו תמונה של המרפסת") | per-category service links | form |

Guides that open with a sales CTA lose the informational query they were built to win.

## Friction inventory (audit these, in order)

1. Is the phone number tappable on mobile and visible without scrolling?
2. Does the form say what happens next and when? (Only if the response time is confirmed — else say
   nothing rather than promising.)
3. Is there a reason to act now that is true (season, lead time), not manufactured urgency?
4. Are trust signals adjacent to the action, not on a separate page? (What is publishable is gated
   by `eeat-trust-evidence` — an empty trust bar is worse than none.)
5. Can a user get a rough price anywhere on the site? Today: no. That is the largest single friction
   point, and it is unblocked by the `/guides/…-cost/` pages, not by a `/pricing/` page.
6. Does anything move under the thumb on load (CLS)? See `performance-web-vitals`.
7. Is the WhatsApp affordance a real link with an accessible label, and does it use the accessible
   green token `#0E7A34` for text (brand `#25D366` for icons/backgrounds only)?

## Proposing a change

A CRO change is not "done" until its metric is named and its baseline is written down. Format:

```
Change:   pre-select the service on /service/[slug]/ form
Metric:   form_start → generate_lead rate on service pages
Baseline: <value> (from GA4, dated)
Expect:   +x pp; read after 4 weeks or 200 sessions, whichever is later
```

With current traffic volume, A/B testing is not viable — changes ship sequentially, one per read
window, each logged in `docs/measurement-plan.md`. Simultaneous changes make everything
unattributable, which is the audit's named biggest failure mode.
