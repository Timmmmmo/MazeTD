"""
MazeTD V5.0 - 腾讯小游戏Top3品质升级
全面重构：数值、关卡、美术
"""
import re

FILE = r'C:\Users\赵鸿杰\.openclaw\agents\game-studio\MazeTD-prototype\index.html'

with open(FILE, 'r', encoding='utf-8') as f:
    content = f.read()

# ============ 1. 标题升级 ============
content = content.replace(
    '<title>迷宫塔防 V4.1 - 塔升级系统</title>',
    '<title>迷宫塔防 V5.0 - 腾讯品质</title>'
)
print("✓ 标题升级 V5.0")

# ============ 2. 数值系统重构 - 参考《王国保卫战》《部落冲突》 ============
# 设计原则：
# - 每种塔有独特定位，不重叠
# - 敌人血量/速度/金币成黄金比例
# - 经济紧张但不卡手

old_T = '''const T = {
  // === 基础塔 - 新手友好 ===
  archer: {c:'#4CAF50', d:15, r:3.5, s:40, $:60},  // 弓箭塔：低成本稳定输出
  wall: {c:'#78909C', d:0, r:0, s:0, $:10, hp:500, maxHp:500, isWall:true},  // 墙壁：基础阻拦
  
  // === 进阶塔 - 策略选择 ===
  cannon: {c:'#F44336', d:40, r:2.5, s:90, $:100, a:1.2},   // 炮塔：AOE群体伤害
  ice: {c:'#03A9F4', d:8, r:3.0, s:50, $:80, w:0.5},        // 冰塔：减速50%控场核心
  poison: {c:'#8BC34A', d:12, r:2.5, s:35, $:90, o:8},      // 毒塔：持续伤害
  trapwall: {c:'#FF5722', d:30, r:0, s:0, $:40, isTrap:true, trapDmg:30},  // 陷阱墙：低成本高回报
  
  // === 高级塔 - 战术核心 ===
  thunder: {c:'#FFC107', d:35, r:2.8, s:50, $:140, h:4},    // 雷电塔：连锁4目标
  blocker: {c:'#9C27B0', d:10, r:2.0, s:45, $:120, hp:400, maxHp:400, isBlocker:true},  // 阻拦塔：战术核心
  teleport: {c:'#E040FB', d:0, r:2.5, s:100, $:180, teleport:true}  // 传送塔：高级战术
};'''

new_T = '''const T = {
  // ========== V5.0 精简塔系统 - 5种核心塔 ==========
  // 设计理念：每种塔有不可替代的独特价值
  
  // 【核心塔1】弓箭塔 - 稳定输出主力
  // 定位：低成本、高射程、稳定单体伤害
  // 升级价值：★★★（攻速提升明显）
  archer: {c:'#4CAF50', d:18, r:4.0, s:35, $:50},
  
  // 【核心塔2】冰塔 - 控场核心
  // 定位：减速敌人，为其他塔创造输出时间
  // 升级价值：★★☆（范围提升更关键）
  ice: {c:'#03A9F4', d:6, r:3.2, s:45, $:70, slow:0.5},
  
  // 【核心塔3】炮塔 - AOE清怪
  // 定位：群体伤害，克制密集敌群
  // 升级价值：★★★（伤害+范围双提升）
  cannon: {c:'#F44336', d:35, r:2.8, s:80, $:110, aoe:1.3},
  
  // 【核心塔4】毒塔 - 持续伤害
  // 定位：百分比伤害，克制高血量敌人
  // 升级价值：★★☆（DOT时间延长）
  poison: {c:'#8BC34A', d:5, r:2.8, s:30, $:85, dot:12, dotTime:5},
  
  // 【核心塔5】雷电塔 - 连锁攻击
  // 定位：多目标打击，克制分散敌人
  // 升级价值：★★★（连锁数+伤害）
  thunder: {c:'#FFC107', d:25, r:3.0, s:45, $:130, chain:3},
  
  // 【辅助】墙壁 - 基础阻拦
  wall: {c:'#78909C', d:0, r:0, s:0, $:15, hp:600, maxHp:600, isWall:true}
};'''

content = content.replace(old_T, new_T)
print("✓ 塔系统重构: 7塔→5核心塔")

# ============ 3. 敌人系统重构 ============
old_enemy = '''const ENEMY_TYPES = {
  // === 基础敌人 ===
  normal: {hp:60, color:'#8BC34A', size:0.42, gold:8, speed:0.50},      // 普通怪：标准参考
  fast: {hp:35, color:'#42A5F5', size:0.35, gold:10, speed:0.80},       // 快速怪：血少跑得快
  tank: {hp:200, color:'#78909C', size:0.55, gold:25, speed:0.25},      // 坦克：血厚跑得慢
  
  // === 特殊敌人 ===
  scout: {hp:70, color:'#FFD700', size:0.38, gold:15, speed:0.65, isScout:true},        // 侦察兵：记住布局
  destroyer: {hp:280, color:'#D32F2F', size:0.52, gold:30, speed:0.20, isDestroyer:true, atkDmg:80},  // 破坏者：攻击墙壁
  shifter: {hp:150, color:'#9C27B0', size:0.45, gold:20, speed:0.35, isShifter:true}    // 变形怪：切换属性
};'''

new_enemy = '''const ENEMY_TYPES = {
  // ========== V5.0 敌人系统 - 黄金比例设计 ==========
  // 设计原则：血量/速度/金币 = 1:0.5:0.1 (参考值)
  // 每种敌人有明确克制关系
  
  // 【基础敌人】教学用，熟悉游戏
  normal: {hp:50, color:'#8BC34A', size:0.40, gold:6, speed:0.45},
  
  // 【快速敌人】考验反应，需提前布局
  fast: {hp:30, color:'#42A5F5', size:0.32, gold:8, speed:0.75},
  
  // 【坦克敌人】考验输出能力，需集火
  tank: {hp:180, color:'#78909C', size:0.52, gold:20, speed:0.22},
  
  // 【破坏者】打破墙壁，考验多路线设计
  destroyer: {hp:220, color:'#D32F2F', size:0.48, gold:25, speed:0.18, isDestroyer:true, atkDmg:100},
  
  // 【侦察兵】记住火力点，后续波次会绕路
  scout: {hp:60, color:'#FFD700', size:0.36, gold:12, speed:0.55, isScout:true},
  
  // 【变形怪】随机切换抗性，考验塔组合
  shifter: {hp:120, color:'#9C27B0', size:0.42, gold:18, speed:0.30, isShifter:true}
};'''

content = content.replace(old_enemy, new_enemy)
print("✓ 敌人系统重构: 黄金比例数值")

# ============ 4. 关卡系统重构 - 8关精简设计 ============
old_levels = re.search(r'const LEVELS = \[[\s\S]*?\];', content)
if old_levels:
    new_levels = '''const LEVELS = [
  // ========== V5.0 关卡系统 - 8关精品设计 ==========
  // 难度曲线：教学(1-2) → 成长(3-5) → 挑战(6-8)
  // 每关解锁1个新塔，玩家有清晰成长线
  
  // === 第一章：教学篇 ===
  {id:'1-1', name:'初阵', waves:3, startGold:550, goldBonus:40,
   unlock:['wall','archer'], enemies:['normal'],
   desc:'点击网格放置墙壁，然后选择弓箭塔', chapter:'教学篇'},
  
  {id:'1-2', name:'疾风', waves:4, startGold:500, goldBonus:50,
   unlock:['wall','archer','ice'], enemies:['normal','fast'],
   desc:'快速敌人需要冰塔减速', chapter:'教学篇'},
  
  // === 第二章：成长篇 ===
  {id:'2-1', name:'铁壁', waves:5, startGold:450, goldBonus:60,
   unlock:['wall','archer','ice','cannon'], enemies:['normal','fast','tank'],
   desc:'坦克敌人需要炮塔AOE集火', chapter:'成长篇'},
  
  {id:'2-2', name:'剧毒', waves:5, startGold:420, goldBonus:70,
   unlock:['wall','archer','ice','cannon','poison'], enemies:['normal','fast','tank'],
   desc:'毒塔持续伤害克制高血量', chapter:'成长篇'},
  
  {id:'2-3', name:'雷霆', waves:6, startGold:400, goldBonus:80,
   unlock:['all'], enemies:['normal','fast','scout'],
   desc:'侦察兵会记住你的布局!', chapter:'成长篇'},
  
  // === 第三章：挑战篇 ===
  {id:'3-1', name:'破军', waves:7, startGold:380, goldBonus:100,
   unlock:['all'], enemies:['normal','fast','tank','destroyer'],
   desc:'破坏者会攻击墙壁!', chapter:'挑战篇'},
  
  {id:'3-2', name:'幻影', waves:8, startGold:350, goldBonus:120,
   unlock:['all'], enemies:['normal','fast','scout','shifter'],
   desc:'变形怪随机切换抗性', chapter:'挑战篇'},
  
  {id:'3-3', name:'终焉', waves:10, startGold:320, goldBonus:150, boss:true,
   unlock:['all'], enemies:['all'],
   desc:'最终挑战 - 全敌人BOSS战!', chapter:'挑战篇'}
];'''
    content = content.replace(old_levels.group(0), new_levels)
    print("✓ 关卡系统重构: 12关→8关精品")

# ============ 5. 升级系统优化 ============
old_upgrade = '''function upgradeTower(x, y) {
  const t = towers.find(t => t.x === x && t.y === y);
  if (!t || t.tp === 'wall' || t.tp === 'trapwall') {
    showTip('⚠️ 该类型无法升级');
    return;
  }
  if (t.lv >= 3) {
    showTip('⚠️ 已达满级 (Lv.3)');
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
}'''

new_upgrade = '''function upgradeTower(x, y) {
  const t = towers.find(t => t.x === x && t.y === y);
  if (!t || t.tp === 'wall') {
    showTip('⚠️ 墙壁无法升级');
    return;
  }
  if (t.lv >= 5) {
    showTip('⭐ 已达满级 (Lv.5)');
    return;
  }
  const baseCost = T[t.tp].$;
  const cost = Math.floor(baseCost * Math.pow(1.5, t.lv || 1));
  if (gold < cost) {
    showTip('💰 金币不足! 需要 ' + cost);
    return;
  }
  gold -= cost;
  t.lv = (t.lv || 1) + 1;
  
  // V5.0 升级属性 - 指数增长，后期更强
  const lv = t.lv - 1;
  t.d = Math.floor(T[t.tp].d * (1 + lv * 0.5 + lv * lv * 0.1));  // 伤害：线性+二次
  t.r = parseFloat((T[t.tp].r * (1 + lv * 0.2)).toFixed(1));       // 范围：线性
  t.s = Math.max(15, Math.floor(T[t.tp].s * (1 - lv * 0.15)));    // 攻速：有下限
  
  // 特殊塔升级加成
  if (t.tp === 'thunder' && T[t.tp].chain) {
    t.chain = Math.min(6, (T[t.tp].chain || 3) + lv);  // 雷电塔连锁数+1
  }
  if (t.tp === 'poison' && T[t.tp].dotTime) {
    t.dotTime = (T[t.tp].dotTime || 5) + lv;           // 毒塔DOT时间+1秒
  }
  
  // 升级特效 - 更华丽
  for(let i=0; i<12; i++) {
    setTimeout(() => {
      const angle = (i/12) * Math.PI * 2;
      const px = ox + (x + 0.5) * CS + Math.cos(angle) * CS * 0.8;
      const py = oy + (y + 0.5) * CS + Math.sin(angle) * CS * 0.8;
      spawnP(px, py, '#FFD700', 8);
    }, i * 30);
  }
  
  showTip('⬆ Lv.' + t.lv + ' ' + N[t.tp] + ' 升级成功!');
  saveProgress();
  updateUI();
}'''

content = content.replace(old_upgrade, new_upgrade)
print("✓ 升级系统优化: 3级→5级，指数增长")

# ============ 6. 粒子系统增强 ============
# 在 render 函数末尾添加更华丽的粒子效果
particle_enhance = '''
// ========== V5.0 粒子系统 - 华丽特效 ==========
let particles = [];

function spawnParticle(x, y, color, count=10, speed=3, life=30) {
  for(let i=0; i<count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const spd = speed * (0.5 + Math.random() * 0.5);
    particles.push({
      x, y,
      vx: Math.cos(angle) * spd,
      vy: Math.sin(angle) * spd,
      color,
      life,
      maxLife: life,
      size: 2 + Math.random() * 3
    });
  }
}

function spawnExplosion(x, y, color='#FF6B6B') {
  // 爆炸特效 - 大量粒子
  spawnParticle(x, y, color, 25, 5, 40);
  spawnParticle(x, y, '#FFD700', 15, 3, 30);
  // 环形冲击波
  for(let i=0; i<8; i++) {
    const angle = (i/8) * Math.PI * 2;
    particles.push({
      x, y,
      vx: Math.cos(angle) * 8,
      vy: Math.sin(angle) * 8,
      color: '#fff',
      life: 20,
      maxLife: 20,
      size: 4
    });
  }
}

function spawnGoldGain(x, y, amount) {
  // 金币获得特效
  for(let i=0; i<Math.min(amount/5, 15); i++) {
    const delay = Math.random() * 200;
    setTimeout(() => {
      const ox2 = x + (Math.random() - 0.5) * 30;
      const oy2 = y + (Math.random() - 0.5) * 30;
      particles.push({
        x: ox2, y: oy2,
        vx: (Math.random() - 0.5) * 2,
        vy: -2 - Math.random() * 2,
        color: '#FFD700',
        life: 50,
        maxLife: 50,
        size: 3,
        isGold: true
      });
    }, delay);
  }
}

function updateParticles() {
  for(let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.1; // 重力
    p.life--;
    if(p.life <= 0) {
      particles.splice(i, 1);
    }
  }
}

function drawParticles() {
  for(const p of particles) {
    const alpha = p.life / p.maxLife;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

// 在 loop() 中调用
'''

# 找到 spawnP 函数后面插入
content = content.replace(
    'function spawnP(x, y, c, n) {',
    particle_enhance + '\nfunction spawnP(x, y, c, n) {'
)
print("✓ 粒子系统增强")

# ============ 7. 屏幕震动效果 ============
shake_system = '''
// ========== V5.0 屏幕震动 ==========
let screenShake = { intensity: 0, decay: 0.9 };

function shake(intensity=5) {
  screenShake.intensity = Math.max(screenShake.intensity, intensity);
}

function applyShake() {
  if(screenShake.intensity > 0.5) {
    const dx = (Math.random() - 0.5) * screenShake.intensity * 2;
    const dy = (Math.random() - 0.5) * screenShake.intensity * 2;
    ctx.translate(dx, dy);
    screenShake.intensity *= screenShake.decay;
  }
}

function resetShake() {
  if(screenShake.intensity > 0.5) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
}
'''

content = content.replace(
    '// ========== V4.1 Canvas 离屏渲染优化 ==========',
    shake_system + '\n// ========== V4.1 Canvas 离屏渲染优化 =========='
)
print("✓ 屏幕震动系统")

# ============ 8. 更新塔名称 ============
old_N = '''const N = {
  archer:'弓箭塔', cannon:'炮塔', ice:'冰冻塔', thunder:'雷电塔', poison:'毒塔',
  blocker:'阻拦塔', teleport:'传送塔', trapwall:'陷阱墙', wall:'墙壁'
};'''

new_N = '''const N = {
  archer:'弓箭塔', ice:'冰冻塔', cannon:'炮塔', poison:'毒塔', thunder:'雷电塔', wall:'墙壁'
};'''

content = content.replace(old_N, new_N)
print("✓ 塔名称更新")

# ============ 保存 ============
with open(FILE, 'w', encoding='utf-8') as f:
    f.write(content)

print("\n✅ V5.0 核心系统升级完成!")
print("接下来需要：修复HTML塔按钮、调整render函数调用粒子系统")
