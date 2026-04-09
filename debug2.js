const fs = require('fs');
const h = fs.readFileSync('index.html', 'utf8');
// Find the actual text
const tests = [
  'ctx.strokeStyle = t.co',
  "coins icon",
  'leaderboard',
  'menu-btn secondary',
  'playSound',
  'kills++;',
  'gameover',
  "新功能",
  "音效BGM",
];
tests.forEach(t => {
  const p = h.indexOf(t);
  console.log((p>=0?'FOUND':'MISSING') + ': ' + t);
  if(p>=0) console.log('  Context: ' + JSON.stringify(h.slice(Math.max(0,p-20), p+t.length+50)));
});
