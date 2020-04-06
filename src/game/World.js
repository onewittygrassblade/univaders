import { Container, Sprite, BitmapText } from '../const/aliases';

import { RENDERER_WIDTH, RENDERER_HEIGHT } from '../const/app';
import { INITIAL_NUMBER_OF_LIVES, MAX_NUMBER_OF_LIVES } from '../const/world';

import Movable from './Movable';
import UnicornGridManager from './UnicornGridManager';
import UnicornFluidManager from './UnicornFluidManager';
import ProjectileManager from './ProjectileManager';
import Emitter from '../particle/Emitter';
import PickUpManager from './PickUpManager';
import TimeManager from '../helpers/TimeManager';

import contain from '../helpers/contain';
import hitTestRectangle from '../helpers/hitTestRectangle';
import { randomInt } from '../helpers/RandomNumbers';

export default class World {
  constructor(gameContainer, textures, soundEffectsPlayer, levelData) {
    this.container = gameContainer;
    this.textures = textures;
    this.soundEffectsPlayer = soundEffectsPlayer;
    this.levelData = levelData;

    this.score = 0;
    this.numberOfLives = INITIAL_NUMBER_OF_LIVES;
    this.dragonHit = false;
    this.hasClearedLevel = false;
    this.hasAlivePlayer = true;
    this.hasUnicorns = true;
    this.unicornsHaveReachedBottom = false;
    this.timeManager = new TimeManager();

    this.createScene();
    this.createDragonProjectileManager();
    this.createUnicornProjectileManagers();
    this.createEmitters();
    this.createScoreDisplay();
    this.createLivesDisplay();
    this.createPickUpManager();
    this.createPickUpActions();
  }

  createScene() {
    // unicorns
    this.unicornManager = new UnicornGridManager(
      this.textures['unicorn.png'],
      this.levelData.unicorns.grid
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
      600,
      0.4,
      () => this.soundEffectsPlayer.play('soft')
    );
    this.container.addChild(this.dragonProjectileManager.container);
  }

  createUnicornProjectileManagers() {
    this.unicornProjectileManagers = [];

    this.unicornManager.getLowerUnicorns().forEach((unicorn) => {
      const projectileManager = new ProjectileManager(
        unicorn,
        this.textures['heart_blue.png'],
        'bottom',
        1500,
        0.15,
        () => {}
      );
      this.unicornProjectileManagers.push(projectileManager);
      this.container.addChild(projectileManager.container);
      projectileManager.delay(1000);
    });
  }

  createEmitters() {
    this.unicornEmitter = new Emitter(
      this.textures['heart_white_small.png'],
      0.05,
      500
    );
    this.container.addChild(this.unicornEmitter.particleSystem.container);

    this.unicornHeartEmitter = new Emitter(
      this.textures['heart_blue_small.png'],
      0.05,
      500
    );
    this.container.addChild(this.unicornHeartEmitter.particleSystem.container);

    this.dragonEmitter = new Emitter(
      this.textures['heart_green_small.png'],
      0.1,
      1500
    );
    this.container.addChild(this.dragonEmitter.particleSystem.container);

    this.dragonHeartEmitter = new Emitter(
      this.textures['heart_red_small.png'],
      0.05,
      500
    );
    this.container.addChild(this.dragonHeartEmitter.particleSystem.container);

    this.pickUpEmitter = new Emitter(
      this.textures['heart_orange_small.png'],
      0.05,
      500
    );
    this.container.addChild(this.pickUpEmitter.particleSystem.container);
  }

  createScoreDisplay() {
    const scoreContainer = new Container();

    const scoreLabelText = new BitmapText('MONTHS', { font: '64px arcade-white' });
    scoreContainer.addChild(scoreLabelText);

    this.scoreText = new BitmapText(`${this.score}`, { font: '64px arcade-green' });
    this.scoreText.x = scoreLabelText.width + 20;
    scoreContainer.addChild(this.scoreText);

    scoreContainer.x = 20;
    scoreContainer.y = 20;
    this.container.addChild(scoreContainer);
  }

  createLivesDisplay() {
    const livesContainer = new Container();

    const livesText = new BitmapText('LIVES', { font: '64px arcade-white' });
    livesContainer.addChild(livesText);

    let lifeWidth;

    this.livesSpriteContainer = new Container();
    for (let i = 0; i < this.numberOfLives; i++) {
      const life = new Sprite(this.textures['dragon.png']);
      lifeWidth = life.width;
      life.x = i * (lifeWidth + 15);
      this.livesSpriteContainer.addChild(life);
    }
    this.livesSpriteContainer.x = livesText.width + 30;
    livesContainer.addChild(this.livesSpriteContainer);

    livesText.y = livesContainer.height / 2 - livesText.height / 2;

    livesContainer.x = RENDERER_WIDTH
                        - livesContainer.width
                        - ((MAX_NUMBER_OF_LIVES - this.numberOfLives) * (lifeWidth + 15))
                        - 20;
    livesContainer.y = 10;
    this.container.addChild(livesContainer);
  }

  createPickUpManager() {
    this.pickUpManager = new PickUpManager([this.textures['pizza.png'], this.textures['beer.png']]);
    this.container.addChild(this.pickUpManager.container);
  }

  createPickUpActions() {
    this.pickUpActions = [
      this.gainLife.bind(this),
      this.speedUpFire.bind(this),
      this.clearUnicornProjectiles.bind(this),
    ];
  }

  gainLife() {
    const life = new Sprite(this.textures['dragon.png']);
    life.x = this.numberOfLives * (life.width + 15);
    this.livesSpriteContainer.addChild(life);

    this.numberOfLives += 1;
    if (this.numberOfLives === MAX_NUMBER_OF_LIVES) {
      this.pickUpActions.shift();
    }

    this.soundEffectsPlayer.play('extralife');
  }

  speedUpFire() {
    this.dragonProjectileManager.increaseFireRate();
    this.soundEffectsPlayer.play('powerup');
  }

  clearUnicornProjectiles() {
    this.unicornProjectileManagers.forEach((projectileManager) => {
      projectileManager.projectiles.forEach((projectile) => {
        this.unicornHeartEmitter.burst(
          7,
          projectile.getGlobalPosition().x + projectile.width / 2,
          projectile.getGlobalPosition().y + projectile.height / 2
        );
      });

      projectileManager.clear();
    });
    this.soundEffectsPlayer.play('explosion');
  }

  clearDragonProjectiles() {
    this.dragonProjectileManager.projectiles.forEach((projectile) => {
      this.dragonHeartEmitter.burst(
        7,
        projectile.getGlobalPosition().x + projectile.width / 2,
        projectile.getGlobalPosition().y + projectile.height / 2
      );
    });

    this.dragonProjectileManager.clear();
  }

  resetAfterCrash() {
    this.hasAlivePlayer = true;
    this.dragonHit = false;

    this.dragon.visible = true;
    this.dragon.x = RENDERER_WIDTH / 2 - this.dragon.width / 2;

    this.dragonProjectileManager.clear();
    this.dragonProjectileManager.resetFireRate();

    this.unicornProjectileManagers.forEach((projectileManager) => {
      projectileManager.clear();
    });
  }

  resetForNextLevel() {
    this.dragon.x = RENDERER_WIDTH / 2 - this.dragon.width / 2;
    this.dragonProjectileManager.clear();

    if (this.levelData.unicorns.type === 'grid') {
      this.unicornManager.setup(this.levelData.unicorns.grid);

      const lowerUnicorns = this.unicornManager.getLowerUnicorns();
      let n = 0;
      this.unicornProjectileManagers.forEach((projectileManager) => {
        projectileManager.clear();
        projectileManager.parent = lowerUnicorns[n];
        n += 1;
        projectileManager.delay(1000);
      });
    } else {
      this.container.removeChild(this.unicornManager.container);
      this.unicornManager = null;
      this.unicornManager = new UnicornFluidManager(this.textures['unicorn.png']);
      this.container.addChild(this.unicornManager.container);
      this.unicorns = this.unicornManager.container.children;

      this.unicornProjectileManagers.forEach((projectileManager) => {
        this.container.removeChild(projectileManager.container);
      });
      this.unicornProjectileManagers = [];
      this.unicornManager.getUnicorns().forEach((unicorn) => {
        const projectileManager = new ProjectileManager(
          unicorn,
          this.textures['heart_blue.png'],
          'bottom',
          1500,
          0.15,
          () => {}
        );
        this.unicornProjectileManagers.push(projectileManager);
        this.container.addChild(projectileManager.container);
        projectileManager.delay(1000);
      });
    }

    this.pickUpManager.clear();

    this.hasUnicorns = true;
    this.hasClearedLevel = false;
  }

  handleEvent(e) {
    if (e.type === 'keydown') {
      if (!this.dragon.visible) {
        return;
      }

      switch (e.keyCode) {
        case 37:
          this.dragon.move('left');
          break;
        case 39:
          this.dragon.move('right');
          break;
        case 32:
          if (!this.hasClearedLevel) {
            this.dragonProjectileManager.fire();
          }
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
    this.unicornEmitter.update(dt);
    this.unicornHeartEmitter.update(dt);
    this.dragonHeartEmitter.update(dt);
    this.pickUpEmitter.update(dt);
    this.dragonEmitter.update(dt);
    this.pickUpManager.update(dt);
    this.timeManager.update(dt);

    if (!this.dragonHit) {
      this.containDragon();
      this.checkUnicornFire();
      this.checkCollisions();
      this.checkIfUnicornsHaveReachedBottom();
    }
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
        this.soundEffectsPlayer.play('pop');
        this.unicornEmitter.burst(
          7,
          hitUnicorn.getGlobalPosition().x + hitUnicorn.width / 2,
          hitUnicorn.getGlobalPosition().y + hitUnicorn.height / 2
        );
        if (!this.unicornManager.hasVisibleUnicorns()) {
          this.hasClearedLevel = true;
          this.dragonProjectileManager.stopFiring();
          this.clearUnicornProjectiles();
          this.clearDragonProjectiles();
          this.soundEffectsPlayer.play('levelcomplete');
          this.timeManager.setTimeout(() => {
            this.hasUnicorns = false;
          }, 1500);
        }

        const unicornProjectileManager = this.unicornProjectileManagers.filter(
          (projectileManager) => projectileManager.parent === hitUnicorn
        )[0];

        if (unicornProjectileManager) {
          unicornProjectileManager.stopFiring();

          if (this.levelData.unicorns.type === 'grid') {
            const unicornAbove = this.unicornManager.getUnicornAbove(hitUnicorn);
            if (unicornAbove) {
              unicornProjectileManager.parent = unicornAbove;
            }
          }
        }

        projectile.shouldBeRemoved = true;

        if (this.levelData.unicorns.type === 'grid') {
          this.unicornManager.increaseMoveRate();
        }

        this.score += 1;
        this.scoreText.text = `${this.score}`;
      }
    });

    // unicorn hearts vs. dragon
    this.unicornProjectileManagers.forEach((projectileManager) => {
      const hitProjectile = projectileManager.projectiles.find(
        (projectile) => !this.dragonHit && hitTestRectangle(projectile, this.dragon, true)
      );

      if (hitProjectile) {
        this.explodeDragon();
        this.timeManager.setTimeout(() => {
          this.loseLife();
          this.hasAlivePlayer = false;
        }, 1500);
      }
    });

    // dragon hearts vs. pick ups
    this.dragonProjectileManager.projectiles.forEach((projectile) => {
      const hitPickUp = this.pickUpManager.pickUps.find(
        (pickUp) => hitTestRectangle(projectile, pickUp, true)
      );

      if (hitPickUp) {
        this.pickUpActions[randomInt(0, this.pickUpActions.length - 1)]();
        projectile.shouldBeRemoved = true;
        hitPickUp.shouldBeRemoved = true;
        this.pickUpEmitter.burst(
          7,
          hitPickUp.getGlobalPosition().x + hitPickUp.width / 2,
          hitPickUp.getGlobalPosition().y + hitPickUp.height / 2
        );
      }
    });

    // dragon vs. unicorns
    const hitUnicorn = this.unicorns.find(
      (unicorn) => unicorn.visible && hitTestRectangle(unicorn, this.dragon, true)
    );

    if (hitUnicorn) {
      this.loseGame();
    }
  }

  checkIfUnicornsHaveReachedBottom() {
    if (this.unicornManager.hasReachedBottom()) {
      this.loseGame();
    }
  }

  hasLives() {
    return this.numberOfLives > 0;
  }

  explodeDragon() {
    this.dragonHit = true;

    this.dragon.visible = false;
    this.dragonEmitter.burst(
      24,
      this.dragon.getGlobalPosition().x + this.dragon.width / 2,
      RENDERER_HEIGHT
    );
    this.dragonProjectileManager.clear();
    this.dragonProjectileManager.stopFiring();
    this.soundEffectsPlayer.play('die');
  }

  loseLife() {
    if (this.numberOfLives === MAX_NUMBER_OF_LIVES) {
      this.pickUpActions.unshift(this.gainLife.bind(this));
    }
    this.numberOfLives -= 1;
    this.livesSpriteContainer.removeChildAt(this.livesSpriteContainer.children.length - 1);
  }

  loseGame() {
    this.explodeDragon();
    this.timeManager.setTimeout(() => {
      this.unicornsHaveReachedBottom = true;
    }, 1500);
  }
}
