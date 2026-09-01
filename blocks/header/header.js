import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * header — wijnvoordeel.be chrome (template-slotted replica).
 * Schema: stardust/eds-schema/flair-rose.json (chrome is outside sections;
 * geometry from sites/wijnvoordeel-be/capture/lift-1440.json).
 *
 * /nav fragment contract (3 sections):
 *   1. brand — logo link + image
 *   2. sections — <ul> of nav links (last li "Service" renders right-aligned)
 *   3. tools — <ul> USP bar items (img + text, <em> = green accent) and an
 *      optional wijnmatch image link
 *
 * Sticky morph mirrors the live site: body.make-sticky-header past 240px
 * scroll pins the nav row; document height is compensated (measured live:
 * docH 2944 → 2943).
 */

const ICONS = {
  search: '/icons/header-search.svg',
  account: '/icons/my-account.svg',
  cart: '/icons/minicart.svg',
};

function el(tag, className, html) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  if (html !== undefined) e.innerHTML = html;
  return e;
}

function buildSearch(extraClass, placeholder) {
  const wrap = el('div', `block-search ${extraClass || ''}`);
  wrap.innerHTML = `
    <form class="minisearch" action="https://www.wijnvoordeel.be/catalogsearch/result/" method="get">
      <input class="input-text" type="text" name="q" placeholder="${placeholder}" maxlength="128" autocomplete="off">
      <button type="submit" class="action-search" aria-label="Zoeken"><span>Zoek</span></button>
    </form>`;
  return wrap;
}

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  const sections = [...fragment.querySelectorAll(':scope > .section')];
  const [brandSec, linksSec, toolsSec] = sections;

  const nav = el('div', 'wvd-header');

  // --- top USP bar (tools section's list) ---
  const uspList = toolsSec?.querySelector('ul');
  if (uspList) {
    const bar = el('div', 'top-container-usp');
    const wrap = el('div', 'wrap');
    const ul = el('ul', 'ism-usp');
    [...uspList.children].forEach((li) => {
      const item = el('li', 'ism-usp-item');
      // images stay direct flex children; text goes in one span so the
      // flex layout doesn't drop whitespace between text and <em>
      const text = el('span', 'ism-usp-item-text');
      [...li.childNodes].forEach((n) => {
        if (n.nodeType === Node.ELEMENT_NODE && n.matches('picture, img')) item.append(n.cloneNode(true));
        else text.append(n.cloneNode(true));
      });
      item.append(text);
      ul.append(item);
    });
    wrap.append(ul);
    bar.append(wrap);
    nav.append(bar);
  }

  // --- header content: logo / search / account+cart ---
  const content = el('div', 'header-content');
  const brandLink = brandSec?.querySelector('a') || el('a');
  const logo = el('a', 'logo');
  logo.href = brandLink.href || '/';
  logo.title = 'Wijnvoordeel.be';
  const brandImg = brandSec?.querySelector('picture, img');
  if (brandImg) logo.append(brandImg.cloneNode(true));
  const center = el('div', 'header-center');
  center.append(buildSearch('main-search', 'Zoek jouw favoriete wijn'));
  const right = el('div', 'header-right', `
    <ul class="header-links">
      <li class="header-search-toggle"><span class="hicon" style="background-image:url('${ICONS.search}')" aria-hidden="true"></span></li>
      <li class="header-account"><span class="hicon" style="background-image:url('${ICONS.account}')" aria-hidden="true"></span><span class="hlabel">Mijn account</span></li>
      <li class="minicart-wrapper"><a href="https://www.wijnvoordeel.be/checkout/cart/"><span class="hicon" style="background-image:url('${ICONS.cart}')" aria-hidden="true"></span><span class="hlabel">Mijn winkelwagen</span></a></li>
    </ul>`);
  const burger = el('button', 'nav-toggle', '<span>Menu</span>');
  burger.setAttribute('aria-label', 'Menu');
  content.append(burger, logo, center, right);
  nav.append(content);

  // --- nav row (links section's list) + sticky extras ---
  const navRow = el('div', 'nav-sections-row');
  const inner = el('div', 'nav-inner');
  const navList = linksSec?.querySelector('ul');
  if (navList) {
    const menu = el('nav', 'navigation-menu');
    menu.setAttribute('aria-label', 'Hoofdmenu');
    [...navList.querySelectorAll(':scope > li')].forEach((li) => {
      // pipeline may wrap the trigger link in a <p> (#98)
      const a = li.querySelector(':scope > a, :scope > p > a');
      if (!a) return;
      const link = el('a', 'navigation-menu-link');
      link.href = a.href;
      const text = el('span', 'navigation-menu-link-text');
      text.textContent = a.textContent.trim();
      if (/promoties/i.test(text.textContent)) text.classList.add('is-promo');
      if (/no\/low/i.test(text.textContent)) text.classList.add('is-nolow');
      if (/^service$/i.test(text.textContent)) link.classList.add('is-service');
      link.append(text);
      menu.append(link);
    });
    inner.append(menu);
  }
  const stickyEl = el('div', 'sticky-header-el');
  stickyEl.append(buildSearch('sticky-search', 'Zoek een wijn,...'));
  stickyEl.insertAdjacentHTML('beforeend', `
    <span class="hicon" style="background-image:url('${ICONS.account}')" aria-hidden="true"></span>
    <a href="https://www.wijnvoordeel.be/checkout/cart/" aria-label="Mijn winkelwagen"><span class="hicon" style="background-image:url('${ICONS.cart}')" aria-hidden="true"></span></a>`);
  inner.append(stickyEl);
  const wijnmatch = toolsSec?.querySelector('p a img, p picture')?.closest('a')
    || toolsSec?.querySelector('a:has(img), a:has(picture)');
  if (wijnmatch) {
    const wm = el('div', 'wijnmatch-btn');
    wm.append(wijnmatch.cloneNode(true));
    inner.append(wm);
  }
  navRow.append(inner);
  nav.append(navRow);

  block.replaceChildren(nav);

  // sticky morph (threshold inside the live 200–260 window)
  const onScroll = () => {
    document.body.classList.toggle('make-sticky-header', window.scrollY > 240);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
