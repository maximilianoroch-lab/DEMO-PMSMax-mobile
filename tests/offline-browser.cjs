const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
(async()=>{
 const instruments='SPY ACWI QQQ FXI XLV GLD VEA EEM EWZ ALUA BBAR BHIP BMA CEPU COME CRES GGAL PAMP SUPV TGSU2 TXAR YPFD AO28 AO29 AN29 GD35 GD38 GD41 BTC ETH ADA SOL XRP AAPL AMD AMZN AVGO BRKB DISN GLOB GOOGL HD JNJ JPM KO LLY LAC LAR LRCX MCD MELI META MSFT NKE NU NVDA PBR PEP PFE T TSLA V VIST WMT CASH'.split(' ');
 assert.equal(instruments.length,65);
 const accounts=['SANTANDER','BBVA','CRITERIA 1234','CRITERIA 5678','ADCAP','IOL','GALICIA','BINANCE'];
 const csv=['Ticker,Cantidad total,Precio USD indicativo,Valor USD indicativo,'+accounts.join(','),...instruments.map(t=>[t,100,10,1000,100,0,0,0,0,0,0,0].join(','))].join('\n');
 const server=http.createServer((req,res)=>{
  const file=path.join(process.cwd(),req.url.split('?')[0]==='/'?'index.html':req.url.split('?')[0].replace(/^\//,''));
  if(!file.startsWith(process.cwd())){res.writeHead(403).end();return;}
  fs.readFile(file,(err,buf)=>{if(err){res.writeHead(404).end();return;}res.writeHead(200,{'content-type':file.endsWith('.html')?'text/html':'application/javascript'});res.end(buf);});
 });
 await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
 const base='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage();
  let status='ok';
  await page.route('https://docs.google.com/**',route=>{
   if(status==='down')return route.abort('failed');
   return route.fulfill({status:200,body:status==='invalid'?'Ticker,Cantidad total\nAAPL,1':csv,headers:{'access-control-allow-origin':'*','content-type':'text/csv'}});
  });
  await page.route('https://raw.githubusercontent.com/**',route=>route.abort('failed'));
  await page.goto(base,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.getElementById('status').textContent.includes('65 instrumentos ficticios'));
  const stored=await page.evaluate(()=>localStorage.getItem(DEMO_V5_CACHE_KEY));
  assert.ok(stored&&stored.includes('AAPL'),'must persist validated raw DEMO inventory');
  status='down';
  await page.locator('#refresh').click();
  await page.waitForFunction(()=>document.getElementById('status').textContent.includes('MODO SIN CONEXIÓN'));
  assert.match(await page.locator('#status').innerText(),/NO actualizados/);
  assert.match(await page.locator('#summary').innerText(),/65.000/);
  status='invalid';
  await page.locator('#refresh').click();
  await page.waitForFunction(()=>document.getElementById('status').textContent.includes('rechazado por validación'));
  assert.doesNotMatch(await page.locator('#status').innerText(),/MODO SIN CONEXIÓN/);
  assert.match(await page.locator('#summary').innerText(),/No se muestran datos/);
  await page.close();
  console.log('PASS: DEMO offline restores only validated inventory and fails closed on invalid online response');
 }finally{await browser.close();await new Promise(ok=>server.close(ok));}
})().catch(e=>{console.error(e);process.exit(1)});
