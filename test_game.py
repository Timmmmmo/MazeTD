"""
MazeTD 游戏测试 - 检查开始游戏按钮
"""
import sys
sys.path.insert(0, r'C:\Program Files\QClaw\resources\openclaw\config\skills\webapp-testing')

from playwright.sync_api import sync_playwright
import os

# 本地HTML文件路径
html_path = r"C:\Users\赵鸿杰\.openclaw\agents\game-studio\MazeTD-prototype\index.html"
file_url = f"file:///{html_path.replace(os.sep, '/')}"

errors = []
console_logs = []

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    
    # 收集控制台日志
    page.on('console', lambda msg: console_logs.append(f"[{msg.type}] {msg.text}"))
    page.on('pageerror', lambda err: errors.append(str(err)))
    
    print(f"打开游戏: {file_url}")
    page.goto(file_url)
    page.wait_for_load_state('networkidle')
    
    # 截图 - 初始菜单
    page.screenshot(path='/tmp/mazetd_menu.png')
    print("截图保存: /tmp/mazetd_menu.png")
    
    # 检查菜单是否显示
    menu = page.locator('#menu')
    game = page.locator('#game')
    
    menu_visible = menu.is_visible()
    game_visible = game.is_visible()
    print(f"菜单可见: {menu_visible}")
    print(f"游戏可见: {game_visible}")
    
    # 查找开始游戏按钮
    start_btn = page.locator('button:has-text("开始挑战")')
    btn_count = start_btn.count()
    print(f"找到 '开始挑战' 按钮: {btn_count} 个")
    
    if btn_count > 0:
        # 点击开始游戏
        print("点击 '开始挑战'...")
        start_btn.first.click()
        page.wait_for_timeout(1000)
        
        # 检查状态变化
        menu_visible_after = menu.is_visible()
        game_visible_after = game.is_visible()
        print(f"点击后 - 菜单可见: {menu_visible_after}")
        print(f"点击后 - 游戏可见: {game_visible_after}")
        
        # 截图 - 点击后
        page.screenshot(path='/tmp/mazetd_after_click.png')
        print("截图保存: /tmp/mazetd_after_click.png")
        
        # 检查Canvas是否存在
        cv = page.locator('#cv')
        cv_visible = cv.is_visible()
        print(f"Canvas可见: {cv_visible}")
        
        # 检查关卡显示
        level_el = page.locator('#show-level')
        if level_el.is_visible():
            level_text = level_el.text_content()
            print(f"当前关卡: {level_text}")
    
    browser.close()

print("\n=== 控制台日志 ===")
for log in console_logs[-20:]:
    print(log)

print("\n=== 错误 ===")
if errors:
    for e in errors:
        print(e)
else:
    print("无错误")
