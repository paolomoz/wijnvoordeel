/**
 * pattern-story — campaign narrative band on a patterned ground: heading-art
 * image, prose, orange CTA, polaroid photo (template-slotted; club-nolo).
 * Considered photo-quote (bg + quote img — different composition) and
 * campaign-intro (hero-specific) — new pattern justified (conversion log).
 *
 * Authoring rows: heading-art img | paragraphs (last bold line = lead-out) |
 * CTA (<strong><a>) | polaroid img. Ground via ground-* variant.
 */
export default async function decorate(block) {
  const ground = [...block.classList].find((c) => c.startsWith('ground-'));
  if (ground) block.closest('.section')?.classList.add(ground);

  const cells = [...block.querySelectorAll(':scope > div > div')];
  const pics = [];
  const paras = [];
  let cta = null;
  cells.forEach((cell) => {
    const m = cell.querySelector('picture, img');
    if (m) { pics.push(m.closest('picture') || m); return; }
    const a = cell.querySelector('a');
    if (a) { cta = a; return; }
    if (cell.textContent.trim()) paras.push(cell);
  });
  const [art, polaroid] = pics;

  const inner = document.createElement('div');
  inner.className = 'wrap story-inner';
  const txt = document.createElement('div');
  txt.className = 'txt-col';
  if (art) {
    const img = art.cloneNode(true);
    const raw = img.matches('img') ? img : img.querySelector('img');
    if (raw) raw.classList.add('heading-img');
    txt.append(img);
  }
  paras.forEach((cell, i) => {
    const p = document.createElement('p');
    if (i === paras.length - 1 && cell.querySelector('strong')) p.className = 'bold-line';
    [...cell.childNodes].forEach((n) => p.append(n.cloneNode(true)));
    txt.append(p);
  });
  if (cta) {
    const row = document.createElement('p');
    row.className = 'button-wrapper cta-row';
    const a = cta.cloneNode(true);
    if (!a.classList.contains('button')) a.classList.add('button', 'primary');
    row.append(a);
    // keep authored order: CTA sits before the bold lead-out line (as live)
    const bold = txt.querySelector('.bold-line');
    if (bold) txt.insertBefore(row, bold); else txt.append(row);
  }
  const pol = document.createElement('div');
  pol.className = 'pol-col';
  if (polaroid) pol.append(polaroid.cloneNode(true));
  inner.append(txt, pol);
  block.replaceChildren(inner);
}
