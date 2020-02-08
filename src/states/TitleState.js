import { BitmapText } from '../const/aliases';

import State from './State';

import { RENDERER_WIDTH } from '../const/app';

export default class TitleState extends State {
  constructor(stateStack, context) {
    super(stateStack, context);
    this.createTitle();
    this.createHint();
  }

  createTitle() {
    const title = new BitmapText('univaders', { font: '180px arcade-white' });
    title.x = RENDERER_WIDTH / 2 - title.width / 2;
    title.y = 200;
    this.container.addChild(title);
  }

  createHint() {
    const hint = new BitmapText('press space to start', { font: '72px arcade-white' });
    hint.x = RENDERER_WIDTH / 2 - hint.width / 2;
    hint.y = 400;
    this.container.addChild(hint);
  }

  handleEvent(e) {
    super.handleEvent(e);
    if (e.type === 'keyup' && e.keyCode === 32) {
      this.stateStack.popState();
      this.stateStack.pushState('GameState');
    }

    return false;
  }
}
