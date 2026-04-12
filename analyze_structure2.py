"""
分析 V4.0 index.html 的代码结构
"""
import re

with open(r'C:\Users\赵鸿杰\.openclaw\agents\game-studio\MazeTD-prototype\index.html', 'r', encoding='utf-8') as f:
    content = f.read()

lines = content.split('\n')

# 找到关键位置
render_start = None
render_bg_start = None
draw_enemy_start = None

for i, line in enumerate(lines, 1):
    if 'function render()' in line and 'renderBackground' not in line:
        render_start = i
        print(f"render() 开始: 行 {i}")
    if 'function renderBackground' in line:
        render_bg_start = i
        print(f"renderBackground() 开始: 行 {i}")
    if 'function drawEnemyIcon' in line:
        draw_enemy_start = i
        print(f"drawEnemyIcon() 开始: 行 {i}")

# 检查 render 和 renderBackground 之间的代码
if render_start and render_bg_start:
    print(f"\n行 {render_start} 到 {render_bg_start} 之间的内容:")
    for i in range(render_start-1, min(render_bg_start, render_start + 25)):
        print(f"  {i+1}: {lines[i][:70]}")

# 检查 renderBackground 之后
if render_bg_start:
    print(f"\n行 {render_bg_start} 之后的内容 (前10行):")
    # 找到 renderBackground 的结束
    brace_count = 0
    render_bg_end = None
    for i in range(render_bg_start-1, len(lines)):
        line = lines[i]
        brace_count += line.count('{') - line.count('}')
        if brace_count == 0 and '{' in ''.join(lines[render_bg_start-1:i+1]):
            render_bg_end = i + 1
            break
    
    if render_bg_end:
        print(f"renderBackground() 结束: 行 {render_bg_end}")
        print(f"\nrenderBackground 结束后的代码 (行 {render_bg_end} 开始):")
        for i in range(render_bg_end-1, min(render_bg_end + 10, len(lines))):
            print(f"  {i+1}: {lines[i][:70]}")
