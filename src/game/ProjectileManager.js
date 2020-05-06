import { ParticleContainer } from '../const/aliases';

import { RENDERER_HEIGHT } from '../const/app';

import Movable from './Movable';

const isOutsideView = (sprite) => (
  sprite.y < -sprite.height || sprite.y > RENDERER_HEIGHT
);

export default class ProjectileManager {
  constructor(parent, texture, offsets, direction, fireInterval, projectileSpeed, playSound) {
    this.parent = parent;
    this.texture = texture;
    this.offsets = offsets;
    this.direction = direction;
    this.baseFireInterval = fireInterval;
    this.fireInterval = fireInterval;
    this.projectileSpeed = projectileSpeed;
    this.playSound = playSound;

    this.projectiles = [];
    this.container = new ParticleContainer();

    this.isFiring = false;
    this.fireCountdown = 0;
  }

  addProjectile(projectile, offset) {
    projectile.x = this.parent.getGlobalPosition().x
      + this.parent.width / 2 - projectile.width / 2
      + offset.x;
    projectile.y = this.parent.getGlobalPosition().y
      + this.parent.height / 2 - projectile.height / 2
      + offset.y;
    projectile.move(this.direction);

    this.container.addChild(projectile);
    this.projectiles.push(projectile);

    this.playSound();
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

  setCheatFireRate() {
    this.fireInterval = 100;
  }

  resetFireRate() {
    this.fireInterval = this.baseFireInterval;
  }

  delay(t) {
    this.fireCountdown = t;
  }

  update(dt) {
    // Remove projectiles out of view
    while (this.projectiles.length > 0 && isOutsideView(this.projectiles[0])) {
      this.container.removeChild(this.projectiles[0]);
      this.projectiles.shift();
    }

    // Remove projectiles that have collided with something
    this.projectiles.forEach((projectile) => {
      if (!projectile.canBeHit) {
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
      this.offsets.forEach((offset) => {
        this.addProjectile(new Movable(this.texture, this.projectileSpeed), offset);
      });
      this.fireCountdown = this.fireInterval;
    }
  }
}
