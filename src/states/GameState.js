import State from './State';
import World from '../game/World';

import LEVELS_DATA from '../const/levels';

export default class GameState extends State {
  constructor(stateStack, context) {
    super(stateStack, context);

    this.world = new World(
      this.container,
      context.textures,
      context.soundEffectsPlayer,
      LEVELS_DATA[0].world
    );
  }

  handleEvent(e) {
    this.world.handleEvent(e);

    if (e.type === 'keyup' && e.keyCode === 27) {
      this.stateStack.pushState('PauseState');
    }

    return false;
  }

  update(dt) {
    this.world.update(dt);

    if (!this.world.hasAlivePlayer && this.world.hasLives()) {
      this.world.resetAfterCrash();
      this.stateStack.pushState('HintState');
      return false;
    }

    if (!this.world.hasAlivePlayer || this.world.unicornsHaveReachedBottom) {
      this.gameOver();
      return false;
    }

    if (!this.world.hasUnicorns) {
      this.context.level += 1;

      if (this.context.level < LEVELS_DATA.length) {
        this.world.levelData = LEVELS_DATA[this.context.level].world;
        this.world.resetForNextLevel();
        this.stateStack.pushState('HintState');
      } else {
        this.gameOver();
      }
    }

    return false;
  }

  gameOver() {
    this.context.score = this.world.score;
    this.stateStack.popState();
    this.stateStack.pushState('GameOverState');
  }
}
