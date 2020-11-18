import { Container, BitmapText } from '../const/aliases';
import { FONT_WHITE_M } from '../const/fonts';

export default class Menu {
  constructor(menuItems) {
    this.menuItems = [];
    this.selectedMenuItem = 0;

    this.build(menuItems);
  }

  build(menuItems) {
    this.container = new Container();

    this.leftSelectionMarker = new BitmapText('.', FONT_WHITE_M);
    this.rightSelectionMarker = new BitmapText('.', FONT_WHITE_M);
    this.container.addChild(this.leftSelectionMarker);
    this.container.addChild(this.rightSelectionMarker);

    menuItems.forEach((item, i) => {
      const text = new BitmapText(item.text, FONT_WHITE_M);
      text.y = i * 100;
      this.container.addChild(text);
      text.callback = item.callback;
      this.menuItems.push(text);
    });

    this.updateSelectionMarkers();

    this.menuItems.forEach((item) => {
      item.x = this.container.width / 2 - item.width / 2;
    });

    this.updateSelectionMarkers();
  }

  updateMenuItemLabel(index, newText) {
    this.menuItems[index].text = newText;
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

  handleEvent(e) {
    if (e.type === 'keyup') {
      switch (e.keyCode) {
        case 13:
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
  }
}
