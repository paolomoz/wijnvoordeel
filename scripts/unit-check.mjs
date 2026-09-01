import { chromium } from 'playwright';
const b=await chromium.launch(); const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto('http://localhost:3000/qa/page.html',{waitUntil:'networkidle'});
console.log(await p.evaluate(()=>JSON.stringify({
  grapes: document.querySelectorAll('.bag-in-box .green-grape img').length,
  uspIcons: document.querySelectorAll('.usp-panel .icon-col img').length,
  uspCols: document.querySelectorAll('.usp-panel .usp-col').length,
  quotePanel: document.querySelectorAll('.photo-quote .quote-panel img').length,
  photoBg: document.querySelectorAll('.photo-quote .photo-bg img').length,
  h1: document.querySelectorAll('h1').length,
  cardActions: document.querySelectorAll('.product-card select option').length,
  buttons: [...document.querySelectorAll('a.button')].map(a=>a.className+' :: '+a.textContent.trim()),
})));
await b.close();
