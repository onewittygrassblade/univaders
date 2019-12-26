import State from './State';
import World from '../game/World';

export default class GameState extends State {
  constructor(stateStack, context) {
    super(stateStack, context);
    this.world = new World(
      this.container,
      context.textures,
    );
  }

  handleEvent(e) {
    super.handleEvent(e);
    this.world.handleEvent(e);

    return false;
  }

  update(dt) {
    this.world.update(dt);

    return false;
  }
}
