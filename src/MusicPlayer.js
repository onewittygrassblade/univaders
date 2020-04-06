export default class MusicPlayer {
  constructor(musics) {
    this.musics = musics;
    this.playing = null;
    this.muted = false;
  }

  play(theme) {
    if (!this.playing) {
      this.startPlaying(theme);
    } else if (this.playing && this.playing !== this.musics[theme]) {
      this.playing.stop();
      this.startPlaying(theme);
    }
  }

  startPlaying(theme) {
    this.playing = this.musics[theme];
    this.playing.muted = this.muted;
    this.playing.play({ loop: true });
  }

  togglePause(paused) {
    if (paused) {
      this.playing.pause();
    } else {
      this.playing.resume();
    }
  }

  toggleMuted() {
    this.muted = !this.muted;
    this.playing.muted = this.muted;
  }

  isMuted() {
    return this.playing.muted;
  }
}
