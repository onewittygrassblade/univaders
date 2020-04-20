import { ColorOverlayFilter } from '@pixi/filter-color-overlay';

import { Container } from '../const/aliases';

import { RENDERER_WIDTH } from '../const/app';

import Movable from './Movable';
import { randomFloat } from '../helpers/RandomNumbers';

const V_MIN = 0.15;
const V_MAX = 0.25;
const COLOURS = [
  0xfff9ff,
  0xfff3ff,
  0xffeefe,
  0xffe8fe,
  0xffe2fe,
  0xffdcfe,
  0xffd6fe,
  0xffd0fd,
  0xffcafd,
  0xffc4fd,
  0xffbefd,
  0xffb8fc,
  0xffb2fc,
  0xffabfc,
  0xffa5fb,
  0xff9efb,
  0xff97fb,
  0xff91fa,
  0xff8afa,
  0xff82f9,
  0xff7bf9,
  0xff73f9,
  0xff6bf8,
  0xff63f8,
  0xff59f7,
  0xff4ff7,
  0xff44f6,
  0xff37f6,
  0xff25f5,
  0xff00f5,
];

export default class UnicornBossManager {
  constructor(texture) {
    this.texture = texture;
    this.hp = 0;
    this.changeVelocityCountdown = 0;
    this.changeVelocityInterval = 1000;

    this.setup();
  }

  setup() {
    this.container = new Container();

    this.unicorn = new Movable(this.texture);
    this.container.addChild(this.unicorn);

    this.container.x = RENDERER_WIDTH / 2 - this.container.width / 2;
    this.container.y = 140;
  }

  receiveDamage() {
    this.unicorn.filters = [new ColorOverlayFilter(COLOURS[this.hp])];
    this.hp += 1;

    if (this.hp === 30) {
      this.unicorn.visible = false;
    }
  }

  hasVisibleUnicorns() {
    return this.hp < 30;
  }

  /* eslint-disable class-methods-use-this */
  flipCoin() {
    return randomFloat(0, 1) <= 0.5;
  }

  hasReachedBottom() {
    return false;
  }
  /* eslint-enable class-methods-use-this */

  update(dt) {
    this.unicorn.update(dt);

    const { x } = this.unicorn.getGlobalPosition();
    if (x <= 50 || x >= RENDERER_WIDTH - this.unicorn.width - 50) {
      this.unicorn.vx = -this.unicorn.vx;
    }

    if (this.changeVelocityCountdown > 0) {
      this.changeVelocityCountdown -= dt;
      return;
    }

    this.unicorn.vx = randomFloat(V_MIN, V_MAX) * (this.flipCoin() ? 1 : -1);

    this.changeVelocityCountdown = this.changeVelocityInterval;
  }
}
