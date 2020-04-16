import { BitmapText } from '../const/aliases';

import State from './State';

import { RENDERER_WIDTH } from '../const/app';

export default class TitleState extends State {
  constructor(stateStack, context) {
    super(stateStack, context);
    this.createTitle();
    this.createMenu();
    this.context.musicPlayer.play('Stringed Disco');
  }

  createTitle() {
    const title = new BitmapText('univaders', { font: '180px arcade-white' });
    title.x = RENDERER_WIDTH / 2 - title.width / 2;
    title.y = 200;
    this.container.addChild(title);
  }

  createMenu() {
    this.menuItems = [];
    this.selectedMenuItem = 0;

    const menuItems = [
      {
        text: 'Start',
        callback: () => this.startGame(),
      },
      {
        text: 'Settings',
        callback: () => this.showSettings(),
      },
    ];

    let yPos = 380;

    this.leftSelectionMarker = new BitmapText('.', { font: '72px arcade-white' });
    this.rightSelectionMarker = new BitmapText('.', { font: '72px arcade-white' });
    this.container.addChild(this.leftSelectionMarker);
    this.container.addChild(this.rightSelectionMarker);

    menuItems.forEach((item) => {
      const text = new BitmapText(item.text, { font: '72px arcade-white' });
      text.x = RENDERER_WIDTH / 2 - text.width / 2;
      text.y = yPos;
      yPos += 100;
      this.container.addChild(text);
      text.callback = item.callback;
      this.menuItems.push(text);
    });

    this.updateSelectionMarkers();
  }

  selectNext() {
    this.selectedMenuItem = (this.selectedMenuItem + 1) % this.menuItems.length;
    this.updateSelectionMarkers();
  }

  selectPrevious() {
    this.selectedMenuItem = (this.selectedMenuItem + this.menuItems.length - 1)
     % this.menuItems.length;
    this.updateSelectionMarkers();
  }

  updateSelectionMarkers() {
    this.leftSelectionMarker.x = this.menuItems[this.selectedMenuItem].x
      - this.leftSelectionMarker.width - 30;
    this.leftSelectionMarker.y = this.menuItems[this.selectedMenuItem].y - 14;
    this.rightSelectionMarker.x = this.menuItems[this.selectedMenuItem].x
     + this.menuItems[this.selectedMenuItem].width + 8;
    this.rightSelectionMarker.y = this.menuItems[this.selectedMenuItem].y - 14;
  }

  startGame() {
    this.stateStack.popState();
    this.stateStack.pushState('GameState');
    this.stateStack.pushState('HintState');
  }

  showSettings() {
    this.stateStack.pushState('SettingsState');
  }

  handleEvent(e) {
    super.handleEvent(e);
    if (e.type === 'keyup') {
      switch (e.keyCode) {
        case 32:
          this.menuItems[this.selectedMenuItem].callback();
          break;
        case 38:
          this.selectPrevious();
          break;
        case 40:
          this.selectNext();
          break;
        default:
          break;
      }
    }

    return false;
  }
}
