import { Container, Sprite, BitmapText } from '../const/aliases';

import { RENDERER_WIDTH, RENDERER_HEIGHT } from '../const/app';
import { UNICORNS, UNICORN_SPACING, INITIAL_NUMBER_OF_LIVES } from '../const/world';

import Movable from './Movable';
import UnicornManager from './UnicornManager';
import ProjectileManager from './ProjectileManager';

import contain from '../helpers/contain';
import hitTestRectangle from '../helpers/hitTestRectangle';

export default class World {
  constructor(gameContainer, textures) {
    this.container = gameContainer;
    this.textures = textures;

    this.score = 0;
    this.numberOfLives = INITIAL_NUMBER_OF_LIVES;
    this.hasAlivePlayer = true;
    this.hasUnicorns = true;

    this.createScene();
    this.createDragonProjectileManager();
    this.createUnicornProjectileManagers();
    this.createScoreDisplay();
    this.createLivesDisplay();
  }

  createScene() {
    // unicorns
    this.unicornManager = new UnicornManager(
      this.textures['unicorn.png'],
      UNICORNS.y,
      UNICORNS.x,
      UNICORN_SPACING.x,
      UNICORN_SPACING.y
    );
    this.container.addChild(this.unicornManager.container);
    this.unicorns = this.unicornManager.container.children;

    // dragon
    this.dragon = new Movable(this.textures['dragon.png'], 0.2);
    this.dragon.x = RENDERER_WIDTH / 2 - this.dragon.width / 2;
    this.dragon.y = RENDERER_HEIGHT - this.dragon.height;
    this.container.addChild(this.dragon);
  }

  createDragonProjectileManager() {
    this.dragonProjectileManager = new ProjectileManager(
      this.dragon,
      this.textures['heart_red.png'],
      'top',
      500,
      0.4
    );
    this.container.addChild(this.dragonProjectileManager.container);
  }

  createUnicornProjectileManagers() {
    this.unicornProjectileManagers = [];
    this.unicornManager.bottomRowUnicorns.forEach((unicorn) => {
      const projectileManager = new ProjectileManager(
        unicorn,
        this.textures['heart_blue.png'],
        'bottom',
        1500,
        0.15
      );
      this.unicornProjectileManagers.push(projectileManager);
      this.container.addChild(projectileManager.container);
    });
  }

  createScoreDisplay() {
    const scoreContainer = new Container();

    this.scoreText = new BitmapText(`${this.score} MONTHS`, { font: '72px arcade-white' } );
    scoreContainer.addChild(this.scoreText);

    scoreContainer.x = 20;
    scoreContainer.y = 20;
    this.container.addChild(scoreContainer);
  }

  createLivesDisplay() {
    const livesContainer = new Container();

    const livesText = new BitmapText('LIVES', { font: '72px arcade-white' });
    livesContainer.addChild(livesText);

    this.livesSpriteContainer = new Container();
    for (let i = 0; i < this.numberOfLives; i++) {
      const life = new Sprite(this.textures['dragon.png']);
      life.x = i * (life.width + 15) + livesText.width + 30;
      this.livesSpriteContainer.addChild(life);
    }
    livesContainer.addChild(this.livesSpriteContainer);

    livesText.y = livesContainer.height / 2 - livesText.height / 2;

    livesContainer.x = RENDERER_WIDTH - livesContainer.width - 20;
    livesContainer.y = 10;
    this.container.addChild(livesContainer);
  }

  reset() {
    this.hasAlivePlayer = true;

    this.dragon.x = RENDERER_WIDTH / 2 - this.dragon.width / 2;

    this.dragonProjectileManager.clear();
    this.unicornProjectileManagers.forEach((projectileManager) => {
      projectileManager.clear();
    });
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
          this.dragonProjectileManager.fire();
          break;
        default:
      }
    } else if (e.type === 'keyup') {
      if (e.keyCode === 37 || e.keyCode === 39) {
        this.dragon.stop();
      } else if (e.keyCode === 32) {
        this.dragonProjectileManager.stopFiring();
      }
    }
  }

  update(dt) {
    this.dragon.update(dt);
    this.unicornManager.update(dt);
    this.dragonProjectileManager.update(dt);
    this.unicornProjectileManagers.forEach((projectileManager) => projectileManager.update(dt));

    this.containDragon();
    this.checkUnicornFire();
    this.checkCollisions();
  }

  containDragon() {
    const dragonVsCanvas = contain(
      this.dragon,
      {
        x: 0,
        y: 0,
        width: RENDERER_WIDTH,
        height: RENDERER_HEIGHT,
      }
    );

    if (dragonVsCanvas) {
      if (dragonVsCanvas.has('left')) {
        this.dragon.x = 0;
      } else if (dragonVsCanvas.has('right')) {
        this.dragon.x = RENDERER_WIDTH - this.dragon.width;
      }
    }
  }

  checkUnicornFire() {
    const dragonPosX = this.dragon.x + this.dragon.width / 2;
    const tolerance = 20;

    this.unicornProjectileManagers.forEach((projectileManager) => {
      if (!projectileManager.parent.visible) {
        return;
      }

      const unicornPosX = projectileManager.parent.getGlobalPosition().x
        + projectileManager.parent.width / 2;

      if (unicornPosX > dragonPosX - tolerance && unicornPosX < dragonPosX + tolerance) {
        if (!projectileManager.isFiring) {
          projectileManager.fire();
        }
      } else {
        projectileManager.stopFiring();
      }
    });
  }

  checkCollisions() {
    // dragon hearts vs. unicorns
    this.dragonProjectileManager.projectiles.forEach((projectile) => {
      const hitUnicorn = this.unicorns.find(
        (unicorn) => unicorn.visible
          && hitTestRectangle(projectile, unicorn, true)
      );

      if (hitUnicorn) {
        hitUnicorn.visible = false;
        const visibleUnicorns = this.unicorns.filter(
          (unicorn) => unicorn.visible
        );
        if (visibleUnicorns.length === 0) {
          this.hasUnicorns = false;
        }

        const unicornProjectileManager = this.unicornProjectileManagers.filter(
          (projectileManager) => projectileManager.parent === hitUnicorn
        )[0];

        if (unicornProjectileManager) {
          unicornProjectileManager.stopFiring();

          const unicornAbove = this.unicornManager.getUnicornAbove(hitUnicorn);
          if (unicornAbove) {
            unicornProjectileManager.parent = unicornAbove;
          }
        }

        projectile.shouldBeRemoved = true;

        this.scoreText.text = `${++this.score} MONTHS`;
      }
    });

    // unicorn hearts vs. dragon
    this.unicornProjectileManagers.forEach((projectileManager) => {
      const hitProjectile = projectileManager.projectiles.find(
        (projectile) => hitTestRectangle(projectile, this.dragon, true)
      );

      if (hitProjectile) {
        this.loseLife();
        this.hasAlivePlayer = false;
      }
    });
  }

  hasLives() {
    return this.numberOfLives > 0;
  }

  loseLife() {
    this.livesSpriteContainer.removeChildAt(this.livesSpriteContainer.children.length - 1);

    this.numberOfLives -= 1;
  }
}
