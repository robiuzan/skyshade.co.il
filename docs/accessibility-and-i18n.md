# Accessibility and internationalization

**Written:** 2026-09-01 · Procedure: the `accessibility-wcag` and `hebrew-rtl-copy` skills.
This file is the **state**: the conformance target, the gap between what is built and what is
claimed, and the architecture rules for language.

---

## 1. Why accessibility is a legal file here, not a quality file

`/accessibility/` publishes a conformance statement. Under the Israeli regulations
(תקנות שוויון זכויות לאנשים עם מוגבלות — התאמות נגישות לשירות) that statement is a
representation about the service, and an inaccurate one is exposure — not a style nit.

The precedent is in this repo: an accessibility-contrast conformance claim was **retracted** on
2026-08-17 because the footer failed the ratio the page claimed
([evidence-register.md](evidence-register.md), ⛔ table). The claim was live and false.

**The rule that follows: build ahead of the claim, and never claim ahead of the build.** A
verified improvement can always be added to the statement later. A statement that runs ahead of
the code is the failure mode this site has already had once.

## 2. Target vs. claim — they are different, on purpose

| | Value | Status |
|---|---|---|
| **Build target** | WCAG **2.1 level AA** | what all new code is written to, from 2026-09-01 |
| **Published claim** on `/accessibility/` | WCAG **2.0 AA** + ת״י 5568 | unchanged until §3 is verified |

Israel's ת״י 5568 is built on WCAG 2.0 AA. WCAG 2.1 adds twelve AA success criteria on top —
mostly mobile, low-vision and input-mechanism criteria that did not exist in 2008, and that this
site, being mobile-first and RTL, is directly exposed to.

Building to 2.1 while claiming 2.0 is the safe asymmetry. **The statement text in
[app/accessibility/page.tsx](../app/accessibility/page.tsx) changes only after every row in §3 is
verified** — and it is re-verified after any layout change, like any other claim in the evidence
register.

## 3. The WCAG 2.1 delta — the twelve criteria to verify

The AA criteria added between 2.0 and 2.1. Status is **unverified** unless marked otherwise;
nothing here has been formally tested.

| SC | Requirement | Exposure on this site |
|---|---|---|
| 1.3.4 Orientation | works in both orientations | 🔶 verify the sticky bar + hero in landscape on a phone |
| **1.3.5 Identify Input Purpose** | `autocomplete` on fields collecting user data | ✅ **already met, verified 2026-09-01** — `autoComplete="name"` at [LeadForm.tsx:207](../components/forms/LeadForm.tsx#L207), `autoComplete="tel"` at [:226](../components/forms/LeadForm.tsx#L226), `autoComplete="off"` on the honeypot at [:294](../components/forms/LeadForm.tsx#L294). Those are the only fields carrying user data. ⚠️ An earlier draft of this file asserted this was missing **without running the check** — do not re-open it without reading the file |
| 1.4.10 Reflow | 320px / 400% zoom, no two-dimensional scrolling | 🔶 highest-risk item: `MobileCtaBar` is `fixed` and the layout spacer is a hard `h-16` |
| **1.4.11 Non-text Contrast** | UI components and graphics ≥3:1 | 🔶 accent buttons, input borders (`border-gray-*`), focus rings, the lucide icons |
| 1.4.12 Text Spacing | survives forced spacing overrides | 🔶 check Hebrew headings for clipping in fixed-height containers |
| 1.4.13 Content on Hover/Focus | dismissible, hoverable, persistent | 🔶 the services dropdown in [components/layout/Header.tsx](../components/layout/Header.tsx) |
| 2.1.4 Character Key Shortcuts | — none exist | ✅ by absence |
| 2.5.1 Pointer Gestures | no path- or multipoint-only actions | ✅ by absence — `FilterableGallery` is click-only |
| 2.5.2 Pointer Cancellation | no down-event activation | ✅ native links and buttons throughout |
| **2.5.3 Label in Name** | the accessible name contains the visible label | ⚠️ **check** — `MobileCtaBar` sets `aria-label="וואטסאפ סקיי שייד"` while the visible text is `וואטסאפ`; it *contains* the label, so it passes. Any future `aria-label` that **replaces** rather than extends the visible Hebrew text fails |
| 2.5.4 Motion Actuation | no motion-only operation | ✅ by absence |
| 4.1.3 Status Messages | announced programmatically without moving focus | ✅ **fixed 2026-09-01** — the error state was already announced (`role="alert"`); the success container now carries `role="status"` + `tabIndex={-1}` and receives focus via a `useEffect`. Focus restoration is required, not optional: the submit button is `disabled` during the fetch, so focus is already on `<body>` before the success div mounts. The form also carries `aria-busy` while sending |

**A standing method note, from a real failure.** The 2026-09-01 draft of this table marked 1.3.5 a
"known gap" on the strength of a grep that was written into §7 as a verification command and then
never run. The attribute was already there. Every row above now carries either a line reference or
an explicit 🔶. **A row without evidence is not a finding** — check the file.

**4.1.3** shipped 2026-09-01 with the pre-baseline `LeadForm` batch. **1.4.11** ships in **Sprint
3**, after the verification-only pass in Sprint 2 establishes which components actually fail the
3:1 ratio — the right fix there is site-wide token work (`globals.css` defaults the bare `border`
to `gray-200`, and the gallery/areas/FAQ chips all use it), not a one-form patch that would make
the lead form the darkest-bordered surface on the site.

### One WCAG **2.0** fix also shipped — it was inside the published claim

`placeholder:text-gray-400` → `gray-500` in the lead form. Tailwind v4 preflight makes inputs
transparent and `fieldClass` sets no background, so placeholders sat on the card behind them at
≈2.6:1 on white and ≈2.5:1 on `bg-gray-50` — under the 4.5:1 that **SC 1.4.3** requires. That is a
2.0 criterion, so `/accessibility/` was making a live inaccurate claim (it names
`ניגודיות צבעים תקינה` explicitly), of exactly the class already retracted once in 2026-08-17.
`gray-500` measures ≈4.84:1 and ≈4.63:1. It also matters practically: the phone placeholder is the
only place the expected number format is stated.

## 4. Rules for all new code

**Native first.** A `<button>`, `<a>`, `<label>` or `<details>` beats any ARIA reconstruction of
it. The best ARIA is the ARIA you did not write; add a role only when no element carries the
semantics.

- **One `<h1>` per page**, heading levels never skipped. `PageHeader` owns the H1 on inner pages.
- **Every image has descriptive Hebrew alt** — the product, the setting, the material. Never the
  filename, never `תמונה`. Decorative images take `alt=""`; icons take `aria-hidden`.
- **Every input has a `<label for>`.** Ids are `useId`-scoped (`fid()` in `LeadForm`) because two
  forms now share a page — see the comment at
  [components/forms/LeadForm.tsx:51](../components/forms/LeadForm.tsx#L51).
- **Errors are announced**, not merely coloured, and never signalled by colour alone.
- **Focus is always visible.** Never `outline: none` without a replacement meeting 3:1.
- **Touch targets ≥44×44px**, including the sticky bar and the footer link stack.
- **Text contrast ≥4.5:1, UI and graphics ≥3:1.** The shipped values — footer `/85` and `/80`,
  the WhatsApp accessible green `#0E7A34` for text-on-green — are audit fixes. Re-verify them;
  do not rediscover them, and do not "clean up" the colours.
- **Motion respects `prefers-reduced-motion`.** [components/ui/Reveal.tsx](../components/ui/Reveal.tsx)
  already does, and starts fully visible so nothing can stick at `opacity:0` if the observer
  never fires. Keep that pattern for any new animation.
- **Keyboard**: the mobile menu keeps `aria-expanded`, a focus trap and Escape. Test every
  interactive path with the mouse unplugged.

## 5. RTL is an accessibility concern, not a styling one

A mis-mirrored control is unusable, not merely ugly — so RTL defects are filed as accessibility
findings, at the same severity.

- **Logical properties only**: `ms-*` / `me-*` / `ps-*` / `pe-*` / `text-start` / `text-end`. A
  literal `ml-*` / `mr-*` / `text-left` in this codebase is a bug.
- `<html lang="he" dir="rtl">` is set once in [app/layout.tsx](../app/layout.tsx). Nothing else sets
  `dir` except the isolation cases below.
- **Isolate LTR runs**: phone numbers, emails, URLs, model codes and measurements inside Hebrew
  text need `dir="ltr"` or `<bdi>`, or the bidi algorithm reorders the punctuation. `050-5063152`
  rendering as `5063152-050` is the classic symptom.
- **Directional icons mirror**; symmetric ones (phone, WhatsApp) do not. A `ChevronLeft` meaning
  "next" points the wrong way in RTL.
- Numerals stay Western Arabic (0–9); units follow the number, as in Hebrew usage.

Full voice and mechanics: the `hebrew-rtl-copy` skill.

## 6. Multilingual — one locale, and that is a decision

**Live: `he-IL` only.** There is no `/en/`, no `hreflang`, and no locale switcher. Adding one is
**gated**.

### Why gated rather than planned

- The customer is an Israeli homeowner buying a physical installation. English-language demand
  for `פרגולות אלומיניום` in Israel is close to zero — the query volume does not exist.
- A translated site doubles every gated surface: the evidence register, the keyword map, the
  answer bank, and the legal copy. The permit wording is **legally reviewed Hebrew**; translating
  it is a new legal review, not a copy task.
- Machine-translated or partially-translated locales are precisely the thin/scaled-content
  pattern [seo-guardrails.md](seo-guardrails.md) §1 bans, in a second language.
- `output: "export"` means each locale is a full second static tree to build, link, sitemap and
  keep in sync — with the `postbuild` drift guard failing the build whenever they diverge.

**The gate: an English tree ships only if there is measured English demand** (GSC impressions on
English queries, or a real inbound segment such as architects specifying in English), **and** a
human translator owns the copy, **and** the legal pages get a fresh review. Absent that, English
is a cost with no upside.

### If it ever ships, this is the architecture — no other shape is acceptable

| Decision | Value | Why |
|---|---|---|
| URL shape | subdirectory `/en/…` | subdomains split the entity; ccTLDs are worse. Works under `output: "export"` |
| Default locale | `he` at the root, **not** `/he/` | never break or redirect the already-indexed URLs |
| Routing | `generateStaticParams` over a `[locale]` segment | a static export cannot negotiate `Accept-Language` — there is no server |
| `hreflang` | reciprocal `he-IL` ↔ `en` pairs **plus `x-default` → the Hebrew root** | non-reciprocal annotations are ignored wholesale |
| `<html>` | `lang` and `dir` per locale (`en` → `dir="ltr"`) | the layout currently hardcodes both; they become props |
| Sitemap | every locale URL listed with its alternates | the `postbuild` guard fails the build otherwise |
| Schema | **one** business entity, `@id` shared across locales; only `name`/`description` localized | two entities is the exact failure this site already has |
| Coverage | 100% of a page, or that page does not exist in `en` | partial translation is thin content |
| Never | auto-redirect by IP or `Accept-Language`; machine translation; an English tree with Hebrew fallbacks | cloaking risk, and it traps users and crawlers alike |

Until the gate is passed, the correct answer to "should we add English?" is **no**, and this
section is the reason.

## 7. Verification

```bash
# Direction / logical-property regressions — any hit is a finding
grep -rnE '\b(ml|mr|pl|pr)-[0-9]|text-(left|right)' app components

# Missing autocomplete on the lead form (SC 1.3.5)
grep -n autocomplete components/forms/LeadForm.tsx

# The live conformance claim — must match what has actually been verified
grep -n 'WCAG\|5568' app/accessibility/page.tsx
```

Then, manually, per release that touches layout: a keyboard-only pass, 400% zoom at 320px, a
screen reader through the lead form end to end, and contrast checks on every changed colour.
Automated tooling catches roughly a third of WCAG issues — it is a filter, never the sign-off.

**After any layout change, re-verify §3 and §4 before the next deploy.** `/accessibility/` makes
a public claim, and that claim is only as current as the last check.
