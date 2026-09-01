/**
 * columns — Block Collection shape: one row, one cell per column.
 * gallery variant (club-nolo): four square photos edge to edge.
 * Ground via ground-* variant classes.
 */
export default async function decorate(block) {
  const ground = [...block.classList].find((c) => c.startsWith('ground-'));
  if (ground) block.closest('.section')?.classList.add(ground);
  const row = block.querySelector(':scope > div');
  if (!row) return;
  const inner = document.createElement('div');
  inner.className = 'wrap columns-inner';
  [...row.children].forEach((cell) => {
    const col = document.createElement('div');
    col.className = 'column';
    [...cell.childNodes].forEach((n) => col.append(n.cloneNode(true)));
    inner.append(col);
  });
  block.replaceChildren(inner);
}
