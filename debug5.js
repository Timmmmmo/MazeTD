const fs = require('fs');
const h = fs.readFileSync('index.html', 'utf8');
const tap = h.indexOf("function toggleAchievePanel()");
const tapEnd = h.indexOf('function toggleSound() {');
const body = h.slice(tap, tapEnd);

console.log('=== RAW FUNCTION ===');
console.log(JSON.stringify(body));
console.log('\n=== If parsed as JS string ===');
console.log('Eval result:');
try {
  console.log(eval(body.slice(0, 50)));
} catch(e) {
  console.log('Error at first 50:', e.message);
}
try {
  console.log(eval(body));
} catch(e) {
  console.log('Full error:', e.message);
}
