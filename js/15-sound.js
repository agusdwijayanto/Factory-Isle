// =============================================
//   FACTORY ISLE — js/15-sound.js
//   =============================================

const Sound = {
  muted: false,
  sounds: {},

  init() {
    if (typeof Howl === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/howler/2.2.4/howler.min.js';
      script.onload = () => this.setupSounds();
      document.head.appendChild(script);
    } else {
      this.setupSounds();
    }
  },

  setupSounds() {
    this.sounds = {
      click: new Howl({ src: ['sfx/click.mp3', 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'], volume: 0.3 }),
      craft: new Howl({ src: ['sfx/craft.mp3', 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'], volume: 0.4 }),
      sell:  new Howl({ src: ['sfx/sell.mp3',  'https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3'], volume: 0.5 }),
      step:  new Howl({ src: ['sfx/step.mp3',  'https://assets.mixkit.co/active_storage/sfx/2573/2573-preview.mp3'], volume: 0.1 })
    };
  },

  play(name) {
    if (this.muted || !this.sounds[name]) return;
this.sounds[name].play();
  },

  toggleMute() {
    this.muted = !this.muted;
    Howler.mute(this.muted);
    return this.muted;
  }
};

window.Sound = Sound;
document.addEventListener('DOMContentLoaded', () => Sound.init());
