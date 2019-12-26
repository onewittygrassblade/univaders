import { Sprite } from '../const/aliases';

export default class Dragon {
  constructor(texture) {
    this.sprite = new Sprite(texture);
    this.velocity = 0;
  }

  move(dir) {
    switch (dir) {
      case 'left':
        this.velocity = -0.2;
        break;
      case 'right':
        this.velocity = 0.2;
        break;
      default:
    }
  }

  stop() {
    this.velocity = 0;
  }

  update(dt) {
    this.sprite.x += this.velocity * dt;
  }
}
