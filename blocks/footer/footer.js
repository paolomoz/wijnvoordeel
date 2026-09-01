import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * footer — wijnvoordeel.be chrome (template-slotted replica).
 *
 * /footer fragment contract (sections, in order):
 *   1. USP bar — <ul> (img + text, <em> = green accent)
 *   2..6. link columns — <h3><a>Title</a></h3> (or <h3>Title</h3>) + <ul> links
 *   7. legal line — <p>
 *   8. payment icons — <ul> of images
 *   9. social links — <ul> of image links
 *   10. bottom menu — <ul> of links / text items
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  const sections = [...fragment.querySelectorAll(':scope > .section')];
  const root = document.createElement('div');
  root.className = 'wvd-footer';

  const take = (i) => sections[i] || null;

  // 1. usp bar
  const usp = take(0)?.querySelector('ul');
  if (usp) {
    const bar = document.createElement('div');
    bar.className = 'footer-usp-section';
    const wrap = document.createElement('div');
    wrap.className = 'wrap';
    const ul = document.createElement('ul');
    ul.className = 'ism-usp';
    [...usp.children].forEach((li) => {
      const item = document.createElement('li');
      item.className = 'ism-usp-item';
      // images stay direct flex children; text goes in one span so the
      // flex layout doesn't drop whitespace between text and <em>
      const text = document.createElement('span');
      text.className = 'ism-usp-item-text';
      [...li.childNodes].forEach((n) => {
        if (n.nodeType === Node.ELEMENT_NODE && n.matches('picture, img')) item.append(n.cloneNode(true));
        else text.append(n.cloneNode(true));
      });
      item.append(text);
      ul.append(item);
    });
    wrap.append(ul);
    bar.append(wrap);
    root.append(bar);
  }

  // 2..6. link columns + 7. legal — inside the tinted container
  const menuContainer = document.createElement('div');
  menuContainer.className = 'footer-menu-container';
  const menuWrap = document.createElement('div');
  menuWrap.className = 'wrap';
  const columns = document.createElement('div');
  columns.className = 'footer-columns';
  for (let i = 1; i <= 5; i += 1) {
    const sec = take(i);
    if (!sec) break;
    const col = document.createElement('div');
    col.className = 'footer-col';
    const item = document.createElement('div');
    item.className = 'footer-menu-item';
    const heading = sec.querySelector('h1, h2, h3, h4');
    if (heading) {
      const title = document.createElement('div');
      title.className = 'footer-menu-title';
      [...heading.childNodes].forEach((n) => title.append(n.cloneNode(true)));
      item.append(title);
    }
    const list = sec.querySelector('ul');
    if (list) {
      const ul = list.cloneNode(true);
      ul.className = 'footer-menu-list';
      item.append(ul);
    }
    col.append(item);
    columns.append(col);
  }
  menuWrap.append(columns);
  const legal = take(6)?.querySelector('p');
  if (legal) {
    const p = document.createElement('p');
    p.className = 'footer-legal';
    [...legal.childNodes].forEach((n) => p.append(n.cloneNode(true)));
    menuWrap.append(p);
  }
  menuContainer.append(menuWrap);
  root.append(menuContainer);

  // 8..10. bottom content
  const bottom = document.createElement('div');
  bottom.className = 'footer-menu-bottom-content';
  const pay = take(7)?.querySelector('ul');
  if (pay) {
    const payBlock = document.createElement('div');
    payBlock.className = 'footer-payment-block';
    const ul = pay.cloneNode(true);
    ul.className = 'footer-payment-icons';
    payBlock.append(ul);
    bottom.append(payBlock);
  }
  const row = document.createElement('div');
  row.className = 'footer-bottom-row';
  const social = take(8)?.querySelector('ul');
  if (social) {
    const div = document.createElement('div');
    div.className = 'footer-bottom-social-links';
    [...social.querySelectorAll('a')].forEach((a) => div.append(a.cloneNode(true)));
    row.append(div);
  }
  const menu = take(9)?.querySelector('ul');
  if (menu) {
    const div = document.createElement('div');
    div.className = 'footer-bottom-additional-links';
    const ul = menu.cloneNode(true);
    ul.className = 'footer-bottom-menu';
    div.append(ul);
    row.append(div);
  }
  bottom.append(row);
  root.append(bottom);

  // mobile accordion (parity with live tap-to-expand)
  root.querySelectorAll('.footer-menu-item .footer-menu-title').forEach((t) => {
    t.addEventListener('click', () => {
      if (window.innerWidth > 768) return;
      t.closest('.footer-menu-item').classList.toggle('open');
    });
  });

  block.replaceChildren(root);
}
