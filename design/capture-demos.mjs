import { mkdir } from 'node:fs/promises';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const out=process.env.CAPTURE_OUT || '/private/tmp/profile-demo-frames';
const browser=await chromium.launch({headless:true});
try {
 for(const name of ['margin','relay']) for(const mobile of [false,true]) {
  const key=name+(mobile?'-mobile':'');
  const dir=`${out}/${key}`; await mkdir(dir,{recursive:true});
  const page=await browser.newPage({viewport:{width:mobile?550:1440,height:1000},deviceScaleFactor:1,reducedMotion:'no-preference'});
  await page.goto((process.env.DEMO_URL || 'http://127.0.0.1:5320/in-the-works')+'#'+name,{waitUntil:'networkidle'});
  const host=page.locator(`[data-product-demo="${name}"]`);
  await host.scrollIntoViewIfNeeded();
  await host.locator('[data-ready="true"]').waitFor();
  await page.clock.install();
  await host.getByRole('button',{name:`Replay ${name} demo`,exact:false}).click();
  await page.clock.runFor(150);
  const scene=host.locator('.product-demo-viewport');
  for(let i=0;i<160;i++) {
   await scene.screenshot({path:`${dir}/${String(i).padStart(4,'0')}.png`});
   await page.clock.runFor(100);
  }
  console.log(key+' captured'); await page.close();
 }
} finally {await browser.close();}
