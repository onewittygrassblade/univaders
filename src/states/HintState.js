import { Container, BitmapText } from '../const/aliases';

import State from './State';
import Rectangle from '../gui/Rectangle';

import { RENDERER_WIDTH, RENDERER_HEIGHT } from '../const/app';
import LEVELS_DATA from '../const/levels';

export default class HintState extends State {
  constructor(stateStack, context) {
    super(stateStack, context);

    this.build();
  }

  build() {
    const textContainer = new Container();

    const messageText = new BitmapText(LEVELS_DATA[this.context.level].hint, { font: '72px arcade-white' });
    messageText.y = 0;
    textContainer.addChild(messageText);
    const hintText = new BitmapText('Press space to start', { font: '64px arcade-white' });
    hintText.y = 100;
    textContainer.addChild(hintText);

    messageText.x = textContainer.width / 2 - messageText.width / 2;
    hintText.x = textContainer.width / 2 - hintText.width / 2;

    const rectangle = new Rectangle(textContainer.width + 200, textContainer.height + 120);
    this.container.addChild(rectangle);
    this.container.addChild(textContainer);

    textContainer.x = this.container.width / 2 - textContainer.width / 2;
    textContainer.y = this.container.height / 2 - textContainer.height / 2;

    this.container.x = RENDERER_WIDTH / 2 - this.container.width / 2;
    this.container.y = RENDERER_HEIGHT / 2 - this.container.height / 2;
  }

  handleEvent(e) {
    if (e.type === 'keyup' && e.keyCode === 32) {
      this.stateStack.popState();
    }

    return false;
  }
}
