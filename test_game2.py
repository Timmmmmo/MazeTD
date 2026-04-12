"""
MazeTD 游戏测试 - 详细错误检测
"""
import sys
sys.path.insert(0, r'C:\Program Files\QClaw\resources\openclaw\config\skills\webapp-testing')

from playwright.sync_api import sync_playwright
import os

html_path = r"C:\Users\赵鸿杰\.openclaw\agents\game-studio\MazeTD-prototype\index.html"
file_url = f"file:///{html_path.replace(os.sep, '/')}"

errors = []
console_logs = []

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    
    page.on('console', lambda msg: console_logs.append(f"[{msg.type}] {msg.text}"))
    page.on('pageerror', lambda err: errors.append(str(err)))
    
    print(f"打开: {file_url}")
    page.goto(file_url)
    page.wait_for_load_state('networkidle')
    
    # 尝试手动调用 startGame
    try:
        result = page.evaluate('typeof startGame')
        print(f"startGame 类型: {result}")
        
        if result == 'function':
            print("startGame 已定义，尝试调用...")
            page.evaluate('startGame()')
            page.wait_for_timeout(500)
            
            game_visible = page.locator('#game').is_visible()
            print(f"游戏界面可见: {game_visible}")
            
            if game_visible:
                print("✅ 游戏启动成功!")
            else:
                print("❌ 游戏界面未显示")
        else:
            print(f"❌ startGame 类型异常: {result}")
    except Exception as e:
        print(f"执行错误: {e}")
    
    browser.close()

print("\n=== 控制台日志 ===")
for log in console_logs:
    print(log)

print("\n=== 页面错误 ===")
for e in errors:
    print(e)
