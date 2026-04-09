const fs = require('fs');
const h = fs.readFileSync('index.html', 'utf8');
const js = h.slice(h.indexOf('<script>') + 8, h.indexOf('</script>'));

// Show the content around position 586
console.log('Pos 586:', JSON.stringify(js.slice(570, 630)));

// Now show what the first 590 chars look like
console.log('\nFirst 590 chars:');
console.log(js.slice(0, 590));

// Check if there's a stray </div> near the top
const early = js.slice(0, 600);
const divPos = early.indexOf('</div>');
if (divPos >= 0) console.log('</div> found at pos:', divPos, ':', JSON.stringify(early.slice(divPos - 20, divPos + 30)));
