import { BitmapText, Graphics } from '../const/aliases';

import State from './State';

import { RENDERER_WIDTH } from '../const/app';

export default class PauseState extends State {
  constructor(stateStack, context) {
    super(stateStack, context);
    this.createRectangle();
    this.createTexts();
  }

  createRectangle() {
    const rectangle = new Graphics();
    rectangle.beginFill(0x000000);
    rectangle.lineStyle(4, 0xFFFFFF, 1);
    rectangle.drawRect(0, 0, 1100, 400);
    rectangle.endFill();
    rectangle.x = RENDERER_WIDTH / 2 - rectangle.width / 2;
    rectangle.y = 120;
    this.container.addChild(rectangle);
  }

  createTexts() {
    const messageText = new BitmapText('Game paused', { font: '180px arcade-lowercase-white' });
    messageText.x = RENDERER_WIDTH / 2 - messageText.width / 2;
    messageText.y = 200;
    this.container.addChild(messageText);

    const hintText = new BitmapText('Press ESC to resume', { font: '72px arcade-lowercase-white' });
    hintText.x = RENDERER_WIDTH / 2 - hintText.width / 2;
    hintText.y = 400;
    this.container.addChild(hintText);
  }

  handleEvent(e) {
    super.handleEvent(e);
    if (e.type === 'keyup' && e.keyCode === 27) {
      this.stateStack.popState();
    }

    return false;
  }
}
