import { BitmapText } from '../const/aliases';

import State from './State';

import { RENDERER_WIDTH } from '../const/app';

export default class GameOverState extends State {
  constructor(stateStack, context) {
    super(stateStack, context);
    this.createTitle();
    this.createHint();
  }

  createTitle() {
    const title = new BitmapText('game over', { font: '180px arcade-lowercase-white' });
    title.x = RENDERER_WIDTH / 2 - title.width / 2;
    title.y = 200;
    this.container.addChild(title);
  }

  createHint() {
    const hint = new BitmapText('press space to go back to title', { font: '72px arcade-lowercase-white' });
    hint.x = RENDERER_WIDTH / 2 - hint.width / 2;
    hint.y = 400;
    this.container.addChild(hint);
  }

  handleEvent(e) {
    super.handleEvent(e);
    if (e.type === 'keyup' && e.keyCode === 32) {
      this.stateStack.popState();
      this.stateStack.pushState('TitleState');
    }

    return false;
  }
}
