"""
分析 V4.0 index.html 的代码结构
"""
import re

with open(r'C:\Users\赵鸿杰\.openclaw\agents\game-studio\MazeTD-prototype\index.html', 'r', encoding='utf-8') as f:
    content = f.read()

lines = content.split('\n')

# 找到 render 函数
render_start = None
render_end = None
render_bg_start = None
render_bg_end = None
orphan_code_start = None
orphan_code_end = None

for i, line in enumerate(lines, 1):
    if 'function render()' in line and 'renderBackground' not in line:
        render_start = i
    if render_bg_start is None and 'function renderBackground' in line:
        render_bg_start = i
    if render_bg_start and 'function drawEnemyIcon' in line:
        orphan_code_end = i - 1
        break

# 找到 render 函数的结束（在 renderBackground 之前）
if render_start and render_bg_start:
    for i in range(render_start, render_bg_start):
        line = lines[i-1]
        if line.strip() == '}' and i < render_bg_start - 1:
            # 检查下一行是否是注释或新函数
            next_line = lines[i] if i < len(lines) else ''
            if next_line.strip().startswith('//') or 'function' in next_line:
                render_end = i
                break

print(f"render() 函数开始: {render_start}")
print(f"render() 函数结束: {render_end}")
print(f"renderBackground() 开始: {render_bg_start}")
print(f"孤儿代码范围: {render_end + 1} - {orphan_code_end}")

# 检查孤儿代码的内容
if render_end and orphan_code_end:
    print(f"\n孤儿代码前几行:")
    for i in range(render_end, min(render_end + 5, len(lines))):
        print(f"  {i+1}: {lines[i][:60]}")
