import {
  loader,
  resources,
  Application,
} from './const/aliases';

import LoadingBar from './LoadingBar';
import MusicPlayer from './sound/MusicPlayer';
import SoundEffectsPlayer from './sound/SoundEffectsPlayer';
import StateStack from './StateStack';
import centerCanvas from './helpers/centerCanvas';

import {
  RENDERER_WIDTH,
  RENDERER_HEIGHT,
  SOUNDS,
  MUSICS,
  STATES,
} from './const/app';

export default class App extends Application {
  constructor() {
    super({ width: RENDERER_WIDTH, height: RENDERER_HEIGHT, backgroundColor: 0x000000 });
  }

  boot() {
    // view
    document.getElementById('root').appendChild(this.view);

    centerCanvas(this.view);
    window.addEventListener('resize', () => {
      centerCanvas(this.view);
    });

    // loading bar
    this.loadingBar = new LoadingBar();
    this.loadingBar.container.y = RENDERER_HEIGHT / 2 - this.loadingBar.container.height / 2;
    this.stage.addChild(this.loadingBar.container);

    // assets
    return new Promise((resolve, reject) => {
      SOUNDS.forEach((soundName) => {
        loader.add(soundName, `sounds/${soundName}.mp3`);
      });

      MUSICS.forEach((musicName) => {
        loader.add(musicName, `music/${musicName}.mp3`);
      });

      loader
        .add('images/univaders.json')
        .add('fonts/arcade-white.fnt')
        .add('fonts/arcade-green.fnt')
        .on('progress', () => {
          this.loadingBar.updateProgress(loader.progress);
        })
        .on('error', reject)
        .load(resolve);
    });
  }

  setup() {
    this.stage.removeChild(this.loadingBar.container);

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

    const sounds = SOUNDS.reduce((acc, item) => {
      acc[item] = resources[item].sound;
      return acc;
    }, {});

    const musics = MUSICS.reduce((acc, item) => {
      acc[item] = resources[item].sound;
      return acc;
    }, {});

    const context = {
      textures,
      soundEffectsPlayer: new SoundEffectsPlayer(sounds),
      musicPlayer: new MusicPlayer(musics),
      stage: this.stage,
      score: 0,
      level: 0,
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
