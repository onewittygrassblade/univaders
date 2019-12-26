import { Container, Sprite, BitmapText } from '../const/aliases';

import { RENDERER_WIDTH, RENDERER_HEIGHT } from '../const/app';
import { UNICORNS, UNICORN_SPACING } from '../const/world';

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
    this.dragon = new Sprite(this.textures['dragon.png']);
    this.dragon.x = RENDERER_WIDTH / 2 - this.dragon.width / 2;
    this.dragon.y = RENDERER_HEIGHT - this.dragon.height;
    this.container.addChild(this.dragon);
  }

  handleEvent(e) {

  }
}
