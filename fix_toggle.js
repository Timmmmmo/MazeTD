const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

// The issue: toggleAchievePanel uses strings with \" instead of proper escape
// These appear as: <\/div> with a quote issue
// Let's find and fix them

// Replace the broken toggleAchievePanel entirely
const tapOld = `
function toggleAchievePanel() {
  var panel = document.getElementById('achieve-panel');
  var list = document.getElementById('achieve-list');
  if(!panel) return;
  if(panel.style.display === 'none' || !panel.style.display) {
    panel.style.display = 'flex';
    var unlocked = Object.keys(achievementState).length;
    var html = '<div style="text-align:center;color:#FFB300;font-size:12px;margin-bottom:10px">UNLOCKED ' + unlocked + '/' + ACHIEVEMENTS.length + '<\\/div>';
    ACHIEVEMENTS.forEach(function(a) {
      var done = !!achievementState[a.id];
      html += '<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);' + (done?'':'opacity:0.35') + '">';
      html += '<span style="font-size:22px">' + (done?'DONE':'LOCK') + '<\\/span>';
      html += '<div style="flex:1">';
      html += '<div style="font-size:13px;color:' + (done?'#FFB300':'#666') + ';font-weight:600">' + a.icon + ' ' + a.name + '<\\/div>';
      html += '<div style="font-size:11px;color:#888">' + a.desc + '<\\/div>';
      html += '<\\/div><span style="font-size:14px">' + (done?'YES':'NO') + '<\\/span><\\/div>';
    });
    list.innerHTML = html;
  } else {
    panel.style.display = 'none';
  }
}`;

const tapNew = `
function toggleAchievePanel() {
  var panel = document.getElementById('achieve-panel');
  var list = document.getElementById('achieve-list');
  if(!panel) return;
  if(panel.style.display === 'none' || !panel.style.display) {
    panel.style.display = 'flex';
    var unlocked = Object.keys(achievementState).length;
    var d = '<div style="text-align:center;color:#FFB300;font-size:12px;margin-bottom:10px">UNLOCKED ' + unlocked + '/' + ACHIEVEMENTS.length + '</div>';
    ACHIEVEMENTS.forEach(function(a) {
      var done = !!achievementState[a.id];
      d += '<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);' + (done?'':'opacity:0.35') + '">';
      d += '<span style="font-size:22px">' + (done?'DONE':'LOCK') + '</span>';
      d += '<div style="flex:1">';
      d += '<div style="font-size:13px;color:' + (done?'#FFB300':'#666') + ';font-weight:600">' + a.icon + ' ' + a.name + '</div>';
      d += '<div style="font-size:11px;color:#888">' + a.desc + '</div>';
      d += '</div><span style="font-size:14px">' + (done?'YES':'NO') + '</span></div>';
    });
    list.innerHTML = d;
  } else {
    panel.style.display = 'none';
  }
}`;

// Use indexOf to find if the old function exists
const tapIdx = h.indexOf("function toggleAchievePanel() {");
const tapNext = h.indexOf('function toggleSound() {');
const existingTap = h.slice(tapIdx, tapNext);
console.log('Existing toggleAchievePanel length:', existingTap.length);

if (existingTap.includes('DONE') && existingTap.includes('\\"')) {
  console.log('Found broken toggleAchievePanel - needs fix');
  h = h.slice(0, tapIdx) + tapNew + '\n' + h.slice(tapNext);
  fs.writeFileSync('index.html', h, 'utf8');
  console.log('Fixed toggleAchievePanel!');
} else if (existingTap.includes('DONE')) {
  console.log('toggleAchievePanel looks OK');
} else {
  console.log('toggleAchievePanel not found or different');
}
