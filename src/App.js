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
    // Set view
    document.getElementById('root').appendChild(this.view);

    centerCanvas(this.view);
    window.addEventListener('resize', () => {
      centerCanvas(this.view);
    });

    // Create and render loading bar
    this.loadingBar = new LoadingBar();
    this.loadingBar.container.y = RENDERER_HEIGHT / 2 - this.loadingBar.container.height / 2;
    this.stage.addChild(this.loadingBar.container);

    // Load assets
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
      .load(this.handleLoadComplete.bind(this));

    loader.onProgress.add(() => {
      this.loadingBar.updateProgress(loader.progress);
    }); // called once per loaded/errored file
    loader.onError.add(() => {
      console.err('Loading error'); // eslint-disable-line no-console
    }); // called once per errored file
  }

  handleLoadComplete() {
    this.stage.removeChild(this.loadingBar.container);

    // Create event collectors
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

    // Create context
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

    // Create state stack
    this.stateStack = new StateStack(context);

    STATES.forEach((state) => {
      this.stateStack.registerState(state);
    });

    // Set game loop
    // PIXI.Ticker uses a ratio that is 1 if FPS = 60, 2 if FPS = 2, etc.
    this.ticker.add((fpsRatio) => {
      this.processInput();
      this.stateStack.update((fpsRatio * 1000) / 60); // time per frame = 1000 / 60 ms
    });

    // Start on title state
    this.stateStack.pushState('TitleState');
  }

  processInput() {
    while (this.events.length) {
      this.stateStack.handleEvent(this.events[0]);
      this.events.shift();
    }
  }
}
