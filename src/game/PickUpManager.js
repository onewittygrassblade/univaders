import { ParticleContainer } from '../const/aliases';

import { RENDERER_WIDTH } from '../const/app';

import Movable from './Movable';

import { randomInt } from '../helpers/RandomNumbers';

const isOutsideView = (sprite) => (
  sprite.x < -sprite.width || sprite.x > RENDERER_WIDTH
);

export default class PickUpManager {
  constructor(textures) {
    this.textures = textures;
    this.pickUps = [];
    this.container = new ParticleContainer();
    this.frequency = 3000;
    this.timer = 0;
  }

  addPickup(pickUp) {
    this.pickUps.push(pickUp);
    pickUp.x = -pickUp.width;
    pickUp.y = 78;
    pickUp.move('right');
    this.container.addChild(pickUp);
  }

  clear() {
    this.container.removeChildren();
    this.pickUps = [];
  }

  update(dt) {
    // Remove pick ups out of view
    while (this.pickUps.length > 0 && isOutsideView(this.pickUps[0])) {
      this.container.removeChild(this.pickUps[0]);
      this.pickUps.shift();
    }

    // Remove pick ups that have collided with something
    this.pickUps.forEach((pickUp) => {
      if (pickUp.shouldBeRemoved) {
        this.container.removeChild(pickUp);
        this.pickUps.splice(this.pickUps.indexOf(pickUp), 1);
      }
    });

    // Update remaining projectiles
    this.pickUps.forEach((pickUp) => {
      pickUp.update(dt);
    });

    // process timer
    if (this.timer < this.frequency) {
      this.timer += dt;
    } else {
      this.addPickup(new Movable(this.textures[randomInt(0, this.textures.length - 1)], 0.15));
      this.timer = 0;
    }
  }
}
