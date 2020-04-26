import Entity from '../particle/Entity';

export default class Movable extends Entity {
  constructor(texture, velocity) {
    super(texture);

    this.velocity = velocity;
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
}
