// MazeTD V22.0 - PixiJS Version
// Logic: 100% from V20.0 | Rendering: Canvas → PixiJS WebGL
import * as PIXI from 'pixi.js';

// ============================================================
// CONSTANTS (from V20.0, exact values)
// ============================================================
const CS=40,COLS=8,ROWS=12,ENTRY={x:1,y:0},EXIT={x:COLS-2,y:ROWS-1},FPS=60;
const ELEMENT_BONUS={normal:{weakTo:[],bonus:1},fire:{weakTo:['ice','poison'],bonus:1.5},ice:{weakTo:['fire','thunder'],bonus:1.5},poison:{weakTo:['ice','archer'],bonus:1.5},thunder:{weakTo:['poison'],bonus:1.8}};
const T={archer:{c:'#4CAF50',element:'archer',d:20,r:4,s:1000,$:45,dps:20},ice:{c:'#03A9F4',element:'ice',d:12,r:3.5,s:1200,$:50,dps:10,slow:.4,slowDur:150},cannon:{c:'#F44336',element:'fire',d:35,r:2.8,s:1400,$:80,dps:25,a:1.5},poison:{c:'#8BC34A',element:'poison',d:8,r:3,s:800,$:60,dps:10,dot:15,dotStacks:5,dotDur:200},thunder:{c:'#9C27B0',element:'thunder',d:24,r:4,s:1200,$:90,dps:20,chain:3},wall:{c:'#78909C',d:0,r:0,s:0,$:15,hp:500,maxHp:500,isWall:true}};
const N={archer:'弓箭塔',ice:'冰冻塔',cannon:'炮塔',poison:'毒塔',thunder:'雷电塔',wall:'墙壁'};
const LEVELS=[{id:'1-1',name:'初阵',chapter:'tutorial',waves:3,startGold:650,goldBonus:40,unlock:['wall','archer'],enemies:['normal']},{id:'1-2',name:'疾风',chapter:'tutorial',waves:3,startGold:620,goldBonus:50,unlock:['wall','archer','ice'],enemies:['normal','fast']},{id:'1-3',name:'铁壁',chapter:'tutorial',waves:4,startGold:600,goldBonus:55,unlock:['wall','archer','ice','cannon'],enemies:['normal','fast']},{id:'1-4',name:'毒雾',chapter:'tutorial',waves:4,startGold:580,goldBonus:65,unlock:['all'],enemies:['normal','fast','tank']},{id:'1-5',name:'雷霆',chapter:'tutorial',waves:5,startGold:550,goldBonus:80,unlock:['all'],enemies:['normal','fast','tank'],boss:true},{id:'2-1',name:'暗流',chapter:'basics',waves:5,startGold:530,goldBonus:90,unlock:['all'],enemies:['normal','fast','scout']},{id:'2-2',name:'破壁',chapter:'basics',waves:6,startGold:510,goldBonus:100,unlock:['all'],enemies:['normal','fast','destroyer']},{id:'2-3',name:'幻形',chapter:'basics',waves:6,startGold:500,goldBonus:110,unlock:['all'],enemies:['normal','fast','shifter']},{id:'2-4',name:'混战',chapter:'basics',waves:7,startGold:490,goldBonus:120,unlock:['all'],enemies:['normal','fast','tank','scout']},{id:'2-5',name:'狂潮',chapter:'basics',waves:8,startGold:470,goldBonus:140,unlock:['all'],enemies:['all'],boss:true},{id:'3-1',name:'冰火',chapter:'advanced',waves:6,startGold:450,goldBonus:150,unlock:['all'],enemies:['fast','tank','destroyer']},{id:'3-2',name:'毒雷',chapter:'advanced',waves:7,startGold:440,goldBonus:160,unlock:['all'],enemies:['tank','scout','shifter']},{id:'3-3',name:'连锁',chapter:'advanced',waves:7,startGold:430,goldBonus:170,unlock:['all'],enemies:['normal','fast','scout','destroyer']},{id:'3-4',name:'逆克',chapter:'advanced',waves:8,startGold:420,goldBonus:180,unlock:['all'],enemies:['all']},{id:'3-5',name:'元素',chapter:'advanced',waves:9,startGold:400,goldBonus:200,unlock:['all'],enemies:['all'],boss:true},{id:'4-1',name:'记忆',chapter:'challenge',waves:8,startGold:380,goldBonus:210,unlock:['all'],enemies:['normal','fast','scout','destroyer']},{id:'4-2',name:'适应',chapter:'challenge',waves:9,startGold:370,goldBonus:220,unlock:['all'],enemies:['all']},{id:'4-3',name:'进化',chapter:'challenge',waves:10,startGold:360,goldBonus:230,unlock:['all'],enemies:['all']},{id:'4-4',name:'绝境',chapter:'challenge',waves:11,startGold:350,goldBonus:245,unlock:['all'],enemies:['all']},{id:'4-5',name:'终焉',chapter:'challenge',waves:12,startGold:340,goldBonus:260,unlock:['all'],enemies:['all'],boss:true},{id:'5-1',name:'噩梦',chapter:'elite',waves:10,startGold:320,goldBonus:270,unlock:['all'],enemies:['all']},{id:'5-2',name:'地狱',chapter:'elite',waves:11,startGold:310,goldBonus:285,unlock:['all'],enemies:['all']},{id:'5-3',name:'深渊',chapter:'elite',waves:12,startGold:305,goldBonus:300,unlock:['all'],enemies:['all']},{id:'5-4',name:'炼狱',chapter:'elite',waves:13,startGold:300,goldBonus:320,unlock:['all'],enemies:['all']},{id:'5-5',name:'封神',chapter:'elite',waves:15,startGold:300,goldBonus:350,unlock:['all'],enemies:['all'],boss:true}];
const CHAPTERS={tutorial:{name:'入门篇',color:'#4CAF50'},basics:{name:'基础篇',color:'#2196F3'},advanced:{name:'进阶篇',color:'#9C27B0'},challenge:{name:'挑战篇',color:'#FF5722'},elite:{name:'精英篇',color:'#FFD700'}};
const ENEMY_TYPES={normal:{hp:55,color:'#8BC34A',size:.4,gold:8,speed:.35,element:'normal'},fast:{hp:35,color:'#42A5F5',size:.32,gold:10,speed:.55,element:'ice'},tank:{hp:180,color:'#78909C',size:.52,gold:22,speed:.18,element:'poison'},destroyer:{hp:220,color:'#D32F2F',size:.48,gold:28,speed:.15,element:'fire',isDestroyer:true,atkDmg:80,atkSpeed:1500},scout:{hp:65,color:'#FFD700',size:.36,gold:14,speed:.35,element:'thunder',isScout:true},shifter:{hp:120,color:'#9C27B0',size:.42,gold:20,speed:.28,element:'normal',isShifter:true}};
const TUTORIALS={'1-1':[{text:'👆 点击网格放置墙壁'},{text:'🏹 选择弓箭塔攻击'},{text:'⚔️ 点击开战!'}],'1-2':[{text:'🌊 快速敌人出现!'},{text:'❄️ 用冰塔减速!'},{text:'⚔️ 点击开战!'}],'1-3':[{text:'💥 炮塔AOE清理!'},{text:'❄️ 冰冻配合!'},{text:'⚔️ 开战!'}]};

// ============================================================
// GAME STATE (from V20.0)
// ============================================================
let grid,path=[],towers=[],enemies=[],bullets=[],parts=[],dmgTexts=[],hist=[];
let gold,hp,wave,kills,cur='archer',tool='place',fighting=false,inited=false,currentLevel=null,curLevelIdx=0,tutorialStep=0,tutorialShown=false,waveScheduled=false;
let aiMemory={dangerZones:[],scoutSurvived:0,destroyerAttacks:0};
let shakeIntensity=0,shakeDuration=0,shakeStart=0;
let animations={list:[]};

// ============================================================
// PIXI SETUP
// ============================================================
let app=null,gfx=null,gfxTower=null,gfxEnemy=null,gfxBullet=null,gfxAnim=null,gfxDmg=null,starGfx=null;
let W=0,H=0,ox=0,oy=0;

const hex=(c)=>parseInt(c.replace('#',''),16);

async function initPixi(){
  const box=document.getElementById('canvas-box');
  const container=document.getElementById('canvas-box');
  app=new PIXI.Application();
  await app.init({
    width:box.clientWidth||360,
    height:box.clientHeight||520,
    backgroundColor:0x050510,
    antialias:true,
    resolution:window.devicePixelRatio||1,
    autoDensity:true
  });
  const canvas=app.canvas;
  canvas.style.width='100%';
  canvas.style.height='100%';
  container.appendChild(canvas);
  
  // Layered rendering (back to front)
  starGfx=new PIXI.Graphics(); app.stage.addChild(starGfx);
  gfx=new PIXI.Graphics(); app.stage.addChild(gfx);
  gfxTower=new PIXI.Graphics(); app.stage.addChild(gfxTower);
  gfxAnim=new PIXI.Graphics(); app.stage.addChild(gfxAnim);
  gfxEnemy=new PIXI.Graphics(); app.stage.addChild(gfxEnemy);
  gfxBullet=new PIXI.Graphics(); app.stage.addChild(gfxBullet);
  gfxDmg=new PIXI.Graphics(); app.stage.addChild(gfxDmg);
  
  // Starfield
  window._stars=[];
  for(let i=0;i<80;i++)window._stars.push({x:Math.random(),y:Math.random(),r:Math.random()*1.5+.5,alpha:Math.random()*.5+.3,twinkle:Math.random()*Math.PI*2});
  
  // Resize handler
  window.addEventListener('resize',()=>{
    const bw=box.clientWidth||360,bh=box.clientHeight||520;
    app.renderer.resize(bw,bh);
    W=bw;H=bh;
    ox=Math.floor((W-COLS*CS)/2);
    oy=Math.floor((H-ROWS*CS)/2);
  });
  
  // Click handler
  app.stage.eventMode='static';
  app.stage.hitArea=app.screen;
  app.stage.on('pointerdown',(e)=>{
    if(fighting)return;
    const lp=e.global;
    const r=canvas.getBoundingClientRect();
    act(lp.x-r.left,lp.y-r.top);
  });
  
  inited=true;
}

// ============================================================
// STARFIELD (from V20.0, adapted for PixiJS)
// ============================================================
function drawStarfield(){
  if(!starGfx)return;
  const t=Date.now()*.001;
  starGfx.clear();
  for(const s of window._stars||[]){
    const alpha=s.alpha+Math.sin(t+s.twinkle)*.2;
    starGfx.circle(s.x*W,s.y*H,s.r); starGfx.fill(0xffffff,Math.max(.1,alpha));
  }
}

// ============================================================
// RENDER (from V20.0 Canvas, ported to PixiJS Graphics)
// ============================================================
function render(){
  if(!app||!gfx)return;
  let sx=0,sy=0;
  if(shakeIntensity>0&&shakeDuration>0){
    const el=Date.now()-shakeStart;
    if(el<shakeDuration){const d=1-(el/shakeDuration);sx=(Math.random()-.5)*shakeIntensity*d*2;sy=(Math.random()-.5)*shakeIntensity*d*2;}
    else{shakeIntensity=0;shakeDuration=0;}
  }
  
  gfx.clear();
  gfxTower.clear();
  gfxEnemy.clear();
  gfxBullet.clear();
  gfxAnim.clear();
  gfxDmg.clear();
  drawStarfield();
  
  // Background gradient (approximate with solid)
  gfx.rect(ox+sx,oy+sy,COLS*CS,ROWS*CS); gfx.fill(0x0f0f2f);
  
  // Grid
  for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){
    const px=ox+x*CS+sx,py=oy+y*CS+sy;
    const v=grid[y][x];
    if(v===1){
      gfx.rect(px+2,py+2,CS-4,CS-4); gfx.fill(0x252550);
      gfx.stroke({width:1,color:0x3a3a6e,alpha:.3});
    }else{
      gfx.rect(px,py,CS,CS); gfx.fill(0x0f0f2f);
      gfx.stroke({width:1,color:0x1a1a3a,alpha:.3});
    }
  }
  
  // Entry/Exit markers
  const ex=ox+ENTRY.x*CS+sx,ey=oy+ENTRY.y*CS+sy;
  gfx.rect(ex,ey,CS,CS); gfx.fill(0x00E676,.15); gfx.stroke({width:2,color:0x00E676,alpha:.8});
  
  const xx=ox+EXIT.x*CS+sx,xy=oy+EXIT.y*CS+sy;
  gfx.rect(xx,xy,CS,CS); gfx.fill(0xFF1744,.15); gfx.stroke({width:2,color:0xFF1744,alpha:.8});
  
  // Danger zones (scout memory)
  if(aiMemory.dangerZones.length>0){
    const pulse=(Date.now()%1000)/1000;
    for(const z of aiMemory.dangerZones){
      gfx.rect(ox+(z.x-1)*CS+sx,oy+(z.y-1)*CS+sy,CS*3,CS*3);
      gfx.fill(0xFFD700,.05+pulse*.05);
    }
  }
  
  // Path (only when not fighting)
  if(path&&!fighting){
    gfx.moveTo(ox+(path[0][0]+.5)*CS+sx,oy+(path[0][1]+.5)*CS+sy);
    for(let i=1;i<path.length;i++)gfx.lineTo(ox+(path[i][0]+.5)*CS+sx,oy+(path[i][1]+.5)*CS+sy);
    gfx.stroke({width:3,color:0xFFD700,alpha:.5});
  }
  
  // Towers
  for(const t of towers){
    const tx=ox+(t.x+.5)*CS+sx,ty=oy+(t.y+.5)*CS+sy,r=t.r*CS;
    // Range indicator
    const gfxCircle=new PIXI.Graphics();
    gfxCircle.fill(parseInt(T[t.tp]?.c?.replace('#','')||'4CAF50',16),.08);
    gfxCircle.stroke({width:1,color:parseInt(T[t.tp]?.c?.replace('#','')||'4CAF50',16),alpha:.2});
    gfx.addChild(gfxCircle);
    // Tower body
    const col=hex(T[t.tp]?.c||'#4CAF50');
    gfxTower.circle(tx,ty,CS*.32);
    gfxTower.fill(col,.9);
    gfxTower.stroke({width:2,color:col,alpha:.8});
    // HP bar for damaged walls
    if(t.isWall&&t.hp<t.maxHp){
      const ratio=t.hp/t.maxHp;
      gfxTower.rect(tx-CS*.32,ty-CS*.5,CS*.64,4);
      gfxTower.fill(0x1a1a1a);
      gfxTower.rect(tx-CS*.32,ty-CS*.5,CS*.64*ratio,4);
      gfxTower.fill(ratio>.5?0x00E676:ratio>.25?0xFF9100:0xFF1744);
    }
  }
  
  // Bullets
  for(const b of bullets){
    gfxBullet.circle(b.x+sx,b.y+sy,5);
    gfxBullet.fill(hex(b.co));
    gfxBullet.moveTo(b.x+sx,b.y+sy);
    gfxBullet.lineTo(b.x-b.vx*.5+sx,b.y-b.vy*.5+sy);
    gfxBullet.stroke({width:2,color:hex(b.co),alpha:.4});
  }
  
  // Animations
  for(const a of animations.list){
    const alpha=a.life/a.maxLife;
    if(a.type==='shoot'){gfxAnim.circle(a.x+sx,a.y+sy,a.size); gfxAnim.stroke({width:2,color:0xFFD700,alpha});}
    else if(a.type==='place'){gfxAnim.circle(a.x+sx,a.y+sy,10+a.size); gfxAnim.stroke({width:3,color:0x00E5FF,alpha});}
  }
  
  // Particles
  for(const p of parts){
    gfxBullet.circle(p.x+sx,p.y+sy,p.sz||3);
    gfxBullet.fill(hex(p.co),p.l/p.ml);
  }
  
  // Damage texts
  for(const d of dmgTexts){
    // Clear old damage text PIXI.Text objects (prevent ghost text accumulation)
    gfxDmg.removeChildren().forEach(c=>{if(c.destroy)c.destroy();});
    // Use PIXI Text
    const dt=new PIXI.Text({text:d.txt,style:{fontSize:12,fill:d.co,fontWeight:'bold',dropShadow:{blur:4,color:0x000000,alpha:.8}}});
    dt.anchor.set(.5);
    dt.x=d.x+sx; dt.y=d.y+sy; dt.alpha=alpha;
    gfxDmg.addChild(dt);
  }
  
  // Enemies
  for(const e of enemies){
    const col=hex(e.co);
    gfxEnemy.circle(e.x+sx,e.y+sy,e.sz*CS*.5);
    gfxEnemy.fill(col,.9);
    gfxEnemy.stroke({width:2,color:col,alpha:.8});
    // Eyes
    const er=e.sz*CS*.2;
    gfxEnemy.circle(e.x-er*.3+sx,e.y-er*.1+sy,er*.15);
    gfxEnemy.circle(e.x+er*.5+sx,e.y-er*.1+sy,er*.15);
    gfxEnemy.fill(0xffffff,.8);
    // Boss crown
    if(e.boss){
      gfxEnemy.fill(0xFFD700);
      gfxEnemy.moveTo(e.x-e.sz*CS*.5+sx,e.y+e.sz*CS*.2+sy);
      gfxEnemy.lineTo(e.x-e.sz*CS*.3+sx,e.y-e.sz*CS*.4+sy);
      gfxEnemy.lineTo(e.x+sx,e.y-e.sz*CS*.6+sy);
      gfxEnemy.lineTo(e.x+e.sz*CS*.3+sx,e.y-e.sz*CS*.4+sy);
      gfxEnemy.lineTo(e.x+e.sz*CS*.5+sx,e.y+e.sz*CS*.2+sy);
      gfxEnemy.closePath();
    }
    // HP bar
    if(e.hp<e.hpMax){
      const bw=e.sz*CS*.8;
      gfxEnemy.rect(e.x-bw/2+sx,e.y-e.sz*CS*.7+sy,bw,5);
      gfxEnemy.fill(0x1a1a1a);
      const hpR=e.hp/e.hpMax;
      gfxEnemy.rect(e.x-bw/2+sx,e.y-e.sz*CS*.7+sy,bw*hpR,5);
      gfxEnemy.fill(hpR>.5?0x00E676:hpR>.25?0xFF9100:0xFF1744);
    }
  }
}

// ============================================================
// GAME LOGIC (from V20.0 - exact copy, no changes)
// ============================================================
function initGrid(){
  grid=[];for(let y=0;y<ROWS;y++){grid[y]=[];for(let x=0;x<COLS;x++)grid[y][x]=(x===0||x===COLS-1||y===0||y===ROWS-1)?1:0;}
  grid[ENTRY.y][ENTRY.x]=0;grid[EXIT.y][EXIT.x]=0;
  towers=[];enemies=[];bullets=[];parts=[];dmgTexts=[];hist=[];
  aiMemory={dangerZones:[],scoutSurvived:0,destroyerAttacks:0};
  path=findPath();
}

function findPath(){
  const d=[[0,1],[1,0],[0,-1],[-1,0]];
  const pq=[{x:ENTRY.x,y:ENTRY.y,path:[[ENTRY.x,ENTRY.y]],cost:0}];
  const visited={};visited[ENTRY.x+','+ENTRY.y]=0;
  while(pq.length>0){
    pq.sort((a,b)=>a.cost-b.cost);
    const cur=pq.shift();
    if(cur.x===EXIT.x&&cur.y===EXIT.y)return cur.path;
    for(const [dx,dy]of d){
      const nx=cur.x+dx,ny=cur.y+dy;
      if(nx<0||nx>=COLS||ny<0||ny>=ROWS)continue;
      const blocked=grid[ny][nx]!==0;
      const cost=cur.cost+(blocked?5:1);
      const key=nx+','+ny;
      if(visited[key]!==undefined&&visited[key]<=cost)continue;
      visited[key]=cost;
      pq.push({x:nx,y:ny,path:cur.path.concat([[nx,ny]]),cost});
    }
  }
  return null;
}

function getEnemyHP(baseHP,wave){return Math.floor(baseHP*(1+wave*.08));}
function getEnemyGold(baseGold,wave){return Math.floor(baseGold*(1.3+wave*.15));}

function updateUI(){
  document.getElementById('sg').textContent=gold;
  document.getElementById('sw').textContent=wave;
  document.getElementById('sh').textContent=hp;
  document.getElementById('sl').textContent=currentLevel?currentLevel.id:'1-1';
}

function updateTool(){
  document.getElementById('tool-name')&&(document.getElementById('tool-name').textContent=N[cur]);
  document.querySelectorAll('.tb').forEach(b=>{
    const tp=b.dataset?.type;
    if(!tp||!T[tp])return;
    const cost=T[tp].$;
    const bt=gold>=cost?'remove':'add';
    b.classList[bt]('disabled');
  });
  if(currentLevel&&currentLevel.unlock){
    document.querySelectorAll('.tb').forEach(b=>{
      const tp=b.dataset?.type||b.id.replace('tb-','');
      if(currentLevel.unlock[0]!=='all'&&!currentLevel.unlock.includes(tp)){b.classList.add('disabled');b.style.opacity='.3';}
      else{b.style.opacity='';}
    });
  }
}

function showTip(m){
  const t=document.getElementById('tip');
  t.textContent=m;t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),1600);
}

function act(mx,my){
  if(!tutorialShown)showTutorial();
  const x=Math.floor((mx-ox)/CS);
  const y=Math.floor((my-oy)/CS);
  if(x<=0||x>=COLS-1||y<=0||y>=ROWS-1){showTip('⚠️ 点击网格内部!');return;}
  if((x===ENTRY.x&&y===ENTRY.y)||(x===EXIT.x&&y===EXIT.y)){showTip('⚠️ 禁止放置!');return;}
  tool==='place'?place(x,y):del(x,y);
}

function place(x,y){
  const t=T[cur];
  if(grid[y][x]===2){showTip('⚠️ 已有塔!');return;}
  if(grid[y][x]===1){showTip('⚠️ 已有墙壁!');return;}
  if(gold<t.$){showTip('⚠️ 金币不足!');return;}
  hist.push({a:'p',x,y,tp:cur});
  grid[y][x]=cur==='wall'?1:2;
  gold-=t.$;
  if(cur==='wall'){towers.push({x,y,tp:cur,hp:t.hp,maxHp:t.maxHp,co:t.c});}
  else{towers.push({x,y,tp:cur,lv:1,co:t.c,d:t.d,r:t.r,s:t.s,cd:0,a:t.a||0});}
  const np=findPath();
  if(np&&np.length>0){
    path=np;
    spawnP(ox+(x+.5)*CS,oy+(y+.5)*CS,t.c,15);
    showTip('✓ '+N[cur]+' 放置成功');
    addAnimation('place',ox+(x+.5)*CS,oy+(y+.5)*CS);
  }else{
    grid[y][x]=0;gold+=t.$;if(cur!=='wall')towers.pop();hist.pop();
    showTip('⚠️ 完全阻断路径!');
    path=findPath();
  }
  updateUI();updateTool();render();
}

function del(x,y){
  if(grid[y][x]===0){showTip('⚠️ 没有物体!');return;}
  const isWall=grid[y][x]===1;
  grid[y][x]=0;
  if(isWall){gold+=Math.floor(T.wall.$*.7);showTip('✓ 墙壁删除');}
  else{for(let i=0;i<towers.length;i++)if(towers[i].x===x&&towers[i].y===y){gold+=Math.floor(T[towers[i].tp].$*.7);towers.splice(i,1);break;}showTip('✓ 塔删除');}
  path=findPath();
  updateUI();updateTool();render();
}

function pickTower(towerType){
  cur=towerType;tool='place';
  document.querySelectorAll('.tb').forEach(b=>b.classList.toggle('selected',b.dataset?.type===towerType||b.id==='tb-'+towerType));
  document.querySelectorAll('.tb').forEach(b=>b.classList.toggle('selected',b.id==='tb-'+towerType));
  updateTool();
  gold<T[towerType].$?showTip('⚠️ 金币不足!'):showTip('✓ '+N[towerType]);
}

function setTool(x){
  tool=x;
  document.querySelectorAll('.tb').forEach(b=>{
    const isDel=b.id==='tb-del';
    if(x==='delete')b.classList.toggle('selected',isDel);
    else b.classList.remove('selected');
  });
  showTip(x==='delete'?'🗑️ 点击删除':'📍 放置 '+N[cur]);
}

function showTutorial(){
  if(tutorialShown||!currentLevel)return;
  const steps=TUTORIALS[currentLevel.id];
  if(!steps||tutorialStep>=steps.length){tutorialShown=true;return;}
  showTip(steps[tutorialStep].text);
  tutorialStep++;
  if(tutorialStep>=steps.length)tutorialShown=true;
}

function toggleBattle(){
  if(!fighting){
    if(!path){showTip('⚠️ 请先建造迷宫!');return;}
    fighting=true;waveScheduled=false;
    document.getElementById('fight').textContent='|| 战斗中';
    document.getElementById('entry-mark').style.display='none';
    document.getElementById('exit-mark').style.display='none';
    if(!enemies.length&&wave<currentLevel.waves)spawnWave();
    loop();
  }else{
    document.getElementById('fight').textContent='▶ 开战';
    document.getElementById('fight').textContent='⚔️ 开战';
  }
}

function spawnWave(){
  wave++;
  const isBossWave=wave===currentLevel.waves&&currentLevel.boss;
  const ch=CHAPTERS[currentLevel.chapter]||CHAPTERS.tutorial;
  showWave(isBossWave?'👹 '+ch.name+'BOSS!':'🌊 第'+wave+'波 ['+ch.name+']',isBossWave?'#F44336':ch.color);
  if(isBossWave){
    const baseBossHp=2500,levelBonus=curLevelIdx*150,chapterBonus=Math.floor(curLevelIdx/5)*500;
    enemies.push(makeEnemy(baseBossHp+levelBonus+chapterBonus,'#AB47BC',1.2,300,{isBoss:true}));
    const cnt=3+Math.floor(curLevelIdx/3);
    for(let i=0;i<cnt;i++)setTimeout(()=>{if(fighting)enemies.push(createEnemyByType(i%2===0?'fast':'normal',wave));},500+i*400);
  }else{
    const baseCount=2+wave,cnt=Math.min(baseCount,18);
    const avail=currentLevel.enemies||['normal'];
    const useAll=avail.includes('all');
    const weights=getEnemyWeights(wave,avail,useAll);
    for(let i=0;i<cnt;i++)setTimeout(()=>{if(fighting)enemies.push(createEnemyByType(weightedRandom(weights),wave));},i*(800-Math.min(wave*5,350)));
  }
  updateUI();
}

function getEnemyWeights(wave,avail,useAll){
  const w={};
  w.normal=useAll||avail.includes('normal')?40:0;
  w.fast=useAll||avail.includes('fast')?25+Math.min(wave*2,15):0;
  w.tank=useAll||avail.includes('tank')?15+Math.min(wave*1.5,10):0;
  w.scout=(useAll||avail.includes('scout'))&&wave>=2?8+wave:0;
  w.destroyer=(useAll||avail.includes('destroyer'))&&wave>=3?7+wave*.8:0;
  w.shifter=(useAll||avail.includes('shifter'))&&wave>=4?5+wave*.6:0;
  return w;
}

function weightedRandom(w){const t=Object.values(w).reduce((a,b)=>a+b,0);let r=Math.random()*t;for(const [k,v]of Object.entries(w)){r-=v;if(r<=0)return k;}return 'normal';}

function createEnemyByType(type,wave){
  const base=ENEMY_TYPES[type];
  return makeEnemy(getEnemyHP(base.hp,wave),base.color,base.size,getEnemyGold(base.gold,wave),{
    isScout:base.isScout,isDestroyer:base.isDestroyer,isShifter:base.isShifter,atkDmg:base.atkDmg||0,atkSpeed:base.atkSpeed||1500,element:base.element||'normal'
  },base.speed);
}

function makeEnemy(hp,co,sz,g,opts={},spd=.35){
  const p=path||[[ENTRY.x,ENTRY.y]];
  return{x:ox+(p[0][0]+.5)*CS,y:oy+(p[0][1]+.5)*CS,hp,hpMax:hp,spd,co,sz,gold:g,sl:0,dt:0,dv:0,pi:0,atkDmg:opts.atkDmg||0,atkSpeed:opts.atkSpeed||1500,lastAtkTime:0,boss:opts.isBoss||false,isScout:opts.isScout||false,isDestroyer:opts.isDestroyer||false,isShifter:opts.isShifter||false,element:opts.element||'normal',shiftTimer:0,currentElement:opts.element||'normal'};
}

function showWave(m,c){
  const e=document.getElementById('wave-msg');
  e.textContent=m;e.style.color=c;e.style.display='block';
  setTimeout(()=>e.style.display='none',900);
}

function screenShake(intensity=5,duration=300){shakeIntensity=intensity;shakeDuration=duration;shakeStart=Date.now();}

function addAnimation(type,x,y){animations.list.push({type,x,y,life:type==='place'?20:15,maxLife:type==='place'?20:15,size:0});}

function updateAnimations(){
  for(let i=animations.list.length-1;i>=0;i--){
    const a=animations.list[i];
    a.life--;
    if(a.type==='shoot'||a.type==='place')a.size=(1-a.life/a.maxLife)*30;
    if(a.life<=0)animations.list.splice(i,1);
  }
  if(animations.list.length>50)animations.list=animations.list.slice(-30);
}

function spawnP(x,y,c,n,opts={}){
  for(let i=0;i<n;i++){
    const a=Math.random()*Math.PI*2,s=1.5+Math.random()*4;
    parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,co:c,l:25,ml:25,sz:2+Math.random()*3,gravity:opts.gravity||.15});
  }
  if(parts.length>200)parts=parts.slice(-100);
}

function spawnKillEffect(x,y,isBoss=false){spawnP(x,y,'#FFD700',isBoss?40:20);if(isBoss){spawnP(x,y,'#AB47BC',30);spawnP(x,y,'#E040FB',15);screenShake(10,500);}}

// ============================================================
// GAME LOOP (from V20.0 - exact copy)
// ============================================================
function loop(){
  if(!fighting)return;
  
  for(let i=enemies.length-1;i>=0;i--){
    const e=enemies[i];
    if(e.isShifter){
      e.shiftTimer++;
      if(e.shiftTimer>=300){
        e.shiftTimer=0;
        const els=['fire','ice','poison','normal'];
        e.currentElement=els[Math.floor(Math.random()*els.length)];
        const cols={fire:'#FF5722',ice:'#03A9F4',poison:'#8BC34A',normal:'#9C27B0'};
        e.co=cols[e.currentElement];
      }
    }
    let sp=e.spd;
    if(e.sl>0)sp*=.4;
    if(e.dt>0){e.hp-=e.dv;e.dt--;}
    e.pi+=sp/60;
    const p=e.pathInfo?.path||path;
    if(!p||p.length===0)continue;
    const pathLen=p.length;
    const idx=Math.min(Math.floor(e.pi),pathLen-1);
    const t2=Math.min(e.pi-Math.floor(e.pi),1);
    const currX=p[idx][0],currY=p[idx][1];
    const nextIdx=(idx<pathLen-1)?idx+1:idx;
    const nextX=p[nextIdx][0],nextY=p[nextIdx][1];
    e.x=ox+(currX+t2*(nextX-currX)+.5)*CS;
    e.y=oy+(currY+t2*(nextY-currY)+.5)*CS;
    
    if(p&&p.length>1&&e.pi>=p.length-1){
      if(e.isScout){aiMemory.scoutSurvived++;for(const t of towers)if(!t.isWall&&!aiMemory.dangerZones.find(z=>z.x===t.x&&z.y===t.y))aiMemory.dangerZones.push({x:t.x,y:t.y});}
      spawnP(e.x,e.y,'#FF1744',10,{gravity:.1});
      screenShake(8,300);
      hp--;
      enemies.splice(i,1);
      updateUI();
      if(hp<=0){gameOver();return;}
      continue;
    }
    
    if(e.hp<=0){
      gold+=e.gold;kills++;
      spawnKillEffect(e.x,e.y,e.boss);
      dmgTexts.push({x:e.x,y:e.y-20,txt:'+'+e.gold,co:'#FFD700',life:40});
      enemies.splice(i,1);
      updateUI();updateTool();
      continue;
    }
    
    const nIdx=Math.floor(e.pi)+1;
    if(nIdx<p.length){
      const nx=p[nIdx][0],ny=p[nIdx][1];
      if(grid[ny]&&grid[ny][nx]!==0){
        const now=Date.now();
        if(now-(e.lastAtkTime||0)>=e.atkSpeed){
          e.lastAtkTime=now;
          if(grid[ny][nx]===1){
            grid[ny][nx]=0;
            spawnP(ox+(nx+.5)*CS,oy+(ny+.5)*CS,'#78909C',10);
            showTip('💥 敌人摧毁了墙壁!');
          }else if(e.isDestroyer){
            let tt=null;
            for(const t of towers)if(t.x===nx&&t.y===ny){tt=t;break;}
            if(tt){grid[ny][nx]=0;towers.splice(towers.indexOf(tt),1);spawnP(ox+(nx+.5)*CS,oy+(ny+.5)*CS,tt.co,15);showTip('💥 破坏者摧毁了'+(N[tt.tp]||'塔')+'!');}
          }
          aiMemory.destroyerAttacks++;
          path=findPath();
        }
        continue;
      }
    }
  }
  
  if(enemies.length===0){
    if(wave<currentLevel.waves&&!waveScheduled){
      waveScheduled=true;
      setTimeout(()=>{if(fighting)spawnWave();waveScheduled=false;},3000);
    }else if(wave>=currentLevel.waves){
      setTimeout(levelComplete,600);return;
    }
  }
  
  // Tower attacks
  for(const t of towers){
    if(t.cd>0){t.cd--;continue;}
    if(t.d===0)continue;
    const tx=ox+(t.x+.5)*CS,ty=oy+(t.y+.5)*CS,rn=t.r*CS;
    let tg=null,md=Infinity;
    for(const e of enemies){const d=Math.hypot(e.x-tx,e.y-ty);if(d<rn&&d<md){md=d;tg=e;}}
    if(tg){
      t.cd=Math.floor(t.s/1000*FPS);
      const a=Math.atan2(tg.y-ty,tg.x-tx);
      let dmgMult=1;
      const towerElement=T[t.tp]?.element||'normal';
      const enemyElement=tg.isShifter?tg.currentElement:tg.element;
      const weakness=ELEMENT_BONUS[enemyElement]?.weakTo||[];
      if(weakness.includes(towerElement))dmgMult=1.5;
      else if(ELEMENT_BONUS[enemyElement]?.bonus&&towerElement===enemyElement)dmgMult=.7;
      bullets.push({x:tx,y:ty,vx:Math.cos(a)*12,vy:Math.sin(a)*12,d:t.d,co:t.co,src:t,dmgMult,element:towerElement});
      addAnimation('shoot',tx,ty);
    }
  }
  
  // Bullet updates
  for(let i=bullets.length-1;i>=0;i--){
    const b=bullets[i];
    b.x+=b.vx;b.y+=b.vy;
    if(b.x<0||b.x>W||b.y<0||b.y>H){bullets.splice(i,1);continue;}
    for(let j=enemies.length-1;j>=0;j--){
      const e=enemies[j];
      if(Math.hypot(e.x-b.x,e.y-b.y)<e.sz*CS*.5+5){
        const finalDmg=Math.floor(b.d*(b.dmgMult||1));
        e.hp-=finalDmg;
        const txtColor=(b.dmgMult||1)>1?'#FFD700':'#F44336';
        dmgTexts.push({x:e.x,y:e.y-30,txt:(b.dmgMult||1)>1?'💥':''+finalDmg,co:txtColor,life:30});
        if(b.src.tp==='ice')e.sl=T.ice.slowDur;
        if(b.src.tp==='poison'){
          e.poisonStacks=(e.poisonStacks||0)+1;
          e.poisonStacks=Math.min(e.poisonStacks,T.poison.dotStacks);
          e.dt=T.poison.dotDur;e.dv=T.poison.dot*e.poisonStacks;
        }
        if(b.src.a){
          const aoe=enemies.filter(o=>o!==e&&Math.hypot(o.x-b.x,o.y-b.y)<b.src.a*CS);
          for(const o of aoe)o.hp-=b.d*.5*(b.dmgMult||1);
        }
        if(b.src.chain){
          let cc=b.src.chain,cm=.8,chained=[e],cx=b.x,cy=b.y;
          while(cc>0){
            let nn=null,nd=Infinity;
            for(const o of enemies){if(chained.includes(o))continue;const d=Math.hypot(o.x-cx,o.y-cy);if(d<CS*2.5&&d<nd){nn=o;nd=d;}}
            if(nn){nn.hp-=b.d*cm*(b.dmgMult||1);dmgTexts.push({x:nn.x,y:nn.y-30,txt:'⚡'+Math.floor(b.d*cm*(b.dmgMult||1)),co:'#FFD700',life:25});chained.push(nn);cx=nn.x;cy=nn.y;cm*=.6;}
            cc--;
          }
        }
        spawnP(b.x,b.y,b.co,3);
        bullets.splice(i,1);break;
      }
    }
  }
  
  for(let i=parts.length-1;i>=0;i--){const p=parts[i];p.x+=p.vx;p.y+=p.vy;p.y+=p.gravity||.15;p.l--;if(p.l<=0)parts.splice(i,1);}
  for(let i=dmgTexts.length-1;i>=0;i--){dmgTexts[i].y-=1.5;dmgTexts[i].life--;if(dmgTexts[i].life<=0)dmgTexts.splice(i,1);}
  if(dmgTexts.length>50)dmgTexts=dmgTexts.slice(-30);
  updateAnimations();
  render();
  requestAnimationFrame(loop);
}

// ============================================================
// GAME FLOW (from V20.0)
// ============================================================
function startGame(){
  curLevelIdx=0;
  currentLevel=LEVELS[curLevelIdx];
  gold=currentLevel.startGold;
  hp=20;wave=0;kills=0;fighting=false;tutorialStep=0;tutorialShown=false;
  document.getElementById('menu').style.display='none';
  document.getElementById('game').style.display='flex';
  document.getElementById('over').style.display='none';
  document.getElementById('level-complete').style.display='none';
  document.getElementById('entry-mark').style.display='flex';
  document.getElementById('exit-mark').style.display='flex';
  document.getElementById('fight').textContent='[开战]';
  if(!inited){
    initPixi().then(()=>{initGrid();updateUI();updateTool();render();setTimeout(showTutorial,500);});
  }else{
    initGrid();updateUI();updateTool();render();setTimeout(showTutorial,500);
  }
}

function gameOver(){
  fighting=false;
  document.getElementById('fw').textContent=wave;
  document.getElementById('fk').textContent=kills;
  document.getElementById('over').style.display='flex';
}

function levelComplete(){
  fighting=false;
  const stars=hp>=18?3:hp>=12?2:1;
  const bonus=currentLevel.goldBonus;
  document.getElementById('stars').textContent='⭐'.repeat(stars);
  document.getElementById('bg').textContent='+'+bonus;
  document.getElementById('level-complete').style.display='flex';
}

function nextLevel(){
  curLevelIdx++;
  if(curLevelIdx>=LEVELS.length)curLevelIdx=0;
  currentLevel=LEVELS[curLevelIdx];
  gold=currentLevel.startGold;
  hp=20;wave=0;kills=0;fighting=false;tutorialStep=0;tutorialShown=false;
  document.getElementById('level-complete').style.display='none';
  document.getElementById('entry-mark').style.display='flex';
  document.getElementById('exit-mark').style.display='flex';
  document.getElementById('fight').textContent='⚔️ 开战';
  initGrid();updateUI();updateTool();render();
  setTimeout(showTutorial,500);
}

function showMenu(){
  document.getElementById('menu').style.display='flex';
  document.getElementById('game').style.display='none';
  document.getElementById('over').style.display='none';
  document.getElementById('level-complete').style.display='none';
}

function doUpgrade(){
  const panel=document.getElementById('upgrade-panel');
  if(!panel.dataset.x)return;
  const x=parseInt(panel.dataset.x),y=parseInt(panel.dataset.y);
  panel.style.display='none';
  const t=towers.find(t=>t.x===x&&t.y===y);
  if(!t||t.tp==='wall'){showTip('⚠️ 该类型无法升级');return;}
  if(t.lv>=3){showTip('⭐ 已达满级 (Lv.3)');return;}
  const baseCost=T[t.tp].$;
  const cost=Math.floor(baseCost*(t.lv+1)*.6);
  if(gold<cost){showTip('⚠️ 金币不足! 需要 '+cost);return;}
  gold-=cost;
  t.lv=(t.lv||1)+1;
  t.d=Math.floor(T[t.tp].d*(1+(t.lv-1)*.4));
  t.r=parseFloat((T[t.tp].r*(1+(t.lv-1)*.15)).toFixed(1));
  t.s=Math.floor(T[t.tp].s*(1-(t.lv-1)*.2));
  spawnP(ox+(x+.5)*CS,oy+(y+.5)*CS,'#FFD700',20);
  showTip('⬆ Lv.'+t.lv+' '+N[t.tp]+' 升级成功!');
  updateUI();
}

window.startGame=startGame;
window.toggleBattle=toggleBattle;
window.pickTower=pickTower;
window.setTool=setTool;
window.nextLevel=nextLevel;
window.showMenu=showMenu;
window.doUpgrade=doUpgrade;

// Make tower buttons referenceable
document.querySelectorAll('.tb').forEach(b=>{
  const tp=b.id.replace('tb-','');
  if(tp&&tp!=='del')b.dataset.type=tp;
});