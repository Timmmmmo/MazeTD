// MazeTD V4.1 Builder - Pure JS changes only
const fs = require('fs');
let src = fs.readFileSync('index.html', 'utf8');
src = src.replace(/\r\n/g, '\n');

function ra(needle, haystack) {
  if (src.indexOf(needle) === -1) { console.log('MISSING: ' + JSON.stringify(needle.slice(0,80))); return false; }
  src = src.split(needle).join(haystack);
  return true;
}

// 1. Title
ra('迷宫挑战 V4.0', '迷宫挑战 V4.1');

// 2. TIER_CFG after N object
ra(
  "const N = {\n  archer:'弓箭塔', cannon:'炮塔', ice:'冰冻塔', thunder:'雷电塔', poison:'毒塔',\n  blocker:'阻拦塔', teleport:'传送塔', trapwall:'陷阱墙', wall:'墙壁'\n};",
  "const N = {\n  archer:'弓箭塔', cannon:'炮塔', ice:'冰冻塔', thunder:'雷电塔', poison:'毒塔',\n  blocker:'阻拦塔', teleport:'传送塔', trapwall:'陷阱墙', wall:'墙壁'\n};\n// V4.1 塔升级配置\nconst TIER_CFG = {\n  archer:   {d:[1,1.3,1.6],r:[1,1.1,1.2],s:[1,0.85,0.72],maxTier:3},\n  cannon:   {d:[1,1.35,1.7],r:[1,1.15,1.25],s:[1,0.82,0.68],maxTier:3},\n  ice:      {d:[1,1.3,1.6],r:[1,1.12,1.22],s:[1,0.8,0.65],w:[0.5,0.62,0.72],maxTier:3},\n  thunder:  {d:[1,1.3,1.6],r:[1,1.15,1.25],s:[1,0.82,0.68],h:[4,5,6],maxTier:3},\n  poison:   {d:[1,1.3,1.6],r:[1,1.1,1.2],s:[1,0.8,0.65],o:[8,11,15],maxTier:3},\n  blocker:  {d:[1,1.4,1.8],hp:[400,650,1000],maxTier:3},\n  teleport: {d:[1,1,1],r:[1,1.2,1.4],s:[1,0.8,0.65],maxTier:3},\n  trapwall: {d:[30,50,80],maxTier:3},\n  wall:     {hp:[500,900,1500],maxTier:3},\n};\nconst TIER_COLOR = ['#FFB300','#FF6D00','#FF1744'];\nconst TIER_STAR  = ['1星','2星','3星'];"
);

// 3. Tower tap upgrade in act()
ra(
  "  tool==='place' ? place(x,y) : del(x,y);\n}",
  "  var existing = grid[y] && grid[y][x];\n  if(existing && existing.type && existing.type !== 'wall') {\n    var tw = towers.find(function(t){return t.x===x && t.y===y;});\n    if(tw) { showTowerUpgrade(tw, x, y); return; }\n  }\n  tool==='place' ? place(x,y) : del(x,y);\n}"
);

// 4. Upgrade popup function (after act function)
ra(
  "function place(x, y) {",
  "function showTowerUpgrade(t, gx, gy) {\n  var cfg = TIER_CFG[t.type] || {};\n  var curTier = t.tier || 1;\n  var maxTier = cfg.maxTier || 3;\n  var nextTier = curTier + 1;\n  var canUpgrade = nextTier <= maxTier;\n  var upgradeCost = Math.round((T[t.type]||{}).$ * Math.pow(1.5, curTier));\n  var pop = document.getElementById('upgrade-popup');\n  if(pop) pop.remove();\n  pop = document.createElement('div');\n  pop.id = 'upgrade-popup';\n  var tc = TIER_COLOR[curTier-1] || '#FFB300';\n  var tn = N[t.type] || t.type;\n  var stars = TIER_STAR[curTier-1] || '';\n  pop.style.cssText = 'position:absolute;left:' + (gx*CS+ox+CS/2) + 'px;top:' + (gy*CS+oy-10) + 'px;transform:translateX(-50%);background:rgba(19,19,40,0.97);border:1.5px solid ' + (canUpgrade?'#FFB300':'#555') + ';border-radius:14px;padding:10px 14px;z-index:80;min-width:140px;text-align:center;box-shadow:0 4px 20px rgba(0,0,0,0.5);backdrop-filter:blur(12px);';\n  var html = '<div style=\"font-size:12px;color:#9E9E9E;margin-bottom:4px\">' + tn + ' <span style=\"color:' + tc + '\">' + stars + '</span><' + '/div>';\n  if(canUpgrade) {\n    var nextStar = TIER_STAR[nextTier-1] || '';\n    var btnBg = gold >= upgradeCost ? 'linear-gradient(135deg,#FFB300,#FF8F00)' : '#555';\n    var btnColor = gold >= upgradeCost ? '#fff' : '#888';\n    html += '<div style=\"font-size:11px;color:#FFB300;margin-bottom:6px\">升级' + nextStar + ' <b>' + upgradeCost + '</b><' + '/div>';\n    html += '<button onclick=\"doUpgrade(' + gx + ',' + gy + ',' + nextTier + ',' + upgradeCost + ')\" style=\"width:100%;padding:6px 0;border:none;border-radius:8px;cursor:pointer;font-size:12px;font-weight:700;background:' + btnBg + ';color:' + btnColor + ';box-shadow:0 2px 8px rgba(0,0,0,0.3);\">' + (gold >= upgradeCost ? '升级' : '金币不足') + '<' + '/button>';\n  } else {\n    html += '<div style=\"font-size:11px;color:#69F0AE;margin-bottom:4px\">已达最高级<' + '/div>';\n  }\n  html += '<button onclick=\"var p=document.getElementById(\\'upgrade-popup\\');if(p)p.remove();\" style=\"margin-top:4px;width:100%;padding:4px 0;border:1px solid #555;border-radius:8px;cursor:pointer;font-size:11px;background:rgba(50,50,80,0.8);color:#888;\">关闭<' + '/button>';\n  pop.innerHTML = html;\n  document.getElementById('canvas-box').appendChild(pop);\n}\nfunction doUpgrade(gx, gy, nextTier, cost) {\n  if(gold < cost) { showTip('金币不足!'); return; }\n  gold -= cost;\n  var tt = towers.find(function(t){return t.x===gx && t.y===gy;});\n  if(!tt) return;\n  tt.tier = nextTier;\n  var cell = grid[gy][gx];\n  cell.tier = nextTier;\n  var cfg = TIER_CFG[tt.type];\n  if(cfg) {\n    cell.dmgMult = cfg.d && cfg.d[nextTier-1];\n    cell.rngMult = cfg.r && cfg.r[nextTier-1];\n    cell.spdMult = cfg.s && cfg.s[nextTier-1];\n  }\n  var popup = document.getElementById('upgrade-popup');\n  if(popup) popup.remove();\n  playSound && playSound('build');\n  showTip('升级成功! ' + (TIER_STAR[nextTier-1]||'') + ' ' + (N[tt.type]||tt.type));\n  updateUI();\n  saveProgress();\n  var ast = getAchStats();\n  ast.upgradedTowers = (ast.upgradedTowers||0)+1;\n  saveAchStats(ast);\n  checkAchievement('upgrade_first', ast.upgradedTowers, 1, ACHIEVEMENTS[12]);\n  checkAchievement('upgrade10', ast.upgradedTowers, 10, ACHIEVEMENTS[13]);\n}\n\nfunction place(x, y) {"
);

// 5. Tower bullet: apply tier multipliers
ra(
  "      bullets.push({\n        x: tx, y: ty,\n        vx: Math.cos(a)*12,\n        vy: Math.sin(a)*12,\n        d: t.d,\n        co: t.co,\n        src: t,\n        dmgMult: t.dmgMult || 1\n      });",
  "      var cell = grid[y2][x2];\n      var tier = cell.tier || 1;\n      var cfg2 = TIER_CFG[t.type] || {};\n      var dmgMult = cfg2.d ? cfg2.d[tier-1] : 1;\n      var spdMult = cfg2.s ? cfg2.s[tier-1] : 1;\n      bullets.push({\n        x: tx, y: ty,\n        vx: Math.cos(a)*12,\n        vy: Math.sin(a)*12,\n        d: Math.round(t.d * dmgMult),\n        co: Math.round(t.co * spdMult),\n        src: t,\n        dmgMult: dmgMult\n      });"
);

// 6. Tower draw: tier stars
ra(
  "  ctx.strokeStyle = t.co < 20 ? 'rgba(255,100,100,0.4)' : 'rgba(255,255,255,0.2)';",
  "  var tTier = t.tier || 1;\n  var tCol = TIER_COLOR[tTier-1] || '#FFB300';\n  var tR = parseInt(tCol.slice(1,3),16), tGv = parseInt(tCol.slice(3,5),16), tB = parseInt(tCol.slice(5,7),16);\n  ctx.strokeStyle = 'rgba('+tR+','+tGv+','+tB+',0.45)';\n  ctx.lineWidth = 2;"
);
// After tower icon draw, add stars
ra(
  "  drawTowerIcon(ctx, t.tp, tx, ty, CS*0.28);",
  "  drawTowerIcon(ctx, t.tp, tx, ty, CS*0.28);\n  if(tTier > 1) {\n    var starStr = tTier === 2 ? '★' : '★★';\n    ctx.fillStyle = tCol;\n    ctx.font = 'bold 11px sans-serif';\n    ctx.textAlign = 'center';\n    ctx.textBaseline = 'bottom';\n    ctx.shadowColor = tCol;\n    ctx.shadowBlur = 6;\n    ctx.fillText(starStr, tx, ty - CS*0.28 - 2);\n    ctx.shadowBlur = 0;\n  }"
);

// 7. Tower save: include tier
ra(
  "  towers.push({x:t.x, y:t.y, type:t.type});",
  "  var tier = t.tier || 1;\n  towers.push({x:t.x, y:t.y, type:t.type, tier:tier});\n  grid[t.y][t.x].tier = tier;\n  var cfg3 = TIER_CFG[t.type];\n  if(cfg3 && tier > 1) {\n    grid[t.y][t.x].dmgMult = cfg3.d && cfg3.d[tier-1];\n    grid[t.y][t.x].rngMult = cfg3.r && cfg3.r[tier-1];\n    grid[t.y][t.x].spdMult = cfg3.s && cfg3.s[tier-1];\n  }"
);

// 8. Achievement system (after leaderboard system)
ra(
  "// V4.0 排行榜\nlet leaderboard = [];",
  "// V4.0 排行榜\nvar leaderboard = [];\n// V4.1 成就系统\nvar ACHIEVEMENTS = [\n  {id:'first_blood',   name:'初战告捷',  desc:'击杀第一个敌人',         icon:'SWORD'},\n  {id:'kill10',        name:'小试牛刀',  desc:'累计击杀10个敌人',       icon:'DAGGER'},\n  {id:'kill50',        name:'战场杀手',  desc:'累计击杀50个敌人',       icon:'SKULL'},\n  {id:'kill100',       name:'屠夫',      desc:'累计击杀100个敌人',      icon:'DEAD'},\n  {id:'wave3',         name:'启程',      desc:'通过第3关',             icon:'ROCKET'},\n  {id:'wave6',         name:'成长',      desc:'通过第6关',             icon:'SEED'},\n  {id:'wave9',         name:'挑战者',    desc:'通过第9关',             icon:'FIRE'},\n  {id:'wave12',        name:'精英',      desc:'通关全部12关',           icon:'TROPHY'},\n  {id:'endless10',     name:'永不止步',  desc:'无尽模式达到10波',       icon:'INFINITY'},\n  {id:'tower5',        name:'布阵师',    desc:'同时拥有5个以上塔',     icon:'TOWER'},\n  {id:'gold1000',      name:'富翁',      desc:'累计获得1000金币',       icon:'COIN'},\n  {id:'hp_full',       name:'完美防守',  desc:'通关时满血',             icon:'HEART'},\n  {id:'upgrade_first', name:'升星者',    desc:'首次升级塔',             icon:'STAR'},\n  {id:'upgrade10',     name:'造星大师',  desc:'累计升级10次',           icon:'STARS'},\n  {id:'wall_breaker',  name:'建筑师',    desc:'放置20个墙壁',           icon:'BRICK'},\n];\nvar achievementState = {};\nfunction loadAchievements() { try { achievementState = JSON.parse(localStorage.getItem('mazeTD_achieve') || '{}'); } catch(e) { achievementState = {}; } }\nloadAchievements();\nfunction getAchStats() { try { return JSON.parse(localStorage.getItem('mazeTD_achieve_stats') || '{}'); } catch(e) { return {}; } }\nfunction saveAchStats(o) { try { localStorage.setItem('mazeTD_achieve_stats', JSON.stringify(o)); } catch(e) {} }\nfunction getMaxEndless() { try { var lb = JSON.parse(localStorage.getItem('mazeTD_leaderboard') || '[]'); return lb.reduce ? lb.reduce(function(m,e){return Math.max(m,parseInt(e.wave)||0);},0) : 0; } catch(e) { return 0; } }\nfunction showAchToast(a) {\n  var toast = document.createElement('div');\n  toast.style.cssText = 'position:fixed;top:80px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,rgba(30,30,64,0.98),rgba(50,40,80,0.98));border:1.5px solid #FFB300;border-radius:16px;padding:12px 20px;z-index:9999;min-width:200px;max-width:280px;box-shadow:0 6px 30px rgba(0,0,0,0.6);backdrop-filter:blur(16px);animation:achSlide 0.5s ease-out,achFade 0.5s 2.5s ease-in forwards;text-align:center;';\n  toast.innerHTML = '<div style=\"font-size:11px;color:#FFB300;font-weight:700;margin-bottom:4px;letter-spacing:1px\">ACHIEVEMENT UNLOCKED<' + '/div><div style=\"font-size:15px;margin-bottom:4px\">'+a.icon+' '+a.name+'<' + '/div><div style=\"font-size:12px;color:#9E9E9E\">'+a.desc+'<' + '/div>';\n  document.body.appendChild(toast);\n  setTimeout(function(){toast.remove();}, 3200);\n  playSound && playSound('levelup');\n}\nif(!document.getElementById('achieve-css')) {\n  var as2 = document.createElement('style');\n  as2.id = 'achieve-css';\n  as2.textContent = '@keyframes achSlide{from{opacity:0;transform:translateX(-50%) translateY(-20px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}@keyframes achFade{to{opacity:0;transform:translateX(-50%) translateY(-10px)}}';\n  if(document.head) document.head.appendChild(as2);\n}\nfunction checkAchievement(id, stat, threshold, aObj) {\n  if(!achievementState[id] && stat >= threshold) {\n    achievementState[id] = true;\n    try { localStorage.setItem('mazeTD_achieve', JSON.stringify(achievementState)); } catch(e) {}\n    showAchToast(aObj);\n  }\n}"
);

// 9. Achievement panel HTML (before </body>)
ra(
  "\n</body>",
  "\n<div id='achieve-btn' onclick='toggleAchievePanel()' style='position:fixed;bottom:20px;right:20px;width:44px;height:44px;border-radius:50%;background:rgba(19,19,40,0.9);border:2px solid #FFB300;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:20px;z-index:99;box-shadow:0 4px 16px rgba(255,179,0,0.3);backdrop-filter:blur(8px);transition:all 0.2s'>Trophy<" + "/div>\n<div id='achieve-panel' style='display:none;position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:200;align-items:center;justify-content:center;'>\n  <div style='background:linear-gradient(180deg,#131328,#0D0D1A);border:1px solid rgba(255,179,0,0.2);border-radius:20px;padding:20px;max-width:340px;width:90%;max-height:80vh;overflow-y:auto;'>\n    <div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;'>\n      <h2 style='color:#FFB300;font-size:18px;margin:0;'>ACHIEVEMENTS<" + "/h2>\n      <button onclick='toggleAchievePanel()' style='background:none;border:none;color:#888;font-size:22px;cursor:pointer;'>x<" + "/button>\n    <" + "/div>\n    <div id='achieve-list'><" + "/div>\n  <" + "/div>\n<" + "/div>\n</body>"
);

// 10. Toggle achieve panel function
ra(
  "function toggleSound() {",
  "function toggleAchievePanel() {\n  var panel = document.getElementById('achieve-panel');\n  var list = document.getElementById('achieve-list');\n  if(!panel) return;\n  if(panel.style.display === 'none' || !panel.style.display) {\n    panel.style.display = 'flex';\n    var unlocked = Object.keys(achievementState).length;\n    var html = '<div style=\"text-align:center;color:#FFB300;font-size:12px;margin-bottom:10px\">UNLOCKED ' + unlocked + '/' + ACHIEVEMENTS.length + '<\\/'div>';\n    ACHIEVEMENTS.forEach(function(a) {\n      var done = !!achievementState[a.id];\n      html += '<div style=\"display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);' + (done?'':'opacity:0.35') + '\">';\n      html += '<span style=\"font-size:22px\">' + (done?'DONE':'LOCK') + '<\\/'span>';\n      html += '<div style=\"flex:1\">';\n      html += '<div style=\"font-size:13px;color:' + (done?'#FFB300':'#666') + ';font-weight:600\">' + a.icon + ' ' + a.name + '<\\/'div>';\n      html += '<div style=\"font-size:11px;color:#888\">' + a.desc + '<\\/'div>';\n      html += '<\\/'div><span style=\"font-size:14px\">' + (done?'YES':'NO') + '<\\/span><\\/'div>';\n    });\n    list.innerHTML = html;\n  } else {\n    panel.style.display = 'none';\n  }\n}\n\nfunction toggleSound() {"
);

// 11. Menu: add achievement button
ra(
  "<div id='leaderboard'><h3>我的最佳战绩</h3>",
  "<button class='menu-btn secondary' onclick='toggleAchievePanel()' style='margin-top:4px'>VIEW ACHIEVEMENTS<" + "/button>\n<div id='leaderboard'><h3>BEST SCORES<" + "/h3>"
);
ra(
  "新功能",
  "V4.1"
);
ra(
  "音效BGM",
  "TOWER UP"
);
ra(
  "动画教学",
  "ACHIEVE"
);

// 12. Achievement triggers on kill
ra(
  "kills++; playSound('coin');",
  "kills++; playSound && playSound('coin');\n  checkAchievement('first_blood', kills, 1, ACHIEVEMENTS[0]);\n  checkAchievement('kill10', kills, 10, ACHIEVEMENTS[1]);\n  checkAchievement('kill50', kills, 50, ACHIEVEMENTS[2]);\n  checkAchievement('kill100', kills, 100, ACHIEVEMENTS[3]);"
);

// 13. Wall placement tracking
ra(
  "  hist.push({",
  "  if(cur==='wall' || cur==='trapwall') { var st = getAchStats(); st.wallsPlaced = (st.wallsPlaced||0)+1; saveAchStats(st); checkAchievement('wall_breaker', st.wallsPlaced, 20, ACHIEVEMENTS[14]); }\n  checkAchievement('tower5', towers?towers.length:0, 5, ACHIEVEMENTS[9]);\n  hist.push({"
);

// 14. Level complete achievements
ra(
  "playSound && playSound('levelup');",
  "playSound && playSound('levelup');\n  var st2 = getAchStats();\n  st2.totalGold = (st2.totalGold||0) + gold;\n  st2.maxWave = Math.max(st2.maxWave||0, wave||0);\n  if(hp>=20) st2.fullHpLevels = (st2.fullHpLevels||0)+1;\n  saveAchStats(st2);\n  checkAchievement('gold1000', st2.totalGold, 1000, ACHIEVEMENTS[10]);\n  checkAchievement('hp_full', st2.fullHpLevels, 1, ACHIEVEMENTS[11]);\n  checkAchievement('wave3', st2.maxWave, 3, ACHIEVEMENTS[4]);\n  checkAchievement('wave6', st2.maxWave, 6, ACHIEVEMENTS[5]);\n  checkAchievement('wave9', st2.maxWave, 9, ACHIEVEMENTS[6]);\n  checkAchievement('wave12', st2.maxWave, 12, ACHIEVEMENTS[7]);\n  checkAchievement('endless10', Math.max(endlessWave||0, getMaxEndless()), 10, ACHIEVEMENTS[8]);"
);

// 15. Game over
ra(
  "playSound && playSound('gameover');",
  "playSound && playSound('gameover');\n  var st3 = getAchStats();\n  st3.maxEndlessWave = Math.max(st3.maxEndlessWave||0, endlessWave||0);\n  saveAchStats(st3);"
);

// 16. CSS for buttons
ra(
  "#btn-help{background:linear-gradient(135deg,#7B1FA2,#4A148C);color:#fff}",
  "#btn-help{background:linear-gradient(135deg,#7B1FA2,#4A148C);color:#fff}\n#upgrade-popup button:hover{transform:scale(1.02)}\n#achieve-btn:hover{transform:scale(1.1)}"
);

// Write
const outFile = 'index_v4.1.html';
fs.writeFileSync(outFile, src, 'utf8');
console.log('V4.1 Built! Size:', src.length);

const h = fs.readFileSync(outFile, 'utf8');
var checks = [
  ['TIER_CFG', h.includes('const TIER_CFG')],
  ['showTowerUpgrade', h.includes('function showTowerUpgrade')],
  ['doUpgrade', h.includes('function doUpgrade')],
  ['ACHIEVEMENTS', h.includes('var ACHIEVEMENTS')],
  ['checkAchievement', h.includes('function checkAchievement')],
  ['showAchToast', h.includes('function showAchToast')],
  ['toggleAchievePanel', h.includes('function toggleAchievePanel')],
  ['achieve-panel', h.includes("id='achieve-panel'")],
  ['achieve-btn', h.includes("id='achieve-btn'")],
  ['V4.1 title', h.includes('迷宫挑战 V4.1')],
  ['Tower tier', h.includes('t.tier || 1')],
  ['Wall tracking', h.includes('wallsPlaced')],
  ['Gold tracking', h.includes('totalGold')],
  ['Wave achievements', h.includes('checkAchievement')],
];
checks.forEach(function(n,o){console.log(o?'OK':'FAIL', n);});
