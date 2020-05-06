import { RENDERER_WIDTH, RENDERER_HEIGHT } from '../const/app';

import UnicornBaseManager from './UnicornBaseManager';
import Movable from './Movable';

const NUM_UNICORNS = {
  rows: 7,
  cols: 10,
};

const UNICORN_SPACING = {
  x: 100,
  y: 60,
};

const X_POS = Array.from(
  Array(NUM_UNICORNS.cols),
  (_, i) => i * UNICORN_SPACING.x
);

const Y_POS = Array.from(
  Array(NUM_UNICORNS.rows),
  (_, i) => i * UNICORN_SPACING.y
);

const WIDTH = NUM_UNICORNS.cols * 45 + (NUM_UNICORNS.cols - 1) * (UNICORN_SPACING.x - 45);

export default class UnicornGridManager extends UnicornBaseManager {
  constructor(texture) {
    super(texture);

    this.moveCountdown = 0;
    this.moveInterval = 1000;
    this.dx = 10;
  }

  setup(grid) {
    for (let i = 0; i < NUM_UNICORNS.rows; i++) {
      for (let j = 0; j < NUM_UNICORNS.cols; j++) {
        const unicorn = new Movable(this.texture);
        unicorn.x = j * UNICORN_SPACING.x;
        unicorn.y = i * UNICORN_SPACING.y;
        unicorn.visible = grid[i][j] > 0;
        this.container.addChild(unicorn);
        this.unicorns.push(unicorn);
      }
    }

    this.container.x = RENDERER_WIDTH / 2 - WIDTH / 2;
    this.container.y = 140;
  }

  getFiringUnicorns() {
    const maxYPos = Math.max(...Y_POS);

    return X_POS.reduce((acc, xPos) => {
      const visibleUnicorns = this.unicorns.filter(
        (unicorn) => unicorn.visible && unicorn.x === xPos
      );
      if (visibleUnicorns.length === 0) {
        acc.push(this.unicorns.find((unicorn) => unicorn.x === xPos && unicorn.y === maxYPos));
        return acc;
      }

      const lowerYPos = Math.max(...visibleUnicorns.map((unicorn) => unicorn.y));
      acc.push(visibleUnicorns.find((unicorn) => unicorn.y === lowerYPos));

      return acc;
    }, []);
  }

  getUnicornAbove(refUnicorn) {
    const unicornsAbove = this.unicorns.filter(
      (unicorn) => unicorn.visible && unicorn.x === refUnicorn.x
    );
    if (unicornsAbove.length > 0) {
      return unicornsAbove[unicornsAbove.length - 1];
    }
    return null;
  }

  increaseMoveRate() {
    if (this.moveInterval <= 200) return;
    this.moveInterval -= 20;
  }

  hasReachedBottom() {
    return this.container.y >= RENDERER_HEIGHT - this.container.height;
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
    const xPos = this.unicorns.filter((unicorn) => unicorn.visible)
      .map((unicorn) => unicorn.getGlobalPosition().x);
    const minX = Math.min(...xPos);
    const maxX = Math.max(...xPos) + 45;
    return (minX <= 30 && this.dx < 0) || (maxX >= RENDERER_WIDTH - 30 && this.dx > 0);
  }
}
