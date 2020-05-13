import { Container, Sprite, BitmapText } from '../const/aliases';

import { RENDERER_WIDTH, RENDERER_HEIGHT } from '../const/app';
import { INITIAL_NUMBER_OF_LIVES, MAX_NUMBER_OF_LIVES } from '../const/world';

import Movable from './Movable';
import UnicornGridManager from './UnicornGridManager';
import UnicornFluidManager from './UnicornFluidManager';
import UnicornBossManager from './UnicornBossManager';
import ProjectileManager from './ProjectileManager';
import VeggieManager from './VeggieManager';
import Emitter from '../particle/Emitter';
import PickUpManager from './PickUpManager';
import TimeManager from '../helpers/TimeManager';
import PubSub from '../helpers/PubSub';

import processCollisions from '../helpers/processCollisions';
import contain from '../helpers/contain';
import { randomInt } from '../helpers/RandomNumbers';

const unicornClasses = {
  UnicornGridManager,
  UnicornFluidManager,
  UnicornBossManager,
};

const unicornClass = (className) => unicornClasses[className];

export default class World {
  constructor(gameContainer, textures, soundEffectsPlayer, levelData) {
    this.container = gameContainer;
    this.textures = textures;
    this.soundEffectsPlayer = soundEffectsPlayer;
    this.levelData = levelData;

    this.score = 0;
    this.numberOfLives = INITIAL_NUMBER_OF_LIVES;
    this.hasClearedLevel = false;
    this.hasAlivePlayer = true;
    this.hasUnicorns = true;
    this.unicornsHaveReachedBottom = false;
    this.timeManager = new TimeManager();

    this.build();

    PubSub.subscribe('codeEntered', (code) => {
      this.handleCode(code);
    });
  }

  build() {
    this.setupDragon();
    this.setupUnicorns();
    this.createVeggieManaer();
    this.createEmitters();
    this.createScoreDisplay();
    this.createLivesDisplay();
    this.setupPickUps();
  }

  setupDragon() {
    this.dragonTexture = this.textures['dragon.png'];
    this.dragon = new Movable(this.dragonTexture, 0.2);
    this.dragon.x = RENDERER_WIDTH / 2 - this.dragon.width / 2;
    this.dragon.y = RENDERER_HEIGHT - this.dragon.height;

    this.dragonProjectileManager = new ProjectileManager(
      this.dragon,
      this.textures['heart_red.png'],
      [{ x: 0, y: -40 }],
      'up',
      600,
      0.4,
      () => this.soundEffectsPlayer.play('soft')
    );
    this.container.addChild(this.dragonProjectileManager.container);

    this.container.addChild(this.dragon);
  }

  setupUnicorns() {
    const Klass = unicornClass(this.levelData.unicorns.class);
    this.unicornManager = new Klass(this.textures[`${this.levelData.unicorns.texture}.png`]);
    this.unicornManager.setup(this.levelData.unicorns.data);

    this.unicornProjectileManagers = [];

    this.unicornManager.getFiringUnicorns().forEach((unicorn) => {
      const projectileManager = new ProjectileManager(
        unicorn,
        this.textures['heart_blue.png'],
        this.levelData.unicorns.emitterOffsets,
        'down',
        this.levelData.unicorns.emitterFireInterval,
        0.15,
        () => {}
      );
      this.unicornProjectileManagers.push(projectileManager);
      this.container.addChild(projectileManager.container);
      projectileManager.delay(1000);
    });

    this.container.addChild(this.unicornManager.container);
  }

  createVeggieManaer() {
    this.veggieManager = new VeggieManager(
      [
        this.textures['radish.png'],
        this.textures['broccoli.png'],
        this.textures['turnip.png'],
        this.textures['carrot.png'],
      ],
      () => this.soundEffectsPlayer.play('drop')
    );
    this.container.addChild(this.veggieManager.container);
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

    const scoreLabelText = new BitmapText('SCORE', { font: '64px arcade-white' });
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
      const life = new Sprite(this.dragonTexture);
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

  setupPickUps() {
    this.pickUpManager = new PickUpManager([this.textures['pizza.png'], this.textures['beer.png']]);
    this.container.addChild(this.pickUpManager.container);

    this.pickUpActions = [
      this.gainLife.bind(this),
      this.speedUpFire.bind(this),
      this.clearUnicornProjectiles.bind(this),
    ];
  }

  gainLife() {
    const life = new Sprite(this.dragonTexture);
    life.x = this.numberOfLives * (life.width + 15);
    this.livesSpriteContainer.addChild(life);

    this.numberOfLives += 1;
    if (this.numberOfLives === MAX_NUMBER_OF_LIVES) {
      this.pickUpActions.shift();
    }

    this.soundEffectsPlayer.play('extralife');
  }

  maxLives() {
    while (this.numberOfLives < MAX_NUMBER_OF_LIVES) {
      const life = new Sprite(this.dragonTexture);
      life.x = this.numberOfLives * (life.width + 15);
      this.livesSpriteContainer.addChild(life);

      this.numberOfLives += 1;
    }

    this.pickUpActions.shift();
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
    this.dragon.canBeHit = true;

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

    this.container.removeChild(this.unicornManager.container);
    this.unicornManager = null;
    this.unicornProjectileManagers.forEach((projectileManager) => {
      this.container.removeChild(projectileManager.container);
    });
    this.unicornProjectileManagers = [];

    this.setupUnicorns();

    this.pickUpManager.clear();

    if (this.levelData.unicorns.type === 'boss') {
      this.unicornEmitter.texture = this.textures['heart_pink_small.png'];
      this.unicornEmitter.particleLifetime = 3000;

      this.score = 999;
      this.scoreText.text = '???';
    }

    this.hasUnicorns = true;
    this.hasClearedLevel = false;
  }

  handleEvent(e) {
    if (!this.dragon.visible) {
      return;
    }

    if (e.type === 'keydown') {
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
      switch (e.keyCode) {
        case 27:
          this.dragon.stop();
          this.dragonProjectileManager.stopFiring();
          break;
        case 32:
          this.dragonProjectileManager.stopFiring();
          break;
        case 37:
        case 39:
          this.dragon.stop();
          break;
        default:
      }
    }
  }

  update(dt) {
    this.dragon.update(dt);
    this.unicornManager.update(dt);
    this.dragonProjectileManager.update(dt);
    this.unicornProjectileManagers.forEach((projectileManager) => projectileManager.update(dt));
    this.veggieManager.update(dt);
    this.unicornEmitter.update(dt);
    this.unicornHeartEmitter.update(dt);
    this.dragonHeartEmitter.update(dt);
    this.pickUpEmitter.update(dt);
    this.dragonEmitter.update(dt);
    this.pickUpManager.update(dt);
    this.timeManager.update(dt);

    if (this.dragon.canBeHit) {
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
    this.unicornProjectileManagers.forEach((projectileManager) => {
      if (!projectileManager.parent.visible) {
        return;
      }

      const dragonPosX = this.dragon.x + this.dragon.width / 2;
      const xLeft = projectileManager.parent.getGlobalPosition().x;
      const xRight = xLeft + projectileManager.parent.width;
      const shouldFire = dragonPosX >= xLeft && dragonPosX <= xRight;

      if (shouldFire && !projectileManager.isFiring) {
        projectileManager.fire();
      } else {
        projectileManager.stopFiring();
      }
    });
  }

  checkCollisions() {
    // dragon hearts vs. unicorns
    processCollisions(
      this.dragonProjectileManager.projectiles,
      this.unicornManager.unicorns,
      (projectile, unicorn) => {
        projectile.canBeHit = false;
        this.processHitUnicorn(unicorn);
      }
    );

    // unicorn hearts vs. dragon
    processCollisions(
      this.unicornProjectileManagers
        .map((projectileManager) => projectileManager.projectiles)
        .flat(),
      [this.dragon],
      () => {
        this.explodeDragon();
        this.timeManager.setTimeout(() => {
          this.loseLife();
          this.hasAlivePlayer = false;
        }, 1500);
      }
    );

    // dragon hearts vs. pick ups
    processCollisions(
      this.dragonProjectileManager.projectiles,
      this.pickUpManager.pickUps,
      (projectile, pickUp) => {
        this.pickUpActions[randomInt(0, this.pickUpActions.length - 1)]();
        projectile.canBeHit = false;
        pickUp.canBeHit = false;
        this.pickUpEmitter.burst(
          7,
          pickUp.getGlobalPosition().x + pickUp.width / 2,
          pickUp.getGlobalPosition().y + pickUp.height / 2
        );
      }
    );

    // dragon vs. unicorns
    processCollisions(
      this.unicornManager.unicorns,
      [this.dragon],
      (unicorn) => {
        this.explodeDragon();
        this.timeManager.setTimeout(() => {
          this.loseLife();
          this.hasAlivePlayer = false;
        }, 1500);

        this.popUnicorn(unicorn);
      }
    );

    // veggies vs. unicorns
    processCollisions(
      this.veggieManager.container.children,
      this.unicornManager.unicorns,
      (veggie, unicorn) => {
        veggie.canBeHit = this.levelData.unicorns.type !== 'boss';
        this.processHitUnicorn(unicorn);
      }
    );

    // veggies vs. unicorn hearts
    processCollisions(
      this.veggieManager.container.children,
      this.unicornProjectileManagers
        .map((projectileManager) => projectileManager.projectiles)
        .flat(),
      (veggie, projectile) => {
        this.unicornHeartEmitter.burst(
          7,
          projectile.getGlobalPosition().x + projectile.width / 2,
          projectile.getGlobalPosition().y + projectile.height / 2
        );
        projectile.canBeHit = false;
        this.soundEffectsPlayer.play('pop');
      }
    );

    // veggies vs. dragon
    processCollisions(
      this.veggieManager.container.children,
      [this.dragon],
      () => {
        this.explodeDragon();
        this.timeManager.setTimeout(() => {
          this.loseLife();
          this.hasAlivePlayer = false;
        }, 1500);
      }
    );
  }

  processHitUnicorn(unicorn) {
    if (this.levelData.unicorns.type === 'grid' || this.levelData.unicorns.type === 'fluid') {
      this.popUnicorn(unicorn);
    }

    if (this.levelData.unicorns.type === 'grid') {
      this.unicornManager.increaseMoveRate();
    }

    if (this.levelData.unicorns.type === 'boss') {
      this.unicornManager.receiveDamage();
      this.soundEffectsPlayer.play('bubble');
    }

    if (!this.unicornManager.hasVisibleUnicorns()) {
      this.hasClearedLevel = true;
      this.dragonProjectileManager.stopFiring();
      this.clearUnicornProjectiles();
      this.clearDragonProjectiles();

      if (this.levelData.unicorns.type === 'boss') {
        this.unicornProjectileManagers.forEach((unicornProjectileManager) => {
          unicornProjectileManager.stopFiring();
        });


        const x = unicorn.getGlobalPosition().x + unicorn.width / 2;
        const y = unicorn.getGlobalPosition().y + unicorn.height / 2;
        this.unicornEmitter.burst(9, x, y);
        this.unicornEmitter.burst(9, x, y + 20);
        this.unicornEmitter.burst(9, x, y - 20);
        this.unicornEmitter.burst(9, x + 20, y);
        this.unicornEmitter.burst(9, x + 20, y + 20);
        this.unicornEmitter.burst(9, x + 20, y - 20);
        this.unicornEmitter.burst(9, x - 20, y);
        this.unicornEmitter.burst(9, x - 20, y + 20);
        this.unicornEmitter.burst(9, x - 20, y + 20);
        this.timeManager.setTimeout(() => {
          this.hasUnicorns = false;
        }, 3000);
      } else {
        this.soundEffectsPlayer.play('levelcomplete');
        this.timeManager.setTimeout(() => {
          this.hasUnicorns = false;
        }, 1500);
      }
    }
  }

  checkIfUnicornsHaveReachedBottom() {
    if (this.unicornManager.hasReachedBottom()) {
      this.explodeDragon();
      this.timeManager.setTimeout(() => {
        this.unicornsHaveReachedBottom = true;
      }, 1500);
    }
  }

  hasLives() {
    return this.numberOfLives > 0;
  }

  popUnicorn(unicorn) {
    unicorn.visible = false;
    this.soundEffectsPlayer.play('pop');
    this.unicornEmitter.burst(
      7,
      unicorn.getGlobalPosition().x + unicorn.width / 2,
      unicorn.getGlobalPosition().y + unicorn.height / 2
    );

    const unicornProjectileManager = this.unicornProjectileManagers.filter(
      (projectileManager) => projectileManager.parent === unicorn
    )[0];

    if (unicornProjectileManager) {
      unicornProjectileManager.stopFiring();

      if (this.levelData.unicorns.type === 'grid') {
        const unicornAbove = this.unicornManager.getUnicornAbove(unicorn);
        if (unicornAbove) {
          unicornProjectileManager.parent = unicornAbove;
        }
      }
    }

    this.score += 1;
    this.scoreText.text = `${this.score}`;
  }

  explodeDragon() {
    this.dragon.canBeHit = false;
    this.dragon.visible = false;
    this.dragon.stop();

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

  handleCode(code) {
    if (['caffeine', 'topup', 'fabulous', 'ratatouille'].includes(code)) {
      this.soundEffectsPlayer.play('guitar');
    } else {
      this.soundEffectsPlayer.play('denied');
      return;
    }

    switch (code) {
      case 'caffeine':
        this.dragonProjectileManager.setCheatFireRate();
        break;
      case 'topup':
        this.maxLives();
        break;
      case 'fabulous':
        this.wearSunglasses();
        break;
      case 'ratatouille':
        this.timeManager.setTimeout(() => {
          this.veggieManager.fire();
        }, 100);
        break;
      default:
    }
  }

  wearSunglasses() {
    this.dragonTexture = this.textures['dragon_sunglasses.png'];
    this.dragon.texture = this.dragonTexture;
    this.livesSpriteContainer.children.forEach((life) => {
      life.texture = this.dragonTexture;
    });
  }
}
