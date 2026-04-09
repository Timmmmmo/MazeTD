const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');
const target = "document.getElementById('canvas-box').appendChild(popup);";
const replacement = "var cb = document.getElementById('canvas-box') || document.body; cb.appendChild(popup);";
if (h.includes(target)) {
  h = h.split(target).join(replacement);
  fs.writeFileSync('index.html', h, 'utf8');
  console.log('Fixed: canvas-box fallback');
} else {
  console.log('Target not found:', JSON.stringify(target));
}
