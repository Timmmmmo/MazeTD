// MazeTD V22.0 - Grid Renderer (PixiJS)
import * as PIXI from 'pixi.js';
import { COLS, ROWS, CS } from './constants.js';

export class RenderGrid {
  constructor(container, game) {
    this.container = container;
    this.game = game;
    this.graphics = new PIXI.Graphics();
    this.container.addChild(this.graphics);
    this.lastGrid = null;
  }

  update() {
    const grid = this.game.grid;
    if (!grid) return;
    
    // Simple check: only redraw if grid changed
    const gridKey = JSON.stringify(grid);
    if (gridKey === this.lastGrid) return;
    this.lastGrid = gridKey;
    
    this.graphics.clear();
    
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const cell = grid[y][x];
        const gx = x * CS;
        const gy = y * CS;
        
        if (cell === 1) {
          // Wall
          this.graphics.beginFill(0x2a2a4a);
          this.graphics.lineStyle(1, 0x4a4a7a);
          this.graphics.drawRect(gx + 1, gy + 1, CS - 2, CS - 2);
          this.graphics.endFill();
        } else {
          // Empty cell - subtle grid lines
          this.graphics.lineStyle(1, 0x1a1a3a, 0.3);
          this.graphics.drawRect(gx, gy, CS, CS);
        }
      }
    }
    
    // Draw path highlight (lighter)
    if (this.game.path && this.game.path.length > 0) {
      this.graphics.lineStyle(2, 0x3a3a5a, 0.5);
      this.game.path.forEach(([px, py]) => {
        this.graphics.drawRect(px * CS + 4, py * CS + 4, CS - 8, CS - 8);
      });
    }
  }
}