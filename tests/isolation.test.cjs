const test=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');
const html=fs.readFileSync('index.html','utf8');
test('DEMO standalone is configured only for fictitious V5',()=>{
 assert.match(html,/const DEMO_SHEET_ID='1xzmw5US1z9CGj0eYdGYS2_FfpSzklGyOYODCJ6vvlcY'/);
 assert.match(html,/const DEMO_TAB='DEMO_INVENTARIO_V5'/);
 assert.doesNotMatch(html,/18qu9LXo55qQZq4oEAq42u_DKaI7e9lZL_PkfUZiu0T0|DEMO_MULTIPLIER|demo_legacy_scaled/);
 assert.match(html,/raw.length!==65/);
 assert.match(html,/tickers.has\(t\)/);
 assert.match(html,/Inventario DEMO sin conciliación/);
 assert.match(html,/items=\[\];total=0/);
});
