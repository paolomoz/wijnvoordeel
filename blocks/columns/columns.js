/**
 * columns — Block Collection shape: one row, one cell per column.
 * gallery variant (club-nolo): four square photos edge to edge.
 * advies-* variants (wijnadvies): hero band, prose cards, linked figure
 * tiles, icon tiles, banner, trust line. Art-directed cells carry two
 * pictures (desktop first, mobile second) — visibility is CSS-side. An
 * advies-cards block with TWO rows is a breakpoint pair: first row
 * desktop copy, second row mobile copy.
 * Variants map to section classes (same mechanism as ground-*), since the
 * vendored runtime has no section-metadata support.
 */
const SECTION_CLASS = {
  'advies-cards': ['advies-cards-section'],
  'advies-tiles': ['advies-panel'],
  'advies-icons': ['advies-panel', 'advies-icons-section'],
  'advies-banner': ['advies-banner'],
  'advies-trust': ['advies-trust-section'],
};

export default async function decorate(block) {
  const section = block.closest('.section');
  const ground = [...block.classList].find((c) => c.startsWith('ground-'));
  if (ground) section?.classList.add(ground);
  [...block.classList].forEach((c) => {
    (SECTION_CLASS[c] || []).forEach((sc) => section?.classList.add(sc));
  });

  const rows = [...block.querySelectorAll(':scope > div')];
  if (!rows.length) return;
  const inners = rows.map((row, i) => {
    const inner = document.createElement('div');
    inner.className = 'wrap columns-inner';
    if (i > 0) inner.classList.add('inner-mobile');
    [...row.children].forEach((cell) => {
      const col = document.createElement('div');
      col.className = 'column';
      [...cell.childNodes].forEach((n) => col.append(n.cloneNode(true)));
      if (col.querySelector('picture') && !col.querySelector('h1,h2,h3,h4')
        && ![...col.querySelectorAll('p')].some((p) => p.textContent.trim())) {
        col.classList.add('col-pic');
      }
      inner.append(col);
    });
    return inner;
  });

  if (block.classList.contains('advies-tiles')) {
    inners.forEach((inner) => [...inner.children].forEach((col) => {
      const link = col.querySelector('a');
      if (!link) return;
      const a = document.createElement('a');
      a.href = link.href;
      a.className = 'tile';
      const fig = document.createElement('figure');
      col.querySelectorAll('picture').forEach((pic) => fig.append(pic));
      const cap = document.createElement('figcaption');
      cap.textContent = link.textContent.trim();
      fig.append(cap);
      a.append(fig);
      col.replaceChildren(a);
    }));
  }

  block.replaceChildren(...inners);
}
