import TitleState from './states/TitleState';

const stateClasses = {
  TitleState,
};

export default class StateStack {
  constructor(context) {
    this.context = context;
    this.stack = [];
    this.pendingList = [];
    this.stateFactories = new Map();
  }

  registerState(stateName) {
    this.stateFactories.set(
      stateName,
      () => new stateClasses[stateName](this, this.context)
    );
  }

  createState(stateName) {
    return this.stateFactories.get(stateName)();
  }

  pushState(stateName) {
    this.pendingList.push({ action: 'push', stateName });
  }

  popState() {
    this.pendingList.push({ action: 'pop' });
  }

  clearStates() {
    this.pendingList.push({ action: 'clear' });
  }

  applyPendingChanges() {
    this.pendingList.forEach((change) => {
      switch (change.action) {
        case 'push':
          this.stack.push(this.createState(change.stateName));
          break;
        case 'pop':
          this.context.stage.removeChild(this.stack.pop().container);
          break;
        case 'clear':
          while (this.stack.length) {
            this.context.stage.removeChild(this.stack.pop().container);
          }
          break;
        default:
      }
    });
    this.pendingList = [];
  }

  handleEvent(e) {
    for (let i = this.stack.length - 1; i >= 0; i--) {
      if (!this.stack[i].handleEvent(e)) {
        break;
      }
    }
  }

  update(dt) {
    for (let i = this.stack.length - 1; i >= 0; i--) {
      if (!this.stack[i].update(dt)) {
        break;
      }
    }
    this.applyPendingChanges();
  }
}
