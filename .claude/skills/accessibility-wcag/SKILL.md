---
name: accessibility-wcag
description: Accessibility procedure for skyshade — the WCAG 2.1 AA build target versus the WCAG 2.0 AA claim published on /accessibility/, the audit fixes that must be re-verified rather than rediscovered, RTL defects as accessibility findings, ARIA patterns for the three client components, and the manual passes automation cannot replace. Use when auditing accessibility, editing a form or interactive component, changing colours, or touching the accessibility statement. Triggers: "accessibility", "a11y", "WCAG", "ARIA", "screen reader", "contrast", "keyboard", "focus", "נגישות", "ת״י 5568".
---

# Accessibility

State — the conformance target, the twelve WCAG 2.1 criteria still unverified, and the language
architecture — lives in `docs/accessibility-and-i18n.md`. **Read it first.** This is the method.

## The rule that governs everything else

`/accessibility/` publishes a conformance claim, and under the Israeli regulations an inaccurate
one is legal exposure. This site has already retracted a false accessibility claim once
(`docs/evidence-register.md`, ⛔, 2026-08-17).

**Build to WCAG 2.1 AA. Keep claiming WCAG 2.0 AA + ת״י 5568 until 2.1 is verified.**

A mismatch between `app/accessibility/page.tsx` and reality is **P0**, above every other
accessibility finding — including the ones that affect more users. It is the only one that is a
legal problem rather than a quality problem.

## Order of work

1. **Re-verify the shipped fixes** (below) before looking for new issues. They regress.
2. **Check the WCAG 2.1 delta** — the twelve criteria in `docs/accessibility-and-i18n.md` §3.
   Three are known gaps: `autocomplete` on the lead form (1.3.5), the form's unannounced
   success/failure state (4.1.3), and non-text contrast on UI components (1.4.11).
3. **Sweep RTL** — a mis-mirrored control is an accessibility defect here, not a styling nit.
4. **Manual passes** — keyboard, zoom, screen reader. Automation finds roughly a third of issues.
5. **Only then** report new findings.

## Shipped fixes — re-verify, do not rediscover

These came out of the 2026-08-17 audit. Each has a reason; none is decorative.

| Fix | Where | Why it exists |
|---|---|---|
| Footer contrast `/85` and `/80` | `components/layout/Footer.tsx` | the footer failed the ratio the site publicly claimed |
| WhatsApp accessible green `#0E7A34` for text | `MobileCtaBar`, `LeadForm` | brand WhatsApp green fails 4.5:1 for text |
| Mobile menu: `aria-expanded` + focus trap + Escape | `components/layout/Header.tsx` | it was keyboard-inoperable |
| `h-16 lg:hidden` spacer | `app/layout.tsx` | the sticky bar covered footer content |
| Real 404, no soft-404 | `app/not-found.tsx` | |
| `useId`-scoped field ids | `components/forms/LeadForm.tsx:51` | two forms now share a page; duplicate ids broke `<label for>` |
| Visible-by-default reveal | `components/ui/Reveal.tsx` | content could stick at `opacity:0` if the observer never fired; also honours `prefers-reduced-motion` |

If a change would remove one of these, it is a regression — say so explicitly rather than filing
it as a refactor.

## Checks

**Structure** — one `<h1>`, no skipped levels, landmarks present (`<main>` is in the layout),
Hebrew `alt` on every content image (the product and setting, never the filename, never `תמונה`),
`alt=""` + `aria-hidden` on decoration and icons.

**Forms** — every input has `<label for>`; `autocomplete` on anything autofill-mappable;
`type`/`inputMode` correct so the right mobile keyboard opens; errors announced and not
colour-only; the success and failure states need `role="status"` / `aria-live="polite"` — the
form currently swaps in a `<div>` and a screen-reader user hears nothing.

**Keyboard** — unplug the mouse and complete: open the mobile menu, reach every nav item, filter
the gallery, fill and submit the lead form, reach the sticky CTA bar. Focus visible at every
step; no `outline: none` without a ≥3:1 replacement; no traps except the intentional one in the
open menu.

**Contrast** — text ≥4.5:1, UI components and graphics ≥3:1 (1.4.11 covers borders, focus rings
and icons, which is the part usually missed). Re-check every changed colour, both themes of any
new surface.

**Targets** — ≥44×44px with ≥8px separation. Usual offenders: the footer link stack, the services
dropdown, icon-only controls.

**Zoom and reflow** — 320px wide at 400% zoom, no two-dimensional scrolling (1.4.10). The sticky
bar plus a landscape phone is this site's tightest layout; also check both orientations (1.3.4).

## RTL — file these as accessibility findings

```bash
grep -rnE '\b(ml|mr|pl|pr)-[0-9]|text-(left|right)' app components
```

Any hit is a finding: use `ms-*` / `me-*` / `ps-*` / `pe-*` / `text-start` / `text-end`.

Then: Latin and numeric runs inside Hebrew (phone, email, URLs, measurements) need `dir="ltr"` or
`<bdi>` or bidi reorders the punctuation — `050-5063152` shown as `5063152-050` is the tell.
Directional icons must mirror; symmetric ones (phone, WhatsApp) must not. `<html lang="he"
dir="rtl">` is set once in `app/layout.tsx` and nothing else sets `dir` except those isolations.

## Screen reader

At least one full pass per release that touches layout: land on the page, reach the main
heading, navigate by headings, operate the mobile menu, complete and submit the lead form, and
confirm the result is **announced**. VoiceOver on iOS is the closest match to this audience.

## Reporting

P0/P1/P2 with `file:line`, the criterion, what you measured versus what you inferred, and the
fix. A claim/reality mismatch on `/accessibility/` is always P0.

State plainly which checks were **manual** and which were **inferred from reading code** — an
inferred contrast ratio or an inferred screen-reader experience is a hypothesis, and saying so is
what keeps this file trustworthy.

## After fixing

Re-verify §3 and §4 of `docs/accessibility-and-i18n.md`, then decide whether the
`/accessibility/` statement may be updated. Log the change in `docs/measurement-plan.md` like any
other shipped change.
