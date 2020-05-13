import { ColorOverlayFilter } from '@pixi/filter-color-overlay';

import { BitmapText, Container, Sprite } from '../const/aliases';

import State from './State';
import TimeManager from '../helpers/TimeManager';

import { RENDERER_WIDTH } from '../const/app';

const COLOURS = [
  0xfc0303,
  0xfc8403,
  0xfcf003,
  0x52fc03,
  0x03fcf8,
  0x0320fc,
  0xf803fc,
];

export default class GameOverState extends State {
  constructor(stateStack, context) {
    super(stateStack, context);

    this.context.musicPlayer.play('Who Likes to Party');
    this.timeManager = new TimeManager();
    this.punchlineIsFadingIn = false;
    this.blinkingTimer = 0;
    this.blinkingPeriod = 490;
    this.blinkingIndex = 1;
    this.canHandleKeyEvents = false;

    this.build();
  }

  build() {
    let yPos = 40;

    this.unicornsContainer = new Container();
    for (let i = 0; i < 9; i++) {
      const unicorn = new Sprite(this.context.textures['unicorn.png']);
      unicorn.filters = [new ColorOverlayFilter(COLOURS[i % COLOURS.length])];
      unicorn.x = i * 120;
      this.unicornsContainer.addChild(unicorn);
    }
    this.unicornsContainer.x = RENDERER_WIDTH / 2 - this.unicornsContainer.width / 2;
    this.unicornsContainer.y = yPos;
    yPos += 120;
    this.container.addChild(this.unicornsContainer);

    const titleText = this.context.score === 999 ? 'Amazing!' : 'Well done!';
    const title = new BitmapText(titleText, { font: '180px arcade-white' });
    title.x = RENDERER_WIDTH / 2 - title.width / 2;
    title.y = yPos;
    yPos += 180;
    this.container.addChild(title);

    const scoreContainer = new Container();
    const text1 = new BitmapText('You scored:', { font: '72px arcade-white' });
    scoreContainer.addChild(text1);
    const score = this.context.score === 999 ? 'infinity' : this.context.score.toString();
    const scoreText = new BitmapText(score, { font: '72px arcade-green' });
    scoreText.x = text1.width + 44;
    scoreContainer.addChild(scoreText);
    scoreContainer.x = RENDERER_WIDTH / 2 - scoreContainer.width / 2;
    scoreContainer.y = yPos;
    yPos += 80;
    this.container.addChild(scoreContainer);

    const punchline = this.context.score === 999 ? '...and then some' : '...for now';
    this.punchlineText = new BitmapText(punchline, { font: '72px arcade-white' });
    this.punchlineText.x = RENDERER_WIDTH / 2 - this.punchlineText.width / 2;
    this.punchlineText.y = yPos;
    yPos += 180;
    this.punchlineText.alpha = 0;
    this.timeManager.setTimeout(() => {
      this.punchlineIsFadingIn = true;
    }, 2000);
    this.container.addChild(this.punchlineText);

    const hintContainer = new Container();

    const hint = new BitmapText('Back to title', { font: '72px arcade-white' });
    hint.x = RENDERER_WIDTH / 2 - hint.width / 2;
    hint.y = yPos;
    hintContainer.addChild(hint);

    const leftSelectionMarker = new BitmapText('.', { font: '72px arcade-white' });
    const rightSelectionMarker = new BitmapText('.', { font: '72px arcade-white' });
    leftSelectionMarker.x = hint.x - leftSelectionMarker.width - 30;
    leftSelectionMarker.y = hint.y - 14;
    rightSelectionMarker.x = hint.x + hint.width + 8;
    rightSelectionMarker.y = hint.y - 14;
    hintContainer.addChild(leftSelectionMarker);
    hintContainer.addChild(rightSelectionMarker);

    hintContainer.children.forEach((child) => {
      child.visible = false;
    });

    this.container.addChild(hintContainer);
    this.timeManager.setTimeout(() => {
      hintContainer.children.forEach((child) => {
        child.visible = true;
      });
      this.canHandleKeyEvents = true;
    }, 4100);

    this.dragon = new Sprite(this.context.textures['dragon.png']);
    this.dragon.x = 130;
    this.dragon.y = 500;
    this.container.addChild(this.dragon);
    const guitar = new Sprite(this.context.textures['guitar.png']);
    guitar.x = 120;
    guitar.y = 508;
    this.container.addChild(guitar);

    this.hearts = [];
    const heartPos = [
      { x: 940, y: 460 },
      { x: 1030, y: 440 },
      { x: 1100, y: 500 },
      { x: 1000, y: 530 },
      { x: 910, y: 560 },
      { x: 980, y: 620 },
      { x: 1080, y: 590 },
    ];
    heartPos.forEach((pos, i) => {
      const heart = new Sprite(this.context.textures['heart_red.png']);
      heart.x = pos.x;
      heart.y = pos.y;
      heart.filters = [new ColorOverlayFilter(COLOURS[i % COLOURS.length])];
      this.container.addChild(heart);
      this.hearts.push(heart);
    });
  }

  updateBlink() {
    let colour;

    this.unicornsContainer.children.forEach((unicorn, i) => {
      colour = COLOURS[(i + this.blinkingIndex) % COLOURS.length];
      unicorn.filters = [new ColorOverlayFilter(colour)];
    });

    colour = COLOURS[this.blinkingIndex % COLOURS.length];
    this.dragon.filters = [new ColorOverlayFilter(colour)];

    this.hearts.forEach((heart, i) => {
      colour = COLOURS[(i + this.blinkingIndex) % COLOURS.length];
      heart.filters = [new ColorOverlayFilter(colour)];
    });

    this.blinkingIndex += 1;
  }

  handleEvent(e) {
    if (!this.canHandleKeyEvents) {
      return false;
    }

    if (e.type === 'keyup' && (e.keyCode === 32 || e.keyCode === 13)) {
      this.context.gameStatus = '';
      this.context.score = 0;
      this.context.level = 0;
      this.stateStack.popState();
      this.stateStack.pushState('TitleState');
    }

    return false;
  }

  update(dt) {
    this.timeManager.update(dt);

    if (this.blinkingTimer < this.blinkingPeriod) {
      this.blinkingTimer += dt;
    } else {
      this.updateBlink();
      this.blinkingTimer = 0;
    }

    if (this.punchlineIsFadingIn) {
      this.punchlineText.alpha += 0.01;
      if (this.punchlineText.alpha >= 1) {
        this.punchlineIsFadingIn = false;
      }
    }

    return false;
  }
}
