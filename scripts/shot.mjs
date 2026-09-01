import { chromium } from 'playwright';
const url = process.argv[2]; const out = process.argv[3]; const w = parseInt(process.argv[4]||'1440',10);
const b=await chromium.launch(); const p=await (await b.newContext({viewport:{width:w,height:900}})).newPage();
await p.goto(url,{waitUntil:'networkidle'}); await p.waitForTimeout(1500);
await p.evaluate(async()=>{for(let y=0;y<=document.body.scrollHeight;y+=800){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,100));}window.scrollTo(0,0);});
await p.waitForTimeout(400);
await p.screenshot({path:out,fullPage:true});
console.log('shot', out, await p.evaluate(()=>document.body.scrollHeight));
await b.close();
