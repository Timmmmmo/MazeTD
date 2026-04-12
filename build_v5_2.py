"""
V5.0 第二阶段：HTML/UI修复 + render集成
"""
import re

FILE = r'C:\Users\赵鸿杰\.openclaw\agents\game-studio\MazeTD-prototype\index.html'

with open(FILE, 'r', encoding='utf-8') as f:
    content = f.read()

# ============ 1. 移除多余塔按钮 ============
# 移除: blocker, teleport, trapwall, poison (如果有)
# 保留: wall, archer, ice, cannon, poison, thunder

# 找到塔按钮区域并替换
old_buttons = re.search(r'<div id="towers">[\s\S]*?</div>\s*<div id="toolbar">', content)
if old_buttons:
    new_buttons = '''<div id="towers">
<div class="tower-btn selected" data-type="archer" onclick="pickTower('archer')"><canvas class="icon-cv" data-tower="archer" width="24" height="24"></canvas><span class="price">50</span><span class="name">弓箭塔</span></div>
<div class="tower-btn" data-type="ice" onclick="pickTower('ice')"><canvas class="icon-cv" data-tower="ice" width="24" height="24"></canvas><span class="price">70</span><span class="name">冰冻塔</span></div>
<div class="tower-btn" data-type="cannon" onclick="pickTower('cannon')"><canvas class="icon-cv" data-tower="cannon" width="24" height="24"></canvas><span class="price">110</span><span class="name">炮塔</span></div>
<div class="tower-btn" data-type="poison" onclick="pickTower('poison')"><canvas class="icon-cv" data-tower="poison" width="24" height="24"></canvas><span class="price">85</span><span class="name">毒塔</span></div>
<div class="tower-btn" data-type="thunder" onclick="pickTower('thunder')"><canvas class="icon-cv" data-tower="thunder" width="24" height="24"></canvas><span class="price">130</span><span class="name">雷电塔</span></div>
<div class="tower-btn" data-type="wall" onclick="pickTower('wall')"><canvas class="icon-cv" data-tower="wall" width="24" height="24"></canvas><span class="price">15</span><span class="name">墙壁</span></div>
</div>
<div id="toolbar">'''
    content = content.replace(old_buttons.group(0), new_buttons)
    print("✓ 塔按钮更新: 5核心塔 + 墙壁")

# ============ 2. 在 render 函数末尾添加粒子绘制 ============
# 找到 render 函数的结尾（在最后一个 } 之前添加 drawParticles）
old_render_end = re.search(r'// 敌人图标绘制函数\s*\nfunction drawEnemyIcon', content)
if old_render_end:
    # 在 drawEnemyIcon 之前插入粒子绘制
    insert_pos = old_render_end.start()
    content = content[:insert_pos] + '''
// V5.0: 绘制粒子
drawParticles();

// 敌人图标绘制函数
function drawEnemyIcon''' + content[insert_pos:]
    print("✓ render 集成粒子绘制")

# ============ 3. 在 loop 函数中调用 updateParticles ============
content = content.replace(
    'function loop() {\n  if(!inited) return;',
    '''function loop() {
  if(!inited) return;
  updateParticles();  // V5.0: 更新粒子
'''
)
print("✓ loop 集成粒子更新")

# ============ 4. 敌人死亡时调用爆炸特效 ============
# 找到 enemies.splice(i, 1); 的位置，在之前添加爆炸特效
content = content.replace(
    'enemies.splice(i, 1);',
    '''spawnExplosion(e.x, e.y, e.c || '#FF6B6B');  // V5.0: 死亡爆炸
      shake(3);  // V5.0: 屏幕震动
      enemies.splice(i, 1);'''
)
print("✓ 敌人死亡爆炸特效")

# ============ 5. 击杀获得金币时调用金币特效 ============
content = content.replace(
    'gold += e.g || ENEMY_TYPES.normal.gold;',
    '''const goldGain = e.g || ENEMY_TYPES.normal.gold;
        gold += goldGain;
        spawnGoldGain(e.x, e.y, goldGain);  // V5.0: 金币飞起特效'''
)
print("✓ 金币获得特效")

# ============ 6. 波次开始时屏幕震动 ============
content = content.replace(
    "showWave('⚔️ 第 ' + wave + ' 波', '#fff');",
    '''showWave('⚔️ 第 ' + wave + ' 波', '#fff');
  shake(8);  // V5.0: 波次开始震动'''
)
print("✓ 波次震动")

# ============ 7. 修改 render 开头应用震动 ============
content = content.replace(
    'function render() {\n  if(!ctx || W===0 || H===0) return;',
    '''function render() {
  if(!ctx || W===0 || H===0) return;
  applyShake();  // V5.0: 应用屏幕震动'''
)
print("✓ render 应用震动")

# ============ 8. render 结束时重置震动 ============
# 在 render 函数最后添加 resetShake
content = content.replace(
    '// V5.0: 绘制粒子\ndrawParticles();',
    '''resetShake();  // V5.0: 重置震动变换
// V5.0: 绘制粒子
drawParticles();'''
)
print("✓ render 重置震动")

# ============ 9. 升级面板中的 offsetX/offsetY 修复 ============
content = content.replace(
    'const cx = rect.left + (tower.x + 0.5) * CS * (rect.width / W);',
    'const cx = rect.left + (tower.x + 0.5) * CS * (rect.width / W) + ox * (rect.width / W) - ox;'
)
content = content.replace(
    'const cy = rect.top + (tower.y + 0.5) * CS * (rect.height / H);',
    'const cy = rect.top + (tower.y + 0.5) * CS * (rect.height / H) + oy * (rect.height / H) - oy;'
)
print("✓ 升级面板位置修复")

# ============ 10. 修改 upgradeTower 中的 offsetX/offsetY ============
content = content.replace(
    'spawnP(px, py, \'#FFD700\', 8);',
    'spawnP(px, py, \'#FFD700\', 8);\n    spawnExplosion(ox + (x + 0.5) * CS, oy + (y + 0.5) * CS, \'#FFD700\');'
)
print("✓ 升级特效增强")

# ============ 保存 ============
with open(FILE, 'w', encoding='utf-8') as f:
    f.write(content)

print("\n✅ V5.0 第二阶段完成!")
print("文件大小: {} 字符".format(len(content)))
