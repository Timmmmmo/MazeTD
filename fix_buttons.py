"""修复塔按钮"""
FILE = r'C:\Users\赵鸿杰\.openclaw\agents\game-studio\MazeTD-prototype\index.html'

with open(FILE, 'r', encoding='utf-8') as f:
    content = f.read()

# 直接替换整个 tower-panel
old_panel = '''<div id="tower-panel">
<div class="tower-btn selected" data-type="archer" onclick="pickTower('archer')"><canvas class="icon-cv" data-tower="archer" width="24" height="24"></canvas><span class="price">70</span><span class="name">弓箭</span></div>
<div class="tower-btn" data-type="cannon" onclick="pickTower('cannon')"><canvas class="icon-cv" data-tower="cannon" width="24" height="24"></canvas><span class="price">120</span><span class="name">炮塔</span></div>
<div class="tower-btn" data-type="ice" onclick="pickTower('ice')"><canvas class="icon-cv" data-tower="ice" width="24" height="24"></canvas><span class="price">100</span><span class="name">冰冻</span></div>
<div class="tower-btn" data-type="thunder" onclick="pickTower('thunder')"><canvas class="icon-cv" data-tower="thunder" width="24" height="24"></canvas><span class="price">150</span><span class="name">雷电</span></div>
<div class="tower-btn" data-type="poison" onclick="pickTower('poison')"><canvas class="icon-cv" data-tower="poison" width="24" height="24"></canvas><span class="price">90</span><span class="name">毒塔</span></div>
<div class="tower-btn new-tower" data-type="blocker" onclick="pickTower('blocker')"><canvas class="icon-cv" data-tower="blocker" width="24" height="24"></canvas><span class="price">150</span><span class="name">阻拦</span></div>
<div class="tower-btn new-tower" data-type="teleport" onclick="pickTower('teleport')"><canvas class="icon-cv" data-tower="teleport" width="24" height="24"></canvas><span class="price">200</span><span class="name">传送</span></div>
<div class="tower-btn new-tower" data-type="trapwall" onclick="pickTower('trapwall')"><canvas class="icon-cv" data-tower="trapwall" width="24" height="24"></canvas><span class="price">50</span><span class="name">陷阱墙</span></div>
<div class="tower-btn" data-type="wall" onclick="pickTower('wall')"><canvas class="icon-cv" data-tower="wall" width="24" height="24"></canvas><span class="price">10</span><span class="name">墙壁</span></div>
</div>'''

new_panel = '''<div id="tower-panel">
<div class="tower-btn selected" data-type="archer" onclick="pickTower('archer')"><canvas class="icon-cv" data-tower="archer" width="24" height="24"></canvas><span class="price">50</span><span class="name">弓箭</span></div>
<div class="tower-btn" data-type="ice" onclick="pickTower('ice')"><canvas class="icon-cv" data-tower="ice" width="24" height="24"></canvas><span class="price">70</span><span class="name">冰冻</span></div>
<div class="tower-btn" data-type="cannon" onclick="pickTower('cannon')"><canvas class="icon-cv" data-tower="cannon" width="24" height="24"></canvas><span class="price">110</span><span class="name">炮塔</span></div>
<div class="tower-btn" data-type="poison" onclick="pickTower('poison')"><canvas class="icon-cv" data-tower="poison" width="24" height="24"></canvas><span class="price">85</span><span class="name">毒塔</span></div>
<div class="tower-btn" data-type="thunder" onclick="pickTower('thunder')"><canvas class="icon-cv" data-tower="thunder" width="24" height="24"></canvas><span class="price">130</span><span class="name">雷电</span></div>
<div class="tower-btn" data-type="wall" onclick="pickTower('wall')"><canvas class="icon-cv" data-tower="wall" width="24" height="24"></canvas><span class="price">15</span><span class="name">墙壁</span></div>
</div>'''

if old_panel in content:
    content = content.replace(old_panel, new_panel)
    print("✓ 塔按钮替换成功")
else:
    print("⚠ 未找到旧塔按钮区域")

with open(FILE, 'w', encoding='utf-8') as f:
    f.write(content)
