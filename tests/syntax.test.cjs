const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const html=fs.readFileSync('index.html','utf8');
test('the entire inline mobile script compiles',()=>{
 const first=html.indexOf('<script>');
 const last=html.indexOf('</script>',first);
 assert.ok(first>=0 && last>first,'inline script exists');
 assert.doesNotThrow(()=>new vm.Script(html.slice(first+'<script>'.length,last)));
});
test('cash panel does not contain broken markup string',()=>{
 assert.ok(!html.includes("registrado.</div>'</div>'}"));
});

test('DEMO breakdowns are vertical and show the percentage before the USD detail',()=>{
 assert.ok(html.includes('class="breakdown-list"'));
 assert.ok(html.includes('class="breakdown-row"'));
 assert.ok(html.includes('class="breakdown-pct"'));
 assert.ok(html.includes('class="breakdown-usd"'));
 assert.ok(!html.includes('<div class="grid"><div class="card" id="regions"'));
 const start=html.indexOf("document.getElementById('typeSummary').innerHTML=");
 const end=html.indexOf("document.getElementById('regions').innerHTML=",start);
 assert.ok(start>=0&&end>start);
 const block=html.slice(start,end);
 assert.ok(block.includes('fmtp.format(totals[t]/total)'));assert.ok(block.includes('money(totals[t])'));assert.ok(block.indexOf('fmtp.format(totals[t]/total)')<block.indexOf('money(totals[t])'));assert.ok(block.indexOf('money(totals[t])')<block.indexOf('class="bar"'));
});
test('DEMO direct exposures explain ETF boundaries and isolate personal data',()=>{
 assert.ok(html.includes('sin descomposición interna de ETF'));
 assert.ok(html.includes('sin look-through'));
 assert.ok(!html.includes('18qu9LXo55qQZq4oEAq42u_DKaI7e9lZL_PkfUZiu0T0'));
});
