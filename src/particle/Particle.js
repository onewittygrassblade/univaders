import Entity from './Entity';

export default class Particle extends Entity {
  constructor(texture, lifetime, x = 0, y = 0, vx = 0, vy = 0) {
    super(texture, x, y, vx, vy);

    this.lifetime = lifetime;
    this.currentLifetime = 0;
  }

  update(dt) {
    super.update(dt);

    this.currentLifetime += dt;
  }
}
