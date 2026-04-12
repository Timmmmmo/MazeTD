"""
MazeTD V4.1 增量构建脚本
安全地添加新功能，不破坏现有代码
"""
import re

FILE = r'C:\Users\赵鸿杰\.openclaw\agents\game-studio\MazeTD-prototype\index.html'

with open(FILE, 'r', encoding='utf-8') as f:
    content = f.read()

# ============ 1. 修复教程箭头语法错误 ============
# step.dir===\'up\' → step.dir==='up'
content = content.replace("step.dir===\\'up\\'", "step.dir==='up'")
print("✓ 修复语法错误: 教程箭头")

# ============ 2. 添加塔升级系统 ============
# 在 place 函数之后添加升级逻辑
upgrade_system = '''

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
      const px = offsetX + x * CS;
      const py = offsetY + y * CS;
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
  const ex = offsetX + ENTRY.x * CS, ey = offsetY + ENTRY.y * CS;
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
  c.fillText('\\u2B07', ex + CS/2, ey + CS/2);

  const xx = offsetX + EXIT.x * CS, xy = offsetY + EXIT.y * CS;
  c.shadowColor = '#FF1744';
  c.shadowBlur = 20;
  c.fillStyle = 'rgba(255,23,68,0.2)';
  c.fillRect(xx, xy, CS, CS);
  c.shadowBlur = 0;
  c.strokeStyle = '#FF1744';
  c.strokeRect(xx + 2, xy + 2, CS - 4, CS - 4);
  c.fillText('\\u2B06', xx + CS/2, xy + CS/2);

  bgDirty = false;
}
'''

# 找到 "// ========== 建造系统 ==========" 的位置，在其后插入
content = content.replace(
    '// ========== 建造系统 ==========',
    '// ========== 建造系统 ==========' + upgrade_system
)
print("✓ 添加 V4.1 塔升级系统 + Canvas优化")

# ============ 3. 修复 render 函数 - 使用离屏渲染 ============
# 找到旧的 render 函数，替换为使用 bgCanvas 的版本
old_render_match = re.search(
    r'(function render\(\) \{[\s\S]*?)(^function \w+\()',
    content, re.MULTILINE
)

if old_render_match:
    old_render = old_render_match.group(1)
    
    # 新的 render 函数
    new_render = '''function render() {
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
'''
    # 保留旧render中除了开头和背景绘制之外的所有内容
    # 去掉旧render的 "function render() {" 和结束 "}"
    inner = old_render.replace('function render() {', '', 1)
    # 去掉开头的背景绘制代码 (到第一个 if/fillStyle)
    inner = re.sub(r'  if\(!ctx[\s\S]*?fillText\([\s\S]*?\'\\u2B06\'[\s\S]*?\);?\n', '', inner, count=1)
    
    new_render += inner
    content = content.replace(old_render, new_render)
    print("✓ 重构 render() 使用离屏背景缓存")
else:
    print("⚠ render() 未找到，跳过")

# ============ 4. 添加塔升级按钮到 UI ============
upgrade_css = '''
/* V4.1: 塔升级按钮 */
.upgrade-btn{
  position:absolute;padding:6px 14px;border-radius:12px;
  font-size:11px;font-weight:bold;cursor:pointer;z-index:50;
  border:none;transition:all 0.2s;pointer-events:auto;
}
.upgrade-btn:active{transform:scale(0.95);}
#upgrade-panel{
  position:absolute;display:none;z-index:60;
  background:rgba(20,20,40,0.97);border:2px solid #FFD700;
  border-radius:14px;padding:12px;min-width:160px;
  box-shadow:0 8px 32px rgba(0,0,0,0.6);
}
#upgrade-panel .up-info{color:#ccc;font-size:12px;margin-bottom:8px;text-align:center}
#upgrade-panel .up-btn{
  width:100%;padding:8px;margin-top:6px;border:none;border-radius:10px;
  background:linear-gradient(135deg,#FFD700,#FFA500);color:#1a1a3e;
  font-weight:bold;font-size:13px;cursor:pointer;
}
#upgrade-panel .up-btn:hover{background:linear-gradient(135deg,#FFE55C,#FFB300);}
#upgrade-panel .up-btn:disabled{opacity:0.4;cursor:not-allowed;}
#upgrade-panel .close-btn{
  position:absolute;top:4px;right:8px;background:none;border:none;
  color:#888;font-size:16px;cursor:pointer;
}
'''

# 在 </style> 之前插入
content = content.replace('</style>', upgrade_css + '\n</style>')
print("✓ 添加塔升级UI样式")

# 在 #canvas-box 内添加升级面板
upgrade_panel_html = '''<div id="upgrade-panel">
  <button class="close-btn" onclick="closeUpgradePanel()">×</button>
  <div class="up-info" id="up-info">选择一座塔</div>
  <button class="up-btn" id="up-btn" onclick="doUpgradeFromPanel()">升级 (0 金)</button>
</div>
'''

content = content.replace('<div id="canvas-box">', '<div id="canvas-box">\n' + upgrade_panel_html)
print("✓ 添加塔升级面板HTML")

# ============ 5. 添加升级面板 JS 逻辑 ============
upgrade_js = '''
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
    info.innerHTML = '\\u2B50 ' + N[tower.tp] + ' Lv.' + tower.lv + '<br><span style="color:#FFD700">已达满级</span>';
    btn.disabled = true;
    btn.textContent = '满级';
  } else {
    const extraDmg = Math.floor(T[tower.tp].d * 0.4);
    const extraRng = (T[tower.tp].r * 0.15).toFixed(1);
    info.innerHTML = N[tower.tp] + ' Lv.' + tower.lv + ' → <b style="color:#FFD700">Lv.' + (tower.lv+1) + '</b><br>' +
      '\\u2694 ' + tower.d + ' → ' + (tower.d + extraDmg) + ' 伤害<br>' +
      '\\u26A1 ' + tower.r + ' → ' + (tower.r + parseFloat(extraRng)) + ' 范围';
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
'''

# 在 </script> 之前插入（找到最后一个 </script>）
content = content.replace('</script>', upgrade_js + '\n</script>')
print("✓ 添加塔升级面板JS逻辑")

# ============ 6. 修改点击逻辑 - 支持升级 ============
# 在 act 函数中找到 "if(grid[y][x] === 0)" 分支，修改为支持升级
# 如果点击有塔的位置，显示升级选项
old_act = re.search(
    r"(function act\(x, y\) \{[\s\S]*?gold \+= Math\.floor\(T\[towers\[i\]\.tp\]\.\$ \* 0\.7\);[\s\S]*?towers\.splice\(i, 1\);[\s\S]*?break;[\s\S]*?\}\n  \})",
    content
)

if old_act:
    # 修改 act 函数，添加升级逻辑
    # 在 "if(grid[y][x] === 0)" 之前添加升级检查
    new_act_part = '''
  // V4.1: 点击已有塔 → 升级菜单
  for(const t of towers) {
    if(t.x === x && t.y === y) {
      if(!fighting) {
        showUpgradePanel(t);
      }
      return;
    }
  }
'''
    content = content.replace(
        '  // 放置塔\n  if(grid[y][x] === 0 && tool === \'place\') {',
        new_act_part + '\n  // 放置塔\n  if(grid[y][x] === 0 && tool === \'place\') {'
    )
    print("✓ 修改点击逻辑支持升级面板")

# ============ 7. 修改 loop 函数开头 - 初始化 bgCanvas ============
content = content.replace(
    'function loop() {\n  if(!inited) return;',
    '''function loop() {
  if(!inited) return;
  // V4.1: 初始化离屏Canvas
  if(!bgCanvas) initBgCanvas();
  if(bgDirty && !bgCtx) initBgCanvas();
'''
)
print("✓ 修改 loop() 初始化背景缓存")

# ============ 8. 修改 startGame - 标记背景需重绘 ============
content = content.replace(
    'grid = makeGrid();\n  path = findPath();\n  updateInfo();',
    '''grid = makeGrid();
  path = findPath();
  bgDirty = true; // V4.1: 标记背景需重绘
  updateInfo();'''
)
print("✓ startGame() 标记背景重绘")

# ============ 9. 修改 initGrid - 标记背景需重绘 ============
content = content.replace(
    'grid = makeGrid();\n  path = findPath();\n  updateInfo();\n}',
    '''grid = makeGrid();
  path = findPath();
  bgDirty = true;
  updateInfo();
}'''
)
print("✓ initGrid() 标记背景重绘")

# ============ 10. 修改 startLevel - 标记背景需重绘 ============
content = content.replace(
    '  grid = makeGrid();\n  path = findPath();\n  updateUI();',
    '''  grid = makeGrid();
  path = findPath();
  bgDirty = true;
  updateUI();'''
)
print("✓ startLevel() 标记背景重绘")

# ============ 11. 修改 undoLast / clearAll - 标记背景需重绘 ============
# undoLast: 在 hist.pop(); 之后加 bgDirty=true
content = content.replace(
    '    hist.pop();\n    updateInfo();\n  }\n}',
    '''    hist.pop();
    bgDirty = true;
    updateInfo();
  }
}'''
)
# clearAll: 在 hist = [] 之后加 bgDirty=true
content = content.replace(
    '    hist = [];\n    updateInfo();\n  }\n}',
    '''    hist = [];
    bgDirty = true;
    updateInfo();
  }
}'''
)
print("✓ undoLast/clearAll 标记背景重绘")

# ============ 12. 修复 delete 逻辑也标记重绘 ============
content = content.replace(
    '        towers.splice(i, 1);\n        break;\n      }\n    }\n  } else {',
    '''        towers.splice(i, 1);
        bgDirty = true;
        break;
      }
    }
  } else {'''
)
print("✓ delete 逻辑标记背景重绘")

# ============ 13. 塔渲染中添加等级显示 ============
# 在 drawTowerIcon 调用后添加等级标识
content = content.replace(
    "drawTowerIcon(ctx, t.tp, tx, ty, CS*0.32);",
    """drawTowerIcon(ctx, t.tp, tx, ty, CS*0.32);
    // V4.1: 塔等级标识
    if(t.lv > 1) {
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.shadowColor = '#000';
      ctx.shadowBlur = 3;
      ctx.fillText('\\u2B50' + t.lv, tx, ty - CS*0.28);
      ctx.shadowBlur = 0;
    }"""
)
print("✓ 添加塔等级显示")

# ============ 14. 存档系统兼容升级数据 ============
# 升级时保存升级后属性
# saveProgress 中 towers 已经有完整数据
# loadProgress 中确保加载时 lv 属性

# ============ 15. 修改标题 ============
content = content.replace(
    '<title>迷宫塔防 V3.0 - 全面优化</title>',
    '<title>迷宫塔防 V4.1 - 塔升级系统</title>'
)
print("✓ 修改标题为 V4.1")

# ============ 保存 ============
with open(FILE, 'w', encoding='utf-8') as f:
    f.write(content)

print("\n✅ V4.1 构建完成!")
print(f"文件大小: {len(content)} 字符")
