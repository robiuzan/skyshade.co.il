# Data and tracking infrastructure

**Written:** 2026-09-01 · Procedure: the `tracking-analytics` skill.
This file sits **above** [gtm-tag-spec.md](gtm-tag-spec.md): that one is the exact container
build (triggers, tags, variables); this one is the infrastructure decisions around it — where
data flows, what may hold PII, whether server-side tagging is worth it, and how a CRM gets wired
without costing a millisecond of LCP.

---

## 1. The data flow today

```
  Browser
    │
    ├─ GTM (head) ──► GA4  G-BRZ0S93NFS        ← behavioural, NO PII, ever
    │                  ▲
    │                  └── dataLayer: form_start · generate_lead · lead_submit_failed
    │                      + data-cta click triggers (tel: / wa.me / mailto:)
    │
    ├─ Web3Forms  api.web3forms.com ──► email ──► Yossi's inbox   ← THE PII PATH
    │                                              (this is the CRM today)
    │
    └─ sessionStorage "ss_first_touch"  {ref, landing}  ← read by LeadForm, sent in the email
                                                          disclosed in /privacy/
```

Three sinks, and the boundary between them is the most important rule in this document.

## 2. The PII boundary

| Sink | May contain | Never contains |
|---|---|---|
| **Email via Web3Forms** | name, phone, service, message, consent, first-touch referrer + landing path | — this is the legitimate destination |
| **GA4 / dataLayer** | `form_location`, `service`, `consent` (boolean), `has_message` (boolean), `link_location`, `error_type` | **name, phone, email, message text, IP-as-identifier, user ids** |
| **`sessionStorage`** | `ss_first_touch` = `{ref, landing}` only | anything identifying a person |

**No PII into GA4, ever** (`CLAUDE.md` rule 11). The free-text message is reduced to a boolean
`has_message` specifically so this line cannot be crossed by accident. Any new event parameter is
checked against this table before it is added — a GA4 property that ingests PII cannot be
un-ingested, and it is a GDPR/PPL problem, not a config problem.

Adding a second `sessionStorage`/`localStorage` key requires a `/privacy/` edit **in the same
commit**. The current disclosure is accurate; a truthful privacy policy is a ⛔-table lesson
already learned here (2026-08-17).

## 3. Server-side tagging — assessed 2026-09-01, decision: not yet

The question comes up because ITP/ad-blockers cost measured events, and because a strict CSP
would be easier with a first-party endpoint. Three options:

| Option | What it means | Cost | Verdict |
|---|---|---|---|
| **A. Client-side only** (today) | GTM web container → GA4 directly | none | ✅ **stay here** |
| **B. Cloudflare Worker as a first-party proxy** | a Worker on this zone serving `gtm.js` and forwarding `/collect` from a same-origin path | one Worker, ongoing maintenance, and it **re-opens the entire Next advisory surface** documented in [security-posture.md](security-posture.md) — that assessment turns on there being no server in front | 🔶 only if measured loss justifies it |
| **C. Hosted server-side GTM** (GCP/Stape) | a real sGTM container | monthly hosting + a subdomain + certificate management | ⛔ not at this traffic |

**Decision: A.** The reasoning is ordering, not ideology — **this site has no measured baseline
at all.** Building infrastructure to recover an unquantified percentage of an unmeasured number
is spending the most expensive resource here (the owner's attention, and the change budget) on a
problem nobody has demonstrated exists.

**Revisit B when, and only when:** four clean weeks of baseline exist *and* the gap between GA4
`generate_lead` and the actual email count in the inbox is measured and material. That gap is
directly observable — the inbox is the ground truth, and it is free to count.

⚠️ Option B has a second-order cost that is easy to miss: [security-posture.md](security-posture.md)
concludes the 22 `next` advisories don't apply **because there is no server in production**.
Putting a Worker in front does not run Next — but it does change the "pure static export"
premise that several assessments in this repo rest on, so each of them gets re-read, not assumed.

## 4. CRM integration — at the delivery layer, never in the browser

The CRM today is an email inbox. When a real CRM arrives, the integration rule is absolute:

> **A CRM is wired to the form's *delivery*, not to the page.** Zero front-end bytes.

```
LeadForm ──► Web3Forms ──┬──► email (unchanged)
                         └──► webhook ──► Make / Zapier / n8n ──► CRM
```

Web3Forms supports webhooks; the automation layer does the field mapping. The browser payload
does not change by a single byte, so:

- **No CWV cost.** No CRM SDK, no chat widget, no tracking pixel added to the page.
- **No CSP change.** Nothing new is fetched from the browser, so
  [public/_headers](../public/_headers) is untouched.
- **No new PII surface in the client.** The data already leaves via Web3Forms; the webhook is a
  second consumer of the same POST.

**Forbidden**, and this is the whole reason the rule is written down: dropping a CRM's JavaScript
snippet, a live-chat widget, or a "lead capture" script into GTM. Each one is bytes on the
critical path, a CSP allowlist entry, a privacy disclosure, and — for chat widgets specifically
— a layout shift and a thumb-zone collision with `MobileCtaBar`. The measured JS budget has
**0.7 KB of headroom** ([performance-budgets.md](performance-budgets.md) §3). There is no room
for a widget, and there would be no room even if there were.

## 5. Consent Mode v2

Scheduled weeks 5–6, **after** the four clean baseline weeks. Sequencing is the whole point:

1. Build the events (W1). Collect **four clean weeks**.
2. **Write the expected 20–40% measured-session drop into
   [measurement-plan.md](measurement-plan.md) *before* shipping the banner.** A drop that was
   predicted is a known cost; the same drop discovered afterwards looks like a catastrophe and
   gets "fixed" by reverting something unrelated.
3. Ship `default` consent state → banner → `update` on interaction. The banner reserves its
   height (CLS — [performance-budgets.md](performance-budgets.md) §5).
4. Israeli law does not currently impose GDPR-style prior consent for analytics, but the
   marketing-consent checkbox (חוק הספאם) is a **separate, unbundled, unchecked** control and
   stays that way regardless of what the cookie banner does. Do not merge them.

## 6. The shared-container hazard

`GTM-KWGGH438` is **not a skyshade container** — it serves ten fleet sites and picks the GA4
property by hostname lookup. **An unscoped trigger fires on nine other clients' sites.**

Every trigger carries `Page Hostname equals skyshade.co.il`. The verification step that catches a
mistake is running GTM Preview against a *second* fleet domain and confirming none of the
`SS - …` tags fire there. Full detail and the build order: [gtm-tag-spec.md](gtm-tag-spec.md).

This is also why tag additions are a fleet decision, not a skyshade one, whenever the hostname
condition is dropped.

## 7. The CSP coupling

Every new tag that fetches from a new host needs that host in the CSP in
[public/_headers](../public/_headers) **before** the tag is published. The CSP is currently
**report-only**, so a violation today is silent — which means a tag added now will appear to work
and then break on the day the CSP is enforced, with no obvious cause.

**Whoever edits the GTM container owns that allowlist.** Write it down in the same change-log row.

## 8. GA4 configuration that must exist

Beyond the tags themselves — without these, parameters are collected but never reportable:

- **Custom dimensions** (event-scoped): `form_location`, `service`, `link_location`, `error_type`.
- **Conversions**: `generate_lead`, `phone_call_click`, `whatsapp_click`. The last two are an
  **intent proxy that overcounts** — a tap is not a conversation. Say so every time the number is
  quoted.
- **The `lead_submit_failed > 0` alarm.** This is the single most valuable object in the entire
  measurement stack: it is the only thing that catches silent lead loss.
- Data retention set to the maximum the property allows; IP anonymization is default in GA4.

## 9. What deliberately is not here

- Any Ads or Meta pixel. Adding one is a CSP change, a privacy-policy change, and a consent
  question — not a tag.
- Scroll and engagement events: add them once the guides silo has traffic worth segmenting.
- User-ID or cross-device stitching. There is no login and no user identity on this site.
- A/B testing infrastructure. Not viable at this traffic volume; changes ship sequentially
  against the change log ([conversion-funnel.md](conversion-funnel.md) §6).
