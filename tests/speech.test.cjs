const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const html=fs.readFileSync('index.html','utf8');
test('mobile DEMO provides audible summary without real holdings',()=>{
 assert.match(html,/id="voiceSummaryBtn"/);
 assert.match(html,/function voiceSummary\(/);
 assert.match(html,/SpeechSynthesisUtterance/);
 assert.match(html,/cartera ficticia/);
});
test('mobile DEMO never references real source or scaled mode',()=>{
 assert.ok(!html.includes('18qu9LXo55qQZq4oEAq42u_DKaI7e9lZL_PkfUZiu0T0'));
 assert.ok(!html.includes('DEMO_MULTIPLIER'));
 assert.ok(!html.includes('DEMO · x4'));
 assert.match(html,/DEMO_INVENTARIO_V5/);
});
