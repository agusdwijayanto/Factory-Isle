// Sound manager using Howler.js CDN with Web Audio synth fallback
const Sound = {
  sounds: {},
  enabled: true,
  init() {
    if (typeof Howl === 'undefined') return;
    const sfxList = {
      click: ['sfx/click.mp3', 'https://cdnjs.cloudflare.com/ajax/libs/howler/2.2.3/howler.min.js'], // fallback or synthetic
      craft: ['sfx/craft.mp3'],
      sell: ['sfx/coin.mp3'],
      walk: ['sfx/walk.mp3']
    };
    // Initialize Howl instances if audio files exist or use synth fallback via SFX
    for (const key of Object.keys(sfxList)) {
      try {
        this.sounds[key] = new Howl({
          src: sfxList[key],
          volume: key === 'walk' ? 0.15 : 0.5,
          onloaderror: () => { this.sounds[key] = null; }
        });
      } catch (_) {
        this.sounds[key] = null;
      }
    }
  },
  play(name) {
    if (S && S.settings && S.settings.sound === false) return;
    if (this.sounds[name] && this.sounds[name].state() === 'loaded') {
      this.sounds[name].play();
      return;
    }
    // Fallback to built-in Web Audio synth (SFX) if Howl sound not loaded/available
    if (typeof SFX !== 'undefined' && SFX.play) {
      if (name === 'click') SFX.play('place');
      else if (name === 'craft') SFX.play('craft');
      else if (name === 'sell') SFX.play('coin');
      else if (name === 'walk') {
        // play quiet walk tap occasionally
        if (Math.random() < 0.3) SFX.play('chop');
      }
    }
  }
};

// Global UI click listener for sound effect 1 (Klik tombol UI)
document.addEventListener('pointerdown', (e) => {
  if (e.target.closest('button, .hud-btn, .build-item, .menu-btn')) {
    Sound.play('click');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  Sound.init();
});
