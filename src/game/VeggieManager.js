import { ParticleContainer } from '../const/aliases';

import { RENDERER_HEIGHT } from '../const/app';

import Movable from './Movable';

const isOutsideView = (sprite) => (
  sprite.y < -sprite.height || sprite.y > RENDERER_HEIGHT
);

const XPOS = [240, 480, 720, 960];

export default class VeggieManager {
  constructor(textures, playSound) {
    this.textures = textures;
    this.playSound = playSound;

    this.projectiles = [];
    this.container = new ParticleContainer();
  }

  fire() {
    XPOS.forEach((xPos, i) => {
      const projectile = new Movable(this.textures[i], 0.3);
      projectile.x = xPos - projectile.width;
      projectile.y = 70;
      projectile.move('down');
      this.container.addChild(projectile);
      this.projectiles.push(projectile);
    });

    this.playSound();
  }

  update(dt) {
    // Remove projectiles out of view
    while (this.projectiles.length > 0 && isOutsideView(this.projectiles[0])) {
      this.container.removeChild(this.projectiles[0]);
      this.projectiles.shift();
    }

    // Update remaining projectiles
    this.projectiles.forEach((projectile) => {
      projectile.update(dt);
    });
  }
}
