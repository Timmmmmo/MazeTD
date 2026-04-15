/**
 * V19.0 全面升级脚本
 * 1. 删除所有debug代码
 * 2. 升级CSS为腾讯小游戏风格
 * 3. 升级美术（塔/敌人/背景/粒子）
 */
const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');

// ===== 1. 删除debug代码 =====
const cleaned = lines.filter(line => {
  const t = line.trim();
  if (t.includes("console.log('[DEBUG]")) return false;
  if (t.includes('console.log("[DEBUG]')) return false;
  if (t.includes("console.warn('存档失败")) return false;
  if (t.includes("console.warn('读档失败")) return false;
  if (t.includes("console.warn('保存分数")) return false;
  if (t.includes("console.warn('加载分数")) return false;
  if (t.includes("console.warn('敌人选择绕行")) return false;
  if (t === 'updateDebug();') return false;
  if (t === '// V18.0: 先更新debug信息，再检查是否需要提前退出') return false;
  if (t === '// V16.5: 先更新debug信息，再检查是否需要提前退出') return false;
  return true;
});
html = cleaned.join('\n');

// 删除debug div
html = html.replace(/<div id="debug"[^>]*>.*?<\/div>\n?/s, '');

// 删除updateDebug函数
html = html.replace(/\/\/ ========== DEBUG ==========\nfunction updateDebug\(\) \{[\s\S]*?\}\n\n/, '');

// ===== 2. 更新标题和版本号 =====
html = html.replace(/<title>.*?<\/title>/, '<title>迷宫塔防 V19.0</title>');
html = html.replace(/<h1>🏰 迷宫塔防.*?<\/h1>/, '<h1>🏰 迷宫塔防</h1>');
html = html.replace(/<h2>腾讯品质.*?<\/h2>/, '<h2>腾讯小游戏 · 沉浸体验</h2>');

// 精简菜单指南
const guideOld = html.indexOf('<div class="guide">');
const guideEnd = html.indexOf('</div>', guideOld) + 6;
if (guideOld !== -1) {
  html = html.substring(0, guideOld) + `<div class="guide">
<h3>🎮 游戏指南</h3>
<p><b>目标</b> - 建造墙壁引导敌人，用塔消灭它们</p>
<p><b>建造</b> - 选择塔种，点击画布放置</p>
<p><b>删除</b> - 点击删除工具，再点击已放置的塔</p>
<p><b>开战</b> - 部署完成后点击开战按钮</p>
</div>` + html.substring(guideEnd);
}

// ===== 3. 替换CSS =====
const cssStart = html.indexOf('<style>');
const cssEnd = html.indexOf('</style>') + 8;
const newCSS = `<style>
/* ========== V19.0 腾讯小游戏沉浸式 ========== */
*{margin:0;padding:0;box-sizing:border-box;user-select:none;-webkit-tap-highlight-color:transparent}
html,body{height:100%;overflow:hidden;touch-action:none}
body{background:#0a0a1f;font-family:'PingFang SC','Helvetica Neue',Helvetica,Arial,'Microsoft YaHei',sans-serif}
:root{
  --gold:#FFD700;--gold-light:#FFE55C;--gold-dark:#B8860B;
  --green:#00E676;--green-dark:#00C853;
  --red:#FF1744;--red-dark:#D50000;
  --cyan:#00E5FF;--cyan-dark:#00B8D4;
  --purple:#E040FB;--purple-dark:#AA00FF;
  --orange:#FF9100;--orange-dark:#FF6D00;
  --blue:#2979FF;--blue-dark:#2962FF;
  --glass:rgba(15,15,40,0.92);--border:rgba(255,255,255,0.1);--radius:16px;
}
if(!CanvasRenderingContext2D.prototype.roundRect){CanvasRenderingContext2D.prototype.roundRect=function(x,y,w,h,r){if(w<2*r)r=w/2;if(h<2*r)r=h/2;this.moveTo(x+r,y);this.arcTo(x+w,y,x+w,y+h,r);this.arcTo(x+w,y+h,x,y+h,r);this.arcTo(x,y+h,x,y,r);this.arcTo(x,y,x+w,y,r);this.closePath();return this;};}
/* 主容器 */
#game{width:100%;height:100dvh;height:100vh;display:none;flex-direction:column;background:linear-gradient(180deg,#0d0d2b 0%,#080818 60%,#040410 100%);position:relative;overflow:hidden}
/* 顶部状态栏 */
#top{flex-shrink:0;display:flex;align-items:center;justify-content:space-between;padding:8px 10px;padding-top:calc(8px + env(safe-area-inset-top,0px));background:var(--glass);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border-bottom:1px solid rgba(255,215,0,0.25);box-shadow:0 2px 20px rgba(0,0,0,0.6),inset 0 -1px 0 rgba(255,215,0,0.08);z-index:50}
.stat{display:flex;align-items:center;gap:4px;color:#7a7a9a;font-size:12px;background:rgba(255,255,255,0.05);padding:5px 9px;border-radius:10px;border:1px solid rgba(255,255,255,0.07)}
.stat .emoji{font-size:14px}
.stat b{color:var(--gold);font-size:17px;font-weight:800;text-shadow:0 0 10px rgba(255,215,0,0.6);min-width:28px;text-align:center}
.stat.red b{color:var(--red);text-shadow:0 0 10px rgba(255,23,68,0.6)}
.stat.green b{color:var(--green);text-shadow:0 0 10px rgba(0,230,118,0.6)}
/* 画布 */
#canvas-box{flex:1;min-height:0;position:relative;overflow:hidden}
canvas{display:block;width:100%;height:100%}
/* 入口出口 */
#entry-mark,#exit-mark{position:absolute;left:50%;transform:translateX(-50%);padding:4px 14px;border-radius:20px;font-size:10px;font-weight:700;z-index:15;letter-spacing:1px;pointer-events:none}
#entry-mark{top:10px;background:linear-gradient(135deg,#00C853,#00E676);color:#fff;box-shadow:0 0 16px rgba(0,230,118,0.7),0 0 32px rgba(0,230,118,0.3)}
#exit-mark{bottom:10px;background:linear-gradient(135deg,#D50000,#FF1744);color:#fff;box-shadow:0 0 16px rgba(255,23,68,0.7),0 0 32px rgba(255,23,68,0.3)}
/* 提示 */
#tip{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.85);color:#fff;padding:10px 24px;border-radius:12px;font-size:14px;z-index:30;pointer-events:none;display:none;white-space:nowrap;backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.12);box-shadow:0 8px 32px rgba(0,0,0,0.7);animation:fadeInOut 1.5s ease forwards}
@keyframes fadeInOut{0%{opacity:0;transform:translate(-50%,-50%) scale(0.85)}15%{opacity:1;transform:translate(-50%,-50%) scale(1)}70%{opacity:1}100%{opacity:0}}
#wave-msg{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:24px;font-weight:900;color:#fff;z-index:35;pointer-events:none;display:none;text-align:center;text-shadow:0 0 24px rgba(255,255,255,0.6),0 4px 20px rgba(0,0,0,0.9);animation:waveIn 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards}
@keyframes waveIn{0%{opacity:0;transform:translate(-50%,-50%) scale(0.2)}100%{opacity:1;transform:translate(-50%,-50%) scale(1)}}
#info,#ai-info{position:absolute;left:8px;background:var(--glass);padding:8px 10px;border-radius:12px;font-size:11px;color:#7a7a9a;z-index:20;backdrop-filter:blur(12px);border:1px solid var(--border);min-width:100px}
#info{top:52px}
#ai-info{top:auto;bottom:170px}
#info h4,#ai-info h4{color:var(--cyan);font-size:11px;margin-bottom:5px;font-weight:600}
#info p,#ai-info p{margin:2px 0}
#info b,#ai-info b{color:var(--gold)}
.good{color:var(--green)!important}
.bad{color:var(--red)!important}
/* 底部工具栏 */
#bottom{flex-shrink:0;background:var(--glass);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);padding:7px 6px 8px;padding-bottom:calc(8px + env(safe-area-inset-bottom,0px));border-top:1px solid rgba(255,215,0,0.25);box-shadow:0 -2px 24px rgba(0,0,0,0.6),inset 0 1px 0 rgba(255,215,0,0.08)}
#tower-panel{display:flex;justify-content:center;gap:5px;margin-bottom:5px;overflow-x:auto;padding:1px 2px;-webkit-overflow-scrolling:touch;scrollbar-width:none}
#tower-panel::-webkit-scrollbar{display:none}
.tower-btn{display:flex;flex-direction:column;align-items:center;justify-content:center;min-width:52px;height:62px;flex-shrink:0;background:linear-gradient(160deg,rgba(50,50,95,0.95),rgba(30,30,65,0.95));border:1.5px solid rgba(255,255,255,0.1);border-radius:14px;cursor:pointer;position:relative;transition:all 0.16s ease;box-shadow:0 4px 14px rgba(0,0,0,0.4),inset 0 1px 0 rgba(255,255,255,0.06)}
.tower-btn::after{content:'';position:absolute;inset:0;border-radius:13px;background:linear-gradient(160deg,rgba(255,255,255,0.07) 0%,transparent 55%);pointer-events:none}
.tower-btn.selected{border-color:var(--gold);background:linear-gradient(160deg,rgba(80,75,40,0.98),rgba(55,50,25,0.98));box-shadow:0 0 20px rgba(255,215,0,0.45),0 4px 14px rgba(0,0,0,0.4);transform:translateY(-4px) scale(1.04)}
.tower-btn:active{transform:scale(0.9);transition-duration:0.08s}
.tower-btn .icon{font-size:20px;line-height:1;margin-bottom:1px}
.tower-btn .price{position:absolute;bottom:3px;background:linear-gradient(135deg,var(--gold-dark),var(--gold));color:#1a1200;font-size:9px;font-weight:800;padding:1px 5px;border-radius:7px;letter-spacing:0.3px}
.tower-btn .name{font-size:9px;color:#6a6a8a;font-weight:500}
.tower-btn.locked{opacity:0.28;pointer-events:none}
#toolbar{display:flex;justify-content:center;gap:7px;margin-bottom:5px}
.tool-btn{display:flex;align-items:center;gap:4px;padding:6px 13px;background:rgba(255,255,255,0.06);border:1.5px solid rgba(255,255,255,0.09);border-radius:18px;color:#9a9aba;font-size:12px;cursor:pointer;transition:all 0.16s}
.tool-btn.selected{border-color:var(--cyan);background:rgba(0,229,255,0.12);color:#fff;box-shadow:0 0 14px rgba(0,229,255,0.25)}
.tool-btn .icon{font-size:13px}
#actions{display:flex;justify-content:center;gap:7px}
.act-btn{flex:1;max-width:105px;padding:9px 8px;border:none;border-radius:13px;font-size:13px;font-weight:700;cursor:pointer;transition:all 0.14s;letter-spacing:0.5px}
#btn-fight{background:linear-gradient(135deg,#FF1744,#D50000);color:#fff;box-shadow:0 4px 18px rgba(255,23,68,0.5),0 2px 8px rgba(0,0,0,0.3);font-size:14px}
#btn-fight:active{transform:scale(0.95)}
#btn-undo{background:linear-gradient(135deg,#FF9100,#FF6D00);color:#fff;box-shadow:0 4px 18px rgba(255,145,0,0.45)}
#btn-clear{background:linear-gradient(135deg,#455a64,#263238);color:#bbb}
/* 菜单 */
#menu{position:absolute;inset:0;background:radial-gradient(ellipse at 35% 25%,#1e1e5a 0%,#0f0f35 35%,#060618 70%,#020208 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:100;padding:20px}
#menu h1{color:var(--cyan);font-size:28px;margin-bottom:5px;font-weight:900;text-shadow:0 0 28px rgba(0,229,255,0.7),0 0 56px rgba(0,229,255,0.3);letter-spacing:5px}
#menu h2{color:#5a5a8a;font-size:13px;margin-bottom:22px;font-weight:400;letter-spacing:3px}
.menu-btn{width:200px;padding:14px;margin:7px 0;background:linear-gradient(145deg,rgba(55,55,110,0.95),rgba(35,35,80,0.95));border:1.5px solid rgba(255,215,0,0.3);color:#fff;border-radius:16px;font-size:15px;font-weight:700;cursor:pointer;transition:all 0.18s;box-shadow:0 6px 22px rgba(0,0,0,0.55),0 0 24px rgba(255,215,0,0.08);letter-spacing:2px}
.menu-btn:active{border-color:var(--gold);box-shadow:0 0 36px rgba(255,215,0,0.4),0 6px 22px rgba(0,0,0,0.55);transform:translateY(-2px)}
.guide{margin-top:20px;padding:14px;background:rgba(0,0,0,0.5);border-radius:14px;max-width:300px;text-align:left;border:1px solid rgba(255,255,255,0.08);backdrop-filter:blur(12px)}
.guide h3{color:var(--cyan);font-size:13px;margin-bottom:8px;font-weight:600}
.guide p{color:#9a9aba;font-size:12px;margin:5px 0;line-height:1.6}
.guide b{color:var(--gold)}
/* 结束画面 */
#over,#level-complete{position:absolute;inset:0;background:radial-gradient(ellipse at center,rgba(18,18,42,0.97) 0%,rgba(4,4,10,0.99) 100%);display:none;flex-direction:column;align-items:center;justify-content:center;z-index:90;padding:24px;backdrop-filter:blur(28px)}
#over h1{font-size:36px;color:var(--red);margin-bottom:18px;text-shadow:0 0 36px rgba(255,23,68,0.7);font-weight:900}
#level-complete h1{font-size:32px;color:var(--green);margin-bottom:16px;text-shadow:0 0 36px rgba(0,230,118,0.7);font-weight:900}
#over p,#level-complete p{color:#9a9aba;font-size:14px;margin:7px 0}
#over b,#level-complete b{color:var(--gold);font-size:19px;font-weight:700}
#stars{font-size:26px;letter-spacing:5px;text-shadow:0 0 18px rgba(255,215,0,0.6)}
/* 升级面板 */
.upgrade-btn{position:absolute;padding:4px 10px;border-radius:10px;font-size:10px;font-weight:bold;cursor:pointer;z-index:50;border:none;transition:all 0.18s;pointer-events:auto}
#upgrade-panel{position:absolute;display:none;z-index:60;background:var(--glass);border:1.5px solid var(--gold);border-radius:14px;padding:11px;min-width:148px;box-shadow:0 8px 30px rgba(0,0,0,0.65),0 0 24px rgba(255,215,0,0.12)}
#upgrade-panel .up-info{color:#9a9aba;font-size:11px;margin-bottom:5px;text-align:center}
#upgrade-panel .up-btn{width:100%;padding:7px;margin-top:5px;border:none;border-radius:10px;background:linear-gradient(135deg,var(--gold),var(--gold-dark));color:#1a1200;font-weight:800;font-size:12px;cursor:pointer}
#upgrade-panel .up-btn:disabled{opacity:0.35;cursor:not-allowed}
#upgrade-panel .close-btn{position:absolute;top:3px;right:7px;background:none;border:none;color:#555;font-size:17px;cursor:pointer}
/* 响应式 */
@media(max-width:380px){.tower-btn{min-width:46px;height:56px}.tower-btn .icon{font-size:17px}.act-btn{max-width:85px;padding:8px;font-size:12px}.stat{font-size:11px;padding:4px 7px}.stat b{font-size:15px}}
@media(max-height:600px){#bottom{padding:5px 6px}.tower-btn{height:52px}#info,#ai-info{display:none}}
@media(min-width:768px){.tower-btn{min-width:62px;height:70px}.tower-btn .icon{font-size:24px}.act-btn{max-width:135px;font-size:15px}}
</style>`;
html = html.substring(0, cssStart) + newCSS + html.substring(cssEnd);

// ===== 4. 升级美术：drawTowerIcon =====
const newDrawTowerIcon = `
// ========== V19.0 顶级美术 - 塔绘制 ==========
function drawTowerIcon(ctx, type, x, y, r) {
  ctx.save();
  ctx.translate(x, y);
  
  // 通用：底部阴影
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.beginPath();
  ctx.ellipse(0, r*0.85, r*0.65, r*0.18, 0, 0, Math.PI*2);
  ctx.fill();
  
  switch(type) {
    case 'archer': {
      // 弓箭塔：翠绿精灵弓手
      // 斗篷
      const capeG = ctx.createRadialGradient(0, r*0.2, 0, 0, r*0.2, r*0.7);
      capeG.addColorStop(0, '#66BB6A');
      capeG.addColorStop(1, '#2E7D32');
      ctx.fillStyle = capeG;
      ctx.beginPath();
      ctx.moveTo(-r*0.55, r*0.75);
      ctx.quadraticCurveTo(-r*0.7, r*0.1, -r*0.1, -r*0.3);
      ctx.quadraticCurveTo(0, -r*0.45, r*0.1, -r*0.3);
      ctx.quadraticCurveTo(r*0.7, r*0.1, r*0.55, r*0.75);
      ctx.closePath();
      ctx.fill();
      // 斗篷高光
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      ctx.beginPath();
      ctx.moveTo(-r*0.3, r*0.75);
      ctx.quadraticCurveTo(-r*0.45, r*0.2, -r*0.05, -r*0.2);
      ctx.quadraticCurveTo(r*0.05, -r*0.3, r*0.1, -r*0.1);
      ctx.quadraticCurveTo(-r*0.1, r*0.3, -r*0.1, r*0.75);
      ctx.closePath();
      ctx.fill();
      // 头部
      const headG = ctx.createRadialGradient(-r*0.05, -r*0.55, 0, 0, -r*0.5, r*0.3);
      headG.addColorStop(0, '#FFCC80');
      headG.addColorStop(1, '#E65100');
      ctx.fillStyle = headG;
      ctx.beginPath();
      ctx.arc(0, -r*0.5, r*0.28, 0, Math.PI*2);
      ctx.fill();
      // 帽子
      ctx.fillStyle = '#1B5E20';
      ctx.beginPath();
      ctx.moveTo(-r*0.35, -r*0.45);
      ctx.lineTo(0, -r*0.95);
      ctx.lineTo(r*0.35, -r*0.45);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#2E7D32';
      ctx.beginPath();
      ctx.ellipse(0, -r*0.45, r*0.38, r*0.1, 0, 0, Math.PI*2);
      ctx.fill();
      // 弓
      ctx.strokeStyle = '#8D6E63';
      ctx.lineWidth = r*0.1;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(r*0.35, r*0.1, r*0.38, -Math.PI*0.7, Math.PI*0.7);
      ctx.stroke();
      // 弦
      ctx.strokeStyle = '#FFF9C4';
      ctx.lineWidth = r*0.04;
      ctx.beginPath();
      ctx.moveTo(r*0.35-r*0.38*Math.cos(Math.PI*0.7), r*0.1-r*0.38*Math.sin(Math.PI*0.7));
      ctx.lineTo(r*0.35-r*0.38*Math.cos(-Math.PI*0.7), r*0.1-r*0.38*Math.sin(-Math.PI*0.7));
      ctx.stroke();
      // 箭
      ctx.strokeStyle = '#FFD54F';
      ctx.lineWidth = r*0.06;
      ctx.beginPath();
      ctx.moveTo(-r*0.4, r*0.1);
      ctx.lineTo(r*0.6, r*0.1);
      ctx.stroke();
      ctx.fillStyle = '#FF8F00';
      ctx.beginPath();
      ctx.moveTo(r*0.6, r*0.1);
      ctx.lineTo(r*0.45, r*0.0);
      ctx.lineTo(r*0.45, r*0.2);
      ctx.closePath();
      ctx.fill();
      // 眼睛
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.ellipse(-r*0.1, -r*0.52, r*0.1, r*0.12, 0, 0, Math.PI*2);
      ctx.ellipse(r*0.1, -r*0.52, r*0.1, r*0.12, 0, 0, Math.PI*2);
      ctx.fill();
      ctx.fillStyle = '#1A237E';
      ctx.beginPath();
      ctx.arc(-r*0.08, -r*0.5, r*0.06, 0, Math.PI*2);
      ctx.arc(r*0.12, -r*0.5, r*0.06, 0, Math.PI*2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(-r*0.06, -r*0.53, r*0.025, 0, Math.PI*2);
      ctx.arc(r*0.14, -r*0.53, r*0.025, 0, Math.PI*2);
      ctx.fill();
      break;
    }
    case 'cannon': {
      // 炮塔：厚重钢铁炮台
      // 底座
      const baseG = ctx.createLinearGradient(0, r*0.3, 0, r*0.8);
      baseG.addColorStop(0, '#546E7A');
      baseG.addColorStop(1, '#263238');
      ctx.fillStyle = baseG;
      ctx.beginPath();
      ctx.roundRect(-r*0.6, r*0.3, r*1.2, r*0.5, r*0.15);
      ctx.fill();
      // 底座高光
      ctx.fillStyle = 'rgba(255,255,255,0.1)';
      ctx.beginPath();
      ctx.roundRect(-r*0.55, r*0.32, r*1.1, r*0.18, r*0.1);
      ctx.fill();
      // 炮身
      const bodyG = ctx.createRadialGradient(-r*0.15, -r*0.1, 0, 0, 0, r*0.65);
      bodyG.addColorStop(0, '#EF5350');
      bodyG.addColorStop(0.5, '#C62828');
      bodyG.addColorStop(1, '#7F0000');
      ctx.fillStyle = bodyG;
      ctx.beginPath();
      ctx.arc(0, r*0.05, r*0.55, 0, Math.PI*2);
      ctx.fill();
      // 炮身高光
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.beginPath();
      ctx.arc(-r*0.18, -r*0.15, r*0.22, 0, Math.PI*2);
      ctx.fill();
      // 铆钉装饰
      ctx.fillStyle = '#B71C1C';
      for(let i=0; i<4; i++) {
        const a = (i/4)*Math.PI*2 + Math.PI/4;
        ctx.beginPath();
        ctx.arc(Math.cos(a)*r*0.38, r*0.05+Math.sin(a)*r*0.38, r*0.07, 0, Math.PI*2);
        ctx.fill();
      }
      // 炮管
      const barrelG = ctx.createLinearGradient(-r*0.15, -r*0.8, r*0.15, -r*0.8);
      barrelG.addColorStop(0, '#37474F');
      barrelG.addColorStop(0.4, '#607D8B');
      barrelG.addColorStop(1, '#263238');
      ctx.fillStyle = barrelG;
      ctx.beginPath();
      ctx.roundRect(-r*0.18, -r*0.85, r*0.36, r*0.65, r*0.1);
      ctx.fill();
      // 炮口
      const muzzleG = ctx.createRadialGradient(0, -r*0.85, 0, 0, -r*0.85, r*0.2);
      muzzleG.addColorStop(0, '#1a1a1a');
      muzzleG.addColorStop(1, '#37474F');
      ctx.fillStyle = muzzleG;
      ctx.beginPath();
      ctx.arc(0, -r*0.85, r*0.2, 0, Math.PI*2);
      ctx.fill();
      // 炮口光晕
      ctx.fillStyle = 'rgba(255,200,50,0.15)';
      ctx.beginPath();
      ctx.arc(0, -r*0.85, r*0.28, 0, Math.PI*2);
      ctx.fill();
      // 眼睛（炮身上）
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.ellipse(-r*0.18, r*0.08, r*0.12, r*0.15, 0, 0, Math.PI*2);
      ctx.ellipse(r*0.18, r*0.08, r*0.12, r*0.15, 0, 0, Math.PI*2);
      ctx.fill();
      ctx.fillStyle = '#B71C1C';
      ctx.beginPath();
      ctx.arc(-r*0.16, r*0.1, r*0.07, 0, Math.PI*2);
      ctx.arc(r*0.2, r*0.1, r*0.07, 0, Math.PI*2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(-r*0.13, r*0.07, r*0.03, 0, Math.PI*2);
      ctx.arc(r*0.23, r*0.07, r*0.03, 0, Math.PI*2);
      ctx.fill();
      break;
    }
    case 'ice': {
      // 冰冻塔：晶莹冰雪精灵
      // 冰晶底座
      const iceBaseG = ctx.createLinearGradient(0, r*0.4, 0, r*0.8);
      iceBaseG.addColorStop(0, '#80DEEA');
      iceBaseG.addColorStop(1, '#006064');
      ctx.fillStyle = iceBaseG;
      ctx.beginPath();
      ctx.roundRect(-r*0.5, r*0.4, r*1.0, r*0.4, r*0.12);
      ctx.fill();
      // 身体（雪人下半）
      const bodyG = ctx.createRadialGradient(-r*0.1, r*0.15, 0, 0, r*0.2, r*0.45);
      bodyG.addColorStop(0, '#E0F7FA');
      bodyG.addColorStop(0.6, '#B2EBF2');
      bodyG.addColorStop(1, '#00838F');
      ctx.fillStyle = bodyG;
      ctx.beginPath();
      ctx.arc(0, r*0.2, r*0.42, 0, Math.PI*2);
      ctx.fill();
      // 身体高光
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.beginPath();
      ctx.arc(-r*0.12, r*0.05, r*0.18, 0, Math.PI*2);
      ctx.fill();
      // 围巾
      ctx.fillStyle = '#FF5252';
      ctx.beginPath();
      ctx.ellipse(0, -r*0.12, r*0.42, r*0.1, 0, 0, Math.PI*2);
      ctx.fill();
      ctx.fillStyle = '#FF1744';
      ctx.beginPath();
      ctx.roundRect(r*0.15, -r*0.22, r*0.18, r*0.28, r*0.06);
      ctx.fill();
      // 头部
      const headG = ctx.createRadialGradient(-r*0.08, -r*0.45, 0, 0, -r*0.4, r*0.3);
      headG.addColorStop(0, '#E0F7FA');
      headG.addColorStop(1, '#80DEEA');
      ctx.fillStyle = headG;
      ctx.beginPath();
      ctx.arc(0, -r*0.4, r*0.28, 0, Math.PI*2);
      ctx.fill();
      // 帽子
      ctx.fillStyle = '#0277BD';
      ctx.beginPath();
      ctx.ellipse(0, -r*0.62, r*0.32, r*0.09, 0, 0, Math.PI*2);
      ctx.fill();
      ctx.fillStyle = '#01579B';
      ctx.beginPath();
      ctx.roundRect(-r*0.22, -r*0.95, r*0.44, r*0.35, r*0.06);
      ctx.fill();
      // 帽子装饰
      ctx.fillStyle = '#FFD54F';
      ctx.beginPath();
      ctx.ellipse(0, -r*0.62, r*0.32, r*0.09, 0, 0, Math.PI*2);
      ctx.fill();
      ctx.fillStyle = '#0277BD';
      ctx.beginPath();
      ctx.ellipse(0, -r*0.62, r*0.26, r*0.07, 0, 0, Math.PI*2);
      ctx.fill();
      // 冰晶装饰
      ctx.strokeStyle = 'rgba(178,235,242,0.8)';
      ctx.lineWidth = r*0.06;
      ctx.lineCap = 'round';
      for(let i=0; i<6; i++) {
        const a = i*Math.PI/3;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a)*r*0.18, r*0.2+Math.sin(a)*r*0.18);
        ctx.lineTo(Math.cos(a)*r*0.38, r*0.2+Math.sin(a)*r*0.38);
        ctx.stroke();
      }
      // 眼睛
      ctx.fillStyle = '#1A237E';
      ctx.beginPath();
      ctx.arc(-r*0.1, -r*0.42, r*0.07, 0, Math.PI*2);
      ctx.arc(r*0.1, -r*0.42, r*0.07, 0, Math.PI*2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(-r*0.07, -r*0.45, r*0.03, 0, Math.PI*2);
      ctx.arc(r*0.13, -r*0.45, r*0.03, 0, Math.PI*2);
      ctx.fill();
      // 腮红
      ctx.fillStyle = 'rgba(255,138,128,0.35)';
      ctx.beginPath();
      ctx.ellipse(-r*0.22, -r*0.3, r*0.1, r*0.07, 0, 0, Math.PI*2);
      ctx.ellipse(r*0.22, -r*0.3, r*0.1, r*0.07, 0, 0, Math.PI*2);
      ctx.fill();
      break;
    }
    case 'poison': {
      // 毒塔：神秘炼金术师
      // 底座
      const pBaseG = ctx.createLinearGradient(0, r*0.35, 0, r*0.8);
      pBaseG.addColorStop(0, '#558B2F');
      pBaseG.addColorStop(1, '#1B5E20');
      ctx.fillStyle = pBaseG;
      ctx.beginPath();
      ctx.roundRect(-r*0.5, r*0.35, r*1.0, r*0.45, r*0.12);
      ctx.fill();
      // 药瓶身
      const bottleG = ctx.createRadialGradient(-r*0.12, -r*0.1, 0, 0, 0, r*0.55);
      bottleG.addColorStop(0, '#AED581');
      bottleG.addColorStop(0.5, '#7CB342');
      bottleG.addColorStop(1, '#33691E');
      ctx.fillStyle = bottleG;
      ctx.beginPath();
      ctx.moveTo(-r*0.42, r*0.35);
      ctx.lineTo(-r*0.42, -r*0.1);
      ctx.quadraticCurveTo(-r*0.42, -r*0.55, 0, -r*0.55);
      ctx.quadraticCurveTo(r*0.42, -r*0.55, r*0.42, -r*0.1);
      ctx.lineTo(r*0.42, r*0.35);
      ctx.closePath();
      ctx.fill();
      // 瓶身高光
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.beginPath();
      ctx.moveTo(-r*0.28, r*0.35);
      ctx.lineTo(-r*0.28, -r*0.05);
      ctx.quadraticCurveTo(-r*0.28, -r*0.38, -r*0.08, -r*0.42);
      ctx.quadraticCurveTo(r*0.02, -r*0.44, r*0.02, -r*0.3);
      ctx.lineTo(r*0.02, r*0.35);
      ctx.closePath();
      ctx.fill();
      // 毒液气泡
      ctx.fillStyle = 'rgba(178,235,152,0.6)';
      ctx.beginPath();
      ctx.arc(r*0.12, r*0.1, r*0.1, 0, Math.PI*2);
      ctx.arc(r*0.22, r*0.28, r*0.07, 0, Math.PI*2);
      ctx.arc(-r*0.05, r*0.25, r*0.08, 0, Math.PI*2);
      ctx.fill();
      // 瓶口
      const neckG = ctx.createLinearGradient(-r*0.18, -r*0.55, r*0.18, -r*0.55);
      neckG.addColorStop(0, '#558B2F');
      neckG.addColorStop(0.5, '#8BC34A');
      neckG.addColorStop(1, '#558B2F');
      ctx.fillStyle = neckG;
      ctx.beginPath();
      ctx.roundRect(-r*0.18, -r*0.75, r*0.36, r*0.22, r*0.07);
      ctx.fill();
      // 瓶盖
      ctx.fillStyle = '#1B5E20';
      ctx.beginPath();
      ctx.roundRect(-r*0.22, -r*0.92, r*0.44, r*0.2, r*0.08);
      ctx.fill();
      ctx.fillStyle = '#33691E';
      ctx.beginPath();
      ctx.roundRect(-r*0.18, -r*0.88, r*0.36, r*0.12, r*0.05);
      ctx.fill();
      // 骷髅标志
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.beginPath();
      ctx.arc(0, -r*0.15, r*0.18, 0, Math.PI*2);
      ctx.fill();
      ctx.fillStyle = '#2E7D32';
      ctx.beginPath();
      ctx.arc(0, -r*0.18, r*0.1, 0, Math.PI*2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.beginPath();
      ctx.arc(-r*0.07, -r*0.2, r*0.04, 0, Math.PI*2);
      ctx.arc(r*0.07, -r*0.2, r*0.04, 0, Math.PI*2);
      ctx.fill();
      ctx.fillStyle = '#2E7D32';
      ctx.beginPath();
      ctx.roundRect(-r*0.1, -r*0.08, r*0.06, r*0.08, r*0.02);
      ctx.roundRect(r*0.04, -r*0.08, r*0.06, r*0.08, r*0.02);
      ctx.fill();
      break;
    }
    case 'thunder': {
      // 雷电塔：闪电法师
      // 底座
      const tBaseG = ctx.createLinearGradient(0, r*0.35, 0, r*0.8);
      tBaseG.addColorStop(0, '#F9A825');
      tBaseG.addColorStop(1, '#E65100');
      ctx.fillStyle = tBaseG;
      ctx.beginPath();
      ctx.roundRect(-r*0.5, r*0.35, r*1.0, r*0.45, r*0.12);
      ctx.fill();
      // 法袍
      const robeG = ctx.createLinearGradient(0, -r*0.3, 0, r*0.35);
      robeG.addColorStop(0, '#7B1FA2');
      robeG.addColorStop(1, '#4A148C');
      ctx.fillStyle = robeG;
      ctx.beginPath();
      ctx.moveTo(-r*0.5, r*0.35);
      ctx.lineTo(-r*0.45, -r*0.15);
      ctx.quadraticCurveTo(-r*0.4, -r*0.35, 0, -r*0.35);
      ctx.quadraticCurveTo(r*0.4, -r*0.35, r*0.45, -r*0.15);
      ctx.lineTo(r*0.5, r*0.35);
      ctx.closePath();
      ctx.fill();
      // 法袍高光
      ctx.fillStyle = 'rgba(255,255,255,0.1)';
      ctx.beginPath();
      ctx.moveTo(-r*0.35, r*0.35);
      ctx.lineTo(-r*0.3, -r*0.1);
      ctx.quadraticCurveTo(-r*0.25, -r*0.28, -r*0.05, -r*0.3);
      ctx.lineTo(-r*0.05, r*0.35);
      ctx.closePath();
      ctx.fill();
      // 头部
      const faceG = ctx.createRadialGradient(-r*0.08, -r*0.55, 0, 0, -r*0.5, r*0.28);
      faceG.addColorStop(0, '#FFCC80');
      faceG.addColorStop(1, '#BF360C');
      ctx.fillStyle = faceG;
      ctx.beginPath();
      ctx.arc(0, -r*0.5, r*0.26, 0, Math.PI*2);
      ctx.fill();
      // 法师帽
      ctx.fillStyle = '#4A148C';
      ctx.beginPath();
      ctx.moveTo(-r*0.32, -r*0.42);
      ctx.lineTo(0, -r*1.0);
      ctx.lineTo(r*0.32, -r*0.42);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#6A1B9A';
      ctx.beginPath();
      ctx.ellipse(0, -r*0.42, r*0.36, r*0.1, 0, 0, Math.PI*2);
      ctx.fill();
      // 帽子星星
      ctx.fillStyle = '#FFD54F';
      drawStar(ctx, 0, -r*0.72, r*0.1, r*0.04);
      // 闪电法杖
      ctx.strokeStyle = '#FFD54F';
      ctx.lineWidth = r*0.1;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(r*0.3, -r*0.2);
      ctx.lineTo(r*0.45, r*0.3);
      ctx.stroke();
      // 闪电符文
      ctx.strokeStyle = '#FFEE58';
      ctx.lineWidth = r*0.08;
      ctx.beginPath();
      ctx.moveTo(r*0.22, -r*0.35);
      ctx.lineTo(r*0.35, -r*0.15);
      ctx.lineTo(r*0.22, -r*0.15);
      ctx.lineTo(r*0.35, r*0.05);
      ctx.stroke();
      // 法杖顶部光球
      const orbG = ctx.createRadialGradient(r*0.28, -r*0.28, 0, r*0.28, -r*0.28, r*0.18);
      orbG.addColorStop(0, '#FFEE58');
      orbG.addColorStop(0.5, '#FFC107');
      orbG.addColorStop(1, 'rgba(255,193,7,0)');
      ctx.fillStyle = orbG;
      ctx.beginPath();
      ctx.arc(r*0.28, -r*0.28, r*0.18, 0, Math.PI*2);
      ctx.fill();
      // 眼睛
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.ellipse(-r*0.1, -r*0.52, r*0.1, r*0.13, 0, 0, Math.PI*2);
      ctx.ellipse(r*0.1, -r*0.52, r*0.1, r*0.13, 0, 0, Math.PI*2);
      ctx.fill();
      ctx.fillStyle = '#4A148C';
      ctx.beginPath();
      ctx.arc(-r*0.08, -r*0.5, r*0.065, 0, Math.PI*2);
      ctx.arc(r*0.12, -r*0.5, r*0.065, 0, Math.PI*2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(-r*0.06, -r*0.53, r*0.028, 0, Math.PI*2);
      ctx.arc(r*0.14, -r*0.53, r*0.028, 0, Math.PI*2);
      ctx.fill();
      break;
    }
    case 'wall': {
      // 墙壁：厚重石砖
      const wallG = ctx.createLinearGradient(0, -r*0.8, 0, r*0.8);
      wallG.addColorStop(0, '#78909C');
      wallG.addColorStop(0.5, '#546E7A');
      wallG.addColorStop(1, '#37474F');
      ctx.fillStyle = wallG;
      ctx.beginPath();
      ctx.roundRect(-r*0.75, -r*0.75, r*1.5, r*1.5, r*0.2);
      ctx.fill();
      // 砖块纹理
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.fillRect(-r*0.75, -r*0.05, r*1.5, r*0.1);
      ctx.fillRect(-r*0.05, -r*0.75, r*0.1, r*0.8);
      ctx.fillRect(-r*0.55, r*0.05, r*0.1, r*0.7);
      ctx.fillRect(r*0.35, r*0.05, r*0.1, r*0.7);
      // 高光
      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      ctx.beginPath();
      ctx.roundRect(-r*0.72, -r*0.72, r*1.44, r*0.35, r*0.15);
      ctx.fill();
      break;
    }
    default: {
      ctx.fillStyle = '#888';
      ctx.beginPath();
      ctx.arc(0, 0, r*0.7, 0, Math.PI*2);
      ctx.fill();
    }
  }
  ctx.restore();
}
`;

// ===== 5. 升级美术：敌人绘制 =====
const newRenderEnemies = `
// ========== V19.0 顶级美术 - 敌人绘制 ==========
function renderEnemies(ctx) {
  if(!ctx || enemies.length === 0) return;
  
  for(const e of enemies) {
    if(typeof e.x !== 'number' || typeof e.y !== 'number') continue;
    const sz = e.sz * CS * 0.72;
    
    ctx.save();
    ctx.translate(e.x, e.y);
    
    // 阴影
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(2, sz*0.85, sz*0.65, sz*0.18, 0, 0, Math.PI*2);
    ctx.fill();
    
    // 冰冻效果
    if(e.sl > 0) {
      ctx.shadowColor = '#00E5FF';
      ctx.shadowBlur = 12;
    } else if(e.isBoss) {
      ctx.shadowColor = '#E040FB';
      ctx.shadowBlur = 20;
    } else {
      ctx.shadowColor = e.co;
      ctx.shadowBlur = 8;
    }
    
    // 身体渐变
    const bodyG = ctx.createRadialGradient(-sz*0.25, -sz*0.25, 0, 0, 0, sz);
    if(e.sl > 0) {
      bodyG.addColorStop(0, '#E0F7FA');
      bodyG.addColorStop(0.5, '#4DD0E1');
      bodyG.addColorStop(1, '#006064');
    } else if(e.isBoss) {
      bodyG.addColorStop(0, '#F3E5F5');
      bodyG.addColorStop(0.4, '#CE93D8');
      bodyG.addColorStop(1, '#4A148C');
    } else {
      bodyG.addColorStop(0, '#fff');
      bodyG.addColorStop(0.3, e.co);
      bodyG.addColorStop(1, shadeColor(e.co, -40));
    }
    ctx.fillStyle = bodyG;
    ctx.beginPath();
    ctx.arc(0, 0, sz, 0, Math.PI*2);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // 高光
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.beginPath();
    ctx.arc(-sz*0.28, -sz*0.28, sz*0.22, 0, Math.PI*2);
    ctx.fill();
    
    // 边框
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = sz*0.06;
    ctx.beginPath();
    ctx.arc(0, 0, sz*0.95, 0, Math.PI*2);
    ctx.stroke();
    
    // 绘制Q版表情
    drawEnemyFace(ctx, e, sz);
    
    // BOSS皇冠
    if(e.isBoss) {
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.moveTo(-sz*0.5, -sz*0.85);
      ctx.lineTo(-sz*0.5, -sz*1.15);
      ctx.lineTo(-sz*0.25, -sz*0.95);
      ctx.lineTo(0, -sz*1.2);
      ctx.lineTo(sz*0.25, -sz*0.95);
      ctx.lineTo(sz*0.5, -sz*1.15);
      ctx.lineTo(sz*0.5, -sz*0.85);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#FF8F00';
      ctx.lineWidth = sz*0.05;
      ctx.stroke();
    }
    
    // 侦察兵/破坏者光环
    if(e.isScout) {
      ctx.strokeStyle = 'rgba(255,215,0,0.6)';
      ctx.lineWidth = sz*0.1;
      ctx.setLineDash([sz*0.2, sz*0.15]);
      ctx.beginPath();
      ctx.arc(0, 0, sz*1.25, 0, Math.PI*2);
      ctx.stroke();
      ctx.setLineDash([]);
    } else if(e.isDestroyer) {
      ctx.strokeStyle = 'rgba(255,23,68,0.6)';
      ctx.lineWidth = sz*0.1;
      ctx.setLineDash([sz*0.2, sz*0.15]);
      ctx.beginPath();
      ctx.arc(0, 0, sz*1.25, 0, Math.PI*2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    
    ctx.restore();
    
    // 血条
    const barW = sz*2.0;
    const barH = sz*0.22;
    const barX = e.x - barW/2;
    const barY = e.y - sz - barH - sz*0.15;
    
    ctx.fillStyle = 'rgba(0,0,0,0.65)';
    ctx.beginPath();
    ctx.roundRect(barX-1, barY-1, barW+2, barH+2, barH/2+1);
    ctx.fill();
    
    const hr = Math.max(0, e.hp/e.mh);
    const hpG = ctx.createLinearGradient(barX, 0, barX+barW, 0);
    if(hr > 0.6) { hpG.addColorStop(0,'#00E676'); hpG.addColorStop(1,'#69F0AE'); }
    else if(hr > 0.3) { hpG.addColorStop(0,'#FF9100'); hpG.addColorStop(1,'#FFB74D'); }
    else { hpG.addColorStop(0,'#FF1744'); hpG.addColorStop(1,'#FF5252'); }
    ctx.fillStyle = hpG;
    ctx.beginPath();
    ctx.roundRect(barX, barY, barW*hr, barH, barH/2);
    ctx.fill();
    
    // 攻击进度条
    if(e.attacking && e.lastAtkTime) {
      const atkSpeed = e.isDestroyer ? 1500 : 3000;
      const atkPct = Math.min(1, (Date.now()-e.lastAtkTime)/atkSpeed);
      ctx.fillStyle = 'rgba(0,0,0,0.65)';
      ctx.beginPath();
      ctx.roundRect(barX-1, barY+barH+2, barW+2, barH, barH/2);
      ctx.fill();
      ctx.fillStyle = '#FF5722';
      ctx.beginPath();
      ctx.roundRect(barX, barY+barH+3, barW*atkPct, barH-2, (barH-2)/2);
      ctx.fill();
    }
  }
}

// 绘制敌人Q版表情
function drawEnemyFace(ctx, e, sz) {
  const r = sz * 0.42;
  
  // 眼睛白
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.ellipse(-r*0.38, -r*0.15, r*0.28, r*0.32, 0, 0, Math.PI*2);
  ctx.ellipse(r*0.38, -r*0.15, r*0.28, r*0.32, 0, 0, Math.PI*2);
  ctx.fill();
  
  // 瞳孔
  const pupilColor = e.isBoss ? '#4A148C' : (e.isDestroyer ? '#B71C1C' : '#1A237E');
  ctx.fillStyle = pupilColor;
  ctx.beginPath();
  ctx.arc(-r*0.32, -r*0.1, r*0.16, 0, Math.PI*2);
  ctx.arc(r*0.44, -r*0.1, r*0.16, 0, Math.PI*2);
  ctx.fill();
  
  // 眼睛高光
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(-r*0.27, -r*0.18, r*0.07, 0, Math.PI*2);
  ctx.arc(r*0.49, -r*0.18, r*0.07, 0, Math.PI*2);
  ctx.fill();
  
  // 嘴巴
  ctx.strokeStyle = 'rgba(0,0,0,0.5)';
  ctx.lineWidth = r*0.1;
  ctx.lineCap = 'round';
  ctx.beginPath();
  if(e.isDestroyer) {
    // 生气嘴
    ctx.moveTo(-r*0.35, r*0.35);
    ctx.lineTo(-r*0.15, r*0.55);
    ctx.lineTo(r*0.15, r*0.35);
    ctx.lineTo(r*0.35, r*0.55);
  } else if(e.isScout) {
    // 好奇嘴
    ctx.arc(0, r*0.3, r*0.22, 0.1*Math.PI, 0.9*Math.PI);
  } else if(e.isShifter) {
    // 调皮嘴
    ctx.moveTo(-r*0.3, r*0.4);
    ctx.quadraticCurveTo(0, r*0.2, r*0.3, r*0.4);
  } else {
    // 可爱微笑
    ctx.arc(0, r*0.2, r*0.28, 0.1*Math.PI, 0.9*Math.PI);
  }
  ctx.stroke();
  
  // 腮红
  ctx.fillStyle = 'rgba(255,138,128,0.35)';
  ctx.beginPath();
  ctx.ellipse(-r*0.65, r*0.1, r*0.18, r*0.12, 0, 0, Math.PI*2);
  ctx.ellipse(r*0.65, r*0.1, r*0.18, r*0.12, 0, 0, Math.PI*2);
  ctx.fill();
}
`;

// ===== 6. 升级背景渲染 =====
const newRenderBg = `
// ========== V19.0 顶级美术 - 背景渲染 ==========
function renderBg(c) {
  if(!c || W===0 || H===0) return;
  
  // 深空背景
  const bgG = c.createRadialGradient(W*0.4, H*0.3, 0, W*0.5, H*0.5, Math.max(W,H)*0.8);
  bgG.addColorStop(0, '#1a1a3e');
  bgG.addColorStop(0.4, '#0d0d28');
  bgG.addColorStop(0.8, '#080818');
  bgG.addColorStop(1, '#040410');
  c.fillStyle = bgG;
  c.fillRect(0, 0, W, H);
  
  // 星星背景
  if(!renderBg._stars) {
    renderBg._stars = [];
    for(let i=0; i<60; i++) {
      renderBg._stars.push({
        x: Math.random(), y: Math.random(),
        r: Math.random()*1.5+0.3,
        a: Math.random()*0.6+0.2
      });
    }
  }
  renderBg._stars.forEach(s => {
    c.fillStyle = \`rgba(255,255,255,\${s.a})\`;
    c.beginPath();
    c.arc(s.x*W, s.y*H, s.r, 0, Math.PI*2);
    c.fill();
  });
  
  // 网格
  for(let y=0; y<ROWS; y++) {
    for(let x=0; x<COLS; x++) {
      const px = ox + x*CS;
      const py = oy + y*CS;
      const v = grid[y][x];
      
      if(v === 1) {
        // 墙壁 - 石砖质感
        const wallG = c.createLinearGradient(px, py, px, py+CS);
        wallG.addColorStop(0, '#607D8B');
        wallG.addColorStop(0.5, '#455A64');
        wallG.addColorStop(1, '#263238');
        c.fillStyle = wallG;
        c.beginPath();
        c.roundRect(px+1, py+1, CS-2, CS-2, 5);
        c.fill();
        // 砖缝
        c.fillStyle = 'rgba(0,0,0,0.3)';
        c.fillRect(px+1, py+CS/2-1, CS-2, 2);
        c.fillRect(px+CS/2-1, py+1, 2, CS/2-1);
        c.fillRect(px+CS/4-1, py+CS/2+1, 2, CS/2-2);
        c.fillRect(px+3*CS/4-1, py+CS/2+1, 2, CS/2-2);
        // 高光
        c.fillStyle = 'rgba(255,255,255,0.12)';
        c.beginPath();
        c.roundRect(px+2, py+2, CS-4, CS*0.28, 4);
        c.fill();
      } else {
        // 空格 - 深色网格
        c.fillStyle = (x+y)%2===0 ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.1)';
        c.fillRect(px, py, CS, CS);
        c.strokeStyle = 'rgba(255,255,255,0.04)';
        c.lineWidth = 0.5;
        c.strokeRect(px, py, CS, CS);
      }
    }
  }
  
  // 路径高亮
  if(path && path.length > 1) {
    c.strokeStyle = 'rgba(0,229,255,0.12)';
    c.lineWidth = CS*0.35;
    c.lineCap = 'round';
    c.lineJoin = 'round';
    c.beginPath();
    c.moveTo(ox+(path[0][0]+0.5)*CS, oy+(path[0][1]+0.5)*CS);
    for(let i=1; i<path.length; i++) {
      c.lineTo(ox+(path[i][0]+0.5)*CS, oy+(path[i][1]+0.5)*CS);
    }
    c.stroke();
  }
  
  // 入口/出口发光
  const entX = ox+(ENTRY.x+0.5)*CS;
  const entY = oy+(ENTRY.y+0.5)*CS;
  const extX = ox+(EXIT.x+0.5)*CS;
  const extY = oy+(EXIT.y+0.5)*CS;
  
  const entG = c.createRadialGradient(entX, entY, 0, entX, entY, CS*0.8);
  entG.addColorStop(0, 'rgba(0,230,118,0.35)');
  entG.addColorStop(1, 'rgba(0,230,118,0)');
  c.fillStyle = entG;
  c.beginPath();
  c.arc(entX, entY, CS*0.8, 0, Math.PI*2);
  c.fill();
  
  const extG = c.createRadialGradient(extX, extY, 0, extX, extY, CS*0.8);
  extG.addColorStop(0, 'rgba(255,23,68,0.35)');
  extG.addColorStop(1, 'rgba(255,23,68,0)');
  c.fillStyle = extG;
  c.beginPath();
  c.arc(extX, extY, CS*0.8, 0, Math.PI*2);
  c.fill();
  
  // 塔渲染
  for(const t of towers) {
    if(!T[t.tp]) continue;
    const tx = ox+(t.x+0.5)*CS;
    const ty = oy+(t.y+0.5)*CS;
    const tr = CS*0.42;
    
    // 塔底座发光
    c.shadowColor = T[t.tp].c || '#888';
    c.shadowBlur = 12;
    c.fillStyle = 'rgba(0,0,0,0.4)';
    c.beginPath();
    c.ellipse(tx+2, ty+tr*0.7, tr*0.65, tr*0.18, 0, 0, Math.PI*2);
    c.fill();
    c.shadowBlur = 0;
    
    // 绘制塔图标
    drawTowerIcon(c, t.tp, tx, ty, tr);
    
    // 攻击范围（选中时显示）
    if(t === selectedTower) {
      c.strokeStyle = 'rgba(255,215,0,0.3)';
      c.lineWidth = 1.5;
      c.setLineDash([4, 4]);
      c.beginPath();
      c.arc(tx, ty, T[t.tp].r*CS, 0, Math.PI*2);
      c.stroke();
      c.setLineDash([]);
    }
  }
}
`;

// 替换drawTowerIcon函数
const towerIconStart = html.indexOf('// ========== V9.3 颜色辅助函数 ==========');
const towerIconEnd = html.indexOf('function drawEnemyIcon(ctx, e, x, y, r) {');
const drawEnemyIconEnd = html.indexOf('\n// ========== V9.3 Q版可爱敌人绘制 ==========');

if (towerIconStart !== -1 && towerIconEnd !== -1) {
  // 找到drawTowerIcon函数的结束位置
  const drawTowerStart = html.indexOf('// ========== V10.0 Q版塔绘制函数 ==========');
  const drawTowerEnd = html.indexOf('\n// ========== V9.3 颜色辅助函数 ==========');
  if (drawTowerStart !== -1 && drawTowerEnd !== -1) {
    html = html.substring(0, drawTowerStart) + newDrawTowerIcon + html.substring(drawTowerEnd);
  }
}

// 替换renderEnemies函数
const renderEnemiesStart = html.indexOf('// V17.0: 敌人渲染 - 独立函数（在render()中调用）');
const renderEnemiesEnd = html.indexOf('\n// 敌人图标绘制函数');
if (renderEnemiesStart !== -1 && renderEnemiesEnd !== -1) {
  html = html.substring(0, renderEnemiesStart) + newRenderEnemies + html.substring(renderEnemiesEnd);
}

// 替换renderBg函数
const renderBgStart = html.indexOf('// ========== V4.1: 离屏背景缓存 ==========');
const renderBgEnd = html.indexOf('\n// ========== V14 腾讯品质渲染 ==========');
if (renderBgStart !== -1 && renderBgEnd !== -1) {
  html = html.substring(0, renderBgStart) + newRenderBg + html.substring(renderBgEnd);
}

// 写入文件
fs.writeFileSync('index.html', html, 'utf8');
console.log('V19.0 升级完成！总行数:', html.split('\n').length);
