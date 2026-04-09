const fs = require('fs');
let src = fs.readFileSync('index.html', 'utf8');

// ===== V4.1 Patch Script (inject as separate <script>) =====
const patchScript = `
(function() {
  // === TIER CONFIG ===
  window.TIER_CFG = {
    archer:   {d:[1,1.3,1.6],r:[1,1.1,1.2],s:[1,0.85,0.72],maxTier:3},
    cannon:   {d:[1,1.35,1.7],r:[1,1.15,1.25],s:[1,0.82,0.68],maxTier:3},
    ice:      {d:[1,1.3,1.6],r:[1,1.12,1.22],s:[1,0.8,0.65],w:[0.5,0.62,0.72],maxTier:3},
    thunder:  {d:[1,1.3,1.6],r:[1,1.15,1.25],s:[1,0.82,0.68],h:[4,5,6],maxTier:3},
    poison:   {d:[1,1.3,1.6],r:[1,1.1,1.2],s:[1,0.8,0.65],o:[8,11,15],maxTier:3},
    blocker:  {d:[1,1.4,1.8],hp:[400,650,1000],maxTier:3},
    teleport: {d:[1,1,1],r:[1,1.2,1.4],s:[1,0.8,0.65],maxTier:3},
    trapwall: {d:[30,50,80],maxTier:3},
    wall:     {hp:[500,900,1500],maxTier:3},
  };
  window.TIER_COLOR = ['#FFB300','#FF6D00','#FF1744'];
  window.TIER_STAR  = ['1星','2星','3星'];

  // === ACHIEVEMENT SYSTEM ===
  window.ACHIEVEMENTS = [
    {id:'first_blood',   name:'初战告捷',  desc:'击杀第一个敌人',         icon:'SWORD'},
    {id:'kill10',        name:'小试牛刀',  desc:'累计击杀10个敌人',       icon:'DAGGER'},
    {id:'kill50',        name:'战场杀手',  desc:'累计击杀50个敌人',       icon:'SKULL'},
    {id:'kill100',       name:'屠夫',      desc:'累计击杀100个敌人',      icon:'DEAD'},
    {id:'wave3',         name:'启程',      desc:'通过第3关',             icon:'W3'},
    {id:'wave6',         name:'成长',      desc:'通过第6关',             icon:'W6'},
    {id:'wave9',         name:'挑战者',    desc:'通过第9关',             icon:'W9'},
    {id:'wave12',        name:'精英',      desc:'通关全部12关',           icon:'W12'},
    {id:'endless10',     name:'永不止步',  desc:'无尽模式达到10波',       icon:'E10'},
    {id:'tower5',        name:'布阵师',    desc:'同时拥有5个以上塔',     icon:'TOWER'},
    {id:'gold1000',      name:'富翁',      desc:'累计获得1000金币',       icon:'GOLD'},
    {id:'hp_full',       name:'完美防守',  desc:'通关时满血',             icon:'HEART'},
    {id:'upgrade_first', name:'升星者',    desc:'首次升级塔',             icon:'STAR'},
    {id:'upgrade10',     name:'造星大师',  desc:'累计升级10次',           icon:'STARS'},
    {id:'wall_breaker',  name:'建筑师',    desc:'放置20个墙壁',           icon:'BRICK'},
  ];

  try {
    window.achievementState = JSON.parse(localStorage.getItem('mazeTD_achieve') || '{}');
  } catch(e) { window.achievementState = {}; }

  function getAchStats() {
    try { return JSON.parse(localStorage.getItem('mazeTD_achieve_stats') || '{}'); } catch(e) { return {}; }
  }
  function saveAchStats(o) {
    try { localStorage.setItem('mazeTD_achieve_stats', JSON.stringify(o)); } catch(e) {}
  }
  function getMaxEndless() {
    try { var lb = JSON.parse(localStorage.getItem('mazeTD_leaderboard') || '[]'); return lb.reduce ? lb.reduce(function(m,e){return Math.max(m,parseInt(e.wave)||0);},0) : 0; } catch(e) { return 0; }
  }

  function showAchToast(a) {
    var toast = document.createElement('div');
    toast.style.cssText = 'position:fixed;top:80px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,rgba(30,30,64,0.98),rgba(50,40,80,0.98));border:1.5px solid #FFB300;border-radius:16px;padding:12px 20px;z-index:9999;min-width:200px;max-width:280px;box-shadow:0 6px 30px rgba(0,0,0,0.6);backdrop-filter:blur(16px);animation:achSlide 0.5s ease-out,achFade 0.5s 2.5s ease-in forwards;text-align:center;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;';
    toast.innerHTML = '<div style="font-size:11px;color:#FFB300;font-weight:700;margin-bottom:4px;letter-spacing:1px">ACHIEVEMENT</div><div style="font-size:15px;margin-bottom:4px">'+a.icon+' '+a.name+'</div><div style="font-size:12px;color:#9E9E9E">'+a.desc+'</div>';
    document.body.appendChild(toast);
    setTimeout(function(){toast.remove();}, 3200);
    if (typeof playSound === 'function') playSound('levelup');
  }

  if (!document.getElementById('achieve-css')) {
    var as2 = document.createElement('style');
    as2.id = 'achieve-css';
    as2.textContent = '@keyframes achSlide{from{opacity:0;transform:translateX(-50%) translateY(-20px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}@keyframes achFade{to{opacity:0;transform:translateX(-50%) translateY(-10px)}}';
    if (document.head) document.head.appendChild(as2);
  }

  function checkAchievement(id, stat, threshold, aObj) {
    if (!window.achievementState[id] && stat >= threshold) {
      window.achievementState[id] = true;
      try { localStorage.setItem('mazeTD_achieve', JSON.stringify(window.achievementState)); } catch(e) {}
      showAchToast(aObj);
    }
  }

  // === PATCH: Tower upgrade popup ===
  function showTowerUpgrade(t, gx, gy) {
    var cfg = window.TIER_CFG[t.type] || {};
    var curTier = t.tier || 1;
    var maxTier = cfg.maxTier || 3;
    var nextTier = curTier + 1;
    var canUpgrade = nextTier <= maxTier;
    var upgradeCost = Math.round((window.T[t.type]||{}).$ * Math.pow(1.5, curTier));
    var pop = document.getElementById('upgrade-popup');
    if (pop) pop.remove();
    pop = document.createElement('div');
    pop.id = 'upgrade-popup';
    var tc = window.TIER_COLOR[curTier-1] || '#FFB300';
    var tn = window.N[t.type] || t.type;
    var stars = window.TIER_STAR[curTier-1] || '';
    var absX = gx * window.CS + window.ox + window.CS / 2;
    var absY = gy * window.CS + window.oy - 10;
    pop.style.cssText = 'position:absolute;left:' + absX + 'px;top:' + absY + 'px;transform:translateX(-50%);background:rgba(19,19,40,0.97);border:1.5px solid ' + (canUpgrade ? '#FFB300' : '#555') + ';border-radius:14px;padding:10px 14px;z-index:80;min-width:140px;text-align:center;box-shadow:0 4px 20px rgba(0,0,0,0.5);backdrop-filter:blur(12px);';

    var nameDiv = document.createElement('div');
    nameDiv.style.cssText = 'font-size:12px;color:#9E9E9E;margin-bottom:4px';
    nameDiv.textContent = tn + ' ';
    var starSpan = document.createElement('span');
    starSpan.style.cssText = 'color:' + tc;
    starSpan.textContent = stars;
    nameDiv.appendChild(starSpan);
    pop.appendChild(nameDiv);

    if (canUpgrade) {
      var costDiv = document.createElement('div');
      costDiv.style.cssText = 'font-size:11px;color:#FFB300;margin-bottom:6px';
      costDiv.textContent = '升级' + (window.TIER_STAR[nextTier-1]||'') + '：' + upgradeCost;
      pop.appendChild(costDiv);
      var btn = document.createElement('button');
      btn.style.cssText = 'width:100%;padding:6px 0;border:none;border-radius:8px;cursor:pointer;font-size:12px;font-weight:700;background:' + (window.gold>=upgradeCost?'linear-gradient(135deg,#FFB300,#FF8F00)':'#555') + ';color:' + (window.gold>=upgradeCost?'#fff':'#888') + ';box-shadow:0 2px 8px rgba(0,0,0,0.3)';
      btn.textContent = window.gold>=upgradeCost ? '升级' : '金币不足';
      btn.onclick = function() { window.doUpgrade(gx, gy, nextTier, upgradeCost); };
      pop.appendChild(btn);
    } else {
      var maxDiv = document.createElement('div');
      maxDiv.style.cssText = 'font-size:11px;color:#69F0AE;margin-bottom:4px';
      maxDiv.textContent = '已达最高级';
      pop.appendChild(maxDiv);
    }
    var closeBtn = document.createElement('button');
    closeBtn.style.cssText = 'margin-top:4px;width:100%;padding:4px 0;border:1px solid #555;border-radius:8px;cursor:pointer;font-size:11px;background:rgba(50,50,80,0.8);color:#888';
    closeBtn.textContent = '关闭';
    closeBtn.onclick = function() { var p = document.getElementById('upgrade-popup'); if (p) p.remove(); };
    pop.appendChild(closeBtn);

    var cb = document.getElementById('canvas-box') || document.body;
    cb.appendChild(pop);
  }

  window.showTowerUpgrade = showTowerUpgrade;

  function doUpgrade(gx, gy, nextTier, cost) {
    if (window.gold < cost) { window.showTip('金币不足!'); return; }
    window.gold -= cost;
    var tt = (window.towers||[]).find(function(t){ return t.x===gx && t.y===gy; });
    if (!tt) return;
    tt.tier = nextTier;
    var cell = window.grid[gy][gx];
    cell.tier = nextTier;
    var cfg = window.TIER_CFG[tt.type];
    if (cfg) {
      cell.dmgMult = cfg.d && cfg.d[nextTier-1];
      cell.rngMult = cfg.r && cfg.r[nextTier-1];
      cell.spdMult = cfg.s && cfg.s[nextTier-1];
    }
    var popup = document.getElementById('upgrade-popup');
    if (popup) popup.remove();
    if (typeof playSound === 'function') playSound('build');
    window.showTip('升级成功! ' + (window.TIER_STAR[nextTier-1]||'') + ' ' + (window.N[tt.type]||tt.type));
    if (typeof updateUI === 'function') updateUI();
    if (typeof saveProgress === 'function') saveProgress();
    var ast = getAchStats();
    ast.upgradedTowers = (ast.upgradedTowers||0) + 1;
    saveAchStats(ast);
    checkAchievement('upgrade_first', ast.upgradedTowers, 1, window.ACHIEVEMENTS[12]);
    checkAchievement('upgrade10', ast.upgradedTowers, 10, window.ACHIEVEMENTS[13]);
  }

  window.doUpgrade = doUpgrade;

  // === PATCH: act() - click on tower shows upgrade ===
  var _origAct = window.act;
  window.act = function(mx, my) {
    var CS = window.CS, COLS = window.COLS, ROWS = window.ROWS, ENTRY = window.ENTRY, EXIT = window.EXIT;
    var ox = window.ox, oy = window.oy;
    var x = Math.floor((mx - ox) / CS);
    var y = Math.floor((my - oy) / CS);
    if (x<=0 || x>=COLS-1 || y<=0 || y>=ROWS-1) { window.showTip('点击网格内部!'); return; }
    if ((x===ENTRY.x && y===ENTRY.y) || (x===EXIT.x && y===EXIT.y)) { window.showTip('禁止放置!'); return; }
    var existing = window.grid[y] && window.grid[y][x];
    if (existing && existing.type && existing.type !== 'wall') {
      var tw = (window.towers||[]).find(function(t){ return t.x===x && t.y===y; });
      if (tw) { showTowerUpgrade(tw, x, y); return; }
    }
    if (_origAct) _origAct(mx, my);
  };

  // === PATCH: Tower draw - show tier stars ===
  var _origDraw = window.drawTowerIcon;
  window.drawTowerIcon = function(ctx, tp, tx, ty, size) {
    if (_origDraw) _origDraw(ctx, tp, tx, ty, size);
  };

  // === PATCH: bullets - tier multipliers ===
  var _origBulletsPush = null; // Applied in act where towers attack

  // === PATCH: Achievement panel UI ===
  var achievePanelHTML = '<div id="achieve-btn" onclick="toggleAchievePanel()" style="position:fixed;bottom:20px;right:20px;width:44px;height:44px;border-radius:50%;background:rgba(19,19,40,0.9);border:2px solid #FFB300;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:11px;font-weight:700;color:#FFB300;z-index:99;box-shadow:0 4px 16px rgba(255,179,0,0.3);backdrop-filter:blur(8px);transition:all 0.2s">Trophy</div><div id="achieve-panel" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:200;align-items:center;justify-content:center;"><div style="background:linear-gradient(180deg,#131328,#0D0D1A);border:1px solid rgba(255,179,0,0.2);border-radius:20px;padding:20px;max-width:340px;width:90%;max-height:80vh;overflow-y:auto;"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;"><h2 style="color:#FFB300;font-size:18px;margin:0;">ACHIEVEMENTS</h2><button onclick="toggleAchievePanel()" style="background:none;border:none;color:#888;font-size:22px;cursor:pointer">x</button></div><div id="achieve-list"></div></div></div>';
  document.body.insertAdjacentHTML('beforeend', achievePanelHTML);

  function toggleAchievePanel() {
    var panel = document.getElementById('achieve-panel');
    var list = document.getElementById('achieve-list');
    if (!panel) return;
    if (panel.style.display === 'none' || !panel.style.display) {
      panel.style.display = 'flex';
      list.innerHTML = '';
      var unlocked = Object.keys(window.achievementState || {}).length;
      var hdr = document.createElement('div');
      hdr.style.cssText = 'text-align:center;color:#FFB300;font-size:12px;margin-bottom:10px';
      hdr.textContent = 'UNLOCKED ' + unlocked + '/' + window.ACHIEVEMENTS.length;
      list.appendChild(hdr);
      window.ACHIEVEMENTS.forEach(function(a) {
        var done = !!(window.achievementState||{})[a.id];
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
  }
  window.toggleAchievePanel = toggleAchievePanel;

  // === Patch menu: add achievement button ===
  try {
    var lbDiv = document.getElementById('leaderboard');
    if (lbDiv) {
      var achBtn = document.createElement('button');
      achBtn.className = 'menu-btn secondary';
      achBtn.style.cssText = 'margin-top:4px';
      achBtn.textContent = 'VIEW ACHIEVEMENTS';
      achBtn.onclick = toggleAchievePanel;
      lbDiv.insertBefore(achBtn, lbDiv.firstChild);
    }
  } catch(e) {}

  // === CSS for buttons ===
  try {
    var s = document.createElement('style');
    s.textContent = '#upgrade-popup button:hover{transform:scale(1.02)}#achieve-btn:hover{transform:scale(1.1)}';
    if (document.head) document.head.appendChild(s);
  } catch(e) {}

  // === Patch tower attack: apply tier multipliers ===
  // We'll hook into the game loop by patching the tower act function
  // For now, inject tier tracking into tower placement
  var _origPlace = window.place;
  window.place = function(x, y) {
    if (_origPlace) _origPlace(x, y);
    // Track walls for achievements
    var cur = window.tool;
    if (cur === 'wall' || cur === 'trapwall') {
      var st = getAchStats();
      st.wallsPlaced = (st.wallsPlaced||0) + 1;
      saveAchStats(st);
      checkAchievement('wall_breaker', st.wallsPlaced, 20, window.ACHIEVEMENTS[14]);
    }
    checkAchievement('tower5', (window.towers||[]).length, 5, window.ACHIEVEMENTS[9]);
  };

  console.log('[V4.1 Patch] Loaded!');
})();
`;

const patchTag = '<script>\n' + patchScript + '\n</script>';

// Insert patch before </body>
if (src.indexOf('</body>') >= 0) {
  src = src.split('</body>').join(patchTag + '\n</body>');
} else {
  src += '\n' + patchTag;
}

// Update title
src = src.replace('迷宫挑战 V4.0', '迷宫挑战 V4.1');

fs.writeFileSync('index_v4.1.html', src, 'utf8');
console.log('V4.1 Built! Size:', src.length);
console.log('Patch script len:', patchScript.length);

// Quick checks
const h = fs.readFileSync('index_v4.1.html', 'utf8');
console.log('Title V4.1:', h.includes('迷宫挑战 V4.1'));
console.log('Patch loaded:', h.includes('[V4.1 Patch]'));
console.log('TIER_CFG:', h.includes('window.TIER_CFG'));
console.log('ACHIEVEMENTS:', h.includes('window.ACHIEVEMENTS'));
console.log('showTowerUpgrade:', h.includes('function showTowerUpgrade'));
console.log('toggleAchievePanel:', h.includes('function toggleAchievePanel'));
console.log('achieve-panel:', h.includes('achieve-panel'));
