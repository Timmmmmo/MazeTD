const fs = require('fs');
const h = fs.readFileSync('index.html', 'utf8');

// Find all potential JS errors
const lines = h.split('\n');
let errors = [];
for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  // Check for common issues
  if (line.includes('function checkAchievement') && line.includes('}')) {
    errors.push('Line ' + (i+1) + ': function checkAchievement might be incomplete');
  }
}

// Check if the getAchStats is defined before doUpgrade uses it
const ga = h.indexOf('function getAchStats');
const du = h.indexOf('function doUpgrade');
console.log('getAchStats defined at:', ga);
console.log('doUpgrade defined at:', du);

// Check for syntax issues with escaped quotes
const escapedQuotes = (h.match(/\\'/g) || []).length;
const backslashes = (h.match(/\\\\/g) || []).length;
console.log('Escaped single quotes:', escapedQuotes);
console.log('Double backslashes:', backslashes);

// Check if the toggleAchievePanel has HTML entity issues
const tap = h.indexOf('function toggleAchievePanel');
console.log('toggleAchievePanel at:', tap);

// Look for <\/ which is invalid in JS
const badEsc = h.indexOf('<\\/div>');
console.log('Bad escaped div:', badEsc);
if (badEsc >= 0) console.log('Context:', JSON.stringify(h.slice(badEsc - 30, badEsc + 30)));
