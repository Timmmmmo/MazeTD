const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

// Find the toggleAchievePanel body and show exact content
const tapStart = h.indexOf("function toggleAchievePanel()");
const tapEnd = h.indexOf('function toggleSound() {');
const body = h.slice(tapStart, tapEnd);

// Show raw content
console.log('=== RAW BODY ===');
for (let i = 0; i < body.length; i += 200) {
  const chunk = body.slice(i, i + 200);
  console.log(`Offset ${i}:`, JSON.stringify(chunk));
  if (i > 2000) break;
}

// Find line with </div> and show what precedes it
const divPos = body.indexOf('</div>');
if (divPos >= 0) {
  console.log('\n</div> found at position:', divPos);
  console.log('Context:', JSON.stringify(body.slice(divPos - 50, divPos + 50)));
}
