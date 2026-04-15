const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 找到并删除所有console.log行
const lines = html.split('\n');
const cleaned = lines.filter(line => {
  const trimmed = line.trim();
  // 跳过所有console.log和updateDebug相关的行
  if (trimmed.startsWith("console.log('[DEBUG]")) return false;
  if (trimmed.startsWith('console.log("[DEBUG]')) return false;
  if (trimmed.includes('updateDebug')) return false;
  if (trimmed === '// ========== DEBUG ==========') return false;
  return true;
});

html = cleaned.join('\n');

// 更新版本号
html = html.replace('V18.0', 'V19.0');
html = html.replace('V18.1', 'V19.0');
html = html.replace('V18.2', 'V19.0');
html = html.replace('V18.3', 'V19.0');
html = html.replace('V18.', 'V19.');

// 替换CSS - 删除旧CSS块，插入新CSS
const styleStart = html.indexOf('<style>');
const styleEnd = html.indexOf('</style>') + 8;
if (styleStart === -1) {
  console.log('ERROR: no <style> found');
  process.exit(1);
}

const newCSS = `<style>
/* ========== V19.0 腾讯小游戏沉浸式适配 ========== */
*{margin:0;padding:0;box-sizing:border-box;user-select:none;-webkit-tap-highlight-color:transparent}
html,body{height:100%;overflow:hidden;touch-action:none}
body{background:#0a0a1f;font-family:'PingFang SC','Helvetica Neue',Helvetica,Arial,'Microsoft YaHei',sans-serif}
:root{--gold:#FFD700;--gold-light:#FFE55C;--gold-dark:#B8860B;--green:#00E676;--green-dark:#00C853;--red:#FF1744;--red-dark:#D50000;--cyan:#00E5FF;--cyan-dark:#00B8D4;--purple:#E040FB;--purple-dark:#AA00FF;--orange:#FF9100;--orange-dark:#FF6D00;--blue:#2979FF;--blue-dark:#2962FF;--bg-dark:#0a0a1f;--bg-card:#13132a;--border:rgba(255,255,255,0.1);--glass:rgba(20,20,50,0.92);--radius:16px;--radius-lg:24px}
if(!CanvasRenderingContext2D.prototype.roundRect){CanvasRenderingContext2D.prototype.roundRect=function(x,y,w,h,r){if(w<2*r)r=w/2;if(h<2*r)r=h/2;this.moveTo(x+r,y);this.arcTo(x+w,y,x+w,y+h,r);this.arcTo(x+w,y+h,x,y+h,r);this.arcTo(x,y+h,x,y,r);this.arcTo(x,y,x+w,y,r);this.closePath();return this;};}
#game{width:100%;height:100dvh;height:100vh;display:none;flex-direction:column;background:linear-gradient(180deg,#12122a 0%,#0a0a1f 60%,#060610 100%);position:relative;overflow:hidden}
#top{flex-shrink:0;display:flex;align-items:center;justify-content:space-between;padding:8px 12px;padding-top:calc(8px + env(safe-area-inset-top, 0px));background:var(--glass);backdrop-filter:blur(20px) saturate(1.5);-webkit-backdrop-filter:blur(20px) saturate(1.5);border-bottom:1.5px solid rgba(255,215,0,0.3);box-shadow:0 4px 20px rgba(0,0,0,0.5),inset 0 -1px 0 rgba(255,215,0,0.1);z-index:50}
.stat{display:flex;align-items:center;gap:5px;color:#8a8aaa;font-size:13px;font-weight:500;background:rgba(255,255,255,0.06);padding:5px 10px;border-radius:12px;border:1px solid rgba(255,255,255,0.08)}
.stat .emoji{font-size:15px}
.stat b{color:var(--gold);font-size:18px;font-weight:700;text-shadow:0 0 12px rgba(255,215,0,0.5);font-family:'DIN Alternate',Arial}
.stat.red b{color:var(--red);text-shadow:0 0 12px rgba(255,23,68,0.5)}
.stat.green b{color:var(--green);text-shadow:0 0 12px rgba(0,230,118,0.5)}
#canvas-box{flex:1;min-height:0;position:relative;overflow:hidden;background:linear-gradient(180deg,rgba(10,10,30,0.3) 0%,rgba(5,5,15,0.5) 100%)}
canvas{display:block;width:100%;height:100%}
#entry-mark,#exit-mark{position:absolute;left:50%;transform:translateX(-50%);padding:5px 16px;border-radius:20px;font-size:11px;font-weight:bold;z-index:15;letter-spacing:1px}
#entry-mark{top:12px;background:linear-gradient(135deg,var(--green-dark),var(--green));color:#fff;box-shadow:0 0 20px rgba(0,230,118,0.6),0 0 40px rgba(0,230,118,0.3),0 4px 12px rgba(0,0,0,0.4)}
#exit-mark{bottom:12px;background:linear-gradient(135deg,var(--red-dark),var(--red));color:#fff;box-shadow:0 0 20px rgba(255,23,68,0.6),0 0 40px rgba(255,23,68,0.3),0 4px 12px rgba(0,0,0,0.4)}
#tip{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.8);color:#fff;padding:12px 28px;border-radius:14px;font-size:15px;z-index:30;pointer-events:none;display:none;white-space:nowrap;backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.15);box-shadow:0 8px 32px rgba(0,0,0,0.6);animation:fadeInOut 1.5s ease forwards}
@keyframes fadeInOut{0%{opacity:0;transform:translate(-50%,-50%) scale(0.8)}15%{opacity:1;transform:translate(-50%,-50%) scale(1)}70%{opacity:1;transform:translate(-50%,-50%) scale(1)}100%{opacity:0;transform:translate(-50%,-50%) scale(0.9)}}
#wave-msg{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:26px;font-weight:900;color:#fff;z-index:35;pointer-events:none;display:none;text-align:center;text-shadow:0 0 20px rgba(255,255,255,0.5),0 4px 20px rgba(0,0,0,0.8);animation:waveIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards}
@keyframes waveIn{0%{opacity:0;transform:translate(-50%,-50%) scale(0.3)}100%{opacity:1;transform:translate(-50%,-50%) scale(1)}}
#info,#ai-info{position:absolute;left:10px;background:var(--glass);padding:10px 12px;border-radius:var(--radius);font-size:12px;color:#8a8aaa;z-index:20;backdrop-filter:blur(10px);border:1px solid var(--border)}
#info{top:55px;min-width:105px}
#ai-info{top:auto;bottom:175px;min-width:105px}
#info h4,#ai-info h4{color:var(--cyan);font-size:12px;margin-bottom:6px;font-weight:600}
#info p,#ai-info p{margin:3px 0}
#info b,#ai-info b{color:var(--gold)}
#bottom{flex-shrink:0;background:var(--glass);backdrop-filter:blur(20px) saturate(1.5);-webkit-backdrop-filter:blur(20px) saturate(1.5);padding:8px 6px 10px;padding-bottom:calc(10px + env(safe-area-inset-bottom, 0px));border-top:1.5px solid rgba(255,215,0,0.3);box-shadow:0 -4px 30px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,215,0,0.1)}
#tower-panel{display:flex;justify-content:center;gap:5px;margin-bottom:6px;overflow-x:auto;padding:2px 4px;-webkit-overflow-scrolling:touch}
.tower-btn{display:flex;flex-direction:column;align-items:center;justify-content:center;min-width:50px;height:60px;flex-shrink:0;background:linear-gradient(145deg,rgba(55,55,100,0.9),rgba(35,35,75,0.9));border:2px solid rgba(255,255,255,0.12);border-radius:14px;cursor:pointer;position:relative;transition:all 0.18s ease;box-shadow:0 4px 12px rgba(0,0,0,0.35)}
.tower-btn::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,0.08) 0%,transparent 60%);border-radius:12px;pointer-events:none}
.tower-btn.selected{border-color:var(--gold);background:linear-gradient(145deg,rgba(90,85,50,0.95),rgba(65,60,35,0.95));box-shadow:0 0 24px rgba(255,215,0,0.4),0 4px 12px rgba(0,0,0,0.35);transform:translateY(-3px)}
.tower-btn:active{transform:scale(0.92)}
.tower-btn .icon{font-size:18px;line-height:1}
.tower-btn .price{position:absolute;bottom:3px;background:linear-gradient(135deg,var(--gold-dark),var(--gold));color:#1a1a2e;font-size:9px;font-weight:bold;padding:1px 5px;border-radius:8px}
.tower-btn .name{font-size:9px;color:#7a7a9a;margin-top:2px;font-weight:500}
.tower-btn.locked{opacity:0.3;pointer-events:none}
#toolbar{display:flex;justify-content:center;gap:8px;margin-bottom:6px}
.tool-btn{display:flex;align-items:center;gap:4px;padding:7px 14px;background:rgba(255,255,255,0.07);border:1.5px solid rgba(255,255,255,0.1);border-radius:20px;color:#aaa;font-size:12px;cursor:pointer;transition:all 0.18s}
.tool-btn.selected{border-color:var(--cyan);background:rgba(0,229,255,0.15);color:#fff;box-shadow:0 0 16px rgba(0,229,255,0.3)}
.tool-btn .icon{font-size:14px}
#actions{display:flex;justify-content:center;gap:8px}
.act-btn{flex:1;max-width:100px;padding:9px 10px;border:none;border-radius:14px;font-size:13px;font-weight:700;cursor:pointer;transition:all 0.15s;letter-spacing:0.5px}
#btn-fight{background:linear-gradient(135deg,var(--red),var(--red-dark));color:#fff;box-shadow:0 4px 20px rgba(255,23,68,0.45),0 2px 8px rgba(0,0,0,0.3);font-size:14px}
#btn-fight:active{transform:scale(0.96);box-shadow:0 2px 10px rgba(255,23,68,0.3)}
#btn-undo{background:linear-gradient(135deg,var(--orange),var(--orange-dark));color:#fff;box-shadow:0 4px 20px rgba(255,145,0,0.4),0 2px 8px rgba(0,0,0,0.3)}
#btn-clear{background:linear-gradient(135deg,#4a5568,#2d3748);color:#ccc;box-shadow:0 4px 15px rgba(0,0,0,0.3)}
#menu{position:absolute;inset:0;background:radial-gradient(ellipse at 30% 30%,#2a2a5e 0%,#1a1a40 30%,#0a0a1f 70%,#050508 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:100;padding:24px}
#menu h1{color:var(--cyan);font-size:30px;margin-bottom:6px;font-weight:900;text-shadow:0 0 30px rgba(0,229,255,0.6),0 0 60px rgba(0,229,255,0.3);letter-spacing:4px}
#menu h2{color:#6a6a9a;font-size:14px;margin-bottom:24px;font-weight:400;letter-spacing:3px}
.menu-btn{width:210px;padding:15px;margin:8px 0;background:linear-gradient(145deg,rgba(60,60,120,0.9),rgba(40,40,90,0.9));border:2px solid rgba(255,215,0,0.35);color:#fff;border-radius:18px;font-size:16px;font-weight:700;cursor:pointer;transition:all 0.2s;box-shadow:0 6px 24px rgba(0,0,0,0.5),0 0 30px rgba(255,215,0,0.1);letter-spacing:2px}
.menu-btn:hover,.menu-btn:active{border-color:var(--gold);box-shadow:0 0 40px rgba(255,215,0,0.35),0 6px 24px rgba(0,0,0,0.5);transform:translateY(-2px)}
.guide{margin-top:24px;padding:16px;background:rgba(0,0,0,0.45);border-radius:var(--radius);max-width:320px;text-align:left;border:1px solid rgba(255,255,255,0.1);backdrop-filter:blur(10px)}
.guide h3{color:var(--cyan);font-size:14px;margin-bottom:10px;font-weight:600}
.guide p{color:#aaa;font-size:12px;margin:6px 0;line-height:1.6}
.guide b{color:var(--gold)}
#over,#level-complete{position:absolute;inset:0;background:radial-gradient(ellipse at center,rgba(20,20,45,0.97) 0%,rgba(5,5,12,0.98) 100%);display:none;flex-direction:column;align-items:center;justify-content:center;z-index:90;padding:24px;backdrop-filter:blur(25px)}
#over h1{font-size:38px;color:var(--red);margin-bottom:20px;text-shadow:0 0 40px rgba(255,23,68,0.6);font-weight:900}
#level-complete h1{font-size:34px;color:var(--green);margin-bottom:18px;text-shadow:0 0 40px rgba(0,230,118,0.6);font-weight:900}
#over p,#level-complete p{color:#aaa;font-size:15px;margin:8px 0}
#over b,#level-complete b{color:var(--gold);font-size:20px;font-weight:700}
#stars{font-size:28px;letter-spacing:4px;text-shadow:0 0 20px rgba(255,215,0,0.5)}
.upgrade-btn{position:absolute;padding:5px 12px;border-radius:12px;font-size:10px;font-weight:bold;cursor:pointer;z-index:50;border:none;transition:all 0.2s;pointer-events:auto}
#upgrade-panel{position:absolute;display:none;z-index:60;background:var(--glass);border:2px solid var(--gold);border-radius:var(--radius);padding:12px;min-width:155px;box-shadow:0 8px 32px rgba(0,0,0,0.6),0 0 30px rgba(255,215,0,0.15)}
#upgrade-panel .up-info{color:#aaa;font-size:12px;margin-bottom:6px;text-align:center}
#upgrade-panel .up-btn{width:100%;padding:8px;margin-top:6px;border:none;border-radius:12px;background:linear-gradient(135deg,var(--gold),var(--gold-dark));color:#1a1a3e;font-weight:bold;font-size:13px;cursor:pointer}
#upgrade-panel .up-btn:disabled{opacity:0.4;cursor:not-allowed}
#upgrade-panel .close-btn{position:absolute;top:4px;right:8px;background:none;border:none;color:#666;font-size:18px;cursor:pointer}
@media(max-width:380px){.tower-btn{min-width:46px;height:56px}.tower-btn .icon{font-size:16px}.act-btn{max-width:90px;padding:8px;font-size:12px}.stat{font-size:11px;padding:4px 8px}.stat b{font-size:16px}}
@media(max-height:600px){#top{height:48px}#bottom{padding:6px 8px}.tower-btn{height:54px}#info,#ai-info{display:none}}
@media(min-width:768px){.tower-btn{min-width:60px;height:68px}.tower-btn .icon{font-size:22px}.act-btn{max-width:130px;font-size:15px}}
</style>`;

html = html.substring(0, styleStart) + newCSS + html.substring(styleEnd + 8);

// 更新标题
html = html.replace('<title>迷宫塔防 V18.0 - Bug修复版</title>', '<title>迷宫塔防 V19.0</title>');

// 删除debug div
html = html.replace(/<div id="debug"[^>]*>.*?<\/div>\n/, '');

// 更新h1/h2
html = html.replace('<h1>🏰 迷宫塔防 V18.0</h1>', '<h1>🏰 迷宫塔防</h1>');
html = html.replace('<h2>腾讯品质 · 流畅触控 · 策略平衡</h2>', '<h2>腾讯小游戏 · 沉浸体验</h2>');

// 精简菜单指南
html = html.replace(
  /<h3>🆕 V16\.0 全面升级<\/h3>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/,
  `<h3>🎮 游戏指南</h3>
<p><b>目标</b> - 建造墙壁引导敌人，用塔消灭它们</p>
<p><b>建造</b> - 选择塔种，点击画布放置</p>
<p><b>删除</b> - 点击删除工具，再点击已放置的塔</p>
<p><b>开战</b> - 部署完成后点击开战按钮</p>
</div></div></div>`
);

fs.writeFileSync('index.html', html, 'utf8');
console.log('Done! Lines:', html.split('\n').length);
