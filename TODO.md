# TODO

## Czar Consultancy — UI Improvements (Part 1)

### Step 1 — Home/About preview placeholder bug
- [ ] Update `index.html` so the literal text `Loading about preview…` is replaced at runtime with real excerpt text from the About page section.

### Step 2 — Home/Practice areas empty-cards guard
- [ ] Ensure `#homeSvcGrid` is populated reliably on load (and add a fallback/hide while loading) so users don’t see heading+CTA without cards.

### Step 3 — Home/Insights Read Article links
- [x] Make “Read Article” links navigate correctly via the existing in-page router (`go()`), and ensure the corresponding insight pages are created before clicks.

### Step 4 — Prevent long back-to-back scroll
- [ ] Verify `.page` visibility/routing initialization so only the active page contributes to layout; prevent multiple pages from being visible simultaneously.

### Step 5 — After Part 1 passes, images
- [ ] Replace Unsplash placeholders with real/local assets across `index.html` where the prompt flags “stock photography”.

## Czar Consultancy — Insights Article Briefs (Full Draft Integration)

### Step 1 — Implement 5 full articles in the in-page generator
- [ ] Add `insightsData` entries for Articles 1–5 with `slug`, `title`, `tag`, `time`, `img`, `lastUpdated`, and full `articleHtml` content.
- [ ] Replace placeholder “Full article content coming soon…” with `ins.articleHtml`.

### Step 2 — Ensure FAQ accordion and CTA render correctly
- [ ] Use the site’s existing FAQ accordion CSS classes and JS conventions (or add minimal JS compatible with current page).
- [ ] Confirm CTA button links to `/contact`.

### Step 3 — QA links + rendering
- [ ] Load each article route (/insights/<slug>) and verify structure + “Last updated: 8 July 2026”.
- [ ] Verify the disclaimer is present on each page.


