const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

// Replace the broken toggleAchievePanel with a DOM-based version
const oldTapStart = h.indexOf("function toggleAchievePanel()");
const oldTapEnd = h.indexOf('function toggleSound() {');

const newTap = `function toggleAchievePanel() {
  var panel = document.getElementById('achieve-panel');
  var list = document.getElementById('achieve-list');
  if(!panel) return;
  if(panel.style.display === 'none' || !panel.style.display) {
    panel.style.display = 'flex';
    var unlocked = Object.keys(achievementState).length;
    list.innerHTML = '';
    // Header
    var hdr = document.createElement('div');
    hdr.style.cssText = 'text-align:center;color:#FFB300;font-size:12px;margin-bottom:10px';
    hdr.textContent = 'UNLOCKED ' + unlocked + '/' + ACHIEVEMENTS.length;
    list.appendChild(hdr);
    // Achievement rows
    ACHIEVEMENTS.forEach(function(a) {
      var done = !!achievementState[a.id];
      var row = document.createElement('div');
      row.style.cssText = 'display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);' + (done?'':'opacity:0.35');
      var icon = document.createElement('span');
      icon.style.cssText = 'font-size:22px';
      icon.textContent = done ? 'OK' : 'LC';
      var info = document.createElement('div');
      info.style.cssText = 'flex:1';
      var name = document.createElement('div');
      name.style.cssText = 'font-size:13px;color:' + (done?'#FFB300':'#666') + ';font-weight:600';
      name.textContent = a.icon + ' ' + a.name;
      var desc = document.createElement('div');
      desc.style.cssText = 'font-size:11px;color:#888';
      desc.textContent = a.desc;
      info.appendChild(name);
      info.appendChild(desc);
      var badge = document.createElement('span');
      badge.style.cssText = 'font-size:14px';
      badge.textContent = done ? 'YES' : 'NO';
      row.appendChild(icon);
      row.appendChild(info);
      row.appendChild(badge);
      list.appendChild(row);
    });
  } else {
    panel.style.display = 'none';
  }
}`;

if (oldTapStart >= 0 && oldTapEnd >= 0) {
  h = h.slice(0, oldTapStart) + newTap + '\n' + h.slice(oldTapEnd);
  fs.writeFileSync('index.html', h, 'utf8');
  console.log('toggleAchievePanel replaced!');
} else {
  console.log('Could not find toggleAchievePanel bounds:', oldTapStart, oldTapEnd);
}
