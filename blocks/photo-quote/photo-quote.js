/**
 * photo-quote — full-bleed campaign photo band with a framed quote graphic
 * (template-slotted; schema: stardust/eds-schema/flair-rose.json § photo-quote).
 *
 * Authoring rows:
 *   1. background photo (editorial, authorable — renders as the band's bg layer)
 *   2. quote graphic (editorial)
 */
export default async function decorate(block) {
  const pics = [...block.querySelectorAll('picture, img')]
    .filter((p) => !p.closest('picture') || p.tagName === 'PICTURE');
  const [bg, quote] = pics;

  const root = document.createElement('div');
  root.className = 'photo-band';
  if (bg) {
    const layer = document.createElement('div');
    layer.className = 'photo-bg';
    layer.append(bg.cloneNode(true));
    root.append(layer);
  }
  const inner = document.createElement('div');
  inner.className = 'wrap photo-inner';
  if (quote) {
    const panel = document.createElement('div');
    panel.className = 'quote-panel';
    const fig = document.createElement('figure');
    fig.append(quote.cloneNode(true));
    panel.append(fig);
    inner.append(panel);
  }
  root.append(inner);
  block.replaceChildren(root);
}
