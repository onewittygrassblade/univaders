import State from './State';
import Rectangle from '../gui/Rectangle';
import Menu from '../gui/Menu';

import { RENDERER_WIDTH, RENDERER_HEIGHT } from '../const/app';

export default class PauseState extends State {
  constructor(stateStack, context) {
    super(stateStack, context);
    this.build();
  }

  build() {
    const toggleMusicMuted = () => {
      this.context.musicPlayer.toggleMuted();
      this.menu.updateMenuItemLabel(1, `Music ${this.context.musicPlayer.muted ? 'off' : 'on'}`);
      this.menu.updateSelectionMarkers();
    };
    const toggleSoundEffectsMuted = () => {
      this.context.soundEffectsPlayer.toggleMuted();
      this.menu.updateMenuItemLabel(2, `Sound effects ${this.context.soundEffectsPlayer.muted ? 'off' : 'on'}`);
      this.menu.updateSelectionMarkers();
    };
    const popState = () => this.stateStack.popState();

    const menuItems = [
      {
        text: 'Resume',
        callback: popState,
      },
      {
        text: `Music ${this.context.musicPlayer.muted ? 'off' : 'on'}`,
        callback: toggleMusicMuted,
      },
      {
        text: `Sound effects ${this.context.soundEffectsPlayer.muted ? 'off' : 'on'}`,
        callback: toggleSoundEffectsMuted,
      },
    ];

    this.menu = new Menu(menuItems);

    const rectangle = new Rectangle(
      this.menu.container.width + 320,
      this.menu.container.height + 120
    );
    this.container.addChild(rectangle);
    this.container.addChild(this.menu.container);

    this.menu.container.x = this.container.width / 2 - this.menu.container.width / 2 - 20;
    this.menu.container.y = this.container.height / 2 - this.menu.container.height / 2;

    this.container.x = RENDERER_WIDTH / 2 - this.container.width / 2;
    this.container.y = RENDERER_HEIGHT / 2 - this.container.height / 2;
  }

  handleEvent(e) {
    super.handleEvent(e);

    if (e.type === 'keyup' && e.keyCode === 27) {
      this.stateStack.popState();
      return false;
    }

    this.menu.handleEvent(e);
    return false;
  }
}
