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
