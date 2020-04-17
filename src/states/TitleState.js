import { BitmapText } from '../const/aliases';

import State from './State';
import Menu from '../gui/Menu';

import { RENDERER_WIDTH } from '../const/app';

export default class TitleState extends State {
  constructor(stateStack, context) {
    super(stateStack, context);

    this.build();
    this.context.musicPlayer.play('Stringed Disco');
  }

  build() {
    const title = new BitmapText('univaders', { font: '180px arcade-white' });
    title.x = RENDERER_WIDTH / 2 - title.width / 2;
    title.y = 200;
    this.container.addChild(title);

    const startGame = () => {
      this.stateStack.popState();
      this.stateStack.pushState('GameState');
      this.stateStack.pushState('HintState');
    };

    const showSettings = () => {
      this.stateStack.pushState('SettingsState');
    };

    const menuItems = [
      {
        text: 'Start',
        callback: startGame,
      },
      {
        text: 'Settings',
        callback: showSettings,
      },
    ];

    this.menu = new Menu(menuItems);
    this.container.addChild(this.menu.container);
    this.menu.container.x = RENDERER_WIDTH / 2 - this.menu.container.width / 2 - 20;
    this.menu.container.y = 380;
  }

  handleEvent(e) {
    this.menu.handleEvent(e);

    return false;
  }
}
