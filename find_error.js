const fs = require('fs');
const h = fs.readFileSync('index.html', 'utf8');
const scriptStart = h.indexOf('<script>') + 8;
const scriptEnd = h.indexOf('<\/script>');
const js = h.slice(scriptStart, scriptEnd);

// Try to parse with acorn or just find the issue manually
// Let's look for obvious string issues around the toggleAchievePanel
const tap = js.indexOf('function toggleAchievePanel');
console.log('toggleAchievePanel at JS pos:', tap);

// Get 300 chars of toggleAchievePanel body
const body = js.slice(tap, tap + 2000);
console.log('\nBody:\n' + body);

// Now let's also check the showTowerUpgrade innerHTML
const stu = js.indexOf('function showTowerUpgrade');
const stuBody = js.slice(stu, stu + 3000);
const innerIdx = stuBody.indexOf('innerHTML = ');
console.log('\nshowTowerUpgrade innerHTML:\n' + stuBody.slice(innerIdx, innerIdx + 500));
