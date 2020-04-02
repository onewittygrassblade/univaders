import { Container } from '../const/aliases';

import { RENDERER_WIDTH, RENDERER_HEIGHT } from '../const/app';

import Movable from './Movable';
import { randomFloat } from '../helpers/RandomNumbers';

const NUM_UNICORNS_COLS = 9;
const NUM_UNICORNS_ROWS = 4;
const UNICORN_SPACING_X = 100;
const UNICORN_SPACING_Y = 100;
const UNICORN_V_MIN = -0.1;
const UNICORN_V_MAX = 0.1;

export default class {
  constructor(texture) {
    this.texture = texture;

    this.setup();
  }

  setup() {
    this.container = new Container();
    this.unicorns = [];

    for (let i = 0; i < NUM_UNICORNS_ROWS; i++) {
      for (let j = 0; j < NUM_UNICORNS_COLS; j++) {
        const unicorn = new Movable(this.texture);
        unicorn.x = j * UNICORN_SPACING_X;
        unicorn.y = i * UNICORN_SPACING_Y;
        unicorn.vx = randomFloat(UNICORN_V_MIN, UNICORN_V_MAX);
        unicorn.vy = randomFloat(UNICORN_V_MIN, UNICORN_V_MAX);
        this.container.addChild(unicorn);
        this.unicorns.push(unicorn);
      }
    }

    this.container.x = RENDERER_WIDTH / 2 - this.container.width / 2;
    this.container.y = 140;
  }

  getUnicorns() {
    return this.unicorns;
  }

  hasVisibleUnicorns() {
    const visibleUnicorns = this.unicorns.filter(
      (unicorn) => unicorn.visible
    );
    return visibleUnicorns.length > 0;
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

  /* eslint-disable class-methods-use-this */
  hasReachedBottom() {
    return false;
  }
  /* eslint-enable class-methods-use-this */
}
