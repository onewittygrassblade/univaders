import { Sprite } from '../const/aliases';

export default class Movable extends Sprite {
  constructor(texture, velocity) {
    super(texture);
    this.velocity = velocity;
    this.vx = 0;
    this.vy = 0;
  }

  move(dir) {
    switch (dir) {
      case 'left':
        this.vx = -this.velocity;
        break;
      case 'right':
        this.vx = this.velocity;
        break;
      case 'up':
        this.vy = -this.velocity;
        break;
      case 'down':
        this.vy = this.velocity;
        break;
      default:
    }
  }

  stop() {
    this.vx = 0;
    this.vy = 0;
  }

  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
  }
}
