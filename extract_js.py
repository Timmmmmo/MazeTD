"""
精确找到语法错误位置
"""
import re

with open(r'C:\Users\赵鸿杰\.openclaw\agents\game-studio\MazeTD-prototype\index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 找到 script 内容
script_match = re.search(r'<script>(.*?)</script>', content, re.DOTALL)
if not script_match:
    print("未找到 script")
    exit(1)

script = script_match.group(1)

# 保存为独立的 JS 文件
js_file = r'C:\Users\赵鸿杰\.openclaw\agents\game-studio\MazeTD-prototype\extracted.js'
with open(js_file, 'w', encoding='utf-8') as f:
    f.write(script)

print(f"已提取 JS 到: {js_file}")
print(f"JS 文件大小: {len(script)} 字符")
print(f"行数: {script.count(chr(10)) + 1}")
