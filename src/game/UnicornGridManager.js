import { Container, Sprite } from '../const/aliases';

import { RENDERER_WIDTH, RENDERER_HEIGHT } from '../const/app';
import { NUM_UNICORNS, UNICORN_SPACING } from '../const/world';

export default class UnicornGridManager {
  constructor(texture, grid) {
    this.texture = texture;

    this.createPositions();
    this.createSprites();
    this.setup(grid);
  }

  createPositions() {
    this.xPositions = [];
    this.yPositions = [];

    for (let i = 0; i < NUM_UNICORNS.rows; i++) {
      this.yPositions.push(i * UNICORN_SPACING.y);
    }
    for (let j = 0; j < NUM_UNICORNS.cols; j++) {
      this.xPositions.push(j * UNICORN_SPACING.x);
    }
  }

  createSprites() {
    this.container = new Container();
    this.unicorns = [];

    for (let i = 0; i < NUM_UNICORNS.rows; i++) {
      for (let j = 0; j < NUM_UNICORNS.cols; j++) {
        const unicorn = new Sprite(this.texture);
        unicorn.x = j * UNICORN_SPACING.x;
        unicorn.y = i * UNICORN_SPACING.y;
        this.container.addChild(unicorn);
        this.unicorns.push(unicorn);
      }
    }

    this.container.x = RENDERER_WIDTH / 2 - this.container.width / 2;
    this.width = this.container.width; // Need to save this for hasReachedEdge
  }

  setup(grid) {
    this.container.y = 140;
    this.moveCountdown = 0;
    this.moveInterval = 1000;
    this.dx = 10;
    this.dy = 0;

    let unicorn;
    let n = 0;

    for (let i = 0; i < NUM_UNICORNS.rows; i++) {
      for (let j = 0; j < NUM_UNICORNS.cols; j++) {
        unicorn = this.unicorns[n];

        if (grid[i][j] === 0) {
          unicorn.visible = false;
        } else {
          unicorn.visible = true;
        }
        n += 1;
      }
    }
  }

  hasVisibleUnicorns() {
    const visibleUnicorns = this.unicorns.filter(
      (unicorn) => unicorn.visible
    );
    return visibleUnicorns.length > 0;
  }

  getLowerUnicorns() {
    const maxYPos = Math.max(...this.yPositions);

    return this.xPositions.reduce((acc, xPos) => {
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

  increaseMoveRate() {
    if (this.moveInterval <= 200) {
      return;
    }

    this.moveInterval -= 20;
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

  hasReachedBottom() {
    return this.container.y >= RENDERER_HEIGHT - this.container.height;
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
