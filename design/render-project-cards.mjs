import { readFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Install Playwright locally, or point PLAYWRIGHT_MODULE to an existing installation.
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const font = async (f) => (await readFile(resolve(root, 'motion/public/assets', f))).toString('base64');
const [serif, sans] = await Promise.all([font('newsreader.woff2'), font('dm-sans.woff2')]);
const cards = [
  {id:'procuraiq', title:'ProcuraIQ', desc:'Ingredient analysis<br>and supplier comparisons.', source:'procuraiq-pitch.png', fit:'contain', bg:'#000000'},
  {id:'contextual-writing', title:'Contextual<br>Writing', desc:'Writing workflows for<br>Claude and Codex.', source:'contextual.png', pos:'left center'},
  {id:'fjord-fleet', title:'Fjord Fleet<br>Pricing', desc:'A university analytics<br>case on fleet pricing.', source:'fjord.png', fit:'contain', bg:'#ffffff'},
  {id:'strikesignal', title:'StrikeSignal', desc:'Counter-Strike predictions<br>and analysis.', status:'Unfinished. On hold.', source:'strikesignal.jpg', pos:'left top'},
  {id:'personal-website', title:'Personal<br>website', desc:'More about my background,<br>interests and work.', source:'personal-gull.png', fit:'contain', bg:'#121a16'},
  {id:'margin', title:'Margin', desc:'A workspace for CVs,<br>cover letters and applications.', status:'In development.', source:'margin.png', fit:'contain', bg:'#efe9d9'},
  {id:'relay', title:'Relay', desc:'Skills and integrations<br>for AI tools.', status:'In development.', source:'relay.png', fit:'contain', bg:'#000000'},
];
const browser = await chromium.launch({headless:true});
try {
  const page = await browser.newPage({viewport:{width:1200,height:450},deviceScaleFactor:1});
  await mkdir(resolve(root,'assets/projects'),{recursive:true});
  for (const c of cards.filter((card) => !process.argv[2] || card.id === process.argv[2])) {
    const bytes = await readFile(resolve(here,'source',c.source));
    const mime = c.source.endsWith('.jpg') ? 'image/jpeg' : 'image/png';
    const data = bytes.toString('base64');
    const html=`<!doctype html><html><head><style>
      @font-face{font-family:Newsreader;src:url(data:font/woff2;base64,${serif}) format('woff2');font-weight:200 800}
      @font-face{font-family:DMSans;src:url(data:font/woff2;base64,${sans}) format('woff2');font-weight:200 900}
      *{box-sizing:border-box}html,body{margin:0;background:#121a16}
      .card{width:1200px;height:450px;background:#121a16;color:#eef1e8;display:flex;align-items:stretch;overflow:hidden}
      .words{width:495px;flex:none;padding:57px 35px 48px 58px;display:flex;flex-direction:column;justify-content:center}
      h1{font:400 66px/0.98 Newsreader,Georgia,serif;letter-spacing:-.036em;margin:0 0 27px}
      p{font:400 28px/1.4 DMSans,sans-serif;letter-spacing:-.012em;margin:0;color:#c2cbbd}
      .status{font:500 23px/1.3 DMSans,sans-serif;margin-top:26px;color:#a8c59d}
      .image{height:390px;width:675px;margin:30px 30px 30px 0;overflow:hidden;background:${c.bg || '#1d2a22'};border-radius:5px}
      .image img{height:100%;width:100%;object-fit:${c.fit || 'cover'};object-position:${c.pos || 'center'};display:block}
    </style></head><body><div class="card"><div class="words"><h1>${c.title}</h1><p>${c.desc}</p>${c.status?`<div class="status">${c.status}</div>`:''}</div><div class="image"><img src="data:${mime};base64,${data}"></div></div></body></html>`;
    await page.setViewportSize({width:1200,height:450});
    await page.setContent(html,{waitUntil:'load'}); await page.evaluate(()=>document.fonts.ready);
    await page.locator('.card').screenshot({path:resolve(root,'assets/projects',c.id+'.png')});
    const mobileCss = `<style>
      .card{width:800px;height:700px;flex-direction:column}
      .words{width:800px;height:260px;flex:none;padding:24px 48px 16px}
      h1{font-size:72px;line-height:1;margin-bottom:15px}
      p{font-size:34px;line-height:1.2}
      .status{font-size:28px;margin-top:10px}
      .image{flex:none;width:736px;height:408px;margin:0 32px 32px}
    </style>`;
    const mobileHtml = html.replace(`<h1>${c.title}</h1>`, `<h1>${c.title.replaceAll('<br>', ' ')}</h1>`).replace('</head>', mobileCss + '</head>');
    await page.setViewportSize({width:800,height:700});
    await page.setContent(mobileHtml,{waitUntil:'load'}); await page.evaluate(()=>document.fonts.ready);
    await page.locator('.card').screenshot({path:resolve(root,'assets/projects',c.id+'-mobile.png')});
    console.log(c.id);
  }
} finally {await browser.close();}
