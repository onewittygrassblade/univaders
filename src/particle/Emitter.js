import Particle from './Particle';
import ParticleSystem from './ParticleSystem';

export default class Emitter {
  constructor(texture, particleSpeed, particleLifetime) {
    this.texture = texture;
    this.particleSpeed = particleSpeed;
    this.particleLifetime = particleLifetime;

    this.particleSystem = new ParticleSystem();
  }

  burst(numberOfParticles, x, y) {
    let directionAngle = 0;
    const directionAngleSpacing = (2 * Math.PI) / numberOfParticles;

    for (let i = 0; i < numberOfParticles; i++) {
      this.particleSystem.addParticle(new Particle(
        this.texture,
        this.particleLifetime,
        x, y,
        this.particleSpeed * Math.cos(directionAngle),
        this.particleSpeed * Math.sin(directionAngle) * -1.0
      ));

      directionAngle += directionAngleSpacing;
    }
  }

  update(dt) {
    this.particleSystem.update(dt);
  }
}
