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

    this.bottomRowUnicorns = [];

    this.setup();
  }

  setup() {
    this.container = new Container();

    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        const unicorn = new Sprite(this.texture);
        unicorn.x = i * this.spacingX;
        unicorn.y = j * this.spacingY;
        this.container.addChild(unicorn);

        if (j === this.rows - 1) {
          this.bottomRowUnicorns.push(unicorn);
        }
      }
    }

    this.container.x = RENDERER_WIDTH / 2 - this.container.width / 2;
    this.container.y = 30;

    this.width = this.container.width; // Need to save this for hasReachedEdge
  }

  update(dt) {
    if (this.moveCountdown > 0) {
      this.moveCountdown -= dt;
      return;
    }

    if (this.hasReachedEdge()) {
      this.dx = -this.dx;
      this.container.y += 30;
    } else {
      this.container.x += this.dx;
    }

    this.moveCountdown = this.moveInterval;
  }

  hasReachedEdge() {
    return (this.container.x <= 30 && this.dx < 0)
      || (this.container.x >= RENDERER_WIDTH - this.width - 30 && this.dx > 0);
  }

  getUnicornAbove(refUnicorn) {
    const unicornsAbove = this.container.children.filter(
      (unicorn) => unicorn.visible && unicorn.x === refUnicorn.x
    );
    if (unicornsAbove.length > 0) {
      return unicornsAbove[unicornsAbove.length - 1];
    }
    return null;
  }
}
