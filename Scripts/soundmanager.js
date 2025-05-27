// SoundManager.js
const SoundManager = {
  sounds: {},

  load(name, src, loop = false) {
    const audio = new Audio(src);
    audio.loop = loop;
    this.sounds[name] = audio;
  },

  play(name) {
    const sound = this.sounds[name];
    if (sound) {
        sound.currentTime = 0;
        sound.play()
        .then(() => console.log(`🔊 Zvuk '${name}' přehrán.`))
        .catch(e => console.warn(`❌ Nelze přehrát '${name}':`, e));
    } else {
        console.warn(`⚠️ Zvuk '${name}' nebyl nalezen.`);
    }
    },

  stop(name) {
    const sound = this.sounds[name];
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
    }
  },

  setVolume(name, volume) {
    const sound = this.sounds[name];
    if (sound) sound.volume = volume;
  }
};


SoundManager.loadDefaults = function() {
  this.load("rain", "../Sounds/rain.mp3", true);
  this.load("page", "../Sounds/page_flip.mp3");
  this.load("thunder", "../Sounds/thunder_hit.mp3");
};