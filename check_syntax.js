const fs = require('fs');
const h = fs.readFileSync('index.html', 'utf8');

// Extract JS between <script> and </script>
const scriptStart = h.indexOf('<script>');
const scriptEnd = h.indexOf('<\/script>');
if (scriptStart >= 0 && scriptEnd >= 0) {
  const js = h.slice(scriptStart + 8, scriptEnd);
  try {
    new Function(js);
    console.log('JS SYNTAX OK');
  } catch(e) {
    console.log('JS SYNTAX ERROR:', e.message);
    // Try to find the exact position
    const m = e.stack || '';
    console.log('Stack:', m.slice(0, 300));
  }
} else {
  console.log('Script tags not found:', scriptStart, scriptEnd);
}
