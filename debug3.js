const fs = require('fs');
const h = fs.readFileSync('index.html', 'utf8');

// Extract the problematic lines from toggleAchievePanel
const tap = h.indexOf("function toggleAchievePanel()");
const tapEnd = h.indexOf('function toggleSound() {');
const body = h.slice(tap, tapEnd);
const lines = body.split('\n');

// Find the UNLOCKED line and show exact bytes
const unlockLine = lines.find(l => l.includes('UNLOCKED'));
console.log('UNLOCKED line raw:', unlockLine);
console.log('Chars around problematic:', unlockLine.slice(-30).split('').map(c => c.charCodeAt(0)));

// Now check if the HTML entity \" is being parsed correctly
// In JS string: '<div ...>text<\/div>'
// The \" becomes a literal " in the string, which would break the outer string!
console.log('\nFull line:', JSON.stringify(unlockLine));

// Check the toggleAchievePanel closing tag pattern
const lines2 = body.split('\n');
lines2.forEach((l, i) => {
  if (l.includes('\\"') || l.includes("'\\''") || l.includes('<\\\\/')) {
    console.log('Problematic line', i, ':', JSON.stringify(l));
  }
});

// Now check showTowerUpgrade too
const stu = h.indexOf("function showTowerUpgrade");
const stuEnd = h.indexOf('function doUpgrade');
const stuBody = h.slice(stu, stuEnd);
const stuLines = stuBody.split('\n');
stuLines.forEach((l, i) => {
  if (l.includes('\\"') || l.includes('<\\\\/')) {
    console.log('STU problematic line', i, ':', JSON.stringify(l));
  }
});
