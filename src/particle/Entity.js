import { Sprite } from '../const/aliases';

export default class Entity extends Sprite {
  constructor(texture, x = 0, y = 0, vx = 0, vy = 0) {
    super(texture);

    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
  }

  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
  }
}
