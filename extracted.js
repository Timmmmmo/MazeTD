
// ========== 基础配置 ==========
const CS=40, COLS=8, ROWS=12, ENTRY={x:1,y:0}, EXIT={x:COLS-2,y:ROWS-1};

// ========== V2.0 数值系统 - 参考腾讯TOP塔防 ==========
// 设计原则：易上手难精通、策略多样、资源约束

// 塔配置 - 精心平衡的数值
const T = {
  // V5.0 精简塔系统 - 5种核心塔
  archer: {c:'#4CAF50', d:18, r:4.0, s:35, $:50},
  ice: {c:'#03A9F4', d:6, r:3.2, s:45, $:70, slow:0.5},
  cannon: {c:'#F44336', d:35, r:2.8, s:80, $:110, aoe:1.3},
  poison: {c:'#8BC34A', d:5, r:2.8, s:30, $:85, dot:12, dotTime:5},
  thunder: {c:'#FFC107', d:25, r:3.0, s:45, $:130, chain:3},
  wall: {c:'#78909C', d:0, r:0, s:0, $:15, hp:600, maxHp:600, isWall:true}
};

const N = {
  archer:'弓箭塔', ice:'冰冻塔', cannon:'炮塔', poison:'毒塔', thunder:'雷电塔', wall:'墙壁'
};

// ========== V2.0 关卡系统 - 12关渐进式设计 ==========
// 章节结构：入门篇 → 成长篇 → 挑战篇 → 精英篇
// 难度曲线：前3关教学，后9关逐步挑战

const LEVELS = [
  {id:'1-1', name:'初阵', waves:3, startGold:550, goldBonus:40,
   unlock:['wall','archer'], enemies:['normal'], chapter:'教学篇',
   desc:'点击网格放置墙壁，然后选择弓箭塔'},
  {id:'1-2', name:'疾风', waves:4, startGold:500, goldBonus:50,
   unlock:['wall','archer','ice'], enemies:['normal','fast'], chapter:'教学篇',
   desc:'快速敌人需要冰塔减速'},
  {id:'2-1', name:'铁壁', waves:5, startGold:450, goldBonus:60,
   unlock:['wall','archer','ice','cannon'], enemies:['normal','fast','tank'], chapter:'成长篇',
   desc:'坦克敌人需要炮塔AOE集火'},
  {id:'2-2', name:'剧毒', waves:5, startGold:420, goldBonus:70,
   unlock:['wall','archer','ice','cannon','poison'], enemies:['normal','fast','tank'], chapter:'成长篇',
   desc:'毒塔持续伤害克制高血量'},
  {id:'2-3', name:'雷霆', waves:6, startGold:400, goldBonus:80,
   unlock:['all'], enemies:['normal','fast','scout'], chapter:'成长篇',
   desc:'侦察兵会记住你的布局!'},
  {id:'3-1', name:'破军', waves:7, startGold:380, goldBonus:100,
   unlock:['all'], enemies:['normal','fast','tank','destroyer'], chapter:'挑战篇',
   desc:'破坏者会攻击墙壁!'},
  {id:'3-2', name:'幻影', waves:8, startGold:350, goldBonus:120,
   unlock:['all'], enemies:['normal','fast','scout','shifter'], chapter:'挑战篇',
   desc:'变形怪随机切换抗性'},
  {id:'3-3', name:'终焉', waves:10, startGold:320, goldBonus:150, boss:true,
   unlock:['all'], enemies:['all'], chapter:'挑战篇',
   desc:'最终挑战 - 全敌人BOSS战!'}
];

// ========== 游戏状态 ==========
let cv, ctx, W, H, ox, oy, grid, path, towers=[], enemies=[], bullets=[], parts=[], dmgTexts=[], hist=[];
let gold, hp, wave, kills, cur='archer', tool='place', fighting=false, inited=false;
let currentLevel=null, curLevelIdx=0;
let tutorialStep=0, tutorialShown=false;

// ========== AI进化系统 ==========
let aiMemory = {
  dangerZones: [],      // 侦察兵记住的危险区域
  scoutSurvived: 0,     // 存活的侦察兵数量
  destroyerAttacks: 0   // 破坏者攻击次数
};

// ========== V2.0 敌人系统 - 精心平衡的数值 ==========
// 设计原则：每种敌人有独特定位，血量/速度/金币成比例
// V2.1: 速度降低到30%，游戏更易上手

const ENEMY_TYPES = {
  normal: {hp:50, color:'#8BC34A', size:0.40, gold:6, speed:0.45},
  fast: {hp:30, color:'#42A5F5', size:0.32, gold:8, speed:0.75},
  tank: {hp:180, color:'#78909C', size:0.52, gold:20, speed:0.22},
  destroyer: {hp:220, color:'#D32F2F', size:0.48, gold:25, speed:0.18, isDestroyer:true, atkDmg:100},
  scout: {hp:60, color:'#FFD700', size:0.36, gold:12, speed:0.55, isScout:true},
  shifter: {hp:120, color:'#9C27B0', size:0.42, gold:18, speed:0.30, isShifter:true}
};

// ========== 存档系统 ==========
function saveProgress() {
  try {
    localStorage.setItem('mazeTD_v3', JSON.stringify({curLevelIdx, highScores: getHighScores()}));
  } catch(e) {}
}
function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem('mazeTD_v3'));
  } catch(e) { return null; }
}
function getHighScores() {
  try { return JSON.parse(localStorage.getItem('mazeTD_scores')) || {}; } catch(e) { return {}; }
}
function saveScore(levelId, stars) {
  const scores = getHighScores();
  if(!scores[levelId] || scores[levelId] < stars) {
    scores[levelId] = stars;
    try { localStorage.setItem('mazeTD_scores', JSON.stringify(scores)); } catch(e) {}
  }
}

// ========== 教学系统 ==========
const TUTORIALS = {
  '1-1': [
    {text:'👆 点击网格放置墙壁', highlight:'grid'},
    {text:'🏹 然后选择弓箭塔攻击敌人', highlight:'tower-archer'},
    {text:'⚔️ 点击"开战"开始!', highlight:'btn-fight'}
  ]
};

function showTutorial() {
  if(tutorialShown || !currentLevel) return;
  const steps = TUTORIALS[currentLevel.id];
  if(!steps || tutorialStep >= steps.length) { tutorialShown = true; return; }
  const step = steps[tutorialStep];
  showTip(step.text);
  tutorialStep++;
  if(tutorialStep >= steps.length) tutorialShown = true;
}

// ========== 初始化 ==========
function initCanvas() {
  cv = document.getElementById('cv');
  if(!cv) return false;
  ctx = cv.getContext('2d');
  resize();
  cv.onclick = click;
  cv.ontouchend = touch;
  window.onresize = resize;
  inited = true;
  return true;
}

function resize() {
  const b = document.getElementById('canvas-box');
  if(!b) return;
  W = b.clientWidth;
  H = b.clientHeight;
  if(W>0 && H>0 && cv) {
    cv.width = W;
    cv.height = H;
    ox = Math.floor((W - COLS*CS)/2);
    oy = Math.floor((H - ROWS*CS)/2);
  }
}

function initGrid() {
  grid = [];
  for(let y=0; y<ROWS; y++) {
    grid[y] = [];
    for(let x=0; x<COLS; x++) {
      grid[y][x] = (x===0 || x===COLS-1 || y===0 || y===ROWS-1) ? 1 : 0;
    }
  }
  grid[ENTRY.y][ENTRY.x] = 0;
  grid[EXIT.y][EXIT.x] = 0;
  towers = [];
  enemies = [];
  bullets = [];
  parts = [];
  dmgTexts = [];
  hist = [];
  aiMemory = {dangerZones: [], scoutSurvived: 0, destroyerAttacks: 0};
  path = findPath();
  updateInfo();
  updateTool();
}

// ========== A*寻路 - 支持攻击堵路障碍物 ==========
// V2.1: 敌人可以攻击堵路的墙壁/塔，寻找最短路径
function findPath(avoidZones=[]) {
  if(!grid) return null;
  
  const q = [[ENTRY.x, ENTRY.y, []]];
  const v = {};
  v[ENTRY.x+','+ENTRY.y] = 1;
  const d = [[0,1],[1,0],[0,-1],[-1,0]];
  
  while(q.length) {
    const [x, y, p] = q.shift();
    if(x===EXIT.x && y===EXIT.y) return p.concat([[x,y]]);
    
    for(const [dx,dy] of d) {
      const nx = x+dx, ny = y+dy;
      const k = nx+','+ny;
      
      // V2.1: 允许通过有障碍物的地方（敌人会攻击）
      // 但优先选择无障碍的路径
      if(nx>=0 && nx<COLS && ny>=0 && ny<ROWS && !v[k]) {
        // 检查是否在避开区域内
        let inDanger = false;
        for(const zone of avoidZones) {
          if(Math.abs(nx-zone.x)<=1 && Math.abs(ny-zone.y)<=1) {
            inDanger = true;
            break;
          }
        }
        
        // V2.1: 如果是障碍物（墙/塔），仍然可以通过，但标记为需要攻击
        const isBlocked = grid[ny][nx] !== 0;
        
        if(!inDanger) {
          v[k] = 1;
          // 如果路径被堵，标记需要攻击
          const newPath = p.concat([[x, y, isBlocked]]);
          q.push([nx, ny, newPath]);
        }
      }
    }
  }
  
  // 如果避开危险区域无法找到路径,则使用普通路径
  if(avoidZones.length > 0) {
    return findPath([]);
  }
  return null;
}

function turns(p) {
  if(!p || p.length<3) return 0;
  let t = 0;
  for(let i=1; i<p.length-1; i++) {
    if(p[i][0]-p[i-1][0] !== p[i+1][0]-p[i][0] || p[i][1]-p[i-1][1] !== p[i+1][1]-p[i][1]) {
      t++;
    }
  }
  return t;
}

// ========== UI更新 ==========
function updateInfo() {
  const l = document.getElementById('show-length');
  const t = document.getElementById('show-turns');
  const e = document.getElementById('show-efficiency');
  if(!l) return;
  
  l.textContent = path ? path.length : '断';
  t.textContent = turns(path);
  
  if(!path) {
    e.textContent = '阻断!';
    e.className = 'bad';
    return;
  }
  
  const m = Math.abs(EXIT.x-ENTRY.x) + Math.abs(EXIT.y-ENTRY.y);
  const r = path.length / m;
  const b = 1 + turns(path) * 0.18;
  const s = Math.floor(r * b * 100);
  
  if(s >= 150) { e.textContent = '极佳'; e.className = 'good'; }
  else if(s >= 100) { e.textContent = '良好'; e.className = 'good'; }
  else { e.textContent = '较差'; e.className = 'bad'; }
}

function updateTool() {
  const t = T[cur];
  document.getElementById('tool-name').textContent = N[cur];
  document.getElementById('tool-cost').textContent = t.$+'金';
  
  document.querySelectorAll('.tower-btn').forEach(b => {
    const c = parseInt(b.querySelector('.price').textContent);
    b.classList.toggle('disabled', gold<c);
  });
  
  if(currentLevel && currentLevel.unlock) {
    document.querySelectorAll('.tower-btn').forEach(b => {
      const tp = b.dataset.type;
      if(currentLevel.unlock[0] !== 'all' && !currentLevel.unlock.includes(tp)) {
        b.classList.add('disabled');
        b.style.opacity = '0.3';
      } else {
        b.style.opacity = '';
      }
    });
  }
}

function updateAIInfo() {
  document.getElementById('show-scouts').textContent = aiMemory.scoutSurvived;
  document.getElementById('show-destroyers').textContent = aiMemory.destroyerAttacks;
  document.getElementById('show-memory').textContent = aiMemory.dangerZones.length;
}

function showTip(m) {
  const t = document.getElementById('tip');
  t.textContent = m;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 1600);
}

// ========== 建造系统 ==========

// ========== V4.1 塔升级系统 ==========
// 每座塔最多升3级，属性逐级提升
// 升级成本 = 基础成本 × 等级 × 0.6
// 升级属性: 伤害+40%, 攻击范围+15%, 攻击速度+20% per level

function upgradeTower(x, y) {
  const t = towers.find(t => t.x === x && t.y === y);
  if (!t || t.tp === 'wall' || t.tp === 'trapwall') {
    showTip('⚠️ 该类型无法升级');
    return;
  }
  if (t.lv >= 5) {
    showTip('⭐ 已达满级 (Lv.5)');
    return;
  }
  const baseCost = T[t.tp].$;
  const cost = Math.floor(baseCost * (t.lv + 1) * 0.6);
  if (gold < cost) {
    showTip('⚠️ 金币不足! 需要 ' + cost);
    return;
  }
  gold -= cost;
  t.lv = (t.lv || 1) + 1;
  // 升级属性加成
  t.d = Math.floor(T[t.tp].d * (1 + (t.lv - 1) * 0.4));
  t.r = parseFloat((T[t.tp].r * (1 + (t.lv - 1) * 0.15)).toFixed(1));
  t.s = Math.floor(T[t.tp].s * (1 - (t.lv - 1) * 0.2));
  // 升级特效
  spawnP(offsetX + (x + 0.5) * CS, offsetY + (y + 0.5) * CS, '#FFD700', 20);
  showTip('⬆ Lv.' + t.lv + ' ' + N[t.tp] + ' 升级成功!');
  saveProgress();
  updateUI();
}

function getUpgradeCost(tower) {
  if (!tower || tower.lv >= 3) return null;
  return Math.floor(T[tower.tp].$ * (tower.lv + 1) * 0.6);
}

// ========== V4.1 Canvas 离屏渲染优化 ==========
// 使用离屏 Canvas 缓存静态背景，大幅减少每帧重绘量
let bgCanvas, bgCtx, bgDirty = true;

function initBgCanvas() {
  bgCanvas = document.createElement('canvas');
  bgCtx = bgCanvas.getContext('2d');
}

function renderBackgroundToCache() {
  if (!bgCtx || W === 0) return;
  bgCanvas.width = W;
  bgCanvas.height = H;
  bgDirty = false;
}

function renderBg(c) {
  // 深色渐变背景
  const grad = c.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.max(W,H));
  grad.addColorStop(0, '#1a1a3e');
  grad.addColorStop(0.5, '#0d0d1f');
  grad.addColorStop(1, '#050510');
  c.fillStyle = grad;
  c.fillRect(0, 0, W, H);

  // 网格
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const px = ox + x * CS;
      const py = oy + y * CS;
      const v = grid[y][x];

      if (v === 1) {
        const wallGrad = c.createLinearGradient(px, py, px, py + CS);
        wallGrad.addColorStop(0, '#3a3a6e');
        wallGrad.addColorStop(0.5, '#252550');
        wallGrad.addColorStop(1, '#1a1a3a');
        c.fillStyle = wallGrad;
        c.fillRect(px + 2, py + 2, CS - 4, CS - 4);
        c.strokeStyle = 'rgba(255,255,255,0.1)';
        c.lineWidth = 1;
        c.strokeRect(px + 2, py + 2, CS - 4, CS - 4);
      } else {
        c.fillStyle = '#0f0f2f';
        c.fillRect(px, py, CS, CS);
        c.strokeStyle = 'rgba(255,255,255,0.03)';
        c.lineWidth = 1;
        c.strokeRect(px, py, CS, CS);
      }
    }
  }

  // 入口出口
  const ex = ox + ENTRY.x * CS, ey = oy + ENTRY.y * CS;
  c.shadowColor = '#00E676';
  c.shadowBlur = 20;
  c.fillStyle = 'rgba(0,230,118,0.2)';
  c.fillRect(ex, ey, CS, CS);
  c.shadowBlur = 0;
  c.strokeStyle = '#00E676';
  c.lineWidth = 3;
  c.strokeRect(ex + 2, ey + 2, CS - 4, CS - 4);
  c.font = (CS * 0.45) + 'px sans-serif';
  c.textAlign = 'center';
  c.textBaseline = 'middle';
  c.fillText('\u2B07', ex + CS/2, ey + CS/2);

  const xx = ox + EXIT.x * CS, xy = oy + EXIT.y * CS;
  c.shadowColor = '#FF1744';
  c.shadowBlur = 20;
  c.fillStyle = 'rgba(255,23,68,0.2)';
  c.fillRect(xx, xy, CS, CS);
  c.shadowBlur = 0;
  c.strokeStyle = '#FF1744';
  c.strokeRect(xx + 2, xy + 2, CS - 4, CS - 4);
  c.fillText('\u2B06', xx + CS/2, xy + CS/2);

  bgDirty = false;
}

function pickTower(towerType) {
  cur = towerType;
  tool = 'place';
  document.querySelectorAll('.tower-btn').forEach(b => b.classList.toggle('selected', b.dataset.type===towerType));
  document.querySelectorAll('.tool-btn').forEach(b => b.classList.toggle('selected', b.id==='tool-place'));
  updateTool();
  gold < T[towerType].$ ? showTip('⚠️ 金币不足!') : showTip('✓ '+N[towerType]);
}

function setTool(x) {
  tool = x;
  document.querySelectorAll('.tool-btn').forEach(b => b.classList.toggle('selected', b.id==='tool-'+x));
  showTip(x==='delete' ? '🗑️ 点击删除' : '📍 放置 '+N[cur]);
}

function click(e) {
  if(fighting) return;
  const r = cv.getBoundingClientRect();
  act(e.clientX-r.left, e.clientY-r.top);
}

function touch(e) {
  if(fighting) return;
  e.preventDefault();
  const t = e.changedTouches[0];
  const r = cv.getBoundingClientRect();
  act(t.clientX-r.left, t.clientY-r.top);
}

function act(mx, my) {
  // 每次操作触发下一步教学
  if(!tutorialShown) showTutorial();
  
  const x = Math.floor((mx-ox)/CS);
  const y = Math.floor((my-oy)/CS);
  
  if(x<=0 || x>=COLS-1 || y<=0 || y>=ROWS-1) {
    showTip('⚠️ 点击网格内部!');
    return;
  }
  
  if((x===ENTRY.x && y===ENTRY.y) || (x===EXIT.x && y===EXIT.y)) {
    showTip('⚠️ 禁止放置!');
    return;
  }
  
  tool==='place' ? place(x,y) : del(x,y);
}

function place(x, y) {
  const t = T[cur];
  if(grid[y][x] !== 0) {
    showTip('⚠️ 已有物体!');
    return;
  }
  if(gold < t.$) {
    showTip('⚠️ 金币不足!');
    return;
  }
  
  hist.push({a:'p', x, y, tp:cur});
  
  // 处理不同类型
  if(cur === 'wall' || cur === 'trapwall') {
    grid[y][x] = 1;
    gold -= t.$;
    if(cur === 'trapwall') {
      towers.push({x, y, tp:cur, i:t.i, co:t.c, isTrap:true, trapDmg:t.trapDmg});
    }
  } else if(cur === 'blocker') {
    grid[y][x] = 2;
    gold -= t.$;
    towers.push({
      x, y, tp:cur, lv:1, i:t.i, co:t.c, d:t.d, r:t.r, s:t.s, cd:0,
      hp: t.hp, maxHp: t.maxHp, isBlocker: true
    });
  } else if(cur === 'teleport') {
    grid[y][x] = 2;
    gold -= t.$;
    towers.push({
      x, y, tp:cur, i:t.i, co:t.c, teleport: true, cd: 0, maxCd: t.s
    });
  } else {
    grid[y][x] = 2;
    gold -= t.$;
    towers.push({
      x, y, tp:cur, lv:1, i:t.i, co:t.c, d:t.d, r:t.r, s:t.s,
      a: t.a||0, w: t.w||0, h: t.h||0, o: t.o||0, cd:0
    });
  }
  
  const np = findPath();
  if(!np) {
    // 回滚
    grid[y][x] = 0;
    gold += t.$;
    if(cur !== 'wall') towers.pop();
    hist.pop();
    showTip('⚠️ 不能阻断路径!');
    path = findPath();
  } else {
    path = np;
    spawnP(ox+(x+0.5)*CS, oy+(y+0.5)*CS, t.c, 12);
    showTip('✓ '+N[cur]+' 放置成功');
  }
  
  updateUI();
  updateInfo();
  updateTool();
  render();
}

function del(x, y) {
  if(grid[y][x] === 0) {
    showTip('⚠️ 没有物体!');
    return;
  }
  
  const isWall = grid[y][x] === 1;
  grid[y][x] = 0;
  
  if(isWall) {
    gold += Math.floor(T.wall.$ * 0.7);
    showTip('✓ 墙壁删除');
  } else {
    for(let i=0; i<towers.length; i++) {
      if(towers[i].x===x && towers[i].y===y) {
        gold += Math.floor(T[towers[i].tp].$ * 0.7);
        towers.splice(i, 1);
        break;
      }
    }
    showTip('✓ 塔删除');
  }
  
  path = findPath();
  updateUI();
  updateInfo();
  updateTool();
  render();
}

function undoLast() {
  if(!hist.length) {
    showTip('没有可撤销');
    return;
  }
  
  const h = hist.pop();
  if(h.a === 'p') {
    grid[h.y][h.x] = 0;
    gold += T[h.tp].$;
    if(h.tp !== 'wall') {
      for(let i=0; i<towers.length; i++) {
        if(towers[i].x===h.x && towers[i].y===h.y) {
          towers.splice(i, 1);
          break;
        }
      }
    }
  }
  
  path = findPath();
  showTip('✓ 已撤销');
  updateUI();
  updateInfo();
  updateTool();
  render();
}

function clearAll() {
  initGrid();
  gold = currentLevel ? currentLevel.startGold : 400;
  showTip('✓ 已清空');
  updateUI();
  render();
}

// ========== 战斗系统 ==========
function toggleBattle() {
  if(!fighting) {
    if(!path) {
      showTip('⚠️ 请先建造迷宫!');
      return;
    }
    fighting = true;
    document.getElementById('btn-fight').textContent = '⏸ 暂停';
    document.getElementById('entry-mark').style.display = 'none';
    document.getElementById('exit-mark').style.display = 'none';
    if(!enemies.length && wave < currentLevel.waves) spawnWave();
    loop();
  } else {
    fighting = false;
    document.getElementById('btn-fight').textContent = '⚔️ 开战';
  }
}

function spawnWave() {
  wave++;
  const isBossWave = wave === currentLevel.waves && currentLevel.boss;
  showWave(isBossWave ? '👹 BOSS来袭!' : '🌊 第'+wave+'波', isBossWave ? '#F44336' : '#4CAF50');
  
  if(isBossWave) {
    // BOSS战：BOSS + 随从小怪
    const bossHp = 2500 + curLevelIdx * 300;
    enemies.push(makeEnemy(bossHp, '#AB47BC', 1.0, 200, {isBoss:true}));
    
    // BOSS召唤随从
    for(let i = 0; i < 4; i++) {
      setTimeout(() => {
        if(fighting) {
          enemies.push(createEnemyByType('fast', wave));
        }
      }, 500 + i * 300);
    }
  } else {
    // 普通波次：根据关卡配置生成敌人
    const baseCount = 3 + wave * 2;
    const cnt = Math.min(baseCount, 20);
    const availEnemies = currentLevel.enemies || ['normal'];
    const useAll = availEnemies.includes('all');
    
    for(let i = 0; i < cnt; i++) {
      let etype = 'normal';
      const r = Math.random();
      
      // 根据关卡配置和波次决定敌人类型
      if(useAll || availEnemies.length > 1) {
        // 基础敌人权重
        if(r < 0.10 && wave >= 6 && (useAll || availEnemies.includes('scout'))) {
          etype = 'scout';
        } else if(r < 0.18 && wave >= 7 && (useAll || availEnemies.includes('destroyer'))) {
          etype = 'destroyer';
        } else if(r < 0.26 && wave >= 8 && (useAll || availEnemies.includes('shifter'))) {
          etype = 'shifter';
        } else if(r < 0.42 && wave >= 2 && (useAll || availEnemies.includes('fast'))) {
          etype = 'fast';
        } else if(r < 0.55 && wave >= 4 && (useAll || availEnemies.includes('tank'))) {
          etype = 'tank';
        }
      }
      
      // 分批出怪，增加节奏感
      setTimeout(() => {
        if(fighting) {
          const e = createEnemyByType(etype, wave);
          enemies.push(e);
        }
      }, i * 250);
    }
  }
  
  updateUI();
  updateAIInfo();
}

function createEnemyByType(type, wave) {
  const base = ENEMY_TYPES[type];
  const hpMult = 1 + wave * 0.15;
  
  const opts = {
    isScout: base.isScout,
    isDestroyer: base.isDestroyer,
    isShifter: base.isShifter,
    atkDmg: base.atkDmg || 0
  };
  
  return makeEnemy(base.hp * hpMult, base.color, base.size, base.gold, opts, base.speed);
}

function makeEnemy(hp, co, sz, g, opts={}, spd=0.735) {
  // AI进化: 侦察兵使用记忆的危险区域
  let usePath = path;
  let customPath = null;
  
  if(opts.isScout && aiMemory.dangerZones.length > 0) {
    customPath = findPath(aiMemory.dangerZones);
    if(customPath) usePath = customPath;
  }
  
  // 确保path有效
  if(!usePath || usePath.length === 0) {
    usePath = findPath() || [[ENTRY.x, ENTRY.y]];
  }
  
  // 确保ox, oy已初始化
  const posX = (ox !== undefined ? ox : 0) + (usePath[0][0]+0.5)*CS;
  const posY = (oy !== undefined ? oy : 0) + (usePath[0][1]+0.5)*CS;
  
  return {
    x: posX,
    y: posY,
    hp: hp,
    mh: hp,
    spd: spd,
    co: co,
    sz: sz,
    g: g,
    sl: 0,
    dt: 0,
    dv: 0,
    pi: 0,
    boss: opts.isBoss || false,
    isScout: opts.isScout || false,
    isDestroyer: opts.isDestroyer || false,
    isShifter: opts.isShifter || false,
    atkDmg: opts.atkDmg || 0,
    shiftTimer: 0,
    currentElement: 'normal',
    eye: Math.random() * Math.PI * 2,
    customPath: customPath
  };
}

function showWave(m, c) {
  const e = document.getElementById('wave-msg');
  e.textContent = m;
  e.style.color = c;
  e.style.display = 'block';
  setTimeout(() => e.style.display='none', 900);
}

// ========== 主循环 ==========
function loop() {
  if(!fighting) return;
  
  // === 敌人更新 ===
  for(let i=enemies.length-1; i>=0; i--) {
    const e = enemies[i];
    
    // 变形怪: 切换属性
    if(e.isShifter) {
      e.shiftTimer++;
      if(e.shiftTimer >= 300) { // 每5秒切换
        e.shiftTimer = 0;
        const elements = ['fire', 'ice', 'poison', 'normal'];
        e.currentElement = elements[Math.floor(Math.random() * elements.length)];
        // 改变颜色表示属性
        const colors = {fire:'#FF5722', ice:'#03A9F4', poison:'#8BC34A', normal:'#9C27B0'};
        e.co = colors[e.currentElement];
      }
    }
    
    // 速度计算
    let sp = e.spd;
    if(e.sl > 0) { sp *= 0.4; e.sl--; }
    if(e.dt > 0) { e.hp -= e.dv; e.dt--; }
    
    // V2.1: 敌人攻击堵路障碍物逻辑
    const offsetX = ox !== undefined ? ox : 0;
    const offsetY = oy !== undefined ? oy : 0;
    
    // 计算当前位置和目标位置
    let usePath = e.customPath || path;
    if(!usePath || usePath.length === 0) {
      usePath = findPath() || [[ENTRY.x, ENTRY.y], [EXIT.x, EXIT.y]];
    }
    
    // 检查下一格是否被堵
    const nextIdx = Math.floor(e.pi) + 1;
    if(nextIdx < usePath.length) {
      const nextPos = usePath[nextIdx];
      const nx = nextPos[0];
      const ny = nextPos[1];
      
      // 如果下一格有障碍物（墙/塔），攻击它
      if(grid[ny] && grid[ny][nx] !== 0) {
        e.attacking = true;
        e.attackTimer = (e.attackTimer || 0) + 1;
        
        // 攻击速度：破坏者1.5秒(90帧)，普通敌人3秒(180帧)
        const attackSpeed = e.isDestroyer ? 90 : 180;
        const damage = e.isDestroyer ? (e.atkDmg || 80) : 30;
        
        if(e.attackTimer >= attackSpeed) {
          e.attackTimer = 0;
          
          // 找到这个位置的塔
          let targetTower = null;
          for(const t of towers) {
            if(t.x === nx && t.y === ny) {
              targetTower = t;
              break;
            }
          }
          
          if(targetTower) {
            // 如果是阻拦塔或有血量的塔，扣血
            if(targetTower.hp !== undefined) {
              targetTower.hp -= damage;
              spawnP(offsetX + (nx+0.5)*CS, offsetY + (ny+0.5)*CS, '#FF5722', 8);
              dmgTexts.push({x:offsetX+(nx+0.5)*CS, y:offsetY+(ny+0.5)*CS-30, txt:'-'+damage, co:'#FF5722', life:30});
              
              // 塔被摧毁
              if(targetTower.hp <= 0) {
                grid[ny][nx] = 0;
                const tIdx = towers.indexOf(targetTower);
                if(tIdx >= 0) towers.splice(tIdx, 1);
                spawnP(offsetX+(nx+0.5)*CS, offsetY+(ny+0.5)*CS, targetTower.c || '#78909C', 15);
                showTip('💥 敌人摧毁了' + (N[targetTower.type] || '塔') + '!');
                
                // 重新计算路径
                path = findPath();
                e.customPath = null;
                e.attacking = false;
              }
            } else {
              // 普通塔直接摧毁
              grid[ny][nx] = 0;
              const tIdx = towers.indexOf(targetTower);
              if(tIdx >= 0) towers.splice(tIdx, 1);
              spawnP(offsetX+(nx+0.5)*CS, offsetY+(ny+0.5)*CS, targetTower.c || '#78909C', 15);
              showTip('💥 敌人摧毁了' + (N[targetTower.type] || '塔') + '!');
              path = findPath();
              e.customPath = null;
              e.attacking = false;
            }
            
            // 陷阱墙触发伤害
            if(targetTower.isTrap) {
              e.hp -= targetTower.trapDmg || 30;
              dmgTexts.push({x:e.x, y:e.y-30, txt:'-'+targetTower.trapDmg, co:'#FF5722', life:30});
            }
          } else {
            // 纯墙壁，直接摧毁
            grid[ny][nx] = 0;
            spawnP(offsetX+(nx+0.5)*CS, offsetY+(ny+0.5)*CS, '#78909C', 10);
            showTip('💥 敌人摧毁了墙壁!');
            path = findPath();
            e.customPath = null;
            e.attacking = false;
          }
          
          aiMemory.destroyerAttacks++;
          updateAIInfo();
        }
        
        // 攻击时不移动
        continue;
      } else {
        e.attacking = false;
        e.attackTimer = 0;
      }
    }
    
    // 路径移动
    e.pi += sp/60;
    const idx = Math.min(Math.floor(e.pi), usePath.length-1);
    e.x = offsetX + (usePath[idx][0]+0.5)*CS;
    e.y = offsetY + (usePath[idx][1]+0.5)*CS;
    
    // 到达终点
    if(e.pi >= usePath.length-1) {
      // 侦察兵存活 - 记录沿途的塔
      if(e.isScout) {
        aiMemory.scoutSurvived++;
        for(const t of towers) {
          if(!t.isTrap && !aiMemory.dangerZones.find(z => z.x===t.x && z.y===t.y)) {
            aiMemory.dangerZones.push({x: t.x, y: t.y});
          }
        }
        updateAIInfo();
      }
      
      hp--;
      enemies.splice(i, 1);
      updateUI();
      if(hp <= 0) { gameOver(); return; }
      continue;
    }
    
    // 死亡
    if(e.hp <= 0) {
      gold += e.g;
      kills++;
      spawnP(e.x, e.y, e.co, 18);
      dmgTexts.push({x:e.x, y:e.y-20, txt:'+'+e.g, co:'#FFD700', life:40});
      enemies.splice(i, 1);
      updateUI();
      updateTool();
      continue;
    }
  }
  
  // 波次结束检测
  if(enemies.length === 0) {
    if(wave < currentLevel.waves) {
      setTimeout(() => { if(fighting) spawnWave(); }, 900);
    } else {
      setTimeout(levelComplete, 400);
      return;
    }
  }
  
  // === 塔攻击 ===
  for(const t of towers) {
    // 传送塔特殊逻辑
    if(t.teleport) {
      if(t.cd > 0) { t.cd--; continue; }
      
      const tx = ox + (t.x+0.5)*CS;
      const ty = oy + (t.y+0.5)*CS;
      const rn = t.r * CS;
      
      for(const e of enemies) {
        const d = Math.hypot(e.x-tx, e.y-ty);
        if(d < rn) {
          // 传送回起点附近
          const oldPi = e.pi;
          e.pi = Math.max(0, e.pi - 5); // 后退5格
          const tp = path && path.length > Math.floor(e.pi) ? path : (findPath() || [[ENTRY.x, ENTRY.y]]);
          e.x = ox + (tp[Math.floor(e.pi)][0]+0.5)*CS;
          e.y = oy + (tp[Math.floor(e.pi)][1]+0.5)*CS;
          
          spawnP(e.x, e.y, '#E040FB', 20);
          dmgTexts.push({x:tx, y:ty-30, txt:'🌀传送!', co:'#E040FB', life:40});
          t.cd = t.maxCd;
          break;
        }
      }
      continue;
    }
    
    // 阻拦塔受攻击
    if(t.isBlocker && t.hp < t.maxHp) {
      // 自动修复
      t.hp = Math.min(t.maxHp, t.hp + 0.5);
    }
    
    // 普通攻击逻辑
    if(t.cd > 0) { t.cd--; continue; }
    if(t.d === 0) continue;
    
    const tx = ox + (t.x+0.5)*CS;
    const ty = oy + (t.y+0.5)*CS;
    const rn = t.r * CS;
    
    let tg = null, md = Infinity;
    for(const e of enemies) {
      // 变形怪属性克制
      let dmgMult = 1;
      if(e.isShifter && e.currentElement !== 'normal') {
        const towerElement = {
          archer: 'normal', cannon: 'fire', ice: 'ice', poison: 'poison', thunder: 'normal', blocker: 'normal'
        }[t.tp] || 'normal';
        if(towerElement !== 'normal' && towerElement !== e.currentElement) {
          dmgMult = 0.5; // 属性不匹配伤害减半
        }
      }
      
      const d = Math.hypot(e.x-tx, e.y-ty);
      if(d < rn && d < md) {
        md = d;
        tg = e;
        t.dmgMult = dmgMult;
      }
    }
    
    if(tg) {
      t.cd = t.s/60;
      const a = Math.atan2(tg.y-ty, tg.x-tx);
      bullets.push({
        x: tx, y: ty,
        vx: Math.cos(a)*12,
        vy: Math.sin(a)*12,
        d: t.d,
        co: t.co,
        src: t,
        dmgMult: t.dmgMult || 1
      });
    }
  }
  
  // === 子弹更新 ===
  for(let i=bullets.length-1; i>=0; i--) {
    const b = bullets[i];
    b.x += b.vx;
    b.y += b.vy;
    
    if(b.x<0 || b.x>W || b.y<0 || b.y>H) {
      bullets.splice(i, 1);
      continue;
    }
    
    for(let j=enemies.length-1; j>=0; j--) {
      const e = enemies[j];
      if(Math.hypot(e.x-b.x, e.y-b.y) < e.sz*CS*0.5+5) {
        const finalDmg = Math.floor(b.d * (b.dmgMult || 1));
        e.hp -= finalDmg;
        dmgTexts.push({x:e.x, y:e.y-30, txt:'-'+finalDmg, co:'#F44336', life:30});
        
        // 特殊效果
        if(b.src.w) e.sl = 100;
        if(b.src.o) { e.dt = 150; e.dv = b.src.o; }
        if(b.src.a) {
          for(const o of enemies) {
            if(o!==e && Math.hypot(o.x-b.x, o.y-b.y) < b.src.a*CS) {
              o.hp -= b.d * 0.4;
            }
          }
        }
        if(b.src.h) {
          let cc = b.src.h;
          for(const o of enemies) {
            if(o!==e && Math.hypot(o.x-e.x, o.y-e.y) < CS*3) {
              o.hp -= b.d * 0.5;
              cc--;
              if(cc <= 0) break;
            }
          }
        }
        
        spawnP(b.x, b.y, b.co, 6);
        bullets.splice(i, 1);
        break;
      }
    }
  }
  
  // === 粒子/文字更新 ===
  for(let i=parts.length-1; i>=0; i--) {
    parts[i].x += parts[i].vx;
    parts[i].y += parts[i].vy;
    parts[i].vy += 0.15;
    parts[i].l--;
    if(parts[i].l <= 0) parts.splice(i, 1);
  }
  
  for(let i=dmgTexts.length-1; i>=0; i--) {
    dmgTexts[i].y -= 1.5;
    dmgTexts[i].life--;
    if(dmgTexts[i].life <= 0) dmgTexts.splice(i, 1);
  }
  
  render();
  requestAnimationFrame(loop);
}

// ========== V14 腾讯品质渲染 ==========
function render() {
  if(!ctx || W===0 || H===0) return;
  
  // V4.1: 离屏背景缓存
  if(bgCtx && bgDirty) {
    renderBg(bgCtx);
  }
  if(bgCanvas) {
    ctx.drawImage(bgCanvas, 0, 0);
  } else {
    renderBg(ctx);
  }
  bgDirty = true;

  if(!ctx || W===0 || H===0) return;
  
  // 深色渐变背景
  const grad = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.max(W,H));
  grad.addColorStop(0, '#1a1a3e');
  grad.addColorStop(0.5, '#0d0d1f');
  grad.addColorStop(1, '#050510');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
  
  // 网格 - 带发光效果
  for(let y=0; y<ROWS; y++) {
    for(let x=0; x<COLS; x++) {
      const px = ox + x*CS;
      const py = oy + y*CS;
      const v = grid[y][x];
      
      if(v === 1) {
        // 墙壁 - 立体效果
        const wallGrad = ctx.createLinearGradient(px, py, px, py+CS);
        wallGrad.addColorStop(0, '#3a3a6e');
        wallGrad.addColorStop(0.5, '#252550');
        wallGrad.addColorStop(1, '#1a1a3a');
        ctx.fillStyle = wallGrad;
        ctx.fillRect(px+2, py+2, CS-4, CS-4);
        
        // 墙壁高光
        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        ctx.lineWidth = 1;
        ctx.strokeRect(px+2, py+2, CS-4, CS-4);
      } else {
        // 空地 - 微弱网格线
        ctx.fillStyle = '#0f0f2f';
        ctx.fillRect(px, py, CS, CS);
        ctx.strokeStyle = 'rgba(255,255,255,0.03)';
        ctx.lineWidth = 1;
        ctx.strokeRect(px, py, CS, CS);
      }
    }
  }
  
  // 入口出口 - 发光效果
  const ex = ox + ENTRY.x*CS, ey = oy + ENTRY.y*CS;
  ctx.shadowColor = '#00E676';
  ctx.shadowBlur = 20;
  ctx.fillStyle = 'rgba(0,230,118,0.2)';
  ctx.fillRect(ex, ey, CS, CS);
  ctx.shadowBlur = 0;
  ctx.strokeStyle = '#00E676';
  ctx.lineWidth = 3;
  ctx.strokeRect(ex+2, ey+2, CS-4, CS-4);
  ctx.font = (CS*0.45)+'px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('⬇', ex+CS/2, ey+CS/2);
  
  const xx = ox + EXIT.x*CS, xy = oy + EXIT.y*CS;
  ctx.shadowColor = '#FF1744';
  ctx.shadowBlur = 20;
  ctx.fillStyle = 'rgba(255,23,68,0.2)';
  ctx.fillRect(xx, xy, CS, CS);
  ctx.shadowBlur = 0;
  ctx.strokeStyle = '#FF1744';
  ctx.strokeRect(xx+2, xy+2, CS-4, CS-4);
  ctx.fillText('⬆', xx+CS/2, xy+CS/2);
  
  // AI记忆的危险区域标记 - 脉冲效果
  if(aiMemory.dangerZones.length > 0) {
    const pulse = (Date.now() % 1000) / 1000;
    ctx.fillStyle = `rgba(255, 215, 0, ${0.1 + pulse * 0.1})`;
    for(const zone of aiMemory.dangerZones) {
      ctx.fillRect(ox+(zone.x-1)*CS, oy+(zone.y-1)*CS, CS*3, CS*3);
    }
  }
  
  // 路径预览 - 发光虚线
  if(path && !fighting) {
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 10;
    ctx.strokeStyle = 'rgba(255,215,0,0.6)';
    ctx.lineWidth = 4;
    ctx.setLineDash([8,4]);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(ox+(path[0][0]+0.5)*CS, oy+(path[0][1]+0.5)*CS);
    for(let i=1; i<path.length; i++) {
      ctx.lineTo(ox+(path[i][0]+0.5)*CS, oy+(path[i][1]+0.5)*CS);
    }
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.shadowBlur = 0;
  }
  
  // 塔 - 发光效果
  for(const t of towers) {
    const tx = ox + (t.x+0.5)*CS;
    const ty = oy + (t.y+0.5)*CS;
    
    // 范围圈 - 渐变发光
    const rangeGrad = ctx.createRadialGradient(tx, ty, 0, tx, ty, CS*t.r);
    rangeGrad.addColorStop(0, t.co+'00');
    rangeGrad.addColorStop(0.7, t.co+'11');
    rangeGrad.addColorStop(1, t.co+'33');
    ctx.beginPath();
    ctx.arc(tx, ty, CS*t.r, 0, Math.PI*2);
    ctx.fillStyle = rangeGrad;
    ctx.fill();
    ctx.strokeStyle = t.co+'44';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // 塔身 - 立体发光
    ctx.shadowColor = t.co;
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(tx, ty, CS*0.32, 0, Math.PI*2);
    const towerGrad = ctx.createRadialGradient(tx-5, ty-5, 0, tx, ty, CS*0.32);
    towerGrad.addColorStop(0, t.co);
    towerGrad.addColorStop(0.5, t.co+'CC');
    towerGrad.addColorStop(1, t.co+'88');
    ctx.fillStyle = towerGrad;
    ctx.fill();
    ctx.shadowBlur = 0;
    
    ctx.strokeStyle = t.co;
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // 墙壁血条
    if(t.isWall && t.hp < t.maxHp) {
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(tx-CS*0.32, ty-CS*0.5, CS*0.64, 5);
      ctx.fillStyle = t.hp/t.maxHp > 0.5 ? '#00E676' : t.hp/t.maxHp > 0.25 ? '#FF9100' : '#FF1744';
      ctx.fillRect(tx-CS*0.32, ty-CS*0.5, CS*0.64*(t.hp/t.maxHp), 5);
    }
    
    // 阻拦塔血条
    if(t.isBlocker && t.hp < t.maxHp) {
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(tx-CS*0.32, ty-CS*0.5, CS*0.64, 5);
      ctx.fillStyle = t.hp/t.maxHp > 0.5 ? '#00E676' : t.hp/t.maxHp > 0.25 ? '#FF9100' : '#FF1744';
      ctx.fillRect(tx-CS*0.32, ty-CS*0.5, CS*0.64*(t.hp/t.maxHp), 5);
    }
    
    // 塔类型图标 - Canvas绘制替代emoji
    drawTowerIcon(ctx, t.tp, tx, ty, CS*0.28);
    
    // 传送塔冷却指示
    if(t.teleport && t.cd > 0) {
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.arc(tx, ty, CS*0.32, -Math.PI/2, -Math.PI/2 + (t.cd/t.maxCd)*Math.PI*2);
      ctx.fill();
    }
  }

// 塔图标绘制函数 - 纯Canvas几何图形
function drawTowerIcon(ctx, type, x, y, r) {
  ctx.save();
  ctx.translate(x, y);
  
  switch(type) {
    case 'archer':
      // 弓箭塔 - 三角箭头
      ctx.fillStyle = '#81C784';
      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.lineTo(r*0.8, r*0.6);
      ctx.lineTo(-r*0.8, r*0.6);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#4CAF50';
      ctx.lineWidth = 2;
      ctx.stroke();
      break;
      
    case 'cannon':
      // 炮塔 - 圆形炸弹
      ctx.fillStyle = '#EF5350';
      ctx.beginPath();
      ctx.arc(0, 0, r*0.8, 0, Math.PI*2);
      ctx.fill();
      ctx.strokeStyle = '#F44336';
      ctx.lineWidth = 2;
      ctx.stroke();
      // 引线
      ctx.strokeStyle = '#FF9800';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, -r*0.8);
      ctx.lineTo(r*0.3, -r*1.2);
      ctx.stroke();
      ctx.fillStyle = '#FFEB3B';
      ctx.beginPath();
      ctx.arc(r*0.3, -r*1.3, r*0.15, 0, Math.PI*2);
      ctx.fill();
      break;
      
    case 'ice':
      // 冰冻塔 - 雪花
      ctx.strokeStyle = '#4FC3F7';
      ctx.lineWidth = 2;
      for(let i=0; i<6; i++) {
        ctx.save();
        ctx.rotate(i * Math.PI/3);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -r);
        ctx.moveTo(0, -r*0.6);
        ctx.lineTo(r*0.3, -r*0.8);
        ctx.moveTo(0, -r*0.6);
        ctx.lineTo(-r*0.3, -r*0.8);
        ctx.stroke();
        ctx.restore();
      }
      break;
      
    case 'thunder':
      // 雷电塔 - 闪电
      ctx.fillStyle = '#FFD54F';
      ctx.beginPath();
      ctx.moveTo(r*0.2, -r);
      ctx.lineTo(-r*0.3, 0);
      ctx.lineTo(0, 0);
      ctx.lineTo(-r*0.2, r);
      ctx.lineTo(r*0.3, 0);
      ctx.lineTo(0, 0);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#FFC107';
      ctx.lineWidth = 2;
      ctx.stroke();
      break;
      
    case 'poison':
      // 毒塔 - 瓶子
      ctx.fillStyle = '#66BB6A';
      ctx.beginPath();
      ctx.moveTo(-r*0.5, r*0.8);
      ctx.lineTo(-r*0.5, -r*0.2);
      ctx.quadraticCurveTo(-r*0.5, -r*0.8, 0, -r*0.8);
      ctx.quadraticCurveTo(r*0.5, -r*0.8, r*0.5, -r*0.2);
      ctx.lineTo(r*0.5, r*0.8);
      ctx.closePath();
      ctx.fill();
      // 瓶口
      ctx.fillStyle = '#4CAF50';
      ctx.fillRect(-r*0.25, -r, r*0.5, r*0.3);
      // 骷髅标记
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(0, 0, r*0.25, 0, Math.PI*2);
      ctx.fill();
      break;
      
    case 'blocker':
      // 阻拦塔 - 盾牌
      ctx.fillStyle = '#AB47BC';
      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.lineTo(r*0.9, -r*0.5);
      ctx.lineTo(r*0.9, r*0.3);
      ctx.quadraticCurveTo(r*0.9, r, 0, r*1.1);
      ctx.quadraticCurveTo(-r*0.9, r, -r*0.9, r*0.3);
      ctx.lineTo(-r*0.9, -r*0.5);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#9C27B0';
      ctx.lineWidth = 2;
      ctx.stroke();
      // 盾牌中心
      ctx.fillStyle = '#E1BEE7';
      ctx.beginPath();
      ctx.arc(0, 0, r*0.35, 0, Math.PI*2);
      ctx.fill();
      break;
      
    case 'teleport':
      // 传送塔 - 漩涡
      ctx.strokeStyle = '#E040FB';
      ctx.lineWidth = 2;
      for(let i=0; i<3; i++) {
        ctx.beginPath();
        ctx.arc(0, 0, r*(0.4+i*0.25), 0, Math.PI*1.5);
        ctx.stroke();
      }
      ctx.fillStyle = '#E040FB';
      ctx.beginPath();
      ctx.arc(0, 0, r*0.2, 0, Math.PI*2);
      ctx.fill();
      break;
      
    case 'trapwall':
      // 陷阱墙 - 警告三角
      ctx.fillStyle = '#FF7043';
      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.lineTo(r*0.9, r*0.7);
      ctx.lineTo(-r*0.9, r*0.7);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#FF5722';
      ctx.lineWidth = 2;
      ctx.stroke();
      // 感叹号
      ctx.fillStyle = '#fff';
      ctx.fillRect(-r*0.1, -r*0.4, r*0.2, r*0.5);
      ctx.beginPath();
      ctx.arc(0, r*0.3, r*0.1, 0, Math.PI*2);
      ctx.fill();
      break;
      
    case 'wall':
      // 墙壁 - 砖块
      ctx.fillStyle = '#607D8B';
      ctx.fillRect(-r*0.9, -r*0.9, r*1.8, r*1.8);
      ctx.strokeStyle = '#78909C';
      ctx.lineWidth = 2;
      ctx.strokeRect(-r*0.9, -r*0.9, r*1.8, r*1.8);
      // 砖缝
      ctx.strokeStyle = '#455A64';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-r*0.9, 0);
      ctx.lineTo(r*0.9, 0);
      ctx.moveTo(0, -r*0.9);
      ctx.lineTo(0, 0);
      ctx.moveTo(-r*0.9, r*0.9);
      ctx.lineTo(0, r*0.9);
      ctx.moveTo(0, 0);
      ctx.lineTo(r*0.9, 0);
      ctx.stroke();
      break;
  }
  
  ctx.restore();
}
  
  // 敌人 - Canvas绘制发光效果
  for(const e of enemies) {
    const sz = e.sz * CS * 0.4;
    
    // 敌人身体 - 发光
    ctx.shadowColor = e.co;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(e.x, e.y, sz, 0, Math.PI*2);
    const enemyGrad = ctx.createRadialGradient(e.x-3, e.y-3, 0, e.x, e.y, sz);
    enemyGrad.addColorStop(0, e.sl>0 ? '#00E5FF' : '#fff');
    enemyGrad.addColorStop(0.3, e.sl>0 ? '#00B8D4' : e.co);
    enemyGrad.addColorStop(1, e.sl>0 ? '#006064' : e.co+'88');
    ctx.fillStyle = enemyGrad;
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // 敌人类型图标 - Canvas绘制
    drawEnemyIcon(ctx, e, e.x, e.y, sz);
    
    // 侦察兵/破坏者特殊光环
    if(e.isScout || e.isDestroyer) {
      ctx.strokeStyle = e.isScout ? '#FFD700' : '#FF1744';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(e.x, e.y, sz+5, 0, Math.PI*2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    
    // 血条 - 立体效果
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(e.x-sz, e.y-sz-8, sz*2, 5);
    const hr = Math.max(0, e.hp/e.mh);
    ctx.fillStyle = hr>0.5 ? '#00E676' : hr>0.25 ? '#FF9100' : '#FF1744';
    ctx.fillRect(e.x-sz, e.y-sz-8, sz*2*hr, 5);
    
    // 攻击进度条（正在破墙时显示）
    if(e.attacking && e.attackTimer > 0) {
      const atkMax = e.isDestroyer ? 90 : 180;
      const atkPct = e.attackTimer / atkMax;
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(e.x-sz, e.y+sz+4, sz*2, 4);
      ctx.fillStyle = '#FF5722';
      ctx.fillRect(e.x-sz, e.y+sz+4, sz*2*atkPct, 4);
    }
  }

// 敌人图标绘制函数
function drawEnemyIcon(ctx, e, x, y, r) {
  ctx.save();
  ctx.translate(x, y);
  
  // 变形怪元素标记
  if(e.isShifter && e.currentElement !== 'normal') {
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    
    switch(e.currentElement) {
      case 'fire':
        // 火焰
        ctx.fillStyle = '#FF5722';
        ctx.beginPath();
        ctx.moveTo(0, -r*0.8);
        ctx.quadraticCurveTo(r*0.5, -r*0.4, r*0.3, r*0.2);
        ctx.quadraticCurveTo(r*0.2, r*0.6, 0, r*0.8);
        ctx.quadraticCurveTo(-r*0.2, r*0.6, -r*0.3, r*0.2);
        ctx.quadraticCurveTo(-r*0.5, -r*0.4, 0, -r*0.8);
        ctx.fill();
        break;
      case 'ice':
        // 冰晶
        ctx.strokeStyle = '#03A9F4';
        ctx.lineWidth = 2;
        for(let i=0; i<6; i++) {
          ctx.save();
          ctx.rotate(i * Math.PI/3);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(0, -r*0.6);
          ctx.stroke();
          ctx.restore();
        }
        break;
      case 'poison':
        // 毒滴
        ctx.fillStyle = '#8BC34A';
        ctx.beginPath();
        ctx.moveTo(0, -r*0.7);
        ctx.quadraticCurveTo(r*0.5, 0, 0, r*0.7);
        ctx.quadraticCurveTo(-r*0.5, 0, 0, -r*0.7);
        ctx.fill();
        break;
    }
  } else if(e.isScout) {
    // 侦察兵 - 眼睛
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.ellipse(0, 0, r*0.5, r*0.35, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(0, 0, r*0.15, 0, Math.PI*2);
    ctx.fill();
  } else if(e.isDestroyer) {
    // 破坏者 - 锤子
    ctx.fillStyle = '#D32F2F';
    ctx.fillRect(-r*0.4, -r*0.2, r*0.8, r*0.5);
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(-r*0.1, r*0.3, r*0.2, r*0.5);
  } else if(e.boss) {
    // BOSS - 皇冠
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.moveTo(-r*0.6, r*0.2);
    ctx.lineTo(-r*0.6, -r*0.3);
    ctx.lineTo(-r*0.3, 0);
    ctx.lineTo(0, -r*0.5);
    ctx.lineTo(r*0.3, 0);
    ctx.lineTo(r*0.6, -r*0.3);
    ctx.lineTo(r*0.6, r*0.2);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#FFA000';
    ctx.lineWidth = 2;
    ctx.stroke();
  } else {
    // 普通敌人 - 简单圆点
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.beginPath();
    ctx.arc(0, 0, r*0.4, 0, Math.PI*2);
    ctx.fill();
  }
  
  ctx.restore();
}
  
  // 子弹 - 发光轨迹
  for(const b of bullets) {
    ctx.shadowColor = b.co;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(b.x, b.y, 5, 0, Math.PI*2);
    ctx.fillStyle = b.co;
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // 子弹尾迹
    ctx.beginPath();
    ctx.moveTo(b.x, b.y);
    ctx.lineTo(b.x-b.vx*0.5, b.y-b.vy*0.5);
    ctx.strokeStyle = b.co+'66';
    ctx.lineWidth = 3;
    ctx.stroke();
  }
  
  // 粒子 - 发光
  for(const p of parts) {
    ctx.globalAlpha = p.l/p.ml;
    ctx.shadowColor = p.co;
    ctx.shadowBlur = 5;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, Math.PI*2);
    ctx.fillStyle = p.co;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
  ctx.globalAlpha = 1;
  
  // 伤害文字 - 发光
  for(const d of dmgTexts) {
    ctx.globalAlpha = d.life/40;
    ctx.shadowColor = d.co;
    ctx.shadowBlur = 5;
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = d.co;
    ctx.fillText(d.txt, d.x, d.y);
    ctx.shadowBlur = 0;
  }
  ctx.globalAlpha = 1;
}

function spawnP(x, y, c, n) {
  for(let i=0; i<n; i++) {
    const a = Math.random() * Math.PI * 2;
    const s = 1.5 + Math.random() * 4;
    parts.push({x, y, vx:Math.cos(a)*s, vy:Math.sin(a)*s, co:c, l:25, ml:25});
  }
}

function updateUI() {
  document.getElementById('show-gold').textContent = gold;
  document.getElementById('show-wave').textContent = wave;
  document.getElementById('show-hp').textContent = hp;
  document.getElementById('show-level').textContent = currentLevel ? currentLevel.id : '1-1';
}

// ========== 游戏流程 ==========
function startGame() {
  const saved = loadProgress();
  curLevelIdx = saved ? saved.curLevelIdx : 0;
  currentLevel = LEVELS[curLevelIdx];
  gold = currentLevel.startGold;
  hp = 20;
  wave = 0;
  kills = 0;
  fighting = false;
  tutorialStep = 0;
  tutorialShown = false;
  
  document.getElementById('menu').style.display = 'none';
  document.getElementById('game').style.display = 'flex';
  document.getElementById('over').style.display = 'none';
  document.getElementById('level-complete').style.display = 'none';
  
  if(!inited) initCanvas();
  initGrid();
  updateUI();
  updateAIInfo();
  render();
  
  // 首关显示教学
  setTimeout(showTutorial, 500);
}

function gameOver() {
  fighting = false;
  document.getElementById('final-wave').textContent = wave;
  document.getElementById('final-kills').textContent = kills;
  document.getElementById('over').style.display = 'flex';
}

function levelComplete() {
  fighting = false;
  const stars = hp >= 18 ? 3 : hp >= 12 ? 2 : 1;
  const bonus = currentLevel.goldBonus;
  saveScore(currentLevel.id, stars);
  saveProgress();
  document.getElementById('stars').textContent = '⭐'.repeat(stars);
  document.getElementById('bonus-gold').textContent = bonus;
  document.getElementById('level-complete').style.display = 'flex';
}

function nextLevel() {
  curLevelIdx++;
  if(curLevelIdx >= LEVELS.length) curLevelIdx = 0;
  currentLevel = LEVELS[curLevelIdx];
  gold = currentLevel.startGold;
  hp = 20;
  wave = 0;
  kills = 0;
  fighting = false;
  tutorialStep = 0;
  tutorialShown = false;
  
  document.getElementById('level-complete').style.display = 'none';
  initGrid();
  updateUI();
  updateAIInfo();
  render();
  saveProgress();
  setTimeout(showTutorial, 500);
}

// 初始化塔按钮图标
function initTowerIcons() {
  document.querySelectorAll('.icon-cv').forEach(canvas => {
    const type = canvas.dataset.tower;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 24, 24);
    drawTowerIcon(ctx, type, 12, 12, 10);
  });
}

// 页面加载时初始化按钮图标
if(document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => setTimeout(initTowerIcons, 100));
} else {
  setTimeout(initTowerIcons, 100);
}

// V4.1: 塔升级面板
let selectedTowerForUpgrade = null;

function showUpgradePanel(tower) {
  selectedTowerForUpgrade = tower;
  const panel = document.getElementById('upgrade-panel');
  const info = document.getElementById('up-info');
  const btn = document.getElementById('up-btn');
  
  if (!panel || !tower) return;
  
  const cost = getUpgradeCost(tower);
  const rect = cv.getBoundingClientRect();
  const cx = rect.left + (tower.x + 0.5) * CS * (rect.width / W);
  const cy = rect.top + (tower.y + 0.5) * CS * (rect.height / H);
  
  panel.style.left = (cx - 80) + 'px';
  panel.style.top = (cy - 100) + 'px';
  
  if (tower.lv >= 3) {
    info.innerHTML = '\u2B50 ' + N[tower.tp] + ' Lv.' + tower.lv + '<br><span style="color:#FFD700">已达满级</span>';
    btn.disabled = true;
    btn.textContent = '满级';
  } else {
    const extraDmg = Math.floor(T[tower.tp].d * 0.4);
    const extraRng = (T[tower.tp].r * 0.15).toFixed(1);
    info.innerHTML = N[tower.tp] + ' Lv.' + tower.lv + ' → <b style="color:#FFD700">Lv.' + (tower.lv+1) + '</b><br>' +
      '\u2694 ' + tower.d + ' → ' + (tower.d + extraDmg) + ' 伤害<br>' +
      '\u26A1 ' + tower.r + ' → ' + (tower.r + parseFloat(extraRng)) + ' 范围';
    btn.disabled = false;
    btn.textContent = '升级 (' + cost + ' 金)';
  }
  
  panel.style.display = 'block';
}

function closeUpgradePanel() {
  document.getElementById('upgrade-panel').style.display = 'none';
  selectedTowerForUpgrade = null;
}

function doUpgradeFromPanel() {
  if (!selectedTowerForUpgrade) return;
  const {x, y} = selectedTowerForUpgrade;
  closeUpgradePanel();
  upgradeTower(x, y);
}

// 点击其他地方关闭面板
document.addEventListener('click', function(e) {
  const panel = document.getElementById('upgrade-panel');
  if (panel && panel.style.display === 'block' && 
      !panel.contains(e.target) && e.target.id !== 'up-btn') {
    closeUpgradePanel();
  }
});

