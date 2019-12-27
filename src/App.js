import {
  loader,
  resources,
  Application,
} from './const/aliases';

import StateStack from './StateStack';
import centerCanvas from './helpers/centerCanvas';

import {
  RENDERER_WIDTH,
  RENDERER_HEIGHT,
  STATES,
} from './const/app';

export default class App extends Application {
  static loadAssets() {
    return new Promise((resolve, reject) => {
      loader
        .add('images/univaders.json')
        .add('fonts/arcade-lowercase-white.fnt')
        .on('error', reject)
        .load(resolve);
    });
  }

  constructor() {
    super({ width: RENDERER_WIDTH, height: RENDERER_HEIGHT, backgroundColor: 0x000000 });
  }

  setup() {
    // view
    document.getElementById('root').appendChild(this.view);

    centerCanvas(this.view);
    window.addEventListener('resize', () => {
      centerCanvas(this.view);
    });

    // event management
    this.events = [];
    window.addEventListener(
      'keydown',
      (e) => {
        e.preventDefault();
        this.events.push(e);
      }
    );
    window.addEventListener(
      'keyup',
      (e) => {
        e.preventDefault();
        this.events.push(e);
      }
    );

    // context
    const { textures } = resources['images/univaders.json'];

    const context = {
      textures,
      stage: this.stage,
    };

    // state stack
    this.stateStack = new StateStack(context);

    STATES.forEach((state) => {
      this.stateStack.registerState(state);
    });

    // start on title state
    this.stateStack.pushState('TitleState');
  }

  run() {
    // PIXI.Ticker uses a ratio that is 1 if FPS = 60, 2 if FPS = 2, etc.
    this.ticker.add((fpsRatio) => {
      this.processInput();
      this.stateStack.update((fpsRatio * 1000) / 60); // time per frame = 1000 / 60 ms
    });
  }

  processInput() {
    while (this.events.length) {
      this.stateStack.handleEvent(this.events[0]);
      this.events.shift();
    }
  }
}
