# Owner intake — the questions for Yossi

Roughly a third of the highest-value work on this site is blocked on one structured session with the
owner. This is that session, in the order to run it (~60–90 minutes). Every answer moves a row in
[evidence-register.md](evidence-register.md) from 🔶 to ✅ and unblocks named work.

Hand this document to Yossi in advance. Record answers **with the date**, then update the register.

---

## 1. Access (do this first — some items take days)

- [ ] **Google Business Profile** — does one exist? If yes: transfer/grant Manager access. If no:
      create it (name exactly `סקיי שייד`, service-area business). *Unblocks: the map pack, reviews,
      the entity anchor, `sameAs`, AI assistants being able to identify the business at all.*
- [ ] Facebook / Instagram business profiles — URLs, or a decision not to have them.
- [ ] Cloudflare dashboard access for the zone (some fixes have no repo equivalent).

## 2. Legal identity

- [ ] ח.פ. / ע.מ. number and the registered entity name
- [ ] Business address — is there a workshop/office that can be published?
- [ ] Insurance: which policies, which insurer, valid through when? (Can we say "מבוטח"?)
- [ ] Licences, standards, certifications — any ת״י compliance, any manufacturer authorizations?

*Unblocks: schema `PostalAddress`, the footer, `/terms/`, the trust bar, local ranking.*

## 3. The people

- [ ] Full name, role, and years in the trade of the person accountable to customers
- [ ] Permission to publish a photo and a short bio
- [ ] Team size; who installs — employees or subcontractors?

*Unblocks: E-E-A-T, `Person` schema, a real `/about/` page, AI-citable authorship.*

## 4. Warranty and service terms

- [ ] Warranty length, per product, and exactly what it covers (structure? motor? finish? labour?)
- [ ] Is it given in writing? Can we publish the terms?
- [ ] Response time to a new enquiry — what can be promised honestly?
- [ ] Is the site measurement free? Is it binding?
- [ ] Typical lead time from order to installation, per product
- [ ] Typical installation duration on site

*Unblocks: `/warranty/`, every "אחריות מלאה" mention, form microcopy, service-page spec blocks.*

## 5. Prices — the single largest keyword gap

The `/guides/…-cost/` cluster is the biggest uncovered commercial demand in this market, and it
cannot ship without real numbers.

- [ ] Price band per m² for a standard aluminum pergola (from–to, and what "standard" means)
- [ ] Premium for electric / bioclimatic
- [ ] Price band for balcony enclosure, deck, fence, cladding, outdoor kitchen
- [ ] What drives price up or down (size, motor, finish, access, roof vs ground)
- [ ] A typical project's total, as a worked example
- [ ] Is a "starting from" figure acceptable to publish?

*A range with stated conditions is worth more than exactness — and far more than silence.*

## 6. Projects — the anti-doorway substance

For **8–12 real projects**, ideally spread across different cities:

- [ ] City / neighbourhood
- [ ] Year
- [ ] Product and size (m²)
- [ ] The constraint solved (an awkward roof, a permit condition, a ועד בית requirement, sea air, wind)
- [ ] Photos (which catalog images belong to it)
- [ ] Permission to name the city (customer name is not needed)

*Unblocks: `/projects/[slug]/`, which city pages survive the cull, and the only content in this
market competitors cannot template.*

## 7. Cities

- [ ] Of the 16 city pages, **in which cities has work actually been delivered?**
- [ ] Any city where the local ועדה's stance on מצללה exemptions is known from experience?
- [ ] Any city that should be added because that is where the work actually comes from?

*Decides which 6–8 city pages are differentiated and which are 301'd.*

## 8. Reviews

- [ ] Are there existing reviews anywhere (Facebook, WhatsApp messages, emails)?
- [ ] Will Yossi ask past customers for Google reviews? (Ask everyone. Never incentivize. Never gate
      by sentiment.)
- [ ] The `lib/content.ts` testimonials: the source admits the wording was altered. **They cannot be
      republished as-is.** Can the real customers be re-contacted for genuine quotes?

## 9. Products and suppliers

- [ ] Which aluminum profiles / systems / suppliers are used?
- [ ] Finishes and colour ranges available
- [ ] What does the business explicitly *not* do? (Stating limits raises credibility.)

## 10. Competitors

- [ ] Which three companies does he lose work to, and why does he think that is?
- [ ] Where do leads come from today — referrals, Facebook, directories, walk-past?

---

## After the session

1. Update [evidence-register.md](evidence-register.md): each answer becomes a ✅ row with the date.
2. Update [entity-profile.md](entity-profile.md) with the confirmed NAP and `sameAs` values.
3. Log the session in `docs/measurement-plan.md` — it is the gate that releases Phase 2's content work.
4. Anything still unanswered stays 🔶. **Do not fill a gap with a plausible number.**
