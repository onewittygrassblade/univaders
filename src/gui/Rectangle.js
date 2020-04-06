import { Graphics } from '../const/aliases';

export default class Rectangle extends Graphics {
  constructor(width, height) {
    super();

    this.beginFill(0x000000);
    this.lineStyle(4, 0xFFFFFF, 1);
    this.drawRect(0, 0, width, height);
    this.endFill();
  }
}
