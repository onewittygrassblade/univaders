import State from './State';
import World from '../game/World';

export default class GameState extends State {
  constructor(stateStack, context) {
    super(stateStack, context);
    this.context.gameStatus = 'running';
    this.world = new World(
      this.container,
      context.textures,
    );
  }

  handleEvent(e) {
    super.handleEvent(e);
    this.world.handleEvent(e);

    if (e.type === 'keyup' && e.keyCode === 27) {
      this.stateStack.pushState('PauseState');
    }

    return false;
  }

  update(dt) {
    this.world.update(dt);

    if (!this.world.hasAlivePlayer) {
      if (this.world.hasLives()) {
        this.world.reset();
      } else {
        this.context.gameStatus = 'failure';
        this.gameOver();
      }
    }

    if (!this.world.hasUnicorns) {
      this.context.gameStatus = 'success';
      this.gameOver();
    }

    return false;
  }

  gameOver() {
    this.stateStack.popState();
    this.stateStack.pushState('GameOverState');
  }
}
