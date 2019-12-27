import { Container, Sprite } from '../const/aliases';

import { RENDERER_WIDTH } from '../const/app';

export default class UnicornManager {
  constructor(texture, rows, cols, spacingX, spacingY) {
    this.texture = texture;
    this.rows = rows;
    this.cols = cols;
    this.spacingX = spacingX;
    this.spacingY = spacingY;

    this.moveCountdown = 0;
    this.moveInterval = 500;
    this.dx = 10;
    this.dy = 0;
  }

  build() {
    this.container = new Container();

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        const unicorn = new Sprite(this.texture);
        unicorn.x = i * this.spacingX;
        unicorn.y = j * this.spacingY;
        this.container.addChild(unicorn);
      }
    }

    this.width = this.container.width;

    return this.container;
  }

  update(dt) {
    if (this.moveCountdown <= 0) {
      if (
        (this.container.x <= 30 && this.dx < 0)
        || (this.container.x >= RENDERER_WIDTH - this.width - 30 && this.dx > 0)
      ) {
        this.dx = -this.dx;
        this.container.y += 30;
      } else {
        this.container.x += this.dx;
      }
      this.moveCountdown = this.moveInterval;
    } else if (this.moveCountdown > 0) {
      this.moveCountdown -= dt;
    }
  }
}
