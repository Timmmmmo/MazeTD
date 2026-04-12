"""
更详细的语法检查 - 找到不匹配的括号
"""
import re

with open(r'C:\Users\赵鸿杰\.openclaw\agents\game-studio\MazeTD-prototype\index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 提取 script 内容
script_match = re.search(r'<script>(.*?)</script>', content, re.DOTALL)
if not script_match:
    print("未找到 script 标签")
    exit(1)

script = script_match.group(1)
lines = script.split('\n')

# 检查括号匹配
stack = []
for i, line in enumerate(lines, 1):
    for j, ch in enumerate(line):
        if ch in '({[':
            stack.append((ch, i, j))
        elif ch in ')}]':
            if not stack:
                print(f"错误: 行 {i} 列 {j} - 多余的 '{ch}'")
                print(f"  内容: {line[:80]}")
                continue
            open_ch, open_line, open_col = stack.pop()
            matching = {'(': ')', '{': '}', '[': ']'}
            if matching[open_ch] != ch:
                print(f"错误: 行 {i} 列 {j} - '{ch}' 不匹配 '{open_ch}' (开始于行 {open_line})")
                print(f"  内容: {line[:80]}")

if stack:
    print(f"\n未闭合的括号:")
    for ch, line, col in stack[-5:]:
        print(f"  '{ch}' 在行 {line} 列 {col}")
else:
    print("括号匹配正常")

# 检查函数定义
func_pattern = re.compile(r'function\s+(\w+)\s*\(')
funcs = func_pattern.findall(script)
print(f"\n定义的函数: {len(funcs)} 个")
print(f"前10个: {funcs[:10]}")

# 检查 startGame 函数
if 'startGame' in funcs:
    print("\n✅ startGame 函数已定义")
else:
    print("\n❌ startGame 函数未定义!")
