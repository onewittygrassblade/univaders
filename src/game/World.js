import { Container, Sprite, BitmapText } from '../const/aliases';

import { RENDERER_WIDTH, RENDERER_HEIGHT } from '../const/app';
import { UNICORNS, UNICORN_SPACING } from '../const/world';

import Dragon from './Dragon';

import contain from '../helpers/contain';

export default class World {
  constructor(gameContainer, textures) {
    this.container = gameContainer;
    this.textures = textures;

    this.createScene();
  }

  createScene() {
    // unicorns
    this.unicorns = new Container();
    for (let i = 0; i < UNICORNS.x; i++) {
      for (let j = 0; j < UNICORNS.y; j++) {
        const unicorn = new Sprite(this.textures['unicorn.png']);
        unicorn.x = i * UNICORN_SPACING.x;
        unicorn.y = j * UNICORN_SPACING.y;
        this.unicorns.addChild(unicorn);
      }
    }
    this.unicorns.x = RENDERER_WIDTH / 2 - this.unicorns.width / 2;
    this.unicorns.y = 30;
    this.container.addChild(this.unicorns);

    // dragon
    this.dragon = new Dragon(this.textures['dragon.png']);
    this.dragon.sprite.x = RENDERER_WIDTH / 2 - this.dragon.sprite.width / 2;
    this.dragon.sprite.y = RENDERER_HEIGHT - this.dragon.sprite.height;
    this.container.addChild(this.dragon.sprite);
  }

  handleEvent(e) {
    if (e.type === 'keydown') {
      switch (e.keyCode) {
        case 37:
          this.dragon.move('left');
          break;
        case 39:
          this.dragon.move('right');
          break;
        default:
      }
    } else if (e.type === 'keyup' && (e.keyCode === 37 || e.keyCode === 39)) {
      this.dragon.stop();
    }
  }

  update(dt) {
    this.dragon.update(dt);
    this.containDragon();
  }

  containDragon() {
    const dragonVsCanvas = contain(
      this.dragon.sprite,
      {
        x: 0,
        y: 0,
        width: RENDERER_WIDTH,
        height: RENDERER_HEIGHT,
      }
    );

    if (dragonVsCanvas) {
      if (dragonVsCanvas.has('left')) {
        this.dragon.sprite.x = 0;
      } else if (dragonVsCanvas.has('right')) {
        this.dragon.sprite.x = RENDERER_WIDTH - this.dragon.sprite.width;
      }
    }
  }
}
