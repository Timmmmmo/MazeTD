// MazeTD V22.0 - Particle Renderer (PixiJS)
import * as PIXI from 'pixi.js';

export class RenderParticle {
  constructor(container, game) {
    this.container = container;
    this.game = game;
    this.particles = new PIXI.Container();
    this.container.addChild(this.particles);
    this.particleCount = 0;
  }

  update(delta) {
    // Simple particle system
    // In full version: spawn particles on kills, manage lifecycle
  }

  spawnKillParticle(x, y, color) {
    const count = 8;
    for (let i = 0; i < count; i++) {
      const p = new PIXI.Graphics();
      p.beginFill(color);
      p.drawCircle(0, 0, 3);
      p.endFill();
      p.x = x;
      p.y = y;
      p.vx = (Math.random() - 0.5) * 8;
      p.vy = (Math.random() - 0.5) * 8;
      p.life = 1;
      this.particles.addChild(p);
    }
  }
}