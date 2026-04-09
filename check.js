const fs = require('fs');
let h = fs.readFileSync('index_broken.html', 'utf8');

// Check showAchToast
const sa = h.indexOf('toast.innerHTML = ');
const saEnd = h.indexOf(';', sa + 18);
const saBody = h.slice(sa, saEnd + 5);
console.log('showAchToast innerHTML:', JSON.stringify(saBody));
console.log('\nChars:', [...saBody.slice(-30)].map(c => c.charCodeAt(0)));
