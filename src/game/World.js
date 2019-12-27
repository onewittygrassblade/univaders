import { RENDERER_WIDTH, RENDERER_HEIGHT } from '../const/app';
import { UNICORNS, UNICORN_SPACING } from '../const/world';

import Movable from './Movable';
import UnicornManager from './UnicornManager';
import ProjectileManager from './ProjectileManager';

import contain from '../helpers/contain';
import hitTestRectangle from '../helpers/hitTestRectangle';

export default class World {
  constructor(gameContainer, textures) {
    this.container = gameContainer;
    this.textures = textures;

    this.createScene();
    this.projectileManager = new ProjectileManager(this.dragon, this.textures['heart.png']);
    this.container.addChild(this.projectileManager.container);
  }

  createScene() {
    // unicorns
    this.unicornManager = new UnicornManager(
      this.textures['unicorn.png'],
      UNICORNS.x,
      UNICORNS.y,
      UNICORN_SPACING.x,
      UNICORN_SPACING.y
    );
    this.unicorns = this.unicornManager.build(); // Container

    this.unicorns.x = RENDERER_WIDTH / 2 - this.unicorns.width / 2;
    this.unicorns.y = 30;
    this.container.addChild(this.unicorns);

    // dragon
    this.dragon = new Movable(this.textures['dragon.png'], 0.2);
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
        case 32:
          this.projectileManager.fire();
          break;
        default:
      }
    } else if (e.type === 'keyup') {
      if (e.keyCode === 37 || e.keyCode === 39) {
        this.dragon.stop();
      } else if (e.keyCode === 32) {
        this.projectileManager.stopFiring();
      }
    }
  }

  update(dt) {
    this.dragon.update(dt);
    this.unicornManager.update(dt);
    this.projectileManager.update(dt);

    this.containDragon();

    this.checkCollisions();
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

  checkCollisions() {
    this.projectileManager.projectiles.forEach((projectile) => {
      const hitUnicornSprite = this.unicorns.children.find(
        (unicornSprite) => unicornSprite.visible
          && hitTestRectangle(projectile.sprite, unicornSprite, true)
      );

      if (hitUnicornSprite) {
        hitUnicornSprite.visible = false;
        projectile.shouldBeRemoved = true;
      }
    });
  }

  hasNoUnicorns() {
    return this.unicorns.children.filter(
      (unicornSprite) => unicornSprite.visible === true
    ).length === 0;
  }
}
