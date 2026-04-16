// MazeTD V22.0 - Starfield Background (PixiJS)
import * as PIXI from 'pixi.js';

export class RenderStarfield {
  constructor(container) {
    this.container = container;
    this.stars = [];
    this.graphics = new PIXI.Graphics();
    this.container.addChild(this.graphics);
    
    this.init();
  }

  init() {
    // Create 120 stars with random properties
    for (let i = 0; i < 120; i++) {
      this.stars.push({
        x: Math.random(),
        y: Math.random(),
        r: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.6 + 0.2,
        twinkle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.0003 + 0.0001
      });
    }
  }

  update(delta) {
    const width = this.container.parent?.width || 400;
    const height = this.container.parent?.height || 600;
    
    this.graphics.clear();
    
    this.stars.forEach(star => {
      star.twinkle += star.speed * delta;
      const alpha = star.alpha * (0.7 + 0.3 * Math.sin(star.twinkle));
      
      this.graphics.beginFill(0xffffff, alpha);
      this.graphics.drawCircle(
        star.x * width,
        star.y * height,
        star.r
      );
      this.graphics.endFill();
    });
  }
}