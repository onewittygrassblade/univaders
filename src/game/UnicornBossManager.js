import { ColorOverlayFilter } from '@pixi/filter-color-overlay';

import { RENDERER_WIDTH } from '../const/app';

import UnicornBaseManager from './UnicornBaseManager';
import Movable from './Movable';

import { randomFloat, flipCoin } from '../helpers/RandomNumbers';

const V_MIN = 0.15;
const V_MAX = 0.25;
const MAX_RECEIVED_DAMAGE = 30;
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

export default class UnicornBossManager extends UnicornBaseManager {
  constructor(texture) {
    super(texture);

    this.receivedDamage = 0;
    this.changeVelocityCountdown = 0;
    this.changeVelocityInterval = 1000;
  }

  setup() {
    this.unicorn = new Movable(this.texture);
    this.container.addChild(this.unicorn);
    this.unicorns.push(this.unicorn);

    this.container.x = RENDERER_WIDTH / 2 - this.container.width / 2;
    this.container.y = 140;
  }

  receiveDamage() {
    this.unicorn.filters = [new ColorOverlayFilter(COLOURS[this.receivedDamage])];
    this.receivedDamage += 1;

    if (this.receivedDamage === MAX_RECEIVED_DAMAGE) {
      this.unicorn.visible = false;
    }
  }

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

    this.unicorn.vx = randomFloat(V_MIN, V_MAX) * (flipCoin() ? 1 : -1);

    this.changeVelocityCountdown = this.changeVelocityInterval;
  }
}
