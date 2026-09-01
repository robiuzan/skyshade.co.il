# Documentation map

Every doc in this folder is either **state** (what is true, measured, decided) or **procedure**
(how to do a thing). Procedure lives in `.claude/skills/`; state lives here. Keeping them apart is
deliberate: a skill that also carried the numbers would go stale silently, and a state file that
also carried the method would be re-argued every month.

**The single-owner rule.** Each fact has exactly one file that owns it. Other files link to that
owner; they never restate it. When two files disagree, the owner wins and the other is a bug.
This is the same rule the site itself runs on (`docs/keyword-map.md`: one keyword, one URL).

---

## State — the files here

| Doc | Owns |
|---|---|
| [seo-guardrails.md](seo-guardrails.md) | the bright lines: spam policy, Israeli-legal, architectural. **Read before writing any page.** |
| [keyword-map.md](keyword-map.md) | one keyword → one owning URL; live and planned owners |
| [evidence-register.md](evidence-register.md) | which claims may be published (✅ / 🔶 / ⛔) — the E-E-A-T gate |
| [entity-profile.md](entity-profile.md) | the canonical NAP, the `sameAs` dependency order, the GBP spec |
| [information-architecture.md](information-architecture.md) | the URL map, per-type gates, link flow, retirement |
| [aeo-question-bank.md](aeo-question-bank.md) | the real Hebrew query shapes content must answer |
| [accessibility-and-i18n.md](accessibility-and-i18n.md) | WCAG 2.1 AA build rules, ARIA, RTL as architecture, and the gated he/en decision |
| [mobile-ux-and-personalization.md](mobile-ux-and-personalization.md) | thumb-zone rules, the sticky CTA spec, and what personalization is legal on a static export |
| [conversion-funnel.md](conversion-funnel.md) | the funnel stages, the friction inventory, the change-cadence rule |
| [image-inventory.md](image-inventory.md) | the four image slots and their crop behaviour, the 55-photo catalog as measured, and which routes carry no photography |
| [performance-budgets.md](performance-budgets.md) | the CWV budgets, the LCP path, the CLS sources, the regression gate |
| [data-tracking-infrastructure.md](data-tracking-infrastructure.md) | server-side tagging, CRM integration, consent, and the CWV cost of tags |
| [gtm-tag-spec.md](gtm-tag-spec.md) | the exact GTM container build — triggers, tags, variables, verification |
| [measurement-plan.md](measurement-plan.md) | the baseline, the KPI set, and **the dated change log every shipped change writes to** |
| [security-posture.md](security-posture.md) | the standing security assessment, incl. why the npm advisories don't apply |
| [owner-intake-checklist.md](owner-intake-checklist.md) | the questions blocking roughly a third of the work |
| [phase-2-improvement-plan.md](phase-2-improvement-plan.md) | the 16-week workstream plan (W1–W10) — **what** and **why** |
| [sprint-roadmap.md](sprint-roadmap.md) | the same work as dated sprints with acceptance criteria — **when** and **done-when** |

Repo root: `audit-roadmap-full.md` (the 222-finding audit — the reasoning behind most of the
above), `audit-critique.md`, `audit-raw-findings.md`, `baseline-seo-snapshot.json`.

## Procedure — the skills

`.claude/skills/` holds 18 skills; `CLAUDE.md` §7 has the full table. Invoke the skill that owns
the task instead of improvising, and read its paired state doc first.

| Task | Skill | Reads |
|---|---|---|
| titles, descriptions, canonicals | `seo-metadata` | keyword-map, seo-guardrails |
| JSON-LD | `schema-structured-data` | entity-profile, evidence-register |
| answer blocks, FAQs | `aeo-answer-content` | aeo-question-bank |
| AI-crawler reach, entity resolution | `geo-ai-visibility` | entity-profile |
| may we claim this? | `eeat-trust-evidence` | evidence-register |
| Hebrew copy, RTL | `hebrew-rtl-copy` | accessibility-and-i18n |
| WCAG, ARIA | `accessibility-wcag` | accessibility-and-i18n |
| which picture, which crop, which alt | `page-imagery` | image-inventory, evidence-register |
| CWV | `performance-web-vitals` | performance-budgets |
| forms, CTAs | `conversion-cro` | conversion-funnel, mobile-ux-and-personalization |
| events, dataLayer | `tracking-analytics` | gtm-tag-spec, data-tracking-infrastructure |
| headers, CSP | `web-security-headers` | security-posture |
| city pages, GBP | `local-seo-il` | entity-profile, evidence-register |
| links, IA | `internal-linking-ia` | information-architecture |
| a new URL | `new-page-gate` | all of the gates |
| deploy | `qa-deploy-gate` | measurement-plan |

## Where the commonly-asked-for docs actually live

Topics that are frequently requested as standalone files, and the file that already owns them.
**Do not create a second file for these** — add to the owner instead.

| Asked for | Owner |
|---|---|
| "SEO / GEO / AEO strategy" | [keyword-map.md](keyword-map.md) + [aeo-question-bank.md](aeo-question-bank.md) + [entity-profile.md](entity-profile.md), bounded by [seo-guardrails.md](seo-guardrails.md), structured by [information-architecture.md](information-architecture.md) |
| "E-E-A-T and trust" | [evidence-register.md](evidence-register.md) — the claim gate — plus [owner-intake-checklist.md](owner-intake-checklist.md) for what unblocks it |
| "UX / CRO / security" | [conversion-funnel.md](conversion-funnel.md) (UX+CRO) and [security-posture.md](security-posture.md) (security). Deliberately two files: they share no reviewers and no cadence |
| "Schema markup guide" | the `schema-structured-data` skill (procedure) + [entity-profile.md](entity-profile.md) (the values) |
| "Local SEO / NAP" | [entity-profile.md](entity-profile.md) is the NAP owner; the `local-seo-il` skill is the procedure |
| "Pricing page content" | there is no `/pricing/` page — the whole price cluster is owned by `/guides/…-cost/`. See [keyword-map.md](keyword-map.md) |
| "Image / photo guidelines" | [image-inventory.md](image-inventory.md) owns the slots and the catalog; the `page-imagery` skill is the procedure and the `image-art-director` agent applies it. Alt-text *conformance* stays in [accessibility-and-i18n.md](accessibility-and-i18n.md); the LCP and weight budgets stay in [performance-budgets.md](performance-budgets.md) |

## Adding a doc

1. Confirm no existing file owns the topic (the table above, then `grep`).
2. Write it as **state**, not method. Method goes in a skill.
3. Register it in `CLAUDE.md` §7 **and** in the table above — an unregistered doc is an orphan,
   and orphaned docs drift into contradicting the ones agents actually read.
4. Date anything that decays: prices, budgets, measured values, live-state assertions.
