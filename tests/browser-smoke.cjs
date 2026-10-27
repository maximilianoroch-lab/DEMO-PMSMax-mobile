const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage();
 const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.route('https://docs.google.com/**',route=>route.fulfill({status:503,body:'unavailable'}));
 await page.goto('file://'+process.cwd()+'/index.html',{waitUntil:'domcontentloaded'});
 await page.locator('#voiceSummaryBtn').click();
 if(!await page.locator('#voiceSummaryText').isVisible())throw Error('Safe summary not visible');
 if(!await page.locator('#voiceSummaryText').innerText().then(s=>s.includes('inventario ficticio')))throw Error('Missing demo-only warning');
 await page.locator('[data-page="diversificacion"]').click();
 if(!await page.locator('#diversificacion.active').count())throw Error('Diversification not navigable');
 await page.locator('[data-page="herramientas"]').click();
 if(!await page.locator('#herramientas.active').count())throw Error('Tools not navigable');
 if(errors.length)throw Error('Page JavaScript errors: '+errors.join(';'));
 await browser.close();
 console.log('Browser smoke: independent DEMO never falls back to real data, safe navigation OK');
})().catch(e=>{console.error(e);process.exit(1)});
