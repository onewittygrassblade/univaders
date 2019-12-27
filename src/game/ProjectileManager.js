import { ParticleContainer } from '../const/aliases';

import { RENDERER_HEIGHT } from '../const/app';

import Movable from './Movable';

export default class ProjectileManager {
  constructor(parent, texture) {
    this.parent = parent;
    this.texture = texture;

    this.projectiles = [];
    this.container = new ParticleContainer();

    this.isFiring = false;
    this.fireCountdown = 0;
    this.fireInterval = 500;
  }

  addProjectile(projectile) {
    this.projectiles.push(projectile);

    projectile.sprite.x = this.parent.sprite.x + this.parent.sprite.width / 2 - projectile.sprite.width / 2; // eslint-disable-line max-len
    projectile.sprite.y = RENDERER_HEIGHT - this.parent.sprite.height - projectile.sprite.height;
    this.container.addChild(projectile.sprite);

    projectile.move('up');
  }

  clear() {
    this.container.removeChildren();
    this.projectiles = [];
  }

  fire() {
    this.isFiring = true;
  }

  stopFiring() {
    this.isFiring = false;
  }

  update(dt) {
    while (this.projectiles.length > 0 && this.projectiles[0].sprite.y < -this.projectiles[0].sprite.height) { // eslint-disable-line max-len
      this.container.removeChild(this.projectiles[0].sprite);
      this.projectiles.shift();
    }

    this.projectiles.forEach((projectile) => {
      if (projectile.shouldBeRemoved) {
        this.container.removeChild(projectile.sprite);
        this.projectiles.splice(this.projectiles.indexOf(projectile), 1);
      }
    });

    this.projectiles.forEach((projectile) => {
      projectile.update(dt);
    });

    if (this.isFiring && this.fireCountdown <= 0) {
      this.addProjectile(new Movable(this.texture, 0.4));
      this.fireCountdown = this.fireInterval;
    } else if (this.fireCountdown > 0) {
      this.fireCountdown -= dt;
    }
  }
}
