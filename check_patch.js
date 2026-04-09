const fs = require('fs');
const h = fs.readFileSync('index.html', 'utf8');
// Find main script (first <script>)
const s1 = h.indexOf('<script>');
const e1 = h.indexOf('</script>');
const main = h.slice(s1 + 8, e1);
try {
  new Function(main);
  console.log('Main script: SYNTAX OK');
} catch(e) {
  console.log('Main script ERROR:', e.message.slice(0, 100));
}
