/**
 * bag-in-box — green campaign band: grape motif graphics flanking the
 * BAG-IN-BOX title graphic + copy (template-slotted;
 * schema: stardust/eds-schema/flair-rose.json § bag-in-box).
 *
 * Authoring rows:
 *   1. grape motif image (rendered on BOTH sides, as live)
 *   2. title graphic (BAG-IN-BOX lettering)
 *   3. body paragraph (leading <strong> = the bold intro)
 */
export default async function decorate(block) {
  const pics = [...block.querySelectorAll(':scope > div > div')]
    .map((cell) => cell.querySelector('picture, img'))
    .filter(Boolean)
    .map((m) => (m.closest('picture') || m));
  const paras = [...block.querySelectorAll('p')].filter((p) => !p.querySelector('picture, img') && p.textContent.trim());
  const [grape, title] = pics;
  const text = paras[0];

  const inner = document.createElement('div');
  inner.className = 'wrap green-inner';

  const grapeCol = (side) => {
    const col = document.createElement('div');
    col.className = `green-grape green-grape-${side}`;
    if (grape) {
      const fig = document.createElement('figure');
      fig.append(grape.cloneNode(true));
      col.append(fig);
    }
    return col;
  };

  const center = document.createElement('div');
  center.className = 'green-center';
  if (title) {
    const fig = document.createElement('figure');
    fig.className = 'bib-title';
    fig.append(title.cloneNode(true));
    center.append(fig);
  }
  if (text) {
    const div = document.createElement('div');
    div.className = 'bib-text';
    const p = document.createElement('p');
    [...text.childNodes].forEach((n) => p.append(n.cloneNode(true)));
    div.append(p);
    center.append(div);
  }

  inner.append(grapeCol('left'), center, grapeCol('right'));
  block.replaceChildren(inner);
}
