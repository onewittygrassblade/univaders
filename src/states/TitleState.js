import { Container, BitmapText } from '../const/aliases';

import State from './State';

import { RENDERER_WIDTH, RENDERER_HEIGHT } from '../const/app';

export default class TitleState extends State {
  constructor(stateStack, context) {
    super(stateStack, context);
    this.createTitle();
  }

  createTitle() {
    const title = new BitmapText('univaders', { font: '72px arcade-lowercase-white' });
    title.x = RENDERER_WIDTH / 2 - title.width / 2;
    title.y = 120;
    this.container.addChild(title);
  }
}
