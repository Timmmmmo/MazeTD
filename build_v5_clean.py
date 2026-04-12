"""
MazeTD V5.0 完整构建脚本
从 V4.1 构建，一次性完成所有修改
"""
import re

FILE = r'C:\Users\赵鸿杰\.openclaw\agents\game-studio\MazeTD-prototype\index.html'

with open(FILE, 'r', encoding='utf-8') as f:
    content = f.read()

print("开始 V5.0 构建...")

# ============ 1. 标题 ============
content = content.replace(
    '<title>迷宫塔防 V4.1 - 塔升级系统</title>',
    '<title>迷宫塔防 V5.0 - 腾讯品质</title>'
)
print("✓ 标题")

# ============ 2. 塔配置 ============
old_T_match = re.search(r'const T = \{[\s\S]*?\};\s*const N =', content)
if old_T_match:
    new_T = '''const T = {
  // V5.0 精简塔系统 - 5种核心塔
  archer: {c:'#4CAF50', d:18, r:4.0, s:35, $:50},
  ice: {c:'#03A9F4', d:6, r:3.2, s:45, $:70, slow:0.5},
  cannon: {c:'#F44336', d:35, r:2.8, s:80, $:110, aoe:1.3},
  poison: {c:'#8BC34A', d:5, r:2.8, s:30, $:85, dot:12, dotTime:5},
  thunder: {c:'#FFC107', d:25, r:3.0, s:45, $:130, chain:3},
  wall: {c:'#78909C', d:0, r:0, s:0, $:15, hp:600, maxHp:600, isWall:true}
};

const N ='''
    content = content.replace(old_T_match.group(0), new_T)
    print("✓ 塔配置")

# ============ 3. 塔名称 ============
content = content.replace(
    "const N = {\n  archer:'弓箭塔', cannon:'炮塔', ice:'冰冻塔', thunder:'雷电塔', poison:'毒塔',\n  blocker:'阻拦塔', teleport:'传送塔', trapwall:'陷阱墙', wall:'墙壁'\n};",
    "const N = {\n  archer:'弓箭塔', ice:'冰冻塔', cannon:'炮塔', poison:'毒塔', thunder:'雷电塔', wall:'墙壁'\n};"
)
print("✓ 塔名称")

# ============ 4. 敌人配置 ============
old_enemy_match = re.search(r'const ENEMY_TYPES = \{[\s\S]*?\};', content)
if old_enemy_match:
    new_enemy = '''const ENEMY_TYPES = {
  normal: {hp:50, color:'#8BC34A', size:0.40, gold:6, speed:0.45},
  fast: {hp:30, color:'#42A5F5', size:0.32, gold:8, speed:0.75},
  tank: {hp:180, color:'#78909C', size:0.52, gold:20, speed:0.22},
  destroyer: {hp:220, color:'#D32F2F', size:0.48, gold:25, speed:0.18, isDestroyer:true, atkDmg:100},
  scout: {hp:60, color:'#FFD700', size:0.36, gold:12, speed:0.55, isScout:true},
  shifter: {hp:120, color:'#9C27B0', size:0.42, gold:18, speed:0.30, isShifter:true}
};'''
    content = content.replace(old_enemy_match.group(0), new_enemy)
    print("✓ 敌人配置")

# ============ 5. 关卡配置 ============
old_levels_match = re.search(r'const LEVELS = \[[\s\S]*?\];', content)
if old_levels_match:
    new_levels = '''const LEVELS = [
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
];'''
    content = content.replace(old_levels_match.group(0), new_levels)
    print("✓ 关卡配置")

# ============ 6. 塔按钮 ============
old_buttons_match = re.search(r'<div id="towers">[\s\S]*?</div>\s*<div id="toolbar">', content)
if old_buttons_match:
    new_buttons = '''<div id="towers">
<div class="tower-btn selected" data-type="archer" onclick="pickTower('archer')"><canvas class="icon-cv" data-tower="archer" width="24" height="24"></canvas><span class="price">50</span><span class="name">弓箭塔</span></div>
<div class="tower-btn" data-type="ice" onclick="pickTower('ice')"><canvas class="icon-cv" data-tower="ice" width="24" height="24"></canvas><span class="price">70</span><span class="name">冰冻塔</span></div>
<div class="tower-btn" data-type="cannon" onclick="pickTower('cannon')"><canvas class="icon-cv" data-tower="cannon" width="24" height="24"></canvas><span class="price">110</span><span class="name">炮塔</span></div>
<div class="tower-btn" data-type="poison" onclick="pickTower('poison')"><canvas class="icon-cv" data-tower="poison" width="24" height="24"></canvas><span class="price">85</span><span class="name">毒塔</span></div>
<div class="tower-btn" data-type="thunder" onclick="pickTower('thunder')"><canvas class="icon-cv" data-tower="thunder" width="24" height="24"></canvas><span class="price">130</span><span class="name">雷电塔</span></div>
<div class="tower-btn" data-type="wall" onclick="pickTower('wall')"><canvas class="icon-cv" data-tower="wall" width="24" height="24"></canvas><span class="price">15</span><span class="name">墙壁</span></div>
</div>
<div id="toolbar">'''
    content = content.replace(old_buttons_match.group(0), new_buttons)
    print("✓ 塔按钮")

# ============ 7. 升级系统 ============
content = content.replace(
    'if (t.lv >= 3) {',
    'if (t.lv >= 5) {'
)
content = content.replace(
    "showTip('⚠️ 已达满级 (Lv.3)');",
    "showTip('⭐ 已达满级 (Lv.5)');"
)
print("✓ 升级上限 3→5")

# ============ 8. 保存 ============
with open(FILE, 'w', encoding='utf-8') as f:
    f.write(content)

print("\n✅ V5.0 构建完成!")
print(f"文件大小: {len(content)} 字符")
