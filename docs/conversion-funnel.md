# Conversion funnel — the state

**Written:** 2026-09-01 · Procedure: the `conversion-cro` skill.
Mobile specifics: [mobile-ux-and-personalization.md](mobile-ux-and-personalization.md).
Every change here writes a row to [measurement-plan.md](measurement-plan.md).

---

## 1. Read this before proposing anything

**No conversion rate for this site is currently known.** GTM `GTM-KWGGH438` holds exactly one
real tag (the GA4 config); `form_start`, `generate_lead` and `lead_submit_failed` are pushed
correctly by the site and then **die in the dataLayer**. There are no `tel:` or `wa.me` click
triggers. See [gtm-tag-spec.md](gtm-tag-spec.md).

So: every statement about "the biggest friction point" on this site today — including the ones in
this file — is a **hypothesis ranked by judgement, not a measurement**. That is stated once here
so it does not have to be re-litigated per proposal, and it is the reason W1 precedes W9 in
[phase-2-improvement-plan.md](phase-2-improvement-plan.md).

The corollary: a CRO change that ships before the events exist is unattributable forever. There
is no retroactive baseline.

## 2. The funnel

```
   Search / AI answer / direct
              │
              ▼
   ┌──────────────────────┐
   │  Landing             │  home · service ×6 · guide ×3 · city ×16 · gallery
   └──────────┬───────────┘
              │  scroll, read, look at photos
              ▼
   ┌──────────────────────┐
   │  Intent formed       │  "these people can do my thing"
   └──────────┬───────────┘
              │
      ┌───────┼────────────────┬─────────────────────┐
      ▼       ▼                ▼                     ▼
   ┌──────┐ ┌──────────┐  ┌──────────┐        ┌────────────┐
   │ Call │ │ WhatsApp │  │   Form   │        │   Leaves   │
   └──────┘ └──────────┘  └────┬─────┘        └────────────┘
   instant   async, low     form_start
   highest   friction, the      │
   intent    evening default    ▼
                          generate_lead ──or── lead_submit_failed
                                                      │
                                             recovery: WhatsApp / call
```

**Intent order: call → WhatsApp → form.** A call is the highest-intent, highest-value exit and it
is the one the business is set up to answer. The form is the lowest-intent exit and the only one
that survives outside business hours — which is exactly why the open/closed indicator in
[mobile-ux-and-personalization.md](mobile-ux-and-personalization.md) §4 matters more than it
looks: it routes the visitor to the exit that will actually get answered.

## 3. Where conversion surfaces exist today

| Surface | Coverage | Notes |
|---|---|---|
| `MobileCtaBar` | every page, mobile | sticky, call + WhatsApp, bottom band |
| Header call | every page | |
| `Hero` call + WhatsApp | home | `hero-call`, `hero-whatsapp` |
| `FinalCta` | most templates | `finalcta-call`, `finalcta-whatsapp` |
| Service-page aside | 6 service pages | `service-aside-*` |
| `LeadForm` | **24 of 36 pages** — home hero, contact, 6 service, 16 city | service pages pre-select their service; city pages use a compact variant with no free-text field |
| Footer call | every page | |

Coverage is not the gap. **Measurement is the gap**, and after that, substance.

## 4. Friction inventory

Ranked by expected effect. Each is a hypothesis until §1 is resolved.

| # | Friction | Where | Why it costs leads | Blocked on |
|---|---|---|---|---|
| 1 | **No price expectation anywhere on the site** | all templates | The first question every pergola buyer has is "roughly what does this cost". A site that never engages with it loses the visitor to one that does — and the price cluster is simultaneously the largest keyword gap | 🔶 owner price bands → the `/guides/…-cost/` cluster |
| 2 | **No corroborated trust** — no reviews, no address, no ח.פ., no named human, no warranty terms | all templates | An unknown contractor asking for a phone number, with nothing a homeowner can verify. `trustStats` and `testimonials` exist in `lib/content.ts` but are 🔶 and deliberately unrendered | 🔶 owner intake + GBP |
| 3 | **"What happens after I call?"** is unanswered near the CTAs | service, city | Removes the fear of the ambush sales call. `Process` exists as a section but is not adjacent to the conversion points | — buildable now, but the copy must not promise a response time (🔶) |
| 4 | ~~No `autocomplete` attributes~~ | `LeadForm` | ✅ **not a finding — already present**, verified 2026-09-01 (`name` at :207, `tel` at :226). Listed here only so it is not "discovered" again | — |
| 5 | **Form success is not announced** to assistive tech | `LeadForm` | On success the whole `<form>` is replaced by a `<div>` with no `role="status"`, destroying focus. The **error** path is already announced (`role="alert"` at :299). WCAG 2.1 SC 4.1.3 | — free, ship it |
| 6 | **Sticky-bar copy is generic** (`חייגו עכשיו`) | `MobileCtaBar` | Untested. Deliberately last: it is the most-seen element on the site, so it is the worst thing to change while unmeasured | W1 + a read window |

**Not on this list, on purpose:** shortening the form. It is already name + phone required, service
optional, message optional, consent unchecked. There is nothing left to remove that would not also
remove the routing value of `service`.

## 5. What is already right — do not regress it

These are audit fixes with scar tissue. Re-verify; do not "simplify".

- **Silent lead loss is fixed.** A Web3Forms delivery failure renders a visible error *plus*
  recovery links — WhatsApp pre-filled with the form contents, and a `tel:` link. The
  `window.open()` is best-effort only: after an `await` it sits outside the user-gesture window
  and is routinely popup-blocked, so the **rendered** links are the real fallback
  ([components/forms/LeadForm.tsx:160](../components/forms/LeadForm.tsx#L160)).
- **`lead_submit_failed` carries `error_type`** (`no_key` vs `delivery`) so the GA4 alarm can
  distinguish a misconfiguration from an outage. That alarm is the single most valuable item in
  [gtm-tag-spec.md](gtm-tag-spec.md).
- **`form_start` fires on first focus, once per mount**, via one bubbling `onFocus` on the form —
  a render alone does not count as a start.
- **Consent is unbundled and unchecked** (חוק הספאם). Never pre-check it, never bundle it into
  the submit action.
- **Field ids are `useId`-scoped** so two forms on one page cannot break `<label for>`.
- **No PII in the dataLayer** — `service`, `consent`, `has_message` only. Never the name, phone
  or message text.
- The phone number in the recovery block carries `dir="ltr"` so bidi cannot reorder it.

## 6. How a conversion change ships

1. Name the metric and write its **baseline** into [measurement-plan.md](measurement-plan.md)
   *first*. No baseline, no change.
2. Ship it **alone** within its read window — 4 weeks or 200 sessions, whichever is later.
   Content additions are additive and exempt; anything touching a CTA, form or layout is not.
3. A/B testing is not viable at this traffic volume. Changes are sequential and read against the
   change log — which only works if the log stays honest about dates.
4. Guides keep **soft** CTAs. A hard sell on an informational page loses the informational query,
   and the guides silo is the site's largest ranking opportunity.
5. Anything that adds weight is checked against
   [performance-budgets.md](performance-budgets.md); anything that adds a claim is checked
   against [evidence-register.md](evidence-register.md).

## 7. Order of work

Fix 5 is free and unblocked, and it ships in **Sprint 1 — deliberately *before* the GTM tags go
live**. A form change landing mid-baseline confounds the baseline; the same change landing before
the measurement window opens costs nothing and means the baseline is measured against the final
form. See [sprint-roadmap.md](sprint-roadmap.md) Sprint 1. Fix 4 turned out not to exist.
Fixes 1 and 2 are the largest and are blocked on the **90-minute owner session**, which remains
the single highest-leverage action available. Fix 3 is buildable now but must not promise a
response time. Fix 6 waits for a measured baseline, and waits deliberately.
