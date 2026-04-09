# -*- coding: utf-8 -*-
"""Build MazeTD V4.0 - 5大升级"""

import re

src = open("index.html", "r", encoding="utf-8").read()

# ─────────────────────────────────────────────
# 1. 替换 <title> 和 CSS 变量
# ─────────────────────────────────────────────
src = src.replace(
    "<title>🧩 迷宫挑战 V3.2 - 策略解谜</title>",
    "<title>🧩 迷宫挑战 V4.0</title>"
)

# 全新CSS配色方案 - 琥珀色暖调+毛玻璃质感
src = re.sub(
    r":root\{[^}]+\}",
    """:root{
  --gold:#FFB300;--gold-light:#FFD54F;--gold-dark:#FF8F00;
  --green:#69F0AE;--green-dark:#00E676;
  --red:#FF5252;--red-dark:#D50000;
  --cyan:#18FFFF;--cyan-dark:#00B8D4;
  --purple:#EA80FC;--purple-dark:#7C4DFF;
  --orange:#FFAB40;--orange-dark:#FF6D00;
  --blue:#448AFF;--blue-dark:#2962FF;
  --bg:#0D0D1A;--bg2:#131328;
  --card:#1E1E3A;--card2:#252550;
  --text:#E0E0E0;--text2:#9E9E9E;
  --border:rgba(255,179,0,0.25);
}""",
    src, flags=re.DOTALL
)

# 替换body背景
src = src.replace(
    "background:radial-gradient(ellipse at center,#1a1a3e 0%,#0d0d1f 50%,#050510 100%);",
    "background:var(--bg);"
)

# ─────────────────────────────────────────────
# 2. 顶部状态栏 - 新设计
# ─────────────────────────────────────────────
new_top = """/* ========== V4.0 顶部状态栏 ========== */
#top{
  flex-shrink:0;height:60px;
  background:rgba(19,19,40,0.92);
  backdrop-filter:blur(24px);
  display:flex;align-items:center;justify-content:space-between;
  padding:0 16px;
  border-bottom:1px solid var(--border);
  box-shadow:0 2px 20px rgba(0,0,0,0.4);
}
.stat{
  display:flex;flex-direction:column;align-items:center;gap:2px;
  font-size:11px;color:var(--text2);
  padding:6px 14px;border-radius:12px;
  background:rgba(255,255,255,0.04);
  border:1px solid rgba(255,255,255,0.06);
  min-width:60px;
}
.stat-icon{font-size:14px;margin-bottom:1px}
.stat b{
  color:var(--gold);font-size:18px;font-weight:700;
  text-shadow:0 0 12px rgba(255,179,0,0.4);
  line-height:1;
}
.stat-label{font-size:10px;color:var(--text2);letter-spacing:0.5px}

/* ========== V4.0 Canvas ========== */
#canvas-box{flex:1;min-height:0;position:relative;overflow:hidden;
  background:linear-gradient(180deg,#0a0a18 0%,#0d0d1a 100%);
}"""

src = re.sub(r"#top\{[^}]+\}.*?box-shadow:0 4px 20px rgba\(0,0,0,0\.5\);\}", new_top, src, flags=re.DOTALL)
src = re.sub(r"\.stat\{[^}]+\}.*?\}\n", "", src)
src = re.sub(r"\.stat b\{[^}]+\}.*?\}\n", "", src)
src = re.sub(r"#canvas-box\{[^}]+\}.*?\}\n", "#canvas-box{flex:1;min-height:0;position:relative;overflow:hidden}\n", src)

# ─────────────────────────────────────────────
# 3. 入口/出口标记
# ─────────────────────────────────────────────
src = re.sub(
    r"#entry-mark\{[^}]+\}",
    """#entry-mark,#exit-mark{
  position:absolute;left:50%;transform:translateX(-50%);
  padding:4px 14px;border-radius:16px;
  font-size:11px;font-weight:700;z-index:10;
  border:1.5px solid rgba(255,255,255,0.25);
  backdrop-filter:blur(8px);letter-spacing:1px;
}
#entry-mark{
  top:8px;
  background:rgba(0,230,118,0.18);
  color:var(--green);border-color:rgba(0,230,118,0.4);
  text-shadow:0 0 10px rgba(0,230,118,0.6);
}
#exit-mark{
  bottom:8px;
  background:rgba(255,23,68,0.18);
  color:var(--red);border-color:rgba(255,23,68,0.4);
  text-shadow:0 0 10px rgba(255,23,68,0.6);
}""", src
)
src = re.sub(r"#exit-mark\{[^}]+\}.*?\}\n", "", src)

# ─────────────────────────────────────────────
# 4. 提示框和波次消息
# ─────────────────────────────────────────────
src = re.sub(
    r"#tip\{[^}]+\}",
    """#tip{
  position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
  background:rgba(19,19,40,0.95);
  color:#fff;padding:16px 28px;border-radius:20px;font-size:15px;z-index:30;
  opacity:0;transition:opacity 0.3s;
  border:1px solid var(--border);
  box-shadow:0 8px 32px rgba(0,0,0,0.6);
  backdrop-filter:blur(16px);max-width:260px;text-align:center;
  line-height:1.6;
}""", src
)

src = re.sub(
    r"#wave-msg\{[^}]+\}.*?\}",
    """#wave-msg{
  position:absolute;top:38%;left:50%;transform:translate(-50%,-50%);
  font-size:38px;font-weight:800;color:var(--green);
  text-shadow:0 0 40px var(--green),0 0 80px var(--green);
  display:none;z-index:20;letter-spacing:2px;
  animation:wavPop 1.2s ease-out forwards;
}
@keyframes wavPop{
  0%{opacity:0;transform:translate(-50%,-50%) scale(0.3)}
  30%{opacity:1;transform:translate(-50%,-50%) scale(1.15)}
  60%{transform:translate(-50%,-50%) scale(0.95)}
  100%{opacity:0;transform:translate(-50%,-50%) scale(1)}
}""", src, flags=re.DOTALL
)

# ─────────────────────────────────────────────
# 5. 信息面板
# ─────────────────────────────────────────────
new_info = """/* ========== V4.0 信息面板 ========== */
#info,#ai-info{
  position:absolute;top:64px;
  background:rgba(19,19,40,0.88);
  backdrop-filter:blur(16px);
  border-radius:14px;padding:12px;font-size:12px;color:var(--text2);
  z-index:10;
  border:1px solid rgba(255,255,255,0.07);
  box-shadow:0 4px 24px rgba(0,0,0,0.35);
}
#info{right:10px;max-width:155px;border-left:2px solid var(--cyan)}
#ai-info{left:10px;max-width:145px;border-left:2px solid var(--purple)}
#info h4{color:var(--cyan);margin-bottom:8px;font-size:12px;font-weight:600;letter-spacing:0.5px}
#ai-info h4{color:var(--purple);margin-bottom:8px;font-size:12px;font-weight:600;letter-spacing:0.5px}
#info b,#ai-info b{color:var(--gold);font-weight:700}
.good{color:var(--green)!important}
.bad{color:var(--red)!important}
.info-item{margin:4px 0;display:flex;justify-content:space-between;align-items:center}"""

src = re.sub(r"#info\{[^}]+\}.*?\}\n", new_info + "\n", src, flags=re.DOTALL)

# ─────────────────────────────────────────────
# 6. 底部控制栏
# ─────────────────────────────────────────────
new_bottom = """/* ========== V4.0 底部控制栏 ========== */
#bottom{
  flex-shrink:0;
  background:rgba(13,13,26,0.96);
  border-top:1px solid var(--border);
  padding:10px;display:flex;flex-direction:column;gap:8px;
  padding-bottom:calc(10px + env(safe-area-inset-bottom,0px));
  backdrop-filter:blur(20px);
}
#current-tool{
  height:26px;
  background:rgba(255,255,255,0.04);
  border-radius:10px;
  display:flex;align-items:center;justify-content:center;
  font-size:12px;color:var(--text2);
  border:1px solid rgba(255,255,255,0.06);
  letter-spacing:0.5px;
}
#current-tool b{color:var(--gold)}"""

src = re.sub(r"#bottom\{[^}]+\}.*?\}\n", new_bottom + "\n", src, flags=re.DOTALL)

# ─────────────────────────────────────────────
# 7. 塔按钮 - 圆润质感
# ─────────────────────────────────────────────
new_tower_panel = """/* ========== V4.0 塔按钮 ========== */
#tower-panel{
  display:flex;gap:6px;justify-content:center;flex-wrap:wrap;
  padding:6px;background:rgba(255,255,255,0.03);border-radius:14px;
  border:1px solid rgba(255,255,255,0.05);
}
.tower-btn{
  width:46px;height:50px;border-radius:14px;
  border:1.5px solid rgba(255,255,255,0.1);
  background:rgba(30,30,64,0.8);
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  cursor:pointer;transition:all 0.2s;
  box-shadow:0 2px 8px rgba(0,0,0,0.3);
}
.tower-btn:hover{border-color:rgba(255,179,0,0.4);background:rgba(40,40,80,0.9)}
.tower-btn:active{transform:scale(0.94)}
.tower-btn.selected{
  border-color:var(--gold);
  box-shadow:0 0 16px rgba(255,179,0,0.35),0 2px 8px rgba(0,0,0,0.3);
  background:rgba(50,50,100,0.95);
}
.tower-btn .icon{font-size:17px;margin-bottom:1px}
.tower-btn .price{font-size:10px;color:var(--gold);font-weight:700}
.tower-btn .name{font-size:8px;color:var(--text2);margin-top:1px}
.tower-btn.disabled{opacity:0.28;pointer-events:none;filter:grayscale(0.5)}
.tower-btn.new-tower{border-color:rgba(234,128,252,0.5);box-shadow:0 0 10px rgba(234,128,252,0.2)}"""

src = re.sub(r"#tower-panel\{[^}]+\}.*?\}\n", new_tower_panel + "\n", src, flags=re.DOTALL)
src = re.sub(r"\.tower-btn\{[^}]+\}.*?\}\n", "", src, flags=re.DOTALL)
src = re.sub(r"\.tower-btn\.selected\{[^}]+\}.*?\}\n", "", src, flags=re.DOTALL)
src = re.sub(r"\.tower-btn\.disabled\{[^}]+\}.*?\}\n", "", src, flags=re.DOTALL)

# ─────────────────────────────────────────────
# 8. 工具按钮和操作按钮
# ─────────────────────────────────────────────
new_toolbar = """/* ========== V4.0 工具按钮 ========== */
#toolbar{display:flex;gap:8px;justify-content:center}
.tool-btn{
  width:56px;height:38px;border-radius:12px;
  border:1.5px solid rgba(255,255,255,0.1);
  background:rgba(30,30,64,0.7);
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  cursor:pointer;transition:all 0.2s;
  box-shadow:0 2px 8px rgba(0,0,0,0.25);
}
.tool-btn:hover{border-color:rgba(255,179,0,0.35)}
.tool-btn:active{transform:scale(0.94)}
.tool-btn.selected{
  border-color:var(--gold);
  box-shadow:0 0 12px rgba(255,179,0,0.25);
  background:rgba(50,50,100,0.9);
}
.tool-btn .icon{font-size:15px}
.tool-btn .name{font-size:10px;color:var(--text2)}
.tool-btn.del-btn.selected{border-color:var(--red);box-shadow:0 0 12px rgba(255,82,82,0.25)}

/* ========== V4.0 操作按钮 ========== */
#actions{display:flex;gap:8px;justify-content:center;flex-wrap:wrap}
.act-btn{
  padding:10px 22px;border-radius:20px;border:none;
  font-size:13px;font-weight:700;cursor:pointer;transition:all 0.2s;
  box-shadow:0 3px 12px rgba(0,0,0,0.3);
  letter-spacing:0.5px;
}
.act-btn:active{transform:scale(0.95)}
#btn-fight{
  background:linear-gradient(135deg,#00C853,#009624);
  color:#fff;box-shadow:0 3px 16px rgba(0,200,83,0.35);
}
#btn-fight.fighting{background:linear-gradient(135deg,#FF5252,#D50000);box-shadow:0 3px 16px rgba(255,82,82,0.35)}
#btn-undo{background:linear-gradient(135deg,#616161,#424242);color:#fff;box-shadow:0 3px 12px rgba(0,0,0,0.25)}
#btn-clear{background:linear-gradient(135deg,#37474F,#263238);color:#fff;box-shadow:0 3px 12px rgba(0,0,0,0.25)}
#btn-share{background:linear-gradient(135deg,#1565C0,#0D47A1);color:#fff;box-shadow:0 3px 12px rgba(21,101,192,0.3)}
#btn-help{background:linear-gradient(135deg,#7B1FA2,#4A148C);color:#fff;box-shadow:0 3px 12px rgba(123,31,162,0.3)}"""

src = re.sub(r"#toolbar\{[^}]+\}.*?\}\n", new_toolbar + "\n", src, flags=re.DOTALL)
src = re.sub(r"\.tool-btn\{[^}]+\}.*?\}\n", "", src, flags=re.DOTALL)
src = re.sub(r"\.tool-btn\.selected\{[^}]+\}.*?\}\n", "", src, flags=re.DOTALL)
src = re.sub(r"#actions\{[^}]+\}.*?\}\n", "", src, flags=re.DOTALL)
src = re.sub(r"\.act-btn\{[^}]+\}.*?\}\n", "", src, flags=re.DOTALL)

# ─────────────────────────────────────────────
# 9. 菜单 - 大改版
# ─────────────────────────────────────────────
new_menu = """/* ========== V4.0 菜单 ========== */
#menu{
  position:absolute;inset:0;
  background:linear-gradient(180deg,#0D0D1A 0%,#131328 50%,#0D0D1A 100%);
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  z-index:100;padding:24px;
}
.menu-header{
  text-align:center;margin-bottom:32px;
}
#menu h1{
  color:var(--gold);font-size:36px;margin-bottom:10px;
  text-shadow:0 0 40px rgba(255,179,0,0.5);
  font-weight:800;letter-spacing:2px;
}
#menu h2{
  color:var(--text2);font-size:15px;font-weight:400;letter-spacing:3px;
}
.menu-btn{
  width:220px;padding:16px;margin:8px 0;
  background:linear-gradient(135deg,#00C853,#009624);
  border:none;color:#fff;border-radius:24px;
  font-size:16px;font-weight:700;cursor:pointer;transition:all 0.2s;
  box-shadow:0 4px 20px rgba(0,200,83,0.35);letter-spacing:1px;
}
.menu-btn:hover{transform:translateY(-2px);box-shadow:0 6px 28px rgba(0,200,83,0.45)}
.menu-btn:active{transform:scale(0.97)}
.menu-btn.secondary{
  background:linear-gradient(135deg,#1E1E3A,#252550);
  border:1px solid var(--border);
  box-shadow:0 4px 16px rgba(0,0,0,0.3);
}
.menu-btn.secondary:hover{box-shadow:0 6px 24px rgba(255,179,0,0.2)}
.guide{
  margin-top:28px;padding:18px 22px;
  background:rgba(19,19,40,0.7);
  border-radius:18px;max-width:320px;text-align:left;
  border:1px solid rgba(255,255,255,0.07);
  backdrop-filter:blur(16px);
}
.guide h3{color:var(--cyan);font-size:14px;margin-bottom:12px;font-weight:600;letter-spacing:0.5px}
.guide p{color:var(--text2);font-size:13px;margin:8px 0;line-height:1.7}
.guide b{color:var(--gold)}
.guide .new{color:var(--purple)}

/* ========== V4.0 排行榜 ========== */
#leaderboard{
  margin-top:20px;padding:16px 20px;
  background:rgba(19,19,40,0.7);
  border-radius:18px;max-width:320px;width:100%;
  border:1px solid rgba(255,179,0,0.15);
  backdrop-filter:blur(16px);
}
#leaderboard h3{color:var(--gold);font-size:14px;font-weight:600;margin-bottom:12px;letter-spacing:0.5px}
.lb-row{display:flex;align-items:center;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.04)}
.lb-rank{width:24px;font-size:12px;color:var(--text2);font-weight:700;text-align:center}
.lb-rank.gold{color:#FFD700;text-shadow:0 0 8px rgba(255,215,0,0.6)}
.lb-rank.silver{color:#C0C0C0}
.lb-rank.bronze{color:#CD7F32}
.lb-name{flex:1;font-size:12px;color:var(--text);margin-left:10px}
.lb-score{font-size:12px;color:var(--gold);font-weight:700}"""

src = re.sub(r"#menu\{[^}]+\}.*?\}\n", new_menu + "\n", src, flags=re.DOTALL)
src = re.sub(r"\.menu-btn\{[^}]+\}.*?\}\n", "", src, flags=re.DOTALL)
src = re.sub(r"\.guide\{[^}]+\}.*?\}\n", "", src, flags=re.DOTALL)

# ─────────────────────────────────────────────
# 10. 结束画面
# ─────────────────────────────────────────────
new_over = """/* ========== V4.0 结束/完成画面 ========== */
#over,#level-complete{
  position:absolute;inset:0;
  background:rgba(13,13,26,0.96);
  display:none;flex-direction:column;align-items:center;justify-content:center;
  z-index:90;padding:24px;
  backdrop-filter:blur(24px);
}
#over h1{font-size:42px;color:var(--red);margin-bottom:20px;
  text-shadow:0 0 40px rgba(255,82,82,0.5);font-weight:800}
#level-complete h1{font-size:38px;color:var(--green);margin-bottom:16px;
  text-shadow:0 0 40px rgba(105,240,174,0.5);font-weight:800}
#over b,#level-complete b{color:var(--gold);font-size:18px;font-weight:700}
.score-display{
  background:rgba(255,255,255,0.04);
  border:1px solid rgba(255,255,255,0.07);
  border-radius:16px;padding:16px 32px;margin:8px 0;
  font-size:15px;color:var(--text2);display:flex;flex-direction:column;align-items:center;gap:8px;
}
.complete-actions{display:flex;flex-direction:column;gap:10px;margin-top:16px;align-items:center}

/* ========== V4.0 教学动画 ========== */
.tutorial-overlay{
  position:absolute;inset:0;z-index:50;
  pointer-events:none;
}
.tutorial-arrow{
  position:absolute;
  font-size:28px;
  animation:tutBounce 0.8s ease-in-out infinite;
  filter:drop-shadow(0 0 10px rgba(255,179,0,0.8));
}
@keyframes tutBounce{
  0%,100%{transform:translateY(0) scale(1)}
  50%{transform:translateY(-10px) scale(1.1)}
}
.tutorial-glow{
  position:absolute;border-radius:12px;
  border:2.5px solid var(--gold);
  box-shadow:0 0 20px rgba(255,179,0,0.4),inset 0 0 20px rgba(255,179,0,0.1);
  animation:tutGlow 1.5s ease-in-out infinite;
}
@keyframes tutGlow{
  0%,100%{box-shadow:0 0 20px rgba(255,179,0,0.4),inset 0 0 20px rgba(255,179,0,0.1)}
  50%{box-shadow:0 0 35px rgba(255,179,0,0.6),inset 0 0 30px rgba(255,179,0,0.15)}
}

/* ========== V4.0 音效按钮 ========== */
#sound-toggle{
  position:absolute;top:12px;right:12px;z-index:60;
  width:36px;height:36px;border-radius:50%;
  background:rgba(19,19,40,0.8);border:1px solid rgba(255,255,255,0.1);
  display:flex;align-items:center;justify-content:center;
  cursor:pointer;font-size:18px;
  backdrop-filter:blur(8px);transition:all 0.2s;
}
#sound-toggle:hover{background:rgba(30,30,64,0.9)}

/* ========== V4.0 进度条 ========== */
#level-progress{
  position:absolute;top:0;left:0;right:0;height:3px;z-index:60;
  background:rgba(255,255,255,0.05);
}
#level-progress-bar{
  height:100%;width:0%;background:linear-gradient(90deg,var(--gold),var(--orange));
  transition:width 0.3s;box-shadow:0 0 8px rgba(255,179,0,0.5)
}"""

src = re.sub(r"#over,#level-complete\{[^}]+\}.*?\}\n", new_over + "\n", src, flags=re.DOTALL)
src = re.sub(r"#over h1\{[^}]+\}.*?\}\n", "", src, flags=re.DOTALL)
src = re.sub(r"#level-complete h1\{[^}]+\}.*?\}\n", "", src, flags=re.DOTALL)

# ─────────────────────────────────────────────
# 11. HTML结构 - 菜单新增排行榜
# ─────────────────────────────────────────────
old_menu_end = """<div class="guide">
<h3>🆕 V3.2 新功能</h3>
<p><b class="new">求助模式</b> - 不会？让好友帮你布阵</p>
<p><b class="new">一键分享</b> - 炫耀你的战绩</p>
<p><b class="new">无尽模式</b> - 看你能走多远</p>
</div></div>"""

new_menu_end = """<div class="guide">
<h3>🆕 V4.0 新功能</h3>
<p><b class="new">🎵 音效BGM</b> - 沉浸式游戏体验</p>
<p><b class="new">📖 动画教学</b> - 箭头引导，上手更快</p>
<p><b class="new">🏆 排行榜</b> - 和好友一较高下</p>
</div>
<div id="leaderboard">
<h3>🏆 我的最佳战绩</h3>
<div id="lb-list"></div>
</div></div>"""

src = src.replace(old_menu_end, new_menu_end)

# 菜单开始按钮改为V4.0
src = src.replace("▶ 开始挑战", "▶ 开始挑战")
src = src.replace("💪 无尽模式", "💪 无尽模式")
src = src.replace("🎮 玩法说明", "📖 快速上手")

# ─────────────────────────────────────────────
# 12. 添加音效按钮到游戏界面
# ─────────────────────────────────────────────
old_canvas_box = '<div id="canvas-box">'
new_canvas_box = """<div id="canvas-box">
<div id="level-progress"><div id="level-progress-bar"></div></div>
<div id="sound-toggle" onclick="toggleSound()" title="音效">🔊</div>"""

src = src.replace(old_canvas_box, new_canvas_box)

# ─────────────────────────────────────────────
# 13. 操作按钮新增分享/求助
# ─────────────────────────────────────────────
src = src.replace(
    'onclick="undo()">↩️ 撤销</button>',
    'onclick="undo()">↩️</button>\n<button class="act-btn" id="btn-share" onclick="shareToFriends()">📤</button>\n<button class="act-btn" id="btn-help" onclick="showHelp()">💬</button>'
)

# ─────────────────────────────────────────────
# 14. JavaScript - 添加Web Audio音效系统
# ─────────────────────────────────────────────

audio_system = """
// ========== V4.0 音效系统 (Web Audio API) ==========
let audioCtx = null;
let soundEnabled = true;
let bgmSource = null;
let bgmGain = null;

// 音效上下文初始化
function initAudio() {
  if(audioCtx) return;
  try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) {}
}

// 生成音效 (type: shoot|hit|kill|build|coin|wave|gameover|levelup)
function playSound(type) {
  if(!soundEnabled || !audioCtx) return;
  if(audioCtx.state === 'suspended') audioCtx.resume();
  const t = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain); gain.connect(audioCtx.destination);
  const configs = {
    shoot:  {f:[400,500],d:0.05,t:0.12,g:0.15,fdb:'square'},
    hit:    {f:[200,150],d:0.04,t:0.10,g:0.12,fdb:'sawtooth'},
    kill:   {f:[600,900,1200],d:0.08,t:0.18,g:0.20,fdb:'square'},
    build:  {f:[300,450],d:0.06,t:0.15,g:0.18,fdb:'triangle'},
    coin:   {f:[800,1200],d:0.04,t:0.12,g:0.15,fdb:'sine'},
    wave:   {f:[400,500,600,800],d:0.1,t:0.4,g:0.18,fdb:'sine'},
    gameover:{f:[400,300,200,150],d:0.15,t:0.5,g:0.22,fdb:'sawtooth'},
    levelup:{f:[400,550,700,900],d:0.1,t:0.4,g:0.25,fdb:'sine'},
    tower:  {f:[350,600],d:0.05,t:0.14,g:0.16,fdb:'triangle'},
    wall:   {f:[250,350],d:0.04,t:0.10,g:0.12,fdb:'triangle'},
    click:  {f:[600],d:0.02,t:0.06,g:0.08,fdb:'sine'},
  };
  const cfg = configs[type] || configs.click;
  cfg.f.forEach((freq, i) => {
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = cfg.fdb;
    o.frequency.value = freq;
    o.connect(g); g.connect(audioCtx.destination);
    const start = t + i * cfg.d;
    g.gain.setValueAtTime(0, start);
    g.gain.linearRampToValueAtTime(cfg.g, start + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, start + cfg.t);
    o.start(start); o.stop(start + cfg.t);
  });
}

// BGM (简单旋律循环)
function startBGM() {
  if(!soundEnabled || !audioCtx || bgmSource) return;
  try {
    bgmGain = audioCtx.createGain();
    bgmGain.gain.value = 0.06;
    bgmGain.connect(audioCtx.destination);
    const melody = [392,440,494,523,587,659,587,523,494,440,392,330,294];
    const beatLen = 0.28;
    let offset = 0;
    function scheduleMelody() {
      melody.forEach((freq, i) => {
        const o = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        o.type = 'sine';
        o.frequency.value = freq;
        o.connect(g); g.connect(bgmGain);
        const t = audioCtx.currentTime + offset + i * beatLen;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.8, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, t + beatLen * 0.9);
        o.start(t); o.stop(t + beatLen);
      });
      offset += melody.length * beatLen;
      bgmTimer = setTimeout(scheduleMelody, melody.length * beatLen * 1000);
    }
    scheduleMelody();
  } catch(e) {}
}

let bgmTimer = null;
function stopBGM() {
  if(bgmTimer) { clearTimeout(bgmTimer); bgmTimer = null; }
  bgmSource = null;
}

function toggleSound() {
  initAudio();
  soundEnabled = !soundEnabled;
  document.getElementById('sound-toggle').textContent = soundEnabled ? '🔊' : '🔇';
  if(!soundEnabled) stopBGM();
  else if(fighting) startBGM();
  saveSoundPref();
}

function saveSoundPref() {
  try { localStorage.setItem('mazeTD_sound', JSON.stringify({soundEnabled})); } catch(e) {}
}
function loadSoundPref() {
  try {
    const d = JSON.parse(localStorage.getItem('mazeTD_sound'));
    if(d) soundEnabled = d.soundEnabled;
  } catch(e) {}
  document.getElementById('sound-toggle').textContent = soundEnabled ? '🔊' : '🔇';
}

// 扩展音效触发点 - 在关键位置调用 playSound()

"""

# 找到 "// ========== V3.2 无尽模式状态 ==========" 之前插入
src = src.replace(
    "// ========== V3.2 无尽模式状态 ==========\nlet endlessMode = false;",
    audio_system + "\n// ========== V3.2 无尽模式状态 ==========\nlet endlessMode = false;"
)

# ─────────────────────────────────────────────
# 15. 排行榜系统
# ─────────────────────────────────────────────
leaderboard_system = """
// ========== V4.0 排行榜系统 ==========
let leaderboard = [];
const MAX_LB = 20;

function getPlayerName() {
  try {
    const d = JSON.parse(localStorage.getItem('mazeTD_player'));
    return d && d.name || '';
  } catch(e) { return ''; }
}
function savePlayerName(name) {
  try { localStorage.setItem('mazeTD_player', JSON.stringify({name})); } catch(e) {}
}

function getLeaderboard() {
  try { return JSON.parse(localStorage.getItem('mazeTD_leaderboard')) || []; } catch(e) { return []; }
}

function saveToLeaderboard(wave, kills, level) {
  const name = getPlayerName() || '玩家';
  const entry = {
    name: name.length > 12 ? name.slice(0,12) : name,
    wave, kills, level: level || currentLevel?.id || '?',
    date: new Date().toLocaleDateString('zh-CN', {month:'2-digit',day:'2-digit'})
  };
  let lb = getLeaderboard();
  lb.push(entry);
  lb.sort((a,b) => b.wave - a.wave || b.kills - a.kills);
  lb = lb.slice(0, MAX_LB);
  try { localStorage.setItem('mazeTD_leaderboard', JSON.stringify(lb)); } catch(e) {}
  leaderboard = lb;
}

function renderLeaderboard() {
  const lb = getLeaderboard();
  const list = document.getElementById('lb-list');
  if(!list) return;
  if(lb.length === 0) {
    list.innerHTML = '<div style="color:#666;font-size:12px;text-align:center;padding:12px">暂无记录，开始游戏吧！</div>';
    return;
  }
  const top3 = ['gold','silver','bronze'];
  list.innerHTML = lb.slice(0,8).map((e,i) =>
    '<div class="lb-row">' +
    '<span class="lb-rank ' + top3[i] + '">' + (i+1) + '</span>' +
    '<span class="lb-name">' + e.name + '</span>' +
    '<span class="lb-score">波' + e.wave + '</span>' +
    '</div>'
  ).join('');
}

// 无尽模式结束后自动记入排行榜
"""

src = src.replace(
    "// ========== V3.2 无尽模式状态 ==========\nlet endlessMode = false;",
    leaderboard_system + "// ========== V3.2 无尽模式状态 ==========\nlet endlessMode = false;"
)

# ─────────────────────────────────────────────
# 16. 增强版存档系统
# ─────────────────────────────────────────────
# 替换原来的存档函数
old_save = """function saveProgress() {
  try {
    localStorage.setItem('mazeTD_v3', JSON.stringify({curLevelIdx, highScores: getHighScores()}));
  } catch(e) {}
}
function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem('mazeTD_v3'));
  } catch(e) { return null; }
}
function getHighScores() {
  try { return JSON.parse(localStorage.getItem('mazeTD_scores')) || {}; } catch(e) { return {}; }
}
function saveScore(levelId, stars) {
  const scores = getHighScores();
  if(!scores[levelId] || scores[levelId] < stars) {
    scores[levelId] = stars;
    try { localStorage.setItem('mazeTD_scores', JSON.stringify(scores)); } catch(e) {}
  }
}"""

new_save = """// V4.0 存档系统 - 完整版
function saveProgress() {
  const data = {
    curLevelIdx,
    gold, hp, kills,
    endlessMode, endlessWave, endlessKills,
    ts: Date.now()
  };
  try { localStorage.setItem('mazeTD_v3', JSON.stringify(data)); } catch(e) {}
}

function loadProgress() {
  try {
    const d = JSON.parse(localStorage.getItem('mazeTD_v3'));
    // 过期检查 (7天)
    if(d && d.ts && (Date.now() - d.ts) > 7*24*60*60*1000) {
      localStorage.removeItem('mazeTD_v3');
      return null;
    }
    return d;
  } catch(e) { return null; }
}

function getHighScores() {
  try { return JSON.parse(localStorage.getItem('mazeTD_scores')) || {}; } catch(e) { return {}; }
}

function saveScore(levelId, stars) {
  const scores = getHighScores();
  if(!scores[levelId] || scores[levelId] < stars) {
    scores[levelId] = stars;
    try { localStorage.setItem('mazeTD_scores', JSON.stringify(scores)); } catch(e) {}
  }
}

// V4.0 继续游戏
function continueGame() {
  const saved = loadProgress();
  if(!saved) { startGame(); return; }
  curLevelIdx = saved.curLevelIdx || 0;
  if(curLevelIdx < 0 || curLevelIdx >= LEVELS.length) curLevelIdx = 0;
  currentLevel = LEVELS[curLevelIdx];
  gold = saved.gold || currentLevel.startGold;
  hp = saved.hp || 20;
  kills = saved.kills || 0;
  endlessMode = saved.endlessMode || false;
  endlessWave = saved.endlessWave || 0;
  endlessKills = saved.endlessKills || 0;
  wave = 0;
  fighting = false;
  tutorialStep = 0;
  tutorialShown = true; // 跳过教学
  enemies = []; towers = []; bullets = []; parts = []; hist = [];

  document.getElementById('menu').style.display = 'none';
  document.getElementById('game').style.display = 'flex';
  document.getElementById('over').style.display = 'none';
  document.getElementById('level-complete').style.display = 'none';

  if(!inited) initCanvas();
  initGrid();
  updateUI();
  updateAIInfo();
  render();
  playSound('click');
  showTip('📖 欢迎回来！继续挑战吧~');
}"""

src = src.replace(old_save, new_save)

# ─────────────────────────────────────────────
# 17. 增强版教学系统 - 动画箭头
# ─────────────────────────────────────────────
new_tutorial = """// ========== V4.0 增强版教学系统 ==========
const TUTORIALS = {
  '1-1': [
    {text:'👆 点击网格放置墙壁，引导敌人路线', highlight:'canvas-box', dir:'right'},
    {text:'🏹 选择弓箭塔，攻击经过的敌人', highlight:'tower-archer', dir:'up'},
    {text:'⚔️ 点击「开战」，开始挑战！', highlight:'btn-fight', dir:'up'}
  ]
};

// 动画教学演示
let tutArrowEl = null, tutGlowEl = null;
let tutAnimTimer = null;
let tutAutoStep = 0; // 自动演示步骤索引

function showTutorial() {
  if(tutorialShown || !currentLevel) return;
  const steps = TUTORIALS[currentLevel.id];
  if(!steps || tutorialStep >= steps.length) { tutorialShown = true; return; }
  const step = steps[tutorialStep];
  showTip(step.text);
  highlightTutorialStep(step);
  tutorialStep++;
  if(tutorialStep >= steps.length) {
    tutorialShown = true;
    setTimeout(clearTutorialHighlight, 3000);
  }
}

function highlightTutorialStep(step) {
  clearTutorialHighlight();
  const canvasBox = document.getElementById('canvas-box');
  if(!canvasBox) return;

  tutArrowEl = document.createElement('div');
  tutArrowEl.className = 'tutorial-arrow';
  tutArrowEl.textContent = step.dir === 'right' ? '👉' : step.dir === 'left' ? '👈' : '👆';
  tutGlowEl = document.createElement('div');
  tutGlowEl.className = 'tutorial-glow';

  if(step.highlight === 'canvas-box') {
    tutGlowEl.style.cssText = 'left:35%;top:30%;width:80px;height:60px;';
    tutArrowEl.style.cssText = 'left:calc(35% + 90px);top:35%;';
    canvasBox.appendChild(tutArrowEl);
    canvasBox.appendChild(tutGlowEl);
  } else {
    const el = document.getElementById(step.highlight);
    if(!el) return;
    const rect = el.getBoundingClientRect();
    const boxRect = canvasBox.getBoundingClientRect();
    const x = rect.left - boxRect.left + rect.width/2 - 20;
    const y = rect.top - boxRect.top + (step.dir === 'up' ? -30 : rect.height + 5);
    tutArrowEl.style.cssText = 'left:' + x + 'px;top:' + y + 'px;';
    tutGlowEl.style.cssText = 'left:' + (rect.left - boxRect.left - 5) + 'px;top:' + (rect.top - boxRect.top - 5) + 'px;width:' + (rect.width + 10) + 'px;height:' + (rect.height + 10) + 'px;';
    canvasBox.appendChild(tutArrowEl);
    canvasBox.appendChild(tutGlowEl);
  }
}

function clearTutorialHighlight() {
  if(tutArrowEl) { tutArrowEl.remove(); tutArrowEl = null; }
  if(tutGlowEl) { tutGlowEl.remove(); tutGlowEl = null; }
  if(tutAnimTimer) { clearTimeout(tutAnimTimer); tutAnimTimer = null; }
}

// 自动演示教学 (关卡1-1第一步)
const TUTORIAL_DEMO = [
  {action:'click', x:4, y:5},   // 点击网格放置墙壁
  {action:'click', x:6, y:5},   // 再放一堵墙
  {action:'wait', ms:500},
  {action:'done'}
];

function playTutorialDemo() {
  if(tutAutoStep >= TUTORIAL_DEMO.length) return;
  const step = TUTORIAL_DEMO[tutAutoStep];
  tutAutoStep++;
  if(step.action === 'wait') {
    tutAnimTimer = setTimeout(playTutorialDemo, step.ms);
  } else if(step.action === 'click') {
    const gx = Math.floor((step.x - ox) / CS);
    const gy = Math.floor((step.y - oy) / CS);
    place(gx, gy);
    playSound('build');
    tutAnimTimer = setTimeout(playTutorialDemo, 400);
  } else if(step.action === 'done') {
    tutAnimTimer = setTimeout(() => tutAutoStep = 0, 2000);
  }
}
"""

src = src.replace(
    """// ========== 教学系统 ==========
const TUTORIALS = {
  '1-1': [
    {text:'👆 点击网格放置墙壁', highlight:'grid'},
    {text:'🏹 然后选择弓箭塔攻击敌人', highlight:'tower-archer'},
    {text:'⚔️ 点击"开战"开始!', highlight:'btn-fight'}
  ]
};

function showTutorial() {
  if(tutorialShown || !currentLevel) return;
  const steps = TUTORIALS[currentLevel.id];
  if(!steps || tutorialStep >= steps.length) { tutorialShown = true; return; }
  const step = steps[tutorialStep];
  showTip(step.text);
  tutorialStep++;
  if(tutorialStep >= steps.length) tutorialShown = true;
}""",
    new_tutorial
)

# ─────────────────────────────────────────────
# 18. 扩展音效触发点
# ─────────────────────────────────────────────

# 在tower价格变化处添加音效
src = src.replace(
    "  gold -= t.$;",
    "  gold -= t.$; playSound('build');"
)

# 在敌人击杀处添加音效
src = src.replace(
    "gold += e.gold || 5;",
    "gold += e.gold || 5; playSound('coin');"
)

# 在gameOver调用处添加音效
src = src.replace(
    "function gameOver() {\n  fighting = false;",
    "function gameOver() {\n  fighting = false;\n  stopBGM(); playSound('gameover');"
)

# 在levelComplete添加音效
src = src.replace(
    "document.getElementById('level-complete').style.display = 'flex';",
    "document.getElementById('level-complete').style.display = 'flex';\n  playSound('levelup');"
)

# 在开战添加BGM
src = src.replace(
    "  fighting = true;",
    "  fighting = true;\n  initAudio(); startBGM();"
)

# 在波次开始显示消息
src = src.replace(
    "function spawnWave() {",
    "function spawnWave() {\n  playSound('wave');"
)

# 在点击按钮处添加音效
src = src.replace(
    "function undo() {",
    "function undo() {\n  playSound('click');"
)

# ─────────────────────────────────────────────
# 19. 增强gameOver记录排行榜
# ─────────────────────────────────────────────
src = src.replace(
    """  document.getElementById('over').style.display = 'flex';
}""",
    """  saveToLeaderboard(wave, kills, currentLevel?.id);
  document.getElementById('over').style.display = 'flex';
}"""
)

# 无尽模式结束也记录
src = src.replace(
    """    endlessMode = false;
    document.getElementById('final-level').textContent = '无尽模式';""",
    """    endlessMode = false;
    saveToLeaderboard(finalWave, finalKills, '无尽');
    document.getElementById('final-level').textContent = '无尽模式';"""
)

# ─────────────────────────────────────────────
# 20. 进度条更新
# ─────────────────────────────────────────────
src = src.replace(
    "function updateUI() {\n  document.getElementById('show-gold').textContent = gold;",
    """function updateUI() {
  document.getElementById('show-gold').textContent = gold;"""
)

# 添加波次进度条
src = src.replace(
    "document.getElementById('show-level').textContent = currentLevel ? currentLevel.id : '1-1';\n}",
    """document.getElementById('show-level').textContent = currentLevel ? currentLevel.id : '1-1';
  // V4.0 进度条
  const prog = document.getElementById('level-progress-bar');
  if(prog && currentLevel) {
    const total = fighting ? currentLevel.waves : 0;
    prog.style.width = total > 0 ? Math.round(wave / total * 100) + '%' : '0%';
  }
}"""
)

# ─────────────────────────────────────────────
# 21. 菜单增加继续游戏 + 排行榜
# ─────────────────────────────────────────────
src = src.replace(
    '<button class="menu-btn" onclick="startGame()">▶ 开始挑战</button>',
    '<button class="menu-btn" onclick="startGame()">▶ 开始挑战</button>\n<button class="menu-btn secondary" onclick="continueGame()">📂 继续游戏</button>'
)

# 菜单打开时刷新排行榜
src = src.replace(
    """function showMenu() {
  document.getElementById('menu').style.display = 'flex';""",
    """function showMenu() {
  document.getElementById('menu').style.display = 'flex';
  renderLeaderboard();"""
)

# 初始化时加载音效设置
src = src.replace(
    """// ========== V3.2 对象池 ==========
const pools = {""",
    """loadSoundPref();
// ========== V3.2 对象池 ==========
const pools = {"""
)

# ─────────────────────────────────────────────
# 22. DOMContentLoaded 初始化音频
# ─────────────────────────────────────────────
src = src.replace(
    "document.addEventListener('DOMContentLoaded', () => setTimeout(initTowerIcons, 100))",
    "document.addEventListener('DOMContentLoaded', () => { setTimeout(initTowerIcons, 100); initAudio(); })"
)

# ─────────────────────────────────────────────
# 23. 渲染优化 - 敌人击杀特效更明显
# ─────────────────────────────────────────────
src = src.replace(
    "// 粒子效果\n    for(let i=0;i<C.POOL_PARTICLE;i++) {",
    "// 击杀粒子特效 (增强版)\n    const c = e.color || '#8BC34A';\n    for(let i=0;i<12;i++) {\n      const ang = Math.random()*Math.PI*2;\n      const spd = 1+Math.random()*2;\n      spawnPart(e.x, e.y, Math.cos(ang)*spd, Math.sin(ang)*spd, c);\n    }"
)

# ─────────────────────────────────────────────
# 写入
# ─────────────────────────────────────────────
open("index_v4.html", "w", encoding="utf-8").write(src)
print("Done! V4.0 generated as index_v4.html")
print(f"File size: {len(src)} bytes")
