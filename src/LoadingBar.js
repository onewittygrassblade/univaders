import { Container, Graphics } from './const/aliases';

import { RENDERER_WIDTH } from './const/app';

const WIDTH = 800;
const HEIGHT = 100;

export default class LoadingBar {
  constructor() {
    this.setup();
  }

  setup() {
    this.container = new Container();

    this.outerRectangle = new Graphics();
    this.outerRectangle.beginFill(0x000000);
    this.outerRectangle.lineStyle(10, 0xFFFFFF, 1);
    this.outerRectangle.drawRect(0, 0, WIDTH, HEIGHT);
    this.outerRectangle.endFill();
    this.outerRectangle.x = RENDERER_WIDTH / 2 - this.outerRectangle.width / 2;
    this.container.addChild(this.outerRectangle);

    this.innerRectangle = new Graphics();
    this.container.addChild(this.innerRectangle);
    this.updateProgress(0);
  }

  updateProgress(progress) {
    this.innerRectangle.clear();

    const width = (WIDTH - 20) * (progress / 100);

    this.innerRectangle.beginFill(0xFFFFFF);
    this.innerRectangle.drawRect(0, 0, width, HEIGHT - 20);
    this.innerRectangle.endFill();
    this.innerRectangle.x = this.outerRectangle.x + 10;
    this.innerRectangle.y = this.outerRectangle.y + 10;
  }
}
