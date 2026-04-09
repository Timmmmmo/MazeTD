const fs = require('fs');
const h = fs.readFileSync('index.html', 'utf8');
const p = h.indexOf('function showTowerUpgrade');
const end = h.indexOf('function doUpgrade');
console.log(JSON.stringify(h.slice(end - 100, end)));
