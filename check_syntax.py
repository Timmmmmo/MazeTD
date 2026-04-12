"""
检查 index.html 中的 JavaScript 语法问题
"""
import re

with open(r'C:\Users\赵鸿杰\.openclaw\agents\game-studio\MazeTD-prototype\index.html', 'r', encoding='utf-8') as f:
    content = f.read()

lines = content.split('\n')
in_script = False
script_start = 0

for i, line in enumerate(lines, 1):
    if '<script>' in line:
        in_script = True
        script_start = i
    if '</script>' in line:
        in_script = False
    
    if in_script:
        # 检查转义问题
        if "\\'" in line:
            # 检查是否是 '===\\'' 这样的错误模式
            if "===\\'" in line or "==\\'" in line:
                print(f"行 {i}: 发现错误的转义 '===\\'")
                print(f"  内容: {line[:120]}")
        
        # 检查 step.dir 相关的代码
        if 'step.dir' in line:
            print(f"行 {i}: step.dir 相关")
            print(f"  内容: {line[:200]}")

# 提取 script 内容并用 Node.js 验证
script_match = re.search(r'<script>(.*?)</script>', content, re.DOTALL)
if script_match:
    script_content = script_match.group(1)
    print(f"\nScript 长度: {len(script_content)} 字符")
    
    # 保存为临时文件
    with open('/tmp/test_script.js', 'w', encoding='utf-8') as f:
        f.write(script_content)
    print("已保存到 /tmp/test_script.js")
