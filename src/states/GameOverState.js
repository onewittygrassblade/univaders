import { BitmapText } from '../const/aliases';

import State from './State';

import { RENDERER_WIDTH, RENDERER_HEIGHT } from '../const/app';

export default class GameOverState extends State {
  constructor(stateStack, context) {
    super(stateStack, context);

    this.createTitle();
    this.createScoreText();
    this.createHint();

    if (this.context.gameStatus === 'success') {
      context.soundEffectsPlayer.play('tada');
    } else {
      context.soundEffectsPlayer.play('fail');
    }

    this.container.x = RENDERER_WIDTH / 2;
    this.container.y = RENDERER_HEIGHT / 2 - this.container.height / 2;
  }

  createTitle() {
    const text = this.context.gameStatus === 'success'
      ? 'wahoo!'
      : 'game over';
    const title = new BitmapText(text, { font: '180px arcade-white' });
    title.anchor.x = 0.5;
    this.container.addChild(title);
  }

  createScoreText() {
    const text = new BitmapText(`final score: ${this.context.score}`, { font: '72px arcade-white' });
    text.anchor.x = 0.5;
    text.y = 160;
    this.container.addChild(text);
  }

  createHint() {
    const hint = new BitmapText('press space to go back to title', { font: '72px arcade-white' });
    hint.anchor.x = 0.5;
    hint.y = 260;
    this.container.addChild(hint);
  }

  handleEvent(e) {
    super.handleEvent(e);
    if (e.type === 'keyup' && e.keyCode === 32) {
      this.context.gameStatus = '';
      this.context.score = 0;
      this.context.level = 0;
      this.stateStack.popState();
      this.stateStack.pushState('TitleState');
    }

    return false;
  }
}
