/**
 * usp-panel — green band closer: 4 USP items (icon over a lavender panel
 * with title + description) + the order CTA (reconstructive;
 * schema: stardust/eds-schema/flair-rose.json § usp-icons + usp-panel).
 *
 * Authoring rows:
 *   1..N: one row per USP — cells: icon image | title | description
 *   last:  CTA row — <strong><a>…</a></strong> (renders as the accent pill)
 */
export default async function decorate(block) {
  const ground = [...block.classList].find((c) => c.startsWith('ground-'));
  if (ground) block.closest('.section')?.classList.add(ground);
  const nolo = block.classList.contains('nolo');
  const rows = [...block.children];
  const uspRows = [];
  let ctaRow = null;

  rows.forEach((row) => {
    if (row.querySelector('a.button, strong a, em a')) ctaRow = row;
    else if (row.textContent.trim() || row.querySelector('picture, img')) uspRows.push(row);
  });

  const icons = document.createElement('div');
  icons.className = 'wrap icons-row';
  const panel = document.createElement('div');
  panel.className = 'wrap usp-panel-inner';

  uspRows.forEach((row) => {
    const cells = [...row.children];
    const pic = row.querySelector('picture, img');
    const texts = cells.filter((c) => !c.querySelector('picture, img') && c.textContent.trim());
    const [titleCell, descCell] = texts;

    const iconCol = document.createElement('div');
    iconCol.className = 'icon-col';
    if (pic) iconCol.append((pic.closest('picture') || pic).cloneNode(true));
    icons.append(iconCol);

    const col = document.createElement('div');
    col.className = 'usp-col';
    if (nolo && pic) col.append((pic.closest('picture') || pic).cloneNode(true));
    if (titleCell) {
      const strong = document.createElement('strong');
      strong.textContent = titleCell.textContent.trim();
      col.append(strong);
    }
    if (descCell) {
      const p = document.createElement('p');
      p.textContent = descCell.textContent.trim();
      col.append(p);
    }
    panel.append(col);
  });

  const order = document.createElement('div');
  order.className = 'wrap usp-order';
  if (ctaRow) {
    const a = ctaRow.querySelector('a');
    const btnWrap = document.createElement('p');
    btnWrap.className = 'button-wrapper';
    const btn = a.cloneNode(true);
    if (!btn.classList.contains('button')) btn.classList.add('button', 'primary');
    btnWrap.append(btn);
    order.append(btnWrap);
  }

  block.replaceChildren(icons, panel, order);
}
