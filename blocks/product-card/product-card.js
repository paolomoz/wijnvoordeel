/**
 * product-card — commerce product tile (reusable across campaign pages).
 * Template-slotted; schema: stardust/eds-schema/flair-rose.json § campaign-hero.
 *
 * Authoring rows (classified by content, not index):
 *   - first image  → product shot
 *   - second image → promo badge (optional)
 *   - <h3> (with optional <a>) → product name
 *   - text starting with a year (e.g. "2025 | …") → meta line
 *   - "Label - Value" line (e.g. "Smaak - Licht") → attribute
 *   - two prices "NN,NN" → old price (first) and current price (second)
 *   - text containing '%' → discount note
 *   - <ul> → quantity options (first option renders in the select)
 *   - CTA link (buttonized <strong><a>) → add-to-cart action
 */

function collectNodes(block) {
  const out = [];
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    const kids = [...cell.children];
    if (kids.length) out.push(...kids);
    else if (cell.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = cell.textContent.trim();
      out.push(p);
    }
  });
  return out;
}

function buildCard(nodes) {
  const media = (n) => (n.matches('picture, img') ? n : n.querySelector('picture, img'));

  const pics = [];
  let name = null;
  let meta = null;
  let attr = null;
  const prices = [];
  let discount = null;
  let qty = null;
  let cta = null;

  nodes.forEach((n) => {
    const m = media(n);
    if (m && !n.matches('h1, h2, h3, h4')) { pics.push(m); return; }
    if (n.matches('h1, h2, h3, h4')) { name = n; return; }
    if (n.matches('ul, ol')) { qty = n; return; }
    const a = n.querySelector('a.button, strong a, em a');
    if (a) { cta = a; return; }
    const t = n.textContent.trim();
    if (!t) return;
    if (/^\d{4}\s*\|/.test(t)) { meta = t; return; }
    if (/^\d+[.,]\d{2}$/.test(t)) { prices.push(t); return; }
    if (/%/.test(t)) { discount = n; return; }
    if (!attr) { attr = t; }
  });

  const card = document.createElement('div');
  card.className = 'product-item-info';

  // media area
  const photo = document.createElement('div');
  photo.className = 'product-item-photo';
  if (pics[0]) {
    const span = document.createElement('span');
    span.className = 'product-image-container';
    span.append(pics[0].cloneNode(true));
    photo.append(span);
  }
  if (pics[1]) {
    const badge = document.createElement('span');
    badge.className = 'crobox-medal';
    badge.append(pics[1].cloneNode(true));
    photo.append(badge);
  }
  card.append(photo);

  // details
  const details = document.createElement('div');
  details.className = 'product-item-details';
  if (meta) {
    const top = document.createElement('div');
    top.className = 'product-item-details-top';
    const small = document.createElement('div');
    small.className = 'small';
    small.textContent = meta;
    top.append(small);
    details.append(top);
  }
  if (name) {
    const h = document.createElement('h3');
    h.className = 'product-item-name';
    const inner = name.querySelector('h1, h2, h3, h4') || name;
    [...inner.childNodes].forEach((n) => h.append(n.cloneNode(true)));
    details.append(h);
  }
  if (attr) {
    const item = document.createElement('div');
    item.className = 'product-attr-item';
    item.textContent = attr;
    details.append(item);
  }
  card.append(details);

  // price + actions
  const form = document.createElement('div');
  form.className = 'product-item-form';
  const priceBox = document.createElement('div');
  priceBox.className = 'price-box';
  if (prices.length > 1) {
    const old = document.createElement('span');
    old.className = 'old-price';
    [old.textContent] = prices;
    priceBox.append(old);
  }
  if (prices.length) {
    const [euros, cents] = prices[prices.length - 1].split(',');
    const special = document.createElement('span');
    special.className = 'special-price';
    special.innerHTML = `<span class="price">${euros}<sup>,${cents}</sup></span>`;
    priceBox.append(special);
  }
  if (discount) {
    const d = document.createElement('div');
    d.className = 'product-discount';
    d.textContent = discount.textContent.trim();
    priceBox.append(d);
  }
  form.append(priceBox);

  const actions = document.createElement('div');
  actions.className = 'product-item-actions';
  if (qty) {
    const field = document.createElement('div');
    field.className = 'field-qty';
    const select = document.createElement('select');
    select.name = 'qty';
    select.title = 'Aantal';
    [...qty.querySelectorAll('li')].forEach((li, i) => {
      const opt = document.createElement('option');
      opt.value = String(i + 1);
      opt.textContent = li.textContent.trim();
      select.append(opt);
    });
    field.append(select);
    actions.append(field);
  }
  if (cta) {
    const btnWrap = document.createElement('p');
    btnWrap.className = 'button-wrapper';
    const a = cta.cloneNode(true);
    if (!a.classList.contains('button')) a.classList.add('button', 'primary');
    a.classList.add('tocart');
    btnWrap.append(a);
    actions.append(btnWrap);
  }
  form.append(actions);
  card.append(form);

  return card;
}

/**
 * rail variant — one row per product (cells: image [+badge] | texts | price | qty+CTA),
 * rendered as a horizontal rail of cards sharing the single-card DOM.
 * Ground variants (ground-*) paint the parent section (JS-applied, not authored
 * section-metadata). Justification (conversion log): same commerce-tile pattern
 * as the single card — D9 variant, not a new block.
 */
export default async function decorate(block) {
  const ground = [...block.classList].find((c) => c.startsWith('ground-'));
  if (ground) block.closest('.section')?.classList.add(ground);

  if (!block.classList.contains('rail')) {
    block.replaceChildren(buildCard(collectNodes(block)));
    return;
  }

  const rail = document.createElement('ol');
  rail.className = 'card-rail';
  let cta = null;
  [...block.children].forEach((row) => {
    const hasPic = row.querySelector('picture, img');
    const link = row.querySelector('a');
    if (!hasPic && link) { cta = link; return; }
    if (!hasPic && !row.textContent.trim()) return;
    const nodes = [];
    row.querySelectorAll(':scope > div').forEach((cell) => {
      const kids = [...cell.children];
      if (kids.length) nodes.push(...kids);
      else if (cell.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = cell.textContent.trim();
        nodes.push(p);
      }
    });
    const li = document.createElement('li');
    li.className = 'rail-item';
    li.append(buildCard(nodes));
    rail.append(li);
  });
  const wrap = document.createElement('div');
  wrap.className = 'wrap rail-wrap';
  wrap.append(rail);
  if (cta) {
    const row = document.createElement('p');
    row.className = 'button-wrapper rail-cta';
    const a = cta.cloneNode(true);
    if (!a.classList.contains('button')) a.classList.add('button', 'primary');
    row.append(a);
    wrap.append(row);
  }
  block.replaceChildren(wrap);
}
