const fs = require('fs');
let h = fs.readFileSync('index_broken.html', 'utf8');

// Replace toggleAchievePanel with DOM-based version (no innerHTML escaping issues)
const oldStart = h.indexOf("function toggleAchievePanel()");
const oldEnd = h.indexOf('function toggleSound() {');
console.log('toggleAchievePanel at:', oldStart, 'len:', oldEnd - oldStart);

const newFn = `function toggleAchievePanel() {
  var panel = document.getElementById('achieve-panel');
  var list = document.getElementById('achieve-list');
  if(!panel) return;
  if(panel.style.display === 'none' || !panel.style.display) {
    panel.style.display = 'flex';
    list.innerHTML = '';
    var hdr = document.createElement('div');
    hdr.style.cssText = 'text-align:center;color:#FFB300;font-size:12px;margin-bottom:10px';
    var unlocked = Object.keys(achievementState).length;
    hdr.textContent = 'UNLOCKED ' + unlocked + '/' + ACHIEVEMENTS.length;
    list.appendChild(hdr);
    ACHIEVEMENTS.forEach(function(a) {
      var done = !!achievementState[a.id];
      var row = document.createElement('div');
      row.style.cssText = 'display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);' + (done?'':'opacity:0.35');
      var ico = document.createElement('span');
      ico.style.cssText = 'font-size:22px';
      ico.textContent = done ? 'OK' : 'LC';
      var box = document.createElement('div');
      box.style.cssText = 'flex:1';
      var nm = document.createElement('div');
      nm.style.cssText = 'font-size:13px;color:' + (done?'#FFB300':'#666') + ';font-weight:600';
      nm.textContent = a.icon + ' ' + a.name;
      var dc = document.createElement('div');
      dc.style.cssText = 'font-size:11px;color:#888';
      dc.textContent = a.desc;
      box.appendChild(nm);
      box.appendChild(dc);
      var st = document.createElement('span');
      st.style.cssText = 'font-size:14px';
      st.textContent = done ? 'YES' : 'NO';
      row.appendChild(ico);
      row.appendChild(box);
      row.appendChild(st);
      list.appendChild(row);
    });
  } else {
    panel.style.display = 'none';
  }
}`;

if (oldStart >= 0 && oldEnd >= 0) {
  h = h.slice(0, oldStart) + newFn + '\n' + h.slice(oldEnd);
  console.log('Replaced toggleAchievePanel');
  
  // Also check showAchToast innerHTML
  const stIdx = h.indexOf("toast.innerHTML = ");
  if (stIdx >= 0) {
    const stEnd = h.indexOf(';', stIdx + 18);
    console.log('showAchToast innerHTML at:', stIdx);
    console.log('Content:', JSON.stringify(h.slice(stIdx, stEnd + 20)));
  }
  
  fs.writeFileSync('index_broken.html', h, 'utf8');
  console.log('Written');
  
  // Check syntax
  const js2 = h.slice(h.indexOf('<script>') + 8, h.indexOf('<\/script>'));
  try {
    new Function(js2);
    console.log('SYNTAX OK!');
  } catch(e) {
    console.log('Still broken:', e.message);
  }
} else {
  console.log('Could not find toggleAchievePanel');
}
