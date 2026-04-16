// MazeTD V22.0 - Bullet Renderer (PixiJS)
import * as PIXI from 'pixi.js';
import { T, CS } from './constants.js';

export class RenderBullet {
  constructor(container, game) {
    this.container = container;
    this.game = game;
    this.bullets = new PIXI.Container();
    this.container.addChild(this.bullets);
    this.bulletSprites = new Map();
    this.bulletId = 0;
  }

  update(delta) {
    const currentBullets = this.game.bullets || [];
    
    // Remove dead bullets
    for (const [id, sprite] of this.bulletSprites) {
      if (!currentBullets.find(b => b.id === id)) {
        this.bullets.removeChild(sprite);
        this.bulletSprites.delete(id);
      }
    }
    
    // Update/add bullets
    currentBullets.forEach(bullet => {
      let sprite = this.bulletSprites.get(bullet.id);
      const worldPos = this.game.gridToWorld(bullet.x, bullet.y);
      
      if (!sprite) {
        sprite = this.createBulletSprite(bullet);
        sprite.id = bullet.id;
        this.bullets.addChild(sprite);
        this.bulletSprites.set(bullet.id, sprite);
      }
      
      sprite.x = worldPos.x;
      sprite.y = worldPos.y;
    });
  }

  createBulletSprite(bullet) {
    const type = bullet.type || 'archer';
    const config = T[type] || T.archer;
    const color = this.colorToInt(config.c);
    const size = type === 'cannon' ? 12 : 8;
    
    const g = new PIXI.Graphics();
    g.beginFill(color);
    g.drawCircle(0, 0, size / 2);
    g.endFill();
    
    return g;
  }

  colorToInt(hex) {
    return parseInt(hex.replace('#', ''), 16);
  }
}