---
name: geo-ai-visibility
description: Generative-engine optimization for skyshade — verifying live AI-crawler reachability (never trusting the repo's robots.ts), entity consistency across the web so assistants resolve "סקיי שייד" correctly, making facts citable, and monitoring what ChatGPT/Perplexity/AI Overviews actually say about the brand. Use for AI-search visibility work. Triggers: "GEO", "AI search", "ChatGPT cites", "Perplexity", "AI crawlers", "GPTBot", "llms.txt", "brand mentioned by AI".
---

# Generative-engine optimization

Three gates, in order. A page fails at the first one that is closed, and work on later gates is
wasted until it opens.

## Gate 1 — reachability. Verify live, every time.

This zone served **HTTP 403 to every AI crawler** for a year, from a Cloudflare setting no repo
change could override. As of 2026-08-23 the owner set AI Crawl Control to Allow and turned the
managed `robots.txt` off; 13/13 UAs returned 200 including deep paths and the sitemap. **A dashboard
setting can be re-enabled by anyone with access — never read `app/robots.ts` and assume.**

```bash
curl -sS https://skyshade.co.il/robots.txt        # expect only app/robots.ts content
for ua in GPTBot OAI-SearchBot ChatGPT-User PerplexityBot Perplexity-User ClaudeBot Claude-User \
          Claude-SearchBot Google-Extended meta-externalagent Applebot-Extended Amazonbot; do
  printf '%-22s %s\n' "$ua" "$(curl -sS -o /dev/null -w '%{http_code}' -A "$ua" https://skyshade.co.il/service/pergolas/)"
done
```

Also check link unfurling — the same rules block social/preview bots:
`curl -A 'facebookexternalhit/1.1' -o /dev/null -w '%{http_code}\n' https://skyshade.co.il/`

If anything is not 200, that is finding #1 and everything below is capped until it is fixed.

**The image host matters too.** `imgquarry.com/robots.txt` must not block GPTBot / ClaudeBot /
Google-Extended, or the photo library stays invisible to multimodal retrieval.

## Gate 2 — entity resolution

An assistant will only assert facts about a business it can pin down. Today `manifest.schema.sameAs`
is `[]`, there is no Google Business Profile, no address, no ח.פ. — the entity is effectively
unresolvable, which is why brand-name searches surface competitors.

The fix, in dependency order:
1. **Google Business Profile** (name exactly `סקיי שייד`, never keyword-appended) — the anchor.
2. **`sameAs`** populated with GBP + real Facebook/Instagram, once they exist.
3. **NAP identical everywhere** — one phone format, one name spelling, one URL (apex, https,
   trailing slash). Any variant creates a second entity in the graph.
4. **Third-party corroboration**: Israeli business directories, supplier/manufacturer pages, real
   press. Assistants weight corroboration far above self-description.
5. The `@id`-linked JSON-LD graph (`schema-structured-data`).

## Gate 3 — citability

Assistants quote **specific, attributable, dated** claims. See `aeo-answer-content` for the block
format. GEO-specific additions:

- **Say the entity's name near the fact.** "סקיי שייד מתקינה פרגולות אלומיניום בכל הארץ מאז 2009" is
  retrievable; "אנחנו מתקינים כבר שנים" is not.
- **Put the fact in text**, not in an image or an icon-only stat tile.
- **One canonical location per fact.** Repeating the same claim in different words across 16 pages
  splits the signal and reads as templated.
- **Unique facts win.** Real projects with city, year and constraint are the only content in this
  market a competitor cannot regenerate.

### On `llms.txt`

Not adopted by any major assistant; it is not a ranking or retrieval input today. Adding one is
cheap and harmless — but it is **not** a substitute for gate 1, and it must never be presented to
the owner as an AI-visibility fix. Priority: below everything else in this file.

## Monitoring

There is no console for this. Run a fixed prompt set monthly and record the answers in
`docs/measurement-plan.md`:

- `מי זו סקיי שייד?` · `פרגולות אלומיניום מומלץ בישראל` · `כמה עולה פרגולת אלומיניום?` ·
  `האם צריך היתר לפרגולה?` · `חברות פרגולות אלומיניום במרכז`

Record: are we named, is the fact correct, which source was cited. In GA4, AI-assistant referrals
arrive as `chatgpt.com` / `perplexity.ai` / `claude.ai` referrers — that is the closest thing to a
measurable channel.
