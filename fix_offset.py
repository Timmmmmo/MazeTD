"""Fix offsetX/offsetY to ox/oy in renderBg"""
FILE = r'C:\Users\赵鸿杰\.openclaw\agents\game-studio\MazeTD-prototype\index.html'

with open(FILE, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace all offsetX/offsetY in renderBg function with ox/oy
import re
# Only replace inside renderBg function
match = re.search(r'(function renderBg\(c\) \{.*?)(function \w+\()', content, re.DOTALL)
if match:
    func_body = match.group(1)
    fixed_body = func_body.replace('offsetX', 'ox').replace('offsetY', 'oy')
    content = content.replace(func_body, fixed_body)
    print("✓ Fixed renderBg: offsetX/offsetY → ox/oy")
else:
    print("⚠ renderBg function not found")
    
with open(FILE, 'w', encoding='utf-8') as f:
    f.write(content)
