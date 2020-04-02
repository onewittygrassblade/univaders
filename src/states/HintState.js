import { BitmapText, Graphics } from '../const/aliases';

import State from './State';

import { RENDERER_WIDTH, RENDERER_HEIGHT } from '../const/app';
import LEVELS_DATA from '../const/levels';

export default class HintState extends State {
  constructor(stateStack, context) {
    super(stateStack, context);
    this.createRectangle();
    this.createTexts(LEVELS_DATA[context.level].hint);
  }

  createRectangle() {
    const rectangle = new Graphics();
    rectangle.beginFill(0x000000);
    rectangle.lineStyle(4, 0xFFFFFF, 1);
    rectangle.drawRect(0, 0, 700, 240);
    rectangle.endFill();
    rectangle.x = RENDERER_WIDTH / 2 - rectangle.width / 2;
    rectangle.y = RENDERER_HEIGHT / 2 - rectangle.height / 2;
    this.container.addChild(rectangle);
  }

  createTexts(message) {
    const messageText = new BitmapText(message, { font: '72px arcade-white' });
    messageText.x = RENDERER_WIDTH / 2 - messageText.width / 2;
    messageText.y = 300;
    this.container.addChild(messageText);

    const hintText = new BitmapText('Press space to start', { font: '48px arcade-white' });
    hintText.x = RENDERER_WIDTH / 2 - hintText.width / 2;
    hintText.y = messageText.y + messageText.height + 50;
    this.container.addChild(hintText);
  }

  handleEvent(e) {
    super.handleEvent(e);
    if (e.type === 'keyup' && e.keyCode === 32) {
      this.stateStack.popState();
    }

    return false;
  }
}
