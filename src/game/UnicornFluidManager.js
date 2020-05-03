import { Container } from '../const/aliases';

import { RENDERER_WIDTH, RENDERER_HEIGHT } from '../const/app';

import Movable from './Movable';
import UnicornBaseManager from './UnicornBaseManager';

import { randomFloat, flipCoin } from '../helpers/RandomNumbers';

const NUM_UNICORNS = {
  rows: 4,
  cols: 9,
};

const UNICORN_SPACING = {
  x: 100,
  y: 100,
};

const UNICORN_V_MIN = 0.03;
const UNICORN_V_MAX = 0.1;

export default class UnicornFluidManager extends UnicornBaseManager {
  setup() {
    for (let i = 0; i < NUM_UNICORNS.rows; i++) {
      for (let j = 0; j < NUM_UNICORNS.cols; j++) {
        const unicorn = new Movable(this.texture);
        unicorn.x = j * UNICORN_SPACING.x;
        unicorn.y = i * UNICORN_SPACING.y;
        unicorn.vx = randomFloat(UNICORN_V_MIN, UNICORN_V_MAX) * (flipCoin() ? 1 : -1);
        unicorn.vy = randomFloat(UNICORN_V_MIN, UNICORN_V_MAX) * (flipCoin() ? 1 : -1);
        this.container.addChild(unicorn);
        this.unicorns.push(unicorn);
      }
    }

    this.container.x = RENDERER_WIDTH / 2 - this.container.width / 2;
    this.container.y = 140;
  }

  update(dt) {
    this.unicorns.forEach((unicorn) => {
      unicorn.update(dt);

      const x = unicorn.getGlobalPosition().x + unicorn.width / 2;
      const y = unicorn.getGlobalPosition().y + unicorn.height / 2;

      if (x <= 60 || x >= RENDERER_WIDTH - 60) {
        unicorn.vx = -unicorn.vx;
      }
      if (y <= 160 || y >= RENDERER_HEIGHT - 160) {
        unicorn.vy = -unicorn.vy;
      }
    });
  }
}
