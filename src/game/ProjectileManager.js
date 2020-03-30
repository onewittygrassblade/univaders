import { ParticleContainer } from '../const/aliases';

import { RENDERER_HEIGHT } from '../const/app';

import Movable from './Movable';

const isOutsideView = (sprite) => (
  sprite.y < -sprite.height || sprite.y > RENDERER_HEIGHT
);

export default class ProjectileManager {
  constructor(parent, texture, startPos, fireInterval, projectileSpeed) {
    this.parent = parent;
    this.texture = texture;
    this.startPos = startPos;

    this.projectiles = [];
    this.container = new ParticleContainer();

    this.isFiring = false;
    this.fireCountdown = 0;
    this.baseFireInterval = fireInterval;
    this.fireInterval = fireInterval;

    this.projectileSpeed = projectileSpeed;
  }

  addProjectile(projectile) {
    this.projectiles.push(projectile);

    projectile.x = this.parent.getGlobalPosition().x + this.parent.width / 2 - projectile.width / 2;

    if (this.startPos === 'top') {
      projectile.y = this.parent.getGlobalPosition().y - projectile.height;
      projectile.move('up');
    } else if (this.startPos === 'bottom') {
      projectile.y = this.parent.getGlobalPosition().y + this.parent.height;
      projectile.move('down');
    }
    this.container.addChild(projectile);
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

  increaseFireRate() {
    if (this.fireInterval <= 200) {
      return;
    }

    this.fireInterval -= 100;
  }

  resetFireRate() {
    this.fireInterval = this.baseFireInterval;
  }

  update(dt) {
    // Remove projectiles out of view
    while (this.projectiles.length > 0 && isOutsideView(this.projectiles[0])) {
      this.container.removeChild(this.projectiles[0]);
      this.projectiles.shift();
    }

    // Remove projectiles that have collided with something
    this.projectiles.forEach((projectile) => {
      if (projectile.shouldBeRemoved) {
        this.container.removeChild(projectile);
        this.projectiles.splice(this.projectiles.indexOf(projectile), 1);
      }
    });

    // Update remaining projectiles
    this.projectiles.forEach((projectile) => {
      projectile.update(dt);
    });

    // Process firing
    if (this.fireCountdown > 0) {
      this.fireCountdown -= dt;
      return;
    }

    if (this.isFiring) {
      this.addProjectile(new Movable(this.texture, this.projectileSpeed));
      this.fireCountdown = this.fireInterval;
    }
  }
}
