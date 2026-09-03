# EDS conversion log — flair-rose (replica deploy)

Source of truth: the gated replica prototype
`sites/wijnvoordeel-be/stardust/prototypes/flair-rose-proposed.html`
(source-fidelity gate: 1440 1.88%/Δ0, 360 1.97%/Δ−1 vs live wijnvoordeel.be).
Schema: `stardust/eds-schema/flair-rose.json`. Runtime: `stardust/runtime-contract.json`
(vanilla boilerplate, formatted-only buttonization, `p.button-wrapper`).

## Block inventory + decode tiers (locked)

| block | tier | prototype section | notes |
|---|---|---|---|
| `campaign-intro` | template-slotted | `.hero-left` | campaign images + lead + kenmerken list |
| `product-card` | template-slotted | `.hero-right` | reusable commerce tile (image, badge, meta, name, attr, prices, discount, qty, CTA) |
| `photo-quote` | template-slotted | `.section-photo` | editorial bg photo as authorable layer + quote graphic |
| `bag-in-box` | template-slotted | `.section-green` | grape motif authored once, rendered both sides (as live) |
| `usp-panel` | reconstructive | `.section-icons` + `.section-usp` | one row per USP (icon/title/desc) + CTA row; icons straddle panel edge |
| `header` / `footer` | template-slotted chrome | canon.css chrome | fed by authored `/nav` + `/footer` (3-section / 10-section contracts in block JSDoc) |

Section layout: `campaign-intro` + `product-card` share one section; the section
CSS (in campaign-intro.css) carries the lavender ground and the 827/413 split.

## Deliberate deltas vs the live page (the roundtrip gate's 2 🔴s — justified)

1. **`<h1>` promotion (#35).** The live page has ZERO heading elements (all
   PageBuilder styled divs). The lead line is promoted to the page's single
   `<h1>` (styled identically: 20/26 w700 campaign-green). ROLE SWAP
   body→heading is intentional.
2. **Add-to-cart as buttonized link.** Live uses a Magento form POST; the EDS
   demo has no commerce backend, so "In winkelwagen" is `<strong><a>` to the
   live cart-add URL. ROLE SWAP body→cta is intentional. Real commerce wiring
   (drop-ins) is a delivery-phase integration item.
3. **Kenmerken as a real `<ul>`.** Live renders literal "• " text spans with
   arbitrary Word-paste splits; authored as a clean list, block renders the
   same glyphs via `li::before`. (roundtrip 🟡 EXTRA/MISSING pairs = same
   strings modulo the glyph and split granularity.)
4. **Mobile experience.** Live mobile is a SEPARATE PageBuilder content set
   (different assets/copy — the dual-content anti-pattern EDS removes). The
   EDS page authors ONE content set that adapts responsively. Published-origin
   fidelity is gated at 1440; mobile diverges from live by design.
5. **Single authored logo** (desktop asset scaled at mobile; live swaps to a
   horizontal variant). Authorable later by swapping the nav doc image.
6. **USP bars frozen** to one item at mobile (live runs a slick autoplay
   carousel — nondeterministic; ledger'd in the replica run too).
7. **Header mega-menu dropdowns** not reproduced (deferred; nav links work).

## D1 lint advisories (justified)

- `photo-quote` / `bag-in-box` flagged as default-content candidates: they are
  genuine bespoke campaign compositions (full-bleed grounds, framed quote,
  flanked motif layout) — kept as template-slotted blocks.
- `usp-panel` differing cell counts: intentional (4× icon/title/desc + 1 CTA row).
- Footer SVGs: batch-verified pure-vector, all < 5KB.

## Fonts

Quasimoda self-hosted (customer's own webfont files) + `quasimoda-fallback`
metric-matched Arial (fontTools). ⚠️ licensing alert in styles.css banner,
fonts/LICENSING.md, and the hand-off.

## wijnvoordeel.nl — clubnolo (2026-09-01)

Block-reuse decisions (one line per new/extended block, existing block considered first):
- product-card + `rail` variant: considered as-is — pilot renders ONE card in a shared hero section; the campaign needs a 3-card rail with equalized heights and an optional CTA row, same card anatomy → variant, not new block. Card internals (photo 216, details pb16, actions pb12, form 120) lifted from source.
- campaign-intro + `nolo` variant: considered default hero-images — that is a 2-photo collage in a 66/33 split section; the NoLo hero is a full-bleed 400px photo band with layered art + brand logo columns; same "campaign lead" ground → variant with its own section reset.
- usp-panel + `nolo` variant: considered default — same 3-column USP ground, different skin (info panel on pattern ground, icon imgs) → variant.
- pattern-story: NEW — narrative band (heading-art | prose | CTA | polaroid) on patterned ground; no existing block shares this structure (campaign-intro is media-led, usp-panel is icon-led); forcing it into either would merge different grounds.
- columns + `gallery` variant: NEW block but Block Collection name/shape (one row → columns); gallery = square-cropped photo strip.
- ground-* pattern backgrounds: fixed brand assets in repo /img/nolo (not authored), applied to sections by block variant class (vendored runtime has no section-metadata support).
- Chrome: /nav-nl + /footer-nl docs (same section contracts as /nav + /footer). Brand deltas live behind `header.brand-nl` / `footer.brand-nl` (nav/footer doc path ending `-nl`) and the page-scoped `theme: sticky-grow` (+24px pinned-header flow growth is clubnolo-specific — measured: wijnadvies and .be hold height).

### Block inventory — clubnolo
| Section | Block | Status | New CSS/JS |
| --- | --- | --- | --- |
| hero band | campaign-intro (nolo) | extended-with-variant | ~45 css / ~30 js |
| rail groen + usp | product-card (rail) + usp-panel (nolo) | extended-with-variant | ~55 css / ~40 js refactor (buildCard extract) |
| pattern story geel-1 / blauw-1 | pattern-story | NEW | 27 css / 58 js |
| rails geel-2 / blauw-2 | product-card (rail) | reused | — |
| gallery blauw-4 | columns (gallery) | NEW (Collection shape) | ~15 css / ~20 js |
| chrome | header/footer + nav-nl/footer-nl docs | reused (brand-nl hooks) | ~10 css / 4 js |

## wijnvoordeel.nl — wijnadvies (2026-09-01)

Block-reuse decisions:
- ZERO new blocks. Every pattern absorbed by the `columns` Collection block as variants:
  - `advies-hero` (2-img row on solid orange ground): considered campaign-intro — both its default (collage in split pilot section) and nolo (layered photo band) are structurally different; a plain image row is the columns ground.
  - `advies-cards` (beige prose cards): considered usp-panel (icon-led, single panel) and pattern-story (patterned band) — both would be forced merges; generic n-column rich-text cells → columns variant. Two-row blocks are breakpoint pairs (row 2 = mobile copy) — matches the live page's paired desktop/mobile PageBuilder rows.
  - `advies-tiles` (linked figure tiles + caption arrow), `advies-icons` (beige mini-cards), `advies-banner` (linked visual), `advies-trust` (rating line, flat 4.5-star asset): all columns variants, geometry-only CSS.
- Bordered panels via section class `advies-panel` (mapped from block variant, same mechanism as ground-*).
- clubnolo reuse check: product-card/pattern-story/usp-panel not needed here (no products, no patterned grounds) — reuse target was columns, which this page exercises heavily.

### Block inventory — wijnadvies
| Section | Block | Status | New CSS/JS |
| --- | --- | --- | --- |
| orange hero | columns (advies-hero, ground-oranje) | reused + variant | ~10 css |
| wijnmatch/vinoloog cards | columns (advies-cards, 2-row breakpoint pair) | reused + variant | ~30 css |
| Top 10 panel | default content + columns (advies-tiles) | reused + variant | ~20 css |
| wijn & spijs | columns (advies-cards) | reused | — |
| icon tiles | columns (advies-icons) | reused + variant | ~12 css |
| WijnMatch banner | columns (advies-banner) | reused + variant | ~6 css |
| Trustpilot line | columns (advies-trust) | reused + variant | ~12 css |
| shared | columns.js multi-row/variant→section map | — | ~25 js |

### Maintainability flags (for the shared-code review; NOT refactored per scope)
- footer.css sizes payment icons by `li:nth-child(N)` — positionally coupled to each brand's icon set/order; .nl needed a full brand-nl-scoped override table. Keying sizes to stable attributes (e.g. `img[alt="Klarna"]`) would collapse both tables into one; flagged, zero-visual-change candidate.
- `.advies-panel .default-content-wrapper p:nth-of-type(1/2)` desktop/mobile intro pair is positional; acceptable while documented here, same remark as above.
- pre-existing pilot CSS duplication (btn pill styles repeated across header/footer/product-card/columns) noted; not touched.

## Maintainability review pass (2026-09-01, cross-repo — Natxo's review)

Actions (zero visual impact, proven by 0.00% bit-identical captures on all 5 pages):
- Payment icon sizing: both positional `li:nth-child` tables (.be + brand-nl, 22 rules)
  collapsed into ONE alt-keyed table (14 rules, `img[alt="…"]`) — sizes are
  icon-intrinsic; the positional coupling that broke on the .nl icon order is gone.
  Same fix in the wijnbeurs repo (11 rules).
- Dead stock blocks removed: cards, hero, widget (this repo); cards, widget (wijnbeurs).
  blocks/ now contains exactly the used inventory.
- Token-completeness gate (#91): clean in both repos.
- Duplication scan: only the chrome USP bar repeats (header↔footer, ~10 lines/repo) —
  accepted as framework-idiomatic self-contained blocks; documented, not refactored.

Watch-items (documented, deliberately not refactored):
- Variant JS forks (`decorateCampaign`, `decorateNolo`) share <50% code with their
  base decorate — correct today (different compositions), split into own blocks if
  they grow further.
- `advies-cards` positional desktop/mobile paragraph pairs (2-row breakpoint pairs).
- `product-card` exists in both repos (cross-repo copy, skins diverged) — the
  concrete data point for a future mono-repo/shared-library discussion.

## wijnvoordeel.nl — black-friday-2026 (2026-09-03) — FROM-BRIEF page (stage 3)

Source of truth: `sites/wijnvoordeel-nl/stardust/prototypes/black-friday-2026-proposed.html`
(designed from Natxo's brief via stardust:direct → prototype; no live source page).
Direction: `sites/wijnvoordeel-nl/stardust/direction.md` (Active — black-friday-2026).
Schema: `stardust/eds-schema/black-friday.json`. Live: https://main--wijnvoordeel--paolomoz.aem.live/black-friday

### Decision grammar per section (default content → reuse → variant → NEW), locked before code

| # | Section (brief) | Considered | Decision | Why |
|---|---|---|---|---|
| 1 | Black Friday hero (dark, offer, bottle trio) | campaign-intro (default = 2-image collage + kenmerken list; nolo = photo band + baked art + logo) → both structurally different, <50% shared code (watch-item rule); columns (advies-hero precedent: text \| images row) | **columns + `bf-hero` variant** | The hero IS a 2-cell row (text \| 3 pictures) — the Collection shape; the variant adds the nacht ground (→ `ground-nacht` section class, same mechanism as ground-*), display type, CTA grouping, LCP attrs. ~70 lines CSS, 12 lines JS. |
| 2 | Deal mechanic (urgency) | tiered-deal band (needs fabricated tiers); sticky promo ribbon; countdown | **NEW block `deal-countdown`** | Time-driven STATE (pre-window → in-window → post-window) is behaviour no existing block has; hiding JS behind `columns` would name a layout block after a behaviour. Key-value rows (Start/Einde/Voor/Tijdens/Na/Tekst) — one of the three component-model shapes. Zero invented numbers: only the two real campaign dates. |
| 3 | Editorial intro on 3 regions | usp-panel nolo (icon-led title/desc cols — wrong semantics); pattern-story (media-led, patterned ground); columns advies-cards (boxed cards — craft-floor rejects icon/heading/text card scaffolds) | **default content (h2 + p) + columns + `regios` variant** | Prose head stays native; the 3 cells (h3 + grape line + p) are an editorial run with hairlines, not cards. ~35 lines CSS, 0 JS. |
| 4 | Promoted products (3 real wines) | redesign a dark card; horizontal list | **product-card `rail` — reused as-is** + default-content head | The captured commerce tile is the brand's conversion component (iaPriorities locked). Only `body.black-friday` theme-scoped tweaks (wrap, no nolo watermark). 0 block CSS/JS. |
| 5 | Brand USP row | usp-panel default (green band + lavender panel + CTA — flair-rose skin); nolo (3 cols on pattern ground) | **usp-panel + `bf` variant** | Same rows (icon \| title), different skin: horizontal triplet on the beige surface, rich title with `<em>` accent (as the chrome USP bar), no CTA row. ~40 lines CSS, 4 lines JS. |
| 6 | Closing CTA | closing block; columns | **default content + section-metadata `style: dark`** | Heading + paragraph + 2 buttonized links = no repeating structure → D1 says no block. Needed section-metadata decoding (the vendored aem.js has none) → 25 lines in scripts.js, benefits every future default-content section. |
| — | Chrome | — | **reused verbatim** (/nav-nl, /footer-nl, brand-nl hooks) | 5 live pages re-gated 0.00% bit-identical after the code push (stitched capture, same instrument as the baselines). |

Deliberately NOT built: a `black-friday` hero block (columns absorbs it), a tiered-deal block (would ship fabricated tiers or placeholder ribbons in the deck), a dark product-card variant (would restyle the conversion component).

### Block inventory — black-friday-2026
| Section | Block | Status | New CSS/JS |
| --- | --- | --- | --- |
| dark hero | columns (bf-hero → ground-nacht) | extended-with-variant | ~70 css / ~12 js |
| deal band | deal-countdown | **NEW** | 118 css / 96 js |
| regions | default content + columns (regios) | reused + variant | ~35 css |
| products | default content + product-card (rail) | reused | — (theme-scoped: ~12 css) |
| usp | usp-panel (bf) | extended-with-variant | ~40 css / 4 js |
| closing | default content + section-metadata dark | default content | ~20 css (styles.css) + 25 js (scripts.js decoder) |
| chrome | header/footer + nav-nl/footer-nl | reused | — |

Totals: **1 new block, 3 variants (columns×2, usp-panel×1), 2 blocks reused as-is (product-card, chrome), 3 default-content sections.** Library after this page: 11 content blocks + 2 chrome sets for 6 exotic pages; new-blocks-per-page curve 5 → 5 → 2 → 2 → 0 → **1**.

### Natxo-style review record
- **Responsive behaviour:** one fluid model at every width (L17 — no resolved px frozen): hero 58/42 flex → column-reverse (bottles first) ≤768; countdown 4 tiles `flex:1 1 0` → 2×2 ≤414; regions 3 cols with hairline pseudo → stacked with top hairlines; rail wraps (theme-scoped) → single column ≤768; USP triplet → left-aligned stack. Verified 1920 / 1440 / 800 / 360 (computed-style guard: all block layouts compute `flex`, 0 zero-width images, 0 broken, 1 h1, no horizontal overflow at 1920/1440/360; at 800 the frozen live chrome's desktop nav overflows by 17–34px exactly as the live site does — chrome, out of scope).
- **Variants added:** `columns.bf-hero`, `columns.regios`, `usp-panel.bf`. **Section styles:** `ground-nacht` (block-applied), `dark` (section-metadata, closed set now {dark}), `black-friday` theme (page metadata → body class; scopes the rail tweaks and section-head typography).
- **Gates:** davids-model-lint 0 🔴 / 1 🟡 (rail CTA row has 1 cell vs 4 — same accepted shape as clubnolo); block-roundtrip 0 structural 🔴 on all 4 blocks + whole page (🟡: prototype's sr-only figcaption not authored — intentional, alt texts carry the names; usp img-count 🟡 fixed by not rendering the hidden icons row for `bf`); deployed guard PASS @1440/1920/360; CLS 0.043 @1440, 0.025 @360 (fetch-delayed probe); `.plain.html` 0 about:error, 9 imgs, 1 h1, 7/7 key facts; content-diff advisory 0 🔴; impeccable detect 0 findings (2 file-level waivers: pinned brand contrast pairs, frozen chrome padding — see DESIGN.json brand_faithful_inversions); chrome non-regression 5/5 pages 0.00%.
- **Content honesty:** every price/region/grape verbatim from the live product pages (2026-09-03); no discount % anywhere (author field on launch day — product-card already carries old/new price); the countdown uses only the brief's dates. Rejected: Immortalis Garnacha (its catalog image is a Monastrell label — L12 class), any Priorat/Montsant product (none in the live catalog).
- **Maintainability flags (not refactored):** (1) `product-card.rail` carries the club-nolo crobox watermark `::after` on the shared variant — campaign art leaked into a reusable variant; theme-scoped off here, should move to a `nolo` scope. (2) stylelint `no-descending-specificity` hits on appended variant rules (same class of pre-existing findings in columns.css/styles.css; the repo is not stylelint-clean at HEAD). (3) Local harness cannot apply page metadata (theme/nav) — `qa/black-friday.html` was hand-tagged `body.black-friday` for the guard; deployed guard is authoritative. (4) `section-metadata` decoding lives in scripts.js because aem.js is vendored without it.
- **Licensing:** unchanged — Quasimoda note stands (`fonts/LICENSING.md`).
- **Prototype ↔ deployed (advisory, from-brief page — no live source to gate against):** stitched 1440 captures differ 11.3% / Δh −33px; the diff image shows every section present with small rhythm offsets (EDS hero band ~40px taller from the columns-inner padding model, deals head spacing) plus the stitched sticky-nav bands — no missing or misrendered element. Deployed eyeball at 1440/360 is the accepted visual pass (Step 10 rule).
