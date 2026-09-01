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
