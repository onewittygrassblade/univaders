export default class TimeManager {
  constructor() {
    this.timers = [];
  }

  setTimeout(callback, finalTime) {
    this.timers.push({
      time: 0,
      finalTime,
      callback,
    });
  }

  update(dt) {
    this.timers.forEach((timer) => {
      if (timer.time < timer.finalTime) {
        timer.time += dt;
      } else {
        timer.callback();
        this.timers.splice(this.timers.indexOf(timer), 1);
      }
    });
  }

  clear() {
    this.timers = [];
  }
}
