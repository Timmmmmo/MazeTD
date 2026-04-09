const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// 检查关键边界检查
console.log('=== 边界检查 ===');
console.log('startGame有边界检查:', html.includes('curLevelIdx >= LEVELS.length') || html.includes('curLevelIdx < LEVELS.length'));
console.log('nextLevel有边界检查:', html.includes('if(curLevelIdx >= LEVELS.length)'));

// 检查所有访问LEVELS[index]的地方
const levelAccess = [];
let pos = 0;
while ((pos = html.indexOf('LEVELS[', pos)) !== -1) {
  const lineStart = html.lastIndexOf('\n', pos);
  const lineEnd = html.indexOf('\n', pos);
  const line = html.slice(Math.max(0, lineStart - 50), lineEnd).trim();
  levelAccess.push(line);
  pos += 7;
}
console.log('\n=== LEVELS访问 ===');
levelAccess.forEach((l, i) => console.log(i + 1 + ':', l.slice(-80)));

// 检查startGame的完整代码
console.log('\n=== startGame完整代码 ===');
const s = html.indexOf('function startGame() {');
const e = html.indexOf('\n}', s + 30);
console.log(html.slice(s, e + 2));

// 检查menu div结构
console.log('\n=== Menu HTML ===');
const mStart = html.indexOf('<div id="menu">');
const mEnd = html.indexOf('</div>', mStart);
console.log(html.slice(mStart, mEnd + 6));
