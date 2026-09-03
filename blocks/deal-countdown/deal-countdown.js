/**
 * deal-countdown — state-aware campaign countdown (NEW block, black-friday-2026).
 * Justification (stardust/eds-conversion-log.md): no existing block carries
 * time-driven state; forcing it into columns/usp-panel would hide a JS
 * behaviour behind a layout block's name.
 *
 * Authoring shape: KEY-VALUE rows (label cell | value cell), order-free,
 * case-insensitive keys:
 *   Start   — ISO datetime the campaign opens   (2026-11-23T00:00:00+01:00)
 *   Einde   — ISO datetime the campaign closes  (2026-11-30T23:59:59+01:00)
 *   Voor    — label while counting down to Start ("De Deal Week begint over")
 *   Tijdens — label while counting down to Einde ("De deals lopen nog")
 *   Na      — rich text shown after Einde (may carry a link)
 *   Tekst   — rich text beside the tiles (offer paragraph(s), optional link)
 *
 * States: before Start → counts to Start; inside the window → counts to Einde;
 * after Einde → tiles hidden, Na text shown. Without JS the label reads the
 * campaign dates and Tekst still renders. prefers-reduced-motion: seconds tile
 * frozen, minute cadence. Decode tier: template-slotted (fixed composition).
 */
function el(tag, className, html) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  if (html !== undefined) e.innerHTML = html;
  return e;
}

const fmt = new Intl.DateTimeFormat('nl-NL', { day: 'numeric', month: 'long' });
const pad = (n) => String(n).padStart(2, '0');

export default function decorate(block) {
  const text = {};
  const rich = {};
  [...block.children].forEach((row) => {
    const [k, v] = [...row.children];
    if (!k || !v) return;
    const key = k.textContent.trim().toLowerCase();
    text[key] = v.textContent.trim();
    rich[key] = v;
  });

  const start = new Date(text.start);
  const end = new Date(text.einde || text.end);
  const valid = !Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime());

  const wrap = el('div', 'wrap deal-wrap');
  const count = el('div', 'deal-count');
  const label = el('p', 'deal-label');
  label.setAttribute('aria-live', 'polite');
  label.innerHTML = valid ? `Deal Week: <strong>${fmt.format(start)} t/m ${fmt.format(end)}</strong>` : '';
  const tiles = el('ol', 'deal-tiles');
  tiles.setAttribute('aria-label', 'Resterende tijd');
  const units = ['dagen', 'uur', 'minuten', 'seconden'];
  const nums = units.map((u) => {
    const li = el('li', 'deal-tile');
    const b = el('b', '', '–');
    li.append(b, el('span', '', u));
    tiles.append(li);
    return b;
  });
  const post = el('div', 'deal-post');
  if (rich.na) [...rich.na.childNodes].forEach((n) => post.append(n.cloneNode(true)));
  count.append(label, tiles, post);

  const offer = el('div', 'deal-offer');
  if (rich.tekst) [...rich.tekst.childNodes].forEach((n) => offer.append(n.cloneNode(true)));

  wrap.append(count, offer);
  block.replaceChildren(wrap);
  if (!valid) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let state = '';
  const tick = () => {
    const now = new Date();
    let target;
    let next;
    if (now < start) { target = start; next = text.voor || 'Begint over'; } else if (now <= end) { target = end; next = text.tijdens || 'Nog'; } else {
      block.classList.add('is-over');
      label.textContent = text.na ? '' : 'Voorbij';
      return;
    }
    const d = target - now;
    nums[0].textContent = Math.floor(d / 864e5);
    nums[1].textContent = pad(Math.floor((d % 864e5) / 36e5));
    nums[2].textContent = pad(Math.floor((d % 36e5) / 6e4));
    nums[3].textContent = reduce ? '––' : pad(Math.floor((d % 6e4) / 1e3));
    if (state !== next) { label.textContent = next; state = next; }
  };
  tick();
  const timer = setInterval(() => { tick(); if (block.classList.contains('is-over')) clearInterval(timer); }, reduce ? 60000 : 1000);
}
