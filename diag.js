const fs = require('fs');
const h = fs.readFileSync('index.html', 'utf8');

// Extract main script
const s1 = h.indexOf('<script>');
const e1 = h.indexOf('</script>');
const main = h.slice(s1 + 8, e1);
console.log('Main script len:', main.length);
console.log('Main script starts:', JSON.stringify(main.slice(0, 100)));

// Check if there are multiple script tags
const scriptCount = (h.match(/<script[^>]*>/g) || []).length;
console.log('Script tags:', scriptCount);

// Find the patch
const patchIdx = h.indexOf('(function() {');
console.log('Patch starts at:', patchIdx, 'of', h.length);

// Check if startGame is defined in main
console.log('startGame in main:', main.includes('function startGame'));
// Check if startGame is defined in patch
const patchPart = h.slice(patchIdx, patchIdx + 2000);
console.log('startGame in patch:', patchPart.includes('function startGame'));

// Find the ACTUAL onclick handler in the HTML
const onIdx = h.indexOf('onclick="startGame()"');
console.log('onclick handler at:', onIdx);
console.log('Context:', JSON.stringify(h.slice(onIdx - 50, onIdx + 50)));
