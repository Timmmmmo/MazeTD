const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');
// Fix: also check y bounds before accessing grid[y]
const needle = "var existing = window.grid[y] && window.grid[y][x];";
const replacement = "var existing = window.grid && window.grid[y] && window.grid[y][x];";
if (h.includes(needle)) {
  h = h.split(needle).join(replacement);
  fs.writeFileSync('index.html', h, 'utf8');
  console.log('Fixed! Added grid && check');
} else {
  console.log('Already fixed or not found');
}
