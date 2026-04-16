// MazeTD V22.0 - Game Logic (Pure Data Layer)
// Separated from rendering for PixiJS migration

import { T, N, ENEMY_TYPES, LEVELS, CHAPTERS, ENTRY, EXIT } from './constants.js';

export class GameLogic {
  constructor() {
    this.COLS = 8;
    this.ROWS = 12;
    this.CS = 40;
    this.grid = [];
    this.towers = [];
    this.enemies = [];
    this.bullets = [];
    this.gold = 400;
    this.hp = 20;
    this.wave = 0;
    this.kills = 0;
    this.fighting = false;
    this.offset = { x: 0, y: 0 };
    
    // Initialize
    this.initGrid();
  }

  initGrid() {
    this.grid = [];
    for (let y = 0; y < this.ROWS; y++) {
      this.grid[y] = [];
      for (let x = 0; x < this.COLS; x++) {
        this.grid[y][x] = (x === 0 || x === this.COLS - 1 || y === 0 || y === this.ROWS - 1) ? 1 : 0;
      }
    }
    this.grid[ENTRY.y][ENTRY.x] = 0;
    this.grid[EXIT.y][EXIT.x] = 0;
    this.path = this.findPath();
  }

  findPath() {
    const d = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    const pq = [{ x: ENTRY.x, y: ENTRY.y, path: [[ENTRY.x, ENTRY.y]], cost: 0 }];
    const visited = {};
    visited[ENTRY.x + ',' + ENTRY.y] = 0;

    while (pq.length > 0) {
      pq.sort((a, b) => a.cost - b.cost);
      const cur = pq.shift();
      if (cur.x === EXIT.x && cur.y === EXIT.y) return cur.path;

      for (const [dx, dy] of d) {
        const nx = cur.x + dx;
        const ny = cur.y + dy;
        if (nx < 0 || nx >= this.COLS || ny < 0 || ny >= this.ROWS) continue;
        if (this.grid[ny][nx] === 1) continue;
        const key = nx + ',' + ny;
        if (visited[key] !== undefined && visited[key] <= cur.cost) continue;
        visited[key] = cur.cost + 1;
        pq.push({
          x: nx,
          y: ny,
          path: [...cur.path, [nx, ny]],
          cost: cur.cost + 1
        });
      }
    }
    return [];
  }

  setOffset(ox, oy) {
    this.offset = { x: ox, y: oy };
  }

  update(delta) {
    if (!this.fighting) return;
    // Update game state (enemy movement, tower targeting, etc.)
  }

  gridToWorld(gx, gy) {
    return {
      x: this.offset.x + gx * this.CS + this.CS / 2,
      y: this.offset.y + gy * this.CS + this.CS / 2
    };
  }

  worldToGrid(wx, wy) {
    const gx = Math.floor((wx - this.offset.x) / this.CS);
    const gy = Math.floor((wy - this.offset.y) / this.CS);
    return { x: gx, y: gy };
  }

  canBuild(gx, gy) {
    if (gx < 0 || gx >= this.COLS || gy < 0 || gy >= this.ROWS) return false;
    if (this.grid[gy][gx] === 1) return false;
    // Check if tower exists
    return !this.towers.some(t => t.gx === gx && t.gy === gy);
  }

  buildTower(type, gx, gy) {
    const tower = type === 'wall' ? { ...T.wall } : T[type];
    tower.type = type;
    tower.gx = gx;
    tower.gy = gy;
    tower.target = null;
    tower.lastShot = 0;
    this.towers.push(tower);
    this.grid[gy][gx] = 1;
    this.path = this.findPath();
  }

  setGold(amount) {
    this.gold = amount;
  }

  setHp(amount) {
    this.hp = amount;
  }

  getState() {
    return {
      gold: this.gold,
      hp: this.hp,
      wave: this.wave,
      kills: this.kills,
      towers: this.towers,
      enemies: this.enemies,
      fighting: this.fighting
    };
  }
}