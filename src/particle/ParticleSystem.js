import { ParticleContainer } from '../const/aliases';

export default class ParticleSystem {
  constructor() {
    this.particles = [];
    this.container = new ParticleContainer(
      15000,
      {
        alpha: true,
        scale: true,
        rotation: true,
        uvs: true,
      }
    );
  }

  addParticle(particle) {
    this.particles.push(particle);
    this.container.addChild(particle);
  }

  clear() {
    this.container.removeChildren();
    this.particles = [];
  }

  update(dt) {
    while (this.particles.length > 0 && this.particles[0].currentLifetime >= this.particles[0].lifetime) { // eslint-disable-line max-len
      this.container.removeChild(this.particles[0]);
      this.particles.shift();
    }

    this.particles.forEach((particle) => particle.update(dt));
  }
}
