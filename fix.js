const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');
const needle = "window.act = function(mx, my) {\n    var CS = window.CS";
const replacement = "window.act = function(mx, my) {\n    if (!window.grid) { window.showTip('请先开始游戏!'); return; }\n    var CS = window.CS";
if (h.includes(needle)) {
  h = h.split(needle).join(replacement);
  fs.writeFileSync('index.html', h, 'utf8');
  console.log('Fixed! Added grid check to window.act');
} else {
  console.log('NOT FOUND:', JSON.stringify(needle.slice(0, 50)));
  console.log('Actual:', JSON.stringify(h.slice(h.indexOf('window.act = '), h.indexOf('window.act = ') + 80)));
}
