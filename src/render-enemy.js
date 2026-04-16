// MazeTD V22.0 - Enemy Renderer (PixiJS)
import * as PIXI from 'pixi.js';
import { ENEMY_TYPES, CS } from './constants.js';

export class RenderEnemy {
  constructor(container, game) {
    this.container = container;
    this.game = game;
    this.enemies = new PIXI.Container();
    this.container.addChild(this.enemies);
    this.enemySprites = new Map();
  }

  update(delta) {
    const currentEnemies = this.game.enemies || [];
    
    // Remove dead enemies
    for (const [id, sprite] of this.enemySprites) {
      if (!currentEnemies.find(e => e.id === id)) {
        this.enemies.removeChild(sprite);
        this.enemySprites.delete(id);
      }
    }
    
    // Update/add enemies
    currentEnemies.forEach(enemy => {
      let sprite = this.enemySprites.get(enemy.id);
      
      if (!sprite) {
        sprite = this.createEnemySprite(enemy);
        this.enemies.addChild(sprite);
        this.enemySprites.set(enemy.id, sprite);
      }
      
      // Update position with interpolation
      const worldPos = this.game.gridToWorld(enemy.x, enemy.y);
      sprite.x = worldPos.x;
      sprite.y = worldPos.y;
    });
  }

  createEnemySprite(enemy) {
    const type = ENEMY_TYPES[enemy.type] || ENEMY_TYPES.normal;
    const size = type.size * CS;
    
    const g = new PIXI.Graphics();
    
    // Body
    g.beginFill(type.color);
    g.drawCircle(0, 0, size / 2);
    g.endFill();
    
    // Glow
    g.beginFill(type.color, 0.3);
    g.drawCircle(0, 0, size / 2 + 4);
    g.endFill();
    
    g.isSprite = true;
    return g;
  }
}