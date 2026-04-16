import * as PIXI from 'pixi.js';
import { GameLogic } from './game-logic.js';
import { RenderGrid } from './render-grid.js';
import { RenderEnemy } from './render-enemy.js';
import { RenderBullet } from './render-bullet.js';
import { RenderParticle } from './render-particle.js';
import { RenderStarfield } from './render-starfield.js';
import { COLS, ROWS, CS } from './constants.js';

class MazeTDApp {
  constructor() {
    this.app = null;
    this.game = null;
    this.layers = {};
  }

  async init() {
    // 初始化 PixiJS
    this.app = new PIXI.Application({
      resizeTo: document.getElementById('canvas-box'),
      backgroundColor: 0x000000,
      antialias: true,
      resolution: Math.min(window.devicePixelRatio || 1, 2.5),
      autoDensity: true
    });

    // 挂载到 canvas-box
    const box = document.getElementById('canvas-box');
    box.appendChild(this.app.view);
    this.app.view.style.position = 'absolute';
    this.app.view.style.top = '0';
    this.app.view.style.left = '0';

    // 创建渲染层（从下到上）
    this.layers.starfield = new PIXI.Container();
    this.layers.grid = new PIXI.Container();
    this.layers.bullet = new PIXI.Container();
    this.layers.enemy = new PIXI.Container();
    this.layers.particle = new PIXI.Container();
    this.layers.ui = new PIXI.Container(); // 伤害数字等

    for (const [name, layer] of Object.entries(this.layers)) {
      this.app.stage.addChild(layer);
    }

    // 初始化星空
    this.starfield = new RenderStarfield(this.layers.starfield);
    this.starfield.init();

    // 初始化游戏逻辑（纯数据层，不依赖渲染）
    this.game = new GameLogic();

    // 初始化各渲染模块
    this.renderGrid = new RenderGrid(this.layers.grid, this.game);
    this.renderEnemy = new RenderEnemy(this.layers.enemy, this.game);
    this.renderBullet = new RenderBullet(this.layers.bullet, this.game);
    this.renderParticle = new RenderParticle(this.layers.particle, this.game);

    // 主循环
    this.app.ticker.add(this.gameLoop, this);

    // 窗口resize
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    const box = document.getElementById('canvas-box');
    const W = box.clientWidth;
    const H = box.clientHeight;
    if (W <= 0 || H <= 0) return;

    this.app.renderer.resize(W, H);

    // 计算网格偏移（保持网格居中）
    const CS = 40;
    const COLS = 8;
    const ROWS = 12;
    const ox = Math.floor((W - COLS * CS) / 2);
    const oy = Math.floor((H - ROWS * CS) / 2);

    // 更新所有层的偏移
    for (const layer of Object.values(this.layers)) {
      if (layer !== this.layers.starfield) {
        layer.position.set(ox, oy);
      }
    }

    this.game.setOffset(ox, oy);
  }

  gameLoop(delta) {
    // 更新游戏逻辑
    this.game.update(delta);
    // 更新渲染
    this.renderGrid.update();
    this.renderEnemy.update(delta);
    this.renderBullet.update(delta);
    this.renderParticle.update(delta);
    this.starfield.update(delta);
  }
}

// 启动
const app = new MazeTDApp();
app.init().then(() => {
  console.log('MazeTD V22.0 — PixiJS Engine loaded');
  // 通知HTML UI层可以初始化了
  if (window.onGameReady) window.onGameReady(app);
});
