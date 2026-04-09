const fs = require('fs');
const h = fs.readFileSync('index.html', 'utf8');
const tests = [
  'saved.towers) {',
  'towers.push({x:t.x, y:t.y, type:t.type});',
  "ctx.strokeStyle = t.co",
  "drawTowerIcon(ctx, t.tp",
  "coins icon",
  "leaderboard",
  "menu-btn secondary",
  "playSound",
  "kills++;",
  "sound && playSound('levelup')",
  "sound && playSound('gameover')",
  "新功能",
  "音效BGM",
  "动画教学",
];
tests.forEach(t => {
  const idx = h.indexOf(t);
  console.log(idx >= 0 ? 'FOUND: ' + t.slice(0,60) : 'MISSING: ' + t.slice(0,60));
});
// Show ctx.strokeStyle context
const p = h.indexOf("ctx.strokeStyle = t.co");
console.log('\nctx.strokeStyle:');
console.log(JSON.stringify(h.slice(p - 20, p + 150)));
// Show h3 menu context
const p2 = h.indexOf('新功能');
console.log('\n新功能 context:');
console.log(JSON.stringify(h.slice(p2 - 30, p2 + 200)));
// Show leaderboard
const p3 = h.indexOf('leaderboard');
console.log('\nleaderboard:');
console.log(JSON.stringify(h.slice(p3 - 50, p3 + 100)));
// Show bullets exact
const p4 = h.indexOf('bullets.push({');
console.log('\nbullets.push exact:');
console.log(JSON.stringify(h.slice(p4, p4 + 200)));
