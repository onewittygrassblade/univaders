class PubSub {
  constructor() {
    this.topics = {};
  }

  subscribe(topic, callback) {
    if (!this.topics[topic]) this.topics[topic] = [];
    const index = this.topics[topic].push(callback) - 1;
    return () => delete this.topics[topic][index];
  }

  publish(topic, ...args) {
    if (!this.topics[topic]) return;
    this.topics[topic].forEach((fn) => {
      fn(...args);
    });
  }
}

export default new PubSub();
