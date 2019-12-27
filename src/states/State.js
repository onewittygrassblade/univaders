import { Container } from '../const/aliases';

export default class State {
  constructor(stateStack, context) {
    this.stateStack = stateStack;
    this.context = context;
    this.container = new Container();
    context.stage.addChild(this.container);
  }

  /* eslint-disable class-methods-use-this */
  handleEvent() {
    return false;
  }

  update() {
    return false;
  }
  /* eslint-enable class-methods-use-this */
}
