import { Container } from '../const/aliases';

export default class UnicornBaseManager {
  constructor(texture) {
    this.texture = texture;

    this.container = new Container();
    this.unicorns = [];
  }

  getFiringUnicorns() {
    return this.unicorns;
  }

  hasVisibleUnicorns() {
    const visibleUnicorns = this.unicorns.filter(
      (unicorn) => unicorn.visible
    );
    return visibleUnicorns.length > 0;
  }

  /* eslint-disable class-methods-use-this */
  hasReachedBottom() {
    return false;
  }
  /* eslint-enable class-methods-use-this */
}
