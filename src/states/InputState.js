import { BitmapText, Container } from '../const/aliases';
import { FONT_WHITE_M } from '../const/fonts';

import State from './State';
import Rectangle from '../gui/Rectangle';
import Menu from '../gui/Menu';
import PubSub from '../helpers/PubSub';

import { RENDERER_WIDTH, RENDERER_HEIGHT } from '../const/app';

export default class InputState extends State {
  constructor(stateStack, context) {
    super(stateStack, context);

    this.build();
  }

  build() {
    const contentContainer = new Container();

    const inputBox = new Rectangle(478, 70);

    this.input = new BitmapText('', FONT_WHITE_M);
    this.input.x = 15;
    this.input.y = 17;

    const submitCode = () => {
      PubSub.publish('codeEntered', this.input.text);
      this.input.text = '';
    };

    const popState = () => {
      this.stateStack.popState();
    };

    const menuItems = [
      {
        text: 'Submit',
        callback: submitCode,
      },
      {
        text: 'Back',
        callback: popState,
      },
    ];

    this.menu = new Menu(menuItems);

    contentContainer.addChild(inputBox);
    contentContainer.addChild(this.input);
    contentContainer.addChild(this.menu.container);

    this.menu.container.x = inputBox.width / 2 - this.menu.container.width / 2;
    this.menu.container.y = 120;

    const rectangle = new Rectangle(
      contentContainer.width + 320,
      contentContainer.height + 120
    );

    this.container.addChild(rectangle);
    this.container.addChild(contentContainer);

    contentContainer.x = this.container.width / 2 - contentContainer.width / 2;
    contentContainer.y = this.container.height / 2 - contentContainer.height / 2;

    this.container.x = RENDERER_WIDTH / 2 - this.container.width / 2;
    this.container.y = RENDERER_HEIGHT / 2 - this.container.height / 2;
  }

  handleEvent(e) {
    if (e.type === 'keyup') {
      if (e.keyCode >= 65 && e.keyCode <= 90) {
        if (this.input.text.length <= 11) {
          this.input.text += e.key;
        }
      } else if (e.keyCode === 8) {
        this.input.text = this.input.text.slice(0, -1);
      } else if (e.keyCode === 27) {
        this.stateStack.popState();
        return false;
      }
    }

    this.menu.handleEvent(e);

    return false;
  }
}
