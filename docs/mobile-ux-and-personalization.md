# Mobile UX and personalization

**Written:** 2026-09-01 · Procedure: the `conversion-cro` skill.
Paired state: [conversion-funnel.md](conversion-funnel.md) (the funnel),
[performance-budgets.md](performance-budgets.md) (what any of this may cost).

---

## 1. The mobile premise, and the number we do not have yet

An Israeli homeowner researching a pergola is on a phone, usually in the evening, often standing
in the garden the thing is going to be built in. The whole interface is designed for a person
holding a phone in one hand with the other hand busy.

⚠️ **We do not have the device split.** GA4 has page views only, but `Device category` is a
standard dimension on those page views — **it is knowable today, without waiting for the GTM
build**. Pull the 90-day mobile/desktop/tablet split and write it into
[measurement-plan.md](measurement-plan.md) as a baseline row. Everything below is designed for a
mobile majority; if the real split says otherwise, that changes the priorities in
[sprint-roadmap.md](sprint-roadmap.md), not this file's rules.

## 2. Thumb zones

For a 5.5–6.7" phone held one-handed, the screen divides into three bands:

| Band        | Region                                                                                                                                                                                                  | What belongs there                                                       |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| **Easy**    | bottom third, and the bottom-right arc for right-handers (mirrored in an RTL layout — Hebrew readers still hold the phone the same way, so **do not mirror the thumb arc**; it is a hand, not a script) | the primary conversion actions: call, WhatsApp, form submit              |
| **Stretch** | middle third                                                                                                                                                                                            | body content, secondary CTAs, form fields                                |
| **Hard**    | top strip                                                                                                                                                                                               | logo, back, the hamburger — navigation you press rarely and deliberately |

Consequences that are already shipped and must not be "tidied away":

- `MobileCtaBar` is `fixed … bottom-0`, `lg:hidden`, and a 2-up grid — call on the accent side,
  WhatsApp on `#0E7A34`. Bottom-anchored because that is the easy band.
- [app/layout.tsx](../app/layout.tsx) renders a `h-16 lg:hidden` spacer so the bar can never cover
  footer content. This is an audit fix. Deleting it re-introduces the defect.
- The primary nav is a top hamburger precisely _because_ navigation is not the conversion path.
  The conversion path never requires opening it.

## 3. Rules for mobile surfaces

- **Touch targets ≥44×44px**, with ≥8px between adjacent targets. The footer link stack and the
  services dropdown are the usual offenders.
- **A CTA is reachable at every scroll position** — either the sticky bar or an in-flow CTA in
  view. This is the one rule that outranks visual tidiness.
- **Never** a modal, interstitial or overlay on entry. Beyond the UX cost, an intrusive mobile
  interstitial is a documented Google demotion.
  > **Override — owner decision 2026-10-11, fleet live-kit.** The fleet's seasonal card (a
  > native `<dialog>`, CLAUDE.md §10) ships here with the 3locksmiths pilot's rules, which keep
  > it off entry: never on a page reached from a search engine, never on the first page before
  > 20 s **and** a scroll, otherwise only from the 2nd page of a visit (after 4 s); once per 14
  > days; never on `/contact/`, the legal pages or `/404/`; never over the open mobile menu, the
  > services dropdown or the gallery lightbox, never while a form field has focus. On a phone it
  > is a bottom sheet that stops above `MobileCtaBar`. The rule above stands for everything else.
  >
  > **2026-10-12, owner (fleet decision, wording sign-off page):** the card may show at any
  > hour, not only inside the business hours in [evidence-register.md](evidence-register.md).
  > The calendar still keeps it shut on Shabbat, chag and quiet days (`lib/live/resolve.mjs`).
- **Forms**: the correct `inputMode`/`type` per field so the right keyboard opens (`type="tel"`
  on phone is already right); labels above fields, never placeholder-only; `autocomplete` on
  every field that maps to autofill data (also WCAG 2.1 SC 1.3.5 — see
  [accessibility-and-i18n.md](accessibility-and-i18n.md) §3).
- **Tap-to-call and WhatsApp are first-class**, not a fallback. Order of intent on this site is
  call → WhatsApp → form, and the layout must reflect that order everywhere.
- **Nothing shifts after paint.** Any element that appears late reserves its height first — see
  §5. On mobile, a layout shift under a thumb that is already descending is a misclick, and a
  misclick on a sticky CTA bar is a lost lead.
- **Landscape counts.** The sticky bar plus a phone landscape viewport is the site's tightest
  layout; it is also WCAG 2.1 SC 1.3.4 and 1.4.10.

## 4. Personalization — what is actually possible here, and what is forbidden

The request "swap content based on the visitor's location" collides with four constraints on this
specific site. All four are real; none of them is a preference.

| Constraint                                                                     | Consequence                                                                                                                                                                |
| ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `output: "export"` + Cloudflare CDN                                            | every visitor is served **the same cached HTML**. There is no server, no middleware, no edge function in front. Any variation happens in the browser, after paint          |
| `Permissions-Policy: geolocation=()` in [public/\_headers](../public/_headers) | the **Geolocation API is disabled site-wide**. Using it means editing that header _and_ a browser permission prompt — a prompt on arrival is a conversion loss, not a gain |
| [seo-guardrails.md](seo-guardrails.md) §1 + `CLAUDE.md` rule 3                 | the site's entire local strategy is _anti_-doorway. Injecting a detected city name into headings is the doorway pattern re-implemented in JavaScript                       |
| Googlebot renders the page                                                     | if the rendered content differs from what a user sees, that is **cloaking**. If it differs per-visitor for indexable content, the indexed version is arbitrary             |

### The ladder — what may be personalized

**Tier 1 — safe, ship freely.** Non-indexable, post-paint, in reserved space, never changing
meaning:

- **Open / closed right now.** Derived from `manifest.openingHours` and the device clock. "פתוח
  עכשיו — נחזור אליכם היום" vs "מחוץ לשעות הפעילות — השאירו הודעה ונחזור מחר". **This is the
  highest-value personalization available on this site and it needs no location at all.** It sets
  a truthful expectation at the exact moment of hesitation, and it is the difference between a
  call that goes unanswered and a WhatsApp that gets answered in the morning.
- Remembering a gallery filter or a form draft within the session.
- Returning-visitor CTA emphasis (WhatsApp over form for someone who already saw the form).

**Tier 2 — allowed with review.** A coarse, non-indexable location _hint_ used only inside a
conversion element, never in a heading:

- A line in the contact block: `נותנים שירות גם באזור שלך` with the region named — rendered only
  when the signal is coarse and confident, in a slot whose height is reserved whether or not it
  fills.
- Signal source, in order of preference: the `cf-ipcountry`-class hint if a Worker is ever added;
  otherwise nothing. **Do not add a third-party IP-geolocation script** — it is a new network
  dependency, a new CSP entry, a privacy disclosure obligation, and a CWV cost, to render one
  line of text.
- The default must be complete and correct on its own. Personalization is an _addition_, never a
  substitution.

**Tier 3 — forbidden.**

- Injecting a city name into `<h1>`, `<title>`, the meta description, the canonical or any JSON-LD.
- Generating or revealing "local" page content from a detected location.
- Any variation Googlebot could see differently from a user.
- Auto-redirecting by IP or `Accept-Language` (see [accessibility-and-i18n.md](accessibility-and-i18n.md) §6).
- Storing location in a cookie or `localStorage` without disclosing it in `/privacy/`. The only
  client-side persistence today is the documented first-touch object in `sessionStorage`; adding
  a second one is a privacy-policy edit **in the same commit**.
  > **2026-10-11, fleet live-kit:** `/assets/live.js` adds `ls-pv` (sessionStorage: page views
  > this visit), `ls-dlg-<line>` (localStorage: when the seasonal card last showed, for the
  > 14-day cap) and `ls-status` (localStorage: a non-normal status-switch mode, ≤ 30 min). No
  > location, nothing personal. Disclosed in `/privacy/` («מידע שנשמר בדפדפן») in the same change.

## 5. The implementation contract for any personalized element

Any Tier 1 or Tier 2 element ships only if all six hold:

1. **The server-rendered default is complete and true** with JavaScript off. Personalization is
   progressive enhancement, exactly like `Reveal`.
2. **Height is reserved** before the value resolves — a fixed `min-h` on the slot, or the default
   text occupying the same space. Zero CLS contribution; the budget is in
   [performance-budgets.md](performance-budgets.md).
   > **2026-10-11, fleet live-kit — a known exception, not yet decided.** The announcement bar's
   > line is chosen before first paint from the calendar, but the fleet status switch is read
   > after paint. On a phone during a season, a quiet / off answer or an unreadable switch
   > (missing CORS, offline, or slower than the 1.5 s timeout, which is not cached) collapses the
   > 35 px bar after paint: measured CLS ≈0.04 per affected page view (review 2026-10-11, 390 px),
   > 0 while the switch answers normal. It also breaks §3's "nothing shifts after paint". Whether
   > that cost is accepted is the owner's call with the wording approval (CLAUDE.md §10).
   >
   > ✅ **Answered 2026-10-12 — the bar ships with this cost.** The owner approved the wording
   > and said "ship all of them" (fleet wording sign-off page); no separate ruling on the CLS
   > number itself is recorded. Re-open it if field data (CrUX) shows the shift.
3. **It adds no network request** and no third-party script.
   > **Override — owner decision 2026-10-11, fleet live-kit.** The live surfaces make ONE read
   > per page view, after first paint: `https://imgquarry.com/status/fleet.json` (the fleet
   > status switch, the same host as the site's images, no credentials, 1.5 s timeout). Its
   > answer can only hide or quiet a line — it carries no text into the page — and it is in
   > `connect-src` and disclosed in `/privacy/`. No third-party script: `/assets/live.js` is
   > served from this site.
4. **It touches nothing indexable** — no heading, title, meta, canonical or schema node.
5. **It is disclosed** in `/privacy/` if it reads or stores anything about the visitor.
6. **It has a named metric and a baseline** in [measurement-plan.md](measurement-plan.md) before
   it ships, and it ships **alone** within its read window — one substantive conversion change
   per 4 weeks or 200 sessions, whichever is later
   ([phase-2-improvement-plan.md](phase-2-improvement-plan.md) §2).
   > **2026-10-11 — not decided.** The fleet live-kit (bar + card + updates strip) is one change
   > that touches the call path; whether it may ship inside the current read window, and its
   > metric (`surface_view` → `phone_call_click` / `whatsapp_click` by `link_location` `topbar-*`
   > / `popup-*`), is the owner's call together with the wording approval (CLAUDE.md §10).
   >
   > ✅ **Answered 2026-10-12 — it ships now, inside the current window.** With the wording
   > approval the owner said "ship all of them" (fleet wording sign-off page). Its metric and
   > zero baseline are the 2026-10-12 row of [measurement-plan.md](measurement-plan.md). Not
   > readable yet: the shared GTM trigger must admit this hostname
   > ([gtm-tag-spec.md](gtm-tag-spec.md)), and the W1 click tags were unbuilt at the last check
   > (CLAUDE.md §9, 2026-09-14).

## 6. Measurement

The existing `data-cta` attributes already distinguish the mobile surfaces —
`sticky-call`, `sticky-whatsapp`, `hero-call`, `hero-whatsapp`, `finalcta-*`, `service-aside-*` —
so once the GTM tags in [gtm-tag-spec.md](gtm-tag-spec.md) exist, `link_location` gives the
sticky bar's real contribution without any new code.

Read per device category: `phone_call_click` and `whatsapp_click` by `link_location` · the
`form_start` → `generate_lead` rate by `form_location` · scroll depth on guides once they have
traffic. **None of this is readable until W1 is built** — which is why the sticky-bar copy and
hierarchy test sits at the end of W9, not the start.
