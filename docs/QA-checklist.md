# DiscMill Affiliate & Content Engine QA Checklist

## 1. Content Links & Formatting
- [ ] **Internal Links Working**: Navigate to a recent Daily Intelligence brief and verify that disc names (e.g., "Innova Destroyer") are clickable and correctly resolve to `/disc/innova/destroyer`.
- [ ] **Affiliate Links Injected**: Run `node scripts/ingest-zo-email.js` with a test file mentioning "Zuca Cart". Verify the output JSON contains `[Zuca Cart](https://www.amazon.com/s?k=...)`.
- [ ] **Blog Slugs Correct**: Verify URLs follow the SEO pattern `/blog/:slug` and load correctly without 404s.

## 2. SEO & Schema
- [ ] **Schema Valid**: Check `BlogDetail.tsx` and `DiscDetail.tsx` in Chrome DevTools to ensure the `<script type="application/ld+json">` is populated and properly closed.
- [ ] **Sitemap Generated**: Verify `public/sitemap.xml` includes all `/disc/...` and `/blog/...` links by running the `generate-sitemap.js` script.
- [ ] **Robots.txt Present**: Check that `public/robots.txt` exists and points to the sitemap.

## 3. Core Pages
- [ ] **Gear Hub Loading**: Navigate to `/gear` and verify all 6 category cards load with correct hover animations and icons.
- [ ] **Pillar Posts Available**: Check the `/blog` index or `/gear` links to verify that the 10 pillar posts (e.g., "Best Disc Golf Starter Sets") render successfully, even if content is just a placeholder.

## 4. Analytics & Testing
- [ ] **A/B Testing Firing**: Open `BlogDetail.tsx`, click a CTA, and verify in DevTools Console that `[Analytics] experiment_assignment` or `affiliate_click` fires correctly.
- [ ] **GearHub Events**: Click a card in `/gear` and verify `[Analytics] gearhub_click` is logged.

## 5. Automation
- [ ] **Auto-commit Script**: Run `node scripts/auto-commit-blog.js` and verify it correctly detects changes in `blog.json`, commits them, and attempts to push.
