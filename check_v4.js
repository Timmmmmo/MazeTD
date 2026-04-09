const fs = require('fs');
const h = fs.readFileSync('index.html', 'utf8');
const tests = [
  'V4.0',
  'function startGame',
  'function toggleSound',
  'leaderboard',
  'function saveProgress',
  'bullets.push',
  'drawTowerIcon',
  'towers.push',
  'kills++;',
  'playSound',
  'function render',
  'N = {',
];
tests.forEach(t => {
  const p = h.indexOf(t);
  console.log((p>=0?'FOUND':'MISSING') + ': ' + t);
  if (p>=0) console.log('  Context: ' + JSON.stringify(h.slice(p-5, p+t.length+50)));
});
