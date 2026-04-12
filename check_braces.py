"""检查 index.html 中的括号匹配"""
FILE = r'C:\Users\赵鸿杰\.openclaw\agents\game-studio\MazeTD-prototype\index.html'

with open(FILE, 'r', encoding='utf-8') as f:
    content = f.read()

# 提取 <script> 部分
script_start = content.find('<script>')
script_end = content.find('</script>')
if script_start == -1 or script_end == -1:
    print("未找到 script 标签")
    exit(1)

js = content[script_start + 8:script_end]

# 检查括号匹配
brace_count = 0
paren_count = 0
bracket_count = 0
errors = []

for i, char in enumerate(js):
    line_num = js[:i].count('\n') + 1
    
    if char == '{':
        brace_count += 1
    elif char == '}':
        brace_count -= 1
        if brace_count < 0:
            errors.append(f"行 {line_num}: 多余的 }}")
            brace_count = 0
    elif char == '(':
        paren_count += 1
    elif char == ')':
        paren_count -= 1
        if paren_count < 0:
            errors.append(f"行 {line_num}: 多余的 )")
            paren_count = 0
    elif char == '[':
        bracket_count += 1
    elif char == ']':
        bracket_count -= 1
        if bracket_count < 0:
            errors.append(f"行 {line_num}: 多余的 ]")
            bracket_count = 0

print(f"最终括号计数: {{ {brace_count}, ( {paren_count}, [ {bracket_count}")
if errors:
    print("\n错误:")
    for e in errors[:10]:
        print(f"  {e}")
else:
    print("括号匹配正常")

# 找出 render 函数的位置
render_start = js.find('function render() {')
if render_start != -1:
    # 找到 render 函数开始后的下一个 function
    next_func = js.find('\nfunction ', render_start + 10)
    render_section = js[render_start:next_func]
    print(f"\nrender 函数长度: {len(render_section)} 字符")
    print(f"render 函数行数: {render_section.count(chr(10)) + 1}")
    
    # 检查 render 函数内的 { }
    render_brace = 0
    render_end_line = 0
    for i, char in enumerate(render_section):
        if char == '{':
            render_brace += 1
        elif char == '}':
            render_brace -= 1
            if render_brace == 0:
                render_end_line = render_section[:i].count('\n') + 1
                break
    
    print(f"render 函数结束于相对行: {render_end_line}")
