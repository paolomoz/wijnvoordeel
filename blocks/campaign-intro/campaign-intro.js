/**
 * campaign-intro — left column of the flair-rose campaign hero
 * (template-slotted; schema: stardust/eds-schema/flair-rose.json § campaign-hero).
 *
 * Authoring rows (classified by content, not index):
 *   - two images (campaign graphic + tagline graphic, in authored order)
 *   - <h1> lead line (the page's single h1)
 *   - body paragraph(s)
 *   - a paragraph whose text ends with ':' → the list title (e.g. "Kenmerken:")
 *   - <ul> feature list
 *   - a paragraph containing <strong> → the closing emphasis line
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
  return out.length ? out : [...block.children];
}

export default async function decorate(block) {
  const nodes = collectNodes(block);
  const media = (n) => (n.matches('picture, img') ? n : n.querySelector('picture, img'));

  const pics = [];
  let lead = null;
  let listTitle = null;
  let list = null;
  const bodies = [];
  let closing = null;

  nodes.forEach((n) => {
    const m = media(n);
    if (m && !n.matches('h1, h2, h3')) { pics.push(m); return; }
    if (n.matches('h1, h2')) { lead = n; return; }
    if (n.matches('ul, ol')) { list = n; return; }
    const t = n.textContent.trim();
    if (!t) return;
    if (t.endsWith(':')) { listTitle = n; return; }
    if (n.querySelector('strong') && !closing && list) { closing = n; return; }
    bodies.push(n);
  });

  const root = document.createElement('div');
  root.className = 'hero-left';

  const images = document.createElement('div');
  images.className = 'hero-images';
  pics.forEach((p, i) => {
    const fig = document.createElement('figure');
    fig.className = `hero-img-${i + 1}`;
    const img = p.cloneNode(true);
    const raw = img.matches('img') ? img : img.querySelector('img');
    if (raw && i === 0) { raw.setAttribute('loading', 'eager'); raw.setAttribute('fetchpriority', 'high'); }
    fig.append(img);
    images.append(fig);
  });
  root.append(images);

  const text = document.createElement('div');
  text.className = 'hero-text';
  if (lead) {
    const h = document.createElement('h1');
    const inner = lead.querySelector('h1, h2, h3') || lead;
    [...inner.childNodes].forEach((n) => h.append(n.cloneNode(true)));
    const p = document.createElement('p');
    p.className = 'lead';
    p.append(h);
    text.append(p);
  }
  bodies.forEach((b) => {
    const p = document.createElement('p');
    p.className = 'body-black';
    [...b.childNodes].forEach((n) => p.append(n.cloneNode(true)));
    text.append(p);
  });
  if (listTitle || list) {
    const p = document.createElement('p');
    p.className = 'kenmerken';
    if (listTitle) {
      const strong = document.createElement('strong');
      strong.className = 'k-title';
      strong.textContent = listTitle.textContent.trim();
      p.append(strong);
    }
    if (list) {
      const ul = document.createElement('ul');
      [...list.querySelectorAll('li')].forEach((li) => {
        const item = document.createElement('li');
        [...li.childNodes].forEach((n) => item.append(n.cloneNode(true)));
        ul.append(item);
      });
      p.append(ul);
    }
    text.append(p);
  }
  if (closing) {
    const p = document.createElement('p');
    p.className = 'gratis';
    [...closing.childNodes].forEach((n) => p.append(n.cloneNode(true)));
    text.append(p);
  }
  root.append(text);

  block.replaceChildren(root);
}
