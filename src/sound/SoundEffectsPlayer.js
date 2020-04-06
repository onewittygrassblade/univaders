export default class SoundEffectsPlayer {
  constructor(sounds) {
    this.sounds = sounds;
    this.muted = false;
  }

  play(sound) {
    if (this.muted) {
      return;
    }

    this.sounds[sound].play();
  }

  toggleMuted() {
    this.muted = !this.muted;
  }
}
