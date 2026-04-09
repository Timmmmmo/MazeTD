// MazeTD V4.0 Builder - Fixed version
const fs = require('fs');
let src = fs.readFileSync('index.html', 'utf8');
const orig = fs.readFileSync('index.html', 'utf8');
console.log('Building V4.0 from original. Size:', src.length);

// ─── Helper ───
function replaceAll(needle, haystack) {
  if (src.indexOf(needle) === -1) {
    console.log('MISSING:', JSON.stringify(needle.slice(0, 80)));
    return false;
  }
  src = src.split(needle).join(haystack);
  return true;
}

// ─── 1. TITLE ───
replaceAll(
  '<title>🧩 迷宫挑战 V3.2 - 策略解谜</title>',
  '<title>🧩 迷宫挑战 V4.0</title>'
);

// ─── 2. CSS :root variables ───
replaceAll(
  ':root{\n  --gold:#FFD700;--gold-light:#FFE55C;--gold-dark:#B8860B;\n  --green:#00E676;--green-dark:#00C853;\n  --red:#FF1744;--red-dark:#D50000;\n  --cyan:#00E5FF;--cyan-dark:#00B8D4;\n  --purple:#E040FB;--purple-dark:#AA00FF;\n  --orange:#FF9100;--orange-dark:#FF6D00;\n  --blue:#2979FF;--blue-dark:#2962FF;\n}',
  ':root{\n  --gold:#FFB300;--gold-light:#FFD54F;--gold-dark:#FF8F00;\n  --green:#69F0AE;--green-dark:#00E676;\n  --red:#FF5252;--red-dark:#D50000;\n  --cyan:#18FFFF;--cyan-dark:#00B8D4;\n  --purple:#EA80FC;--purple-dark:#7C4DFF;\n  --orange:#FFAB40;--orange-dark:#FF6D00;\n  --blue:#448AFF;--blue-dark:#2962FF;\n  --bg:#0D0D1A;--bg2:#131328;\n  --card:#1E1E3A;--card2:#252550;\n  --text:#E0E0E0;--text2:#9E9E9E;\n  --border:rgba(255,179,0,0.25);\n}'
);

// ─── 3. Body background ───
replaceAll(
  'background:radial-gradient(ellipse at center,#1a1a3e 0%,#0d0d1f 50%,#050510 100%);\n  font-family:-apple-system,BlinkMacSystemFont,',
  'background:#0D0D1A;\n  font-family:-apple-system,BlinkMacSystemFont,'
);

// ─── 4. #top (HUD) ───
replaceAll(
  '#top{\n  flex-shrink:0;height:56px;\n  background:linear-gradient(180deg,rgba(30,30,60,0.95) 0%,rgba(20,20,40,0.9) 100%);\n  backdrop-filter:blur(20px);\n  display:flex;align-items:center;justify-content:space-around;\n  border-bottom:2px solid rgba(255,215,0,0.4);\n  box-shadow:0 4px 20px rgba(0,0,0,0.5);\n}\n.stat{\n  display:flex;align-items:center;gap:6px;\n  font-size:13px;color:#aaa;\n  background:rgba(255,255,255,0.05);\n  padding:6px 12px;border-radius:20px;\n  border:1px solid rgba(255,255,255,0.1);\n}\n.stat b{\n  color:var(--gold);font-size:20px;\n  text-shadow:0 0 10px rgba(255,215,0,0.5);\n}',
  '#top{\n  flex-shrink:0;height:60px;\n  background:rgba(19,19,40,0.92);\n  backdrop-filter:blur(24px);\n  display:flex;align-items:center;justify-content:space-between;\n  padding:0 12px;\n  border-bottom:1px solid rgba(255,179,0,0.25);\n  box-shadow:0 2px 20px rgba(0,0,0,0.4);\n}\n.stat{\n  display:flex;flex-direction:column;align-items:center;gap:1px;\n  font-size:10px;color:#9E9E9E;\n  padding:5px 12px;border-radius:12px;\n  background:rgba(255,255,255,0.04);\n  border:1px solid rgba(255,255,255,0.06);\n  min-width:58px;\n}\n.stat b{\n  color:#FFB300;font-size:17px;font-weight:700;\n  text-shadow:0 0 10px rgba(255,179,0,0.4);\n}'
);

// ─── 5. #canvas-box ───
replaceAll(
  '#canvas-box{flex:1;min-height:0;position:relative;overflow:hidden}\ncanvas{display:block;width:100%;height:100%}',
  '#canvas-box{flex:1;min-height:0;position:relative;overflow:hidden;background:linear-gradient(180deg,#0a0a18,#0d0d1a)}\ncanvas{display:block;width:100%;height:100%}'
);

// ─── 6. Entry/exit marks ───
replaceAll(
  '#entry-mark{\n  top:10px;\n  background:linear-gradient(135deg,var(--green-dark),var(--green));\n  color:#fff;\n  box-shadow:0 0 20px rgba(0,230,118,0.5),0 4px 15px rgba(0,0,0,0.4);\n}\n#exit-mark{\n  bottom:10px;\n  background:linear-gradient(135deg,var(--red-dark),var(--red));\n  color:#fff;\n  box-shadow:0 0 20px rgba(255,23,68,0.5),0 4px 15px rgba(0,0,0,0.4);\n}',
  '#entry-mark,#exit-mark{\n  position:absolute;left:50%;transform:translateX(-50%);\n  padding:3px 12px;border-radius:14px;\n  font-size:10px;font-weight:700;z-index:10;\n  border:1.5px solid rgba(255,255,255,0.2);\n  backdrop-filter:blur(8px);letter-spacing:1px;\n}\n#entry-mark{\n  top:8px;\n  background:rgba(0,230,118,0.15);\n  color:#69F0AE;border-color:rgba(0,230,118,0.4);\n  text-shadow:0 0 8px rgba(0,230,118,0.6);\n}\n#exit-mark{\n  bottom:8px;\n  background:rgba(255,23,68,0.15);\n  color:#FF5252;border-color:rgba(255,23,68,0.4);\n  text-shadow:0 0 8px rgba(255,23,68,0.6);\n}'
);

// ─── 7. #tip ───
replaceAll(
  '#tip{\n  position:absolute;top:45%;left:50%;transform:translate(-50%,-50%);\n  background:linear-gradient(135deg,rgba(0,0,0,0.95),rgba(20,20,40,0.95));\n  color:#fff;padding:14px 24px;border-radius:16px;font-size:15px;z-index:30;\n  opacity:0;transition:opacity 0.3s;\n  border:1px solid rgba(255,215,0,0.3);\n  box-shadow:0 8px 32px rgba(0,0,0,0.5);\n}\n#tip.show{opacity:1}',
  '#tip{\n  position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);\n  background:rgba(19,19,40,0.96);color:#fff;padding:14px 24px;\n  border-radius:18px;font-size:14px;z-index:30;\n  opacity:0;transition:opacity 0.3s;\n  border:1px solid rgba(255,179,0,0.25);\n  box-shadow:0 8px 32px rgba(0,0,0,0.6);\n  backdrop-filter:blur(16px);max-width:250px;text-align:center;line-height:1.6;\n}\n#tip.show{opacity:1}'
);

// ─── 8. #wave-msg ───
replaceAll(
  '#wave-msg{\n  position:absolute;top:40%;left:50%;transform:translate(-50%,-50%);\n  font-size:36px;font-weight:bold;color:var(--green);\n  text-shadow:0 0 40px var(--green),0 0 80px var(--green);\n  display:none;z-index:20;\n  animation:pulse 1s ease-in-out infinite;\n}\n@keyframes pulse{\n  0%,100%{transform:translate(-50%,-50%) scale(1)}\n  50%{transform:translate(-50%,-50%) scale(1.05)}\n}',
  '#wave-msg{\n  position:absolute;top:38%;left:50%;transform:translate(-50%,-50%);\n  font-size:36px;font-weight:800;color:#69F0AE;\n  text-shadow:0 0 40px #69F0AE,0 0 80px #69F0AE;\n  display:none;z-index:20;letter-spacing:2px;\n  animation:wavPop 1.2s ease-out forwards;\n}\n@keyframes wavPop{\n  0%{opacity:0;transform:translate(-50%,-50%) scale(0.3)}\n  30%{opacity:1;transform:translate(-50%,-50%) scale(1.15)}\n  60%{transform:translate(-50%,-50%) scale(0.95)}\n  100%{opacity:0;transform:translate(-50%,-50%) scale(1)}\n}'
);

// ─── 9. Info panels ───
replaceAll(
  '#info{right:10px;max-width:150px;border-left:3px solid var(--cyan)}\n#ai-info{left:10px;max-width:140px;border-left:3px solid var(--purple)}',
  '#info{right:8px;max-width:150px;border-left:2px solid #18FFFF}\n#ai-info{left:8px;max-width:140px;border-left:2px solid #EA80FC}'
);
replaceAll(
  '#info h4{color:var(--cyan);margin-bottom:6px;font-size:13px;font-weight:600}\n#ai-info h4{color:var(--purple);margin-bottom:6px;font-size:13px;font-weight:600}',
  '#info h4{color:#18FFFF;margin-bottom:6px;font-size:11px;font-weight:600;letter-spacing:0.5px}\n#ai-info h4{color:#EA80FC;margin-bottom:6px;font-size:11px;font-weight:600;letter-spacing:0.5px}'
);

// ─── 10. #bottom ───
replaceAll(
  '#bottom{\n  flex-shrink:0;\n  background:linear-gradient(180deg,rgba(30,30,60,0.95) 0%,rgba(15,15,30,0.95) 100%);\n  border-top:2px solid rgba(255,215,0,0.3);\n  padding:10px;display:flex;flex-direction:column;gap:8px;\n  padding-bottom:calc(10px + env(safe-area-inset-bottom,0px));\n  box-shadow:0 -4px 20px rgba(0,0,0,0.3);\n}\n#current-tool{\n  height:28px;\n  background:rgba(0,0,0,0.4);\n  border-radius:10px;\n  display:flex;align-items:center;justify-content:center;\n  font-size:13px;color:#888;\n  border:1px solid rgba(255,255,255,0.1);\n}\n#current-tool b{color:var(--gold);font-weight:600}',
  '#bottom{\n  flex-shrink:0;\n  background:rgba(13,13,26,0.96);\n  border-top:1px solid rgba(255,179,0,0.25);\n  padding:8px;display:flex;flex-direction:column;gap:6px;\n  padding-bottom:calc(8px + env(safe-area-inset-bottom,0px));\n  backdrop-filter:blur(20px);\n}\n#current-tool{\n  height:26px;\n  background:rgba(255,255,255,0.04);\n  border-radius:10px;\n  display:flex;align-items:center;justify-content:center;\n  font-size:12px;color:#9E9E9E;\n  border:1px solid rgba(255,255,255,0.06);\n  letter-spacing:0.5px;\n}\n#current-tool b{color:#FFB300;font-weight:700}'
);

// ─── 11. Tower buttons ───
replaceAll(
  '#tower-panel{\n  display:flex;gap:8px;justify-content:center;flex-wrap:wrap;\n  padding:6px;background:rgba(0,0,0,0.3);border-radius:12px;\n}\n.tower-btn{\n  width:48px;height:52px;border-radius:12px;\n  border:2px solid rgba(255,255,255,0.1);\n  background:linear-gradient(145deg,#252550,#1a1a3a);\n  display:flex;flex-direction:column;align-items:center;justify-content:center;\n  cursor:pointer;transition:all 0.2s;\n  box-shadow:0 4px 8px rgba(0,0,0,0.3),inset 0 1px 0 rgba(255,255,255,0.1);\n}\n.tower-btn:active{transform:translateY(2px)}\n.tower-btn.selected{\n  border-color:var(--gold);\n  box-shadow:0 0 20px rgba(255,215,0,0.4),0 4px 8px rgba(0,0,0,0.3);\n  background:linear-gradient(145deg,#3a3a6e,#252550);\n}\n.tower-btn .icon{font-size:18px}\n.tower-btn .price{font-size:11px;color:var(--gold);font-weight:bold}\n.tower-btn .name{font-size:9px;color:#888}\n.tower-btn.disabled{opacity:0.3;pointer-events:none}\n.tower-btn.new-tower{border-color:var(--purple);box-shadow:0 0 10px rgba(224,64,251,0.3)}',
  '#tower-panel{\n  display:flex;gap:5px;justify-content:center;flex-wrap:wrap;\n  padding:5px;background:rgba(255,255,255,0.03);border-radius:14px;\n  border:1px solid rgba(255,255,255,0.05);\n}\n.tower-btn{\n  width:45px;height:50px;border-radius:14px;\n  border:1.5px solid rgba(255,255,255,0.1);\n  background:rgba(30,30,64,0.8);\n  display:flex;flex-direction:column;align-items:center;justify-content:center;\n  cursor:pointer;transition:all 0.2s;\n  box-shadow:0 2px 8px rgba(0,0,0,0.3);\n}\n.tower-btn:hover{border-color:rgba(255,179,0,0.4);background:rgba(40,40,80,0.9)}\n.tower-btn:active{transform:scale(0.94)}\n.tower-btn.selected{\n  border-color:#FFB300;\n  box-shadow:0 0 16px rgba(255,179,0,0.35);\n  background:rgba(50,50,100,0.95);\n}\n.tower-btn .icon{font-size:16px}\n.tower-btn .price{font-size:10px;color:#FFB300;font-weight:700}\n.tower-btn .name{font-size:8px;color:#9E9E9E;margin-top:1px}\n.tower-btn.disabled{opacity:0.28;pointer-events:none}\n.tower-btn.new-tower{border-color:rgba(234,128,252,0.5);box-shadow:0 0 10px rgba(234,128,252,0.2)}'
);

// ─── 12. Toolbar ───
replaceAll(
  '#toolbar{display:flex;gap:10px;justify-content:center}\n.tool-btn{\n  width:60px;height:42px;border-radius:10px;\n  border:2px solid rgba(255,255,255,0.1);\n  background:linear-gradient(145deg,#252550,#1a1a3a);\n  display:flex;flex-direction:column;align-items:center;justify-content:center;\n  cursor:pointer;transition:all 0.2s;\n  box-shadow:0 4px 8px rgba(0,0,0,0.3);\n}\n.tool-btn.selected{\n  border-color:var(--gold);\n  box-shadow:0 0 15px rgba(255,215,0,0.3);\n}\n.tool-btn .icon{font-size:16px}\n.tool-btn .name{font-size:11px;color:#aaa}',
  '#toolbar{display:flex;gap:8px;justify-content:center}\n.tool-btn{\n  width:54px;height:36px;border-radius:12px;\n  border:1.5px solid rgba(255,255,255,0.1);\n  background:rgba(30,30,64,0.7);\n  display:flex;flex-direction:column;align-items:center;justify-content:center;\n  cursor:pointer;transition:all 0.2s;\n  box-shadow:0 2px 8px rgba(0,0,0,0.25);\n}\n.tool-btn:hover{border-color:rgba(255,179,0,0.35)}\n.tool-btn:active{transform:scale(0.94)}\n.tool-btn.selected{\n  border-color:#FFB300;\n  box-shadow:0 0 12px rgba(255,179,0,0.25);\n  background:rgba(50,50,100,0.9);\n}\n.tool-btn .icon{font-size:14px}\n.tool-btn .name{font-size:10px;color:#9E9E9E}\n.tool-btn.del-btn.selected{border-color:#FF5252;box-shadow:0 0 12px rgba(255,82,82,0.25)}'
);

// ─── 13. Action buttons ───
replaceAll(
  '#actions{display:flex;gap:10px;justify-content:center}\n.act-btn{\n  padding:12px 28px;border-radius:24px;border:none;\n  font-size:14px;font-weight:bold;cursor:pointer;transition:all 0.2s;\n  box-shadow:0 4px 15px rgba(0,0,0,0.3);\n}\n.act-btn:active{transform:translateY(2px)}\n#btn-fight{\n  background:linear-gradient(135deg,var(--green),var(--green-dark));\n  color:#fff;\n  box-shadow:0 4px 20px rgba(0,230,118,0.4);\n}\n#btn-undo{\n  background:linear-gradient(135deg,var(--orange),var(--orange-dark));\n  color:#fff;\n  box-shadow:0 4px 20px rgba(255,145,0,0.4);\n}\n#btn-clear{\n  background:linear-gradient(135deg,#546E7A,#37474F);\n  color:#fff;\n}',
  '#actions{display:flex;gap:8px;justify-content:center;flex-wrap:wrap}\n.act-btn{\n  padding:9px 20px;border-radius:20px;border:none;\n  font-size:13px;font-weight:700;cursor:pointer;transition:all 0.2s;\n  box-shadow:0 3px 12px rgba(0,0,0,0.3);letter-spacing:0.5px;\n}\n.act-btn:active{transform:scale(0.95)}\n#btn-fight{\n  background:linear-gradient(135deg,#00C853,#009624);color:#fff;\n  box-shadow:0 3px 16px rgba(0,200,83,0.35);\n}\n#btn-fight.fighting{background:linear-gradient(135deg,#FF5252,#D50000);box-shadow:0 3px 16px rgba(255,82,82,0.35)}\n#btn-undo{background:linear-gradient(135deg,#546E7A,#37474F);color:#fff}\n#btn-clear{background:linear-gradient(135deg,#37474F,#263238);color:#fff}\n#btn-share{background:linear-gradient(135deg,#1565C0,#0D47A1);color:#fff}\n#btn-help{background:linear-gradient(135deg,#7B1FA2,#4A148C);color:#fff}'
);

// ─── 14. Menu ───
replaceAll(
  '#menu{\n  position:absolute;inset:0;\n  background:radial-gradient(ellipse at center,#2a2a5e 0%,#151530 50%,#0a0a1a 100%);\n  display:flex;flex-direction:column;align-items:center;justify-content:center;\n  z-index:100;padding:24px;\n}\n#menu h1{\n  color:var(--cyan);font-size:32px;margin-bottom:8px;\n  text-shadow:0 0 30px rgba(0,229,255,0.5);\n  font-weight:700;\n}\n#menu h2{\n  color:#888;font-size:16px;margin-bottom:28px;font-weight:400;\n  letter-spacing:2px;\n}',
  '#menu{\n  position:absolute;inset:0;\n  background:linear-gradient(180deg,#0D0D1A,#131328 50%,#0D0D1A);\n  display:flex;flex-direction:column;align-items:center;justify-content:center;\n  z-index:100;padding:24px;\n}\n#menu h1{\n  color:#FFB300;font-size:34px;margin-bottom:8px;\n  text-shadow:0 0 40px rgba(255,179,0,0.5);\n  font-weight:800;letter-spacing:2px;\n}\n#menu h2{\n  color:#9E9E9E;font-size:14px;margin-bottom:24px;font-weight:400;letter-spacing:3px;\n}'
);
replaceAll(
  '.guide{\n  margin-top:28px;padding:18px;\n  background:rgba(0,0,0,0.4);\n  border-radius:16px;max-width:320px;text-align:left;\n  border:1px solid rgba(255,255,255,0.1);\n  backdrop-filter:blur(10px);\n}\n.guide h3{color:var(--cyan);font-size:15px;margin-bottom:12px;font-weight:600}\n.guide p{color:#bbb;font-size:13px;margin:8px 0;line-height:1.7}\n.guide b{color:var(--gold)}\n.guide .new{color:var(--purple)}',
  '.guide{\n  margin-top:20px;padding:16px 20px;\n  background:rgba(19,19,40,0.7);\n  border-radius:18px;max-width:320px;text-align:left;\n  border:1px solid rgba(255,255,255,0.07);\n  backdrop-filter:blur(16px);\n}\n.guide h3{color:#18FFFF;font-size:13px;margin-bottom:10px;font-weight:600;letter-spacing:0.5px}\n.guide p{color:#9E9E9E;font-size:13px;margin:7px 0;line-height:1.7}\n.guide b{color:#FFB300}\n.guide .new{color:#EA80FC}'
);

// ─── 15. Leaderboard CSS ───
replaceAll(
  '<!-- 菜单HTML -->',
  '#leaderboard{margin-top:16px;padding:14px 18px;background:rgba(19,19,40,0.7);border-radius:18px;max-width:320px;width:100%;border:1px solid rgba(255,179,0,0.12);backdrop-filter:blur(16px)}\n#leaderboard h3{color:#FFB300;font-size:13px;font-weight:600;margin-bottom:10px}\n.lb-row{display:flex;align-items:center;padding:5px 0;border-bottom:1px solid rgba(255,255,255,0.04)}\n.lb-rank{width:20px;font-size:11px;color:#9E9E9E;font-weight:700;text-align:center}\n.lb-rank.top1{color:#FFD700;text-shadow:0 0 8px rgba(255,215,0,0.6)}\n.lb-rank.top2{color:#C0C0C0}\n.lb-rank.top3{color:#CD7F32}\n.lb-name{flex:1;font-size:12px;color:#E0E0E0;margin-left:10px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\n.lb-score{font-size:12px;color:#FFB300;font-weight:700}\n\n/* 菜单HTML --> */'
);
replaceAll(
  '/* 菜单HTML --> */',
  '<!-- 菜单HTML -->'
);

// ─── 16. Menu HTML: leaderboard + continue button ───
replaceAll(
  '<button class="menu-btn" onclick="startGame()">▶ 开始挑战</button>\n<div class="guide">',
  '<button class="menu-btn" onclick="startGame()">▶ 开始挑战</button>\n<button class="menu-btn secondary" onclick="continueGame()">📂 继续游戏</button>\n<div class="guide">'
);
replaceAll(
  '<h3>🆕 V3.2 新功能</h3>\n<p><b class="new">求助模式</b> - 不会？让好友帮你布阵</p>\n<p><b class="new">一键分享</b> - 炫耀你的战绩</p>\n<p><b class="new">无尽模式</b> - 看你能走多远</p>',
  '<h3>🆕 V4.0 新功能</h3>\n<p><b class="new">🎵 音效BGM</b> - 沉浸式游戏体验</p>\n<p><b class="new">📖 动画教学</b> - 箭头引导，上手更快</p>\n<p><b class="new">🏆 排行榜</b> - 和好友一较高下</p>'
);
replaceAll(
  '<h3>🎮 玩法说明</h3>',
  '<h3>📖 快速上手</h3>'
);
replaceAll(
  '<p>在迷宫中建造防御，阻止怪物到达终点</p>\n<p>建造墙壁可以改变怪物路线</p>\n<p>不同防御塔有不同效果，合理搭配！</p>\n<p><b>⚠️ 注意</b>：有些怪物会<b class="bad">攻击墙壁</b>！</p>',
  '<p>建造墙壁引导敌人路线，再用防御塔消灭它们！</p>\n<p>不同防御塔有不同效果，合理搭配才能通关！</p>\n<p><b>⚠️ 注意</b>：有些怪物会<b class="bad">攻击墙壁</b>！</p>'
);
// Add leaderboard HTML before </div> in menu
replaceAll(
  '</div>\n</div>\n\n</body>',
  '<div id="leaderboard"><h3>🏆 我的最佳战绩</h3><div id="lb-list"></div></div>\n</div>\n</body>'
);

// ─── 17. Sound toggle + progress bar in canvas-box ───
replaceAll(
  '<div id="canvas-box">',
  '<div id="canvas-box">\n<div id="level-progress"><div id="level-progress-bar"></div></div>\n<div id="sound-toggle" onclick="toggleSound()" title="音效">🔊</div>'
);
replaceAll(
  '<button class="act-btn" id="btn-undo" onclick="undo()">↩️ 撤销</button>',
  '<button class="act-btn" id="btn-undo" onclick="undo()">↩️ 撤销</button>\n<button class="act-btn" id="btn-share" onclick="shareToFriends()">📤 炫耀</button>\n<button class="act-btn" id="btn-help" onclick="showHelp()">💬 求助</button>'
);

// ─── 18. Tutorial animation CSS ───
replaceAll(
  '/* 入口出口标记 */',
  '.tutorial-arrow{position:absolute;font-size:26px;animation:tutBounce 0.8s ease-in-out infinite;filter:drop-shadow(0 0 10px rgba(255,179,0,0.8))}\n@keyframes tutBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px) scale(1.1)}}\n.tutorial-glow{position:absolute;border-radius:12px;border:2.5px solid #FFB300;box-shadow:0 0 20px rgba(255,179,0,0.4),inset 0 0 20px rgba(255,179,0,0.1);animation:tutGlow 1.5s ease-in-out infinite;pointer-events:none;z-index:50}\n@keyframes tutGlow{0%,100%{box-shadow:0 0 20px rgba(255,179,0,0.4),inset 0 0 20px rgba(255,179,0,0.1)}50%{box-shadow:0 0 35px rgba(255,179,0,0.6),inset 0 0 30px rgba(255,179,0,0.15)}}\n#sound-toggle{position:absolute;top:10px;right:10px;z-index:60;width:34px;height:34px;border-radius:50%;background:rgba(19,19,40,0.85);border:1px solid rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:17px;backdrop-filter:blur(8px);transition:all 0.2s}\n#sound-toggle:hover{background:rgba(30,30,64,0.95)}\n#level-progress{position:absolute;top:0;left:0;right:0;height:3px;z-index:60;background:rgba(255,255,255,0.05)}\n#level-progress-bar{height:100%;width:0%;background:linear-gradient(90deg,#FFB300,#FFAB40);transition:width 0.3s;box-shadow:0 0 8px rgba(255,179,0,0.5)}\n\n/* 入口出口标记 */'
);

// ─── 19. Audio system ───
const audioSystem = `
// V4.0 音效系统 (Web Audio API - 无需外部文件)
let audioCtx = null;
let soundEnabled = true;
let bgmTimer = null;

function initAudio() {
  if(audioCtx) return;
  try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) {}
}

function playSound(type) {
  if(!soundEnabled || !audioCtx) return;
  if(audioCtx.state === 'suspended') audioCtx.resume();
  const t = audioCtx.currentTime;
  const configs = {
    shoot:    {f:[420,520],d:0.05,t:0.11,g:0.12,type:'square'},
    hit:      {f:[200,160],d:0.04,t:0.09,g:0.10,type:'sawtooth'},
    kill:     {f:[620,900,1200],d:0.08,t:0.18,g:0.18,type:'square'},
    build:    {f:[300,480],d:0.06,t:0.14,g:0.15,type:'triangle'},
    coin:     {f:[820,1200],d:0.04,t:0.12,g:0.14,type:'sine'},
    wave:     {f:[400,500,620,800],d:0.12,t:0.45,g:0.16,type:'sine'},
    gameover: {f:[400,300,200,150],d:0.15,t:0.55,g:0.20,type:'sawtooth'},
    levelup:  {f:[400,550,700,900],d:0.1,t:0.4,g:0.22,type:'sine'},
    tower:    {f:[360,620],d:0.05,t:0.13,g:0.14,type:'triangle'},
    click:    {f:[600],d:0.02,t:0.06,g:0.07,type:'sine'},
  };
  const cfg = configs[type] || configs.click;
  cfg.f.forEach((freq, i) => {
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = cfg.type;
    o.frequency.value = freq;
    o.connect(g); g.connect(audioCtx.destination);
    const start = t + i * cfg.d;
    g.gain.setValueAtTime(0, start);
    g.gain.linearRampToValueAtTime(cfg.g, start + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, start + cfg.t);
    o.start(start); o.stop(start + cfg.t + 0.01);
  });
}

function startBGM() {
  if(!soundEnabled || !audioCtx) return;
  stopBGM();
  const melody = [392,440,494,523,587,659,587,523,494,440,392,330,294,262];
  const beatLen = 0.26;
  let offset = 0;
  function schedule() {
    melody.forEach((freq, i) => {
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      const master = audioCtx.createGain();
      master.gain.value = 0.055;
      o.type = 'sine';
      o.frequency.value = freq;
      o.connect(g); g.connect(master); master.connect(audioCtx.destination);
      const st = audioCtx.currentTime + offset + i * beatLen;
      g.gain.setValueAtTime(0, st);
      g.gain.linearRampToValueAtTime(0.7, st + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, st + beatLen * 0.85);
      o.start(st); o.stop(st + beatLen);
    });
    offset += melody.length * beatLen;
    bgmTimer = setTimeout(schedule, melody.length * beatLen * 1000);
  }
  schedule();
}

function stopBGM() {
  if(bgmTimer) { clearTimeout(bgmTimer); bgmTimer = null; }
}

function toggleSound() {
  initAudio();
  soundEnabled = !soundEnabled;
  const el = document.getElementById('sound-toggle');
  if(el) el.textContent = soundEnabled ? '🔊' : '🔇';
  if(!soundEnabled) stopBGM();
  else if(fighting) startBGM();
  try { localStorage.setItem('mazeTD_sound', JSON.stringify({soundEnabled})); } catch(e) {}
}

function loadSoundPref() {
  try {
    const d = JSON.parse(localStorage.getItem('mazeTD_sound'));
    if(d && d.soundEnabled !== undefined) soundEnabled = d.soundEnabled;
  } catch(e) {}
  const el = document.getElementById('sound-toggle');
  if(el) el.textContent = soundEnabled ? '🔊' : '🔇';
}
`;

replaceAll(
  '// ========== V3.2 无尽模式状态 ==========\nlet endlessMode = false;',
  audioSystem + '\n// ========== V3.2 无尽模式状态 ==========\nlet endlessMode = false;'
);

// ─── 20. Leaderboard system ───
const leaderboardSystem = `
// V4.0 排行榜
let leaderboard = [];
function getPlayerName() {
  try { const d = JSON.parse(localStorage.getItem('mazeTD_player')); return d && d.name || ''; } catch(e) { return ''; }
}
function savePlayerName(name) {
  try { localStorage.setItem('mazeTD_player', JSON.stringify({name})); } catch(e) {}
}
function getLeaderboard() {
  try { return JSON.parse(localStorage.getItem('mazeTD_leaderboard')) || []; } catch(e) { return []; }
}
function saveToLeaderboard(wave, kills, level) {
  const name = getPlayerName() || '匿名玩家';
  const entry = {
    name: name.length > 10 ? name.slice(0,10) : name,
    wave, kills, level: level || '?',
    date: new Date().toLocaleDateString('zh-CN',{month:'2-digit',day:'2-digit'})
  };
  let lb = getLeaderboard();
  lb.push(entry);
  lb.sort((a,b) => b.wave - a.wave || b.kills - a.kills);
  lb = lb.slice(0, 20);
  try { localStorage.setItem('mazeTD_leaderboard', JSON.stringify(lb)); } catch(e) {}
  leaderboard = lb;
}
function renderLeaderboard() {
  const lb = getLeaderboard();
  const list = document.getElementById('lb-list');
  if(!list) return;
  if(lb.length === 0) {
    list.innerHTML = '<div style="color:#555;font-size:11px;text-align:center;padding:10px">暂无记录，开始游戏创造历史！</div>';
    return;
  }
  const medals = ['top1','top2','top3'];
  list.innerHTML = lb.slice(0,8).map((e,i) =>
    '<div class="lb-row">' +
    '<span class="lb-rank ' + medals[i] + '">' + (i+1) + '</span>' +
    '<span class="lb-name">' + e.name + '</span>' +
    '<span class="lb-score">波' + e.wave + '</span>' +
    '</div>'
  ).join('');
}
`;

replaceAll(
  '// ========== V3.2 无尽模式状态 ==========\nlet endlessMode = false;',
  leaderboardSystem + '\n// ========== V3.2 无尽模式状态 ==========\nlet endlessMode = false;'
);

// ─── 21. Enhanced save/load ───
const newSaveSystem = `// V4.0 存档系统
function saveProgress() {
  const data = {
    curLevelIdx, gold, hp, kills,
    endlessMode, endlessWave, endlessKills,
    towers: towers.map(t => ({x:t.x,y:t.y,type:t.type})),
    ts: Date.now()
  };
  try { localStorage.setItem('mazeTD_v3', JSON.stringify(data)); } catch(e) {}
}
function loadProgress() {
  try {
    const d = JSON.parse(localStorage.getItem('mazeTD_v3'));
    if(d && d.ts && (Date.now() - d.ts) > 7*24*60*60*1000) {
      localStorage.removeItem('mazeTD_v3'); return null;
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
  wave = 0; fighting = false; tutorialStep = 0; tutorialShown = true;
  enemies = []; bullets = []; parts = [];
  if(saved.towers) {
    saved.towers.forEach(t => {
      if(grid[t.y] && grid[t.y][t.x] === 0) {
        const type = T[t.type];
        if(type && gold >= type.$) {
          gold -= type.$;
          grid[t.y][t.x] = {type:t.type};
          towers.push({x:t.x, y:t.y, type:t.type});
        }
      }
    });
  }
  document.getElementById('menu').style.display = 'none';
  document.getElementById('game').style.display = 'flex';
  document.getElementById('over').style.display = 'none';
  document.getElementById('level-complete').style.display = 'none';
  if(!inited) initCanvas();
  initGrid();
  updateUI();
  updateAIInfo();
  render();
  playSound('levelup');
  showTip('📖 欢迎回来！继续挑战吧~');
}
`;

replaceAll(
  '// ========== 存档系统 ==========\nfunction saveProgress() {\n  try {\n    localStorage.setItem(\'mazeTD_v3\', JSON.stringify({curLevelIdx, highScores: getHighScores()}));\n  } catch(e) {}\n}\nfunction loadProgress() {\n  try {\n    return JSON.parse(localStorage.getItem(\'mazeTD_v3\'));\n  } catch(e) { return null; }\n}\nfunction getHighScores() {\n  try { return JSON.parse(localStorage.getItem(\'mazeTD_scores\')) || {}; } catch(e) { return {}; }\n}\nfunction saveScore(levelId, stars) {\n  const scores = getHighScores();\n  if(!scores[levelId] || scores[levelId] < stars) {\n    scores[levelId] = stars;\n    try { localStorage.setItem(\'mazeTD_scores\', JSON.stringify(scores)); } catch(e) {}\n  }\n}',
  newSaveSystem
);

// ─── 22. Enhanced tutorial system ───
const newTutorial = `// V4.0 增强版教学系统
const TUTORIALS = {
  '1-1': [
    {text:'👆 点击网格放置墙壁，引导怪物走更长的路', highlight:'cv', dir:'right'},
    {text:'🏹 选择弓箭塔，攻击经过的敌人', highlight:'tower-archer', dir:'up'},
    {text:'⚔️ 点击「开战」，开始挑战！', highlight:'btn-fight', dir:'up'}
  ]
};
let tutArrowEl = null, tutGlowEl = null;

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
    setTimeout(clearTutorialHighlight, 4000);
  }
}

function highlightTutorialStep(step) {
  clearTutorialHighlight();
  const canvasBox = document.getElementById('canvas-box');
  if(!canvasBox) return;
  tutArrowEl = document.createElement('div');
  tutArrowEl.className = 'tutorial-arrow';
  tutArrowEl.textContent = step.dir === 'right' ? '👉' : '👆';
  tutGlowEl = document.createElement('div');
  tutGlowEl.className = 'tutorial-glow';
  if(step.highlight === 'cv') {
    const box = canvasBox.getBoundingClientRect();
    tutGlowEl.style.cssText = 'left:' + (box.width*0.3) + 'px;top:' + (box.height*0.3) + 'px;width:80px;height:60px;';
    tutArrowEl.style.cssText = 'left:' + (box.width*0.3+90) + 'px;top:' + (box.height*0.3+20) + 'px;';
  } else {
    const el = document.getElementById(step.highlight);
    if(!el) return;
    const rect = el.getBoundingClientRect();
    const boxRect = canvasBox.getBoundingClientRect();
    tutGlowEl.style.cssText = 'left:' + (rect.left-boxRect.left-4) + 'px;top:' + (rect.top-boxRect.top-4) + 'px;width:' + (rect.width+8) + 'px;height:' + (rect.height+8) + 'px;';
    tutArrowEl.style.cssText = 'left:' + (rect.left-boxRect.left+rect.width/2-14) + 'px;top:' + (rect.top-boxRect.top+(step.dir===\\'up\\'?-35:rect.height+5)) + 'px;';
  }
  canvasBox.appendChild(tutArrowEl);
  canvasBox.appendChild(tutGlowEl);
}

function clearTutorialHighlight() {
  if(tutArrowEl) { tutArrowEl.remove(); tutArrowEl = null; }
  if(tutGlowEl) { tutGlowEl.remove(); tutGlowEl = null; }
}
`;

replaceAll(
  '// ========== 教学系统 ==========\nconst TUTORIALS = {\n  \'1-1\': [\n    {text:\'👆 点击网格放置墙壁\', highlight:\'grid\'},\n    {text:\'🏹 然后选择弓箭塔攻击敌人\', highlight:\'tower-archer\'},\n    {text:\'⚔️ 点击"开战"开始!\', highlight:\'btn-fight\'}\n  ]\n};\n\nfunction showTutorial() {\n  if(tutorialShown || !currentLevel) return;\n  const steps = TUTORIALS[currentLevel.id];\n  if(!steps || tutorialStep >= steps.length) { tutorialShown = true; return; }\n  const step = steps[tutorialStep];\n  showTip(step.text);\n  tutorialStep++;\n  if(tutorialStep >= steps.length) tutorialShown = true;\n}',
  newTutorial
);

// ─── 23. Sound triggers ───
replaceAll(
  'gold -= t.$;\n  hist.push({',
  'gold -= t.$; playSound(\'build\');\n  hist.push({'
);
replaceAll(
  'gold += e.gold || 5;\n  kills++;',
  'gold += e.gold || 5; kills++; playSound(\'coin\');'
);
replaceAll(
  'function gameOver() {\n  fighting = false;',
  'function gameOver() {\n  fighting = false;\n  stopBGM(); playSound(\'gameover\');'
);
replaceAll(
  "document.getElementById('level-complete').style.display = 'flex';",
  "document.getElementById('level-complete').style.display = 'flex';\n  playSound('levelup');"
);
replaceAll(
  'fighting = true;\n  wave = 1;\n  spawnWave();',
  'fighting = true;\n  wave = 1;\n  initAudio(); startBGM();\n  playSound(\'wave\');\n  spawnWave();'
);
replaceAll(
  'function undo() {',
  'function undo() { playSound(\'click\');'
);
replaceAll(
  'function toggleBattle() {',
  'function toggleBattle() { playSound(\'click\');'
);
replaceAll(
  'cur = name; updateUI(); render();',
  'cur = name; playSound(\'click\'); updateUI(); render();'
);

// Save to leaderboard
replaceAll(
  "document.getElementById('over').style.display = 'flex';\n}",
  "saveToLeaderboard(wave, kills, currentLevel?.id);\ndocument.getElementById('over').style.display = 'flex';\n}"
);
replaceAll(
  "endlessMode = false;\n    document.getElementById('final-level').textContent = '无尽模式';",
  "endlessMode = false;\n    saveToLeaderboard(finalWave, finalKills, '无尽');\n    document.getElementById('final-level').textContent = '无尽模式';"
);

// ─── 24. Progress bar in updateUI ───
replaceAll(
  "document.getElementById('show-level').textContent = currentLevel ? currentLevel.id : '1-1';\n}",
  "document.getElementById('show-level').textContent = currentLevel ? currentLevel.id : '1-1';\n  // V4.0 波次进度条\n  const prog = document.getElementById('level-progress-bar');\n  if(prog) {\n    if(currentLevel && currentLevel.waves > 0) {\n      prog.style.width = (wave / currentLevel.waves * 100).toFixed(1) + '%';\n    } else {\n      prog.style.width = '0%';\n    }\n  }\n}"
);

// ─── 25. Init audio on DOMContentLoaded ───
replaceAll(
  "setTimeout(initTowerIcons, 100))",
  "setTimeout(initTowerIcons, 100); loadSoundPref(); })"
);

// ─── 26. showMenu: refresh leaderboard ───
replaceAll(
  "function showMenu() {\n  document.getElementById('menu').style.display = 'flex';",
  "function showMenu() {\n  document.getElementById('menu').style.display = 'flex';\n  renderLeaderboard();"
);

// ─── 27. Enhanced kill particles ───
replaceAll(
  '// 粒子效果\n    for(let i=0;i<C.POOL_PARTICLE;i++) {\n      const ang = Math.random()*Math.PI*2;\n      const spd = 0.5+Math.random();\n      spawnPart(e.x, e.y, Math.cos(ang)*spd, Math.sin(ang)*spd, e.color || \'#8BC34A\');\n    }',
  '// 击杀粒子特效 (V4.0增强)\n    const kc = e.color || \'#8BC34A\';\n    for(let i=0;i<14;i++) {\n      const ang = Math.random()*Math.PI*2;\n      const spd = 1+Math.random()*2.5;\n      spawnPart(e.x, e.y, Math.cos(ang)*spd, Math.sin(ang)*spd, kc);\n    }'
);

// ─── Write ───
const outFile = 'index_v4.html';
fs.writeFileSync(outFile, src, 'utf8');
console.log('Done! Written to', outFile, '- Size:', src.length);

// Verify
const h = fs.readFileSync(outFile, 'utf8');
const checks = [
  ['playSound function', h.includes('function playSound')],
  ['renderLeaderboard', h.includes('renderLeaderboard')],
  ['highlightTutorialStep', h.includes('highlightTutorialStep')],
  ['level-progress-bar', h.includes('level-progress-bar')],
  ['continueGame', h.includes('function continueGame')],
  ['--gold:#FFB300', h.includes('--gold:#FFB300')],
  ['sound-toggle', h.includes('sound-toggle')],
  ['tutorial-arrow', h.includes('tutorial-arrow')],
  ['startBGM', h.includes('function startBGM')],
  ['saveToLeaderboard', h.includes('saveToLeaderboard')],
  ['loadSoundPref', h.includes('loadSoundPref')],
];
checks.forEach(([name, ok]) => console.log(ok ? '✅' : '❌', name));
