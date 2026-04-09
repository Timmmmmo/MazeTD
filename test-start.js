const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

console.log('=== HTML结构检查 ===');
console.log('Canvas:', html.includes('<canvas id="cv"'));
console.log('Menu div:', html.includes('id="menu"'));
console.log('Game div:', html.includes('id="game"'));
console.log('FightBtn:', html.includes('id="btn-fight"'));
console.log('StartBtn:', html.includes('startGame()'));
console.log('TowerPanel:', html.includes('id="tower-panel"'));

console.log('\n=== 关键函数检查 ===');
console.log('toggleBattle:', html.includes('function toggleBattle'));
console.log('initCanvas:', html.includes('function initCanvas'));
console.log('render:', html.includes('function render'));
console.log('startGame:', html.includes('function startGame'));

console.log('\n=== CSS检查 ===');
console.log('#game display:none:', html.includes('#game{display:none}'));
console.log('#menu display:none:', html.includes('#menu{display:none}'));

console.log('\n=== 潜在问题检查 ===');
// 检查函数顺序
const s1 = html.indexOf('function startGame');
const s2 = html.indexOf('function toggleBattle');
console.log('startGame位置:', s1, 'toggleBattle位置:', s2);
console.log('startGame在toggleBattle前:', s1 < s2);
