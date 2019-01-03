/* global document */
import _ from 'underscore';
import log from '../lib/log';
import Modules from '../utils/modules';

export default class Audio {
  constructor(game) {
    this.game = game;

    this.audibles = {};
    this.format = 'mp3';

    this.song = null;
    this.songName = null;

    this.enabled = true;

    this.load();
  }

  load() {
    this.music = {
      codingroom: false,
      smalltown: false,
      village: false,
      beach: false,
      spookyship: false,
      meadowofthepast: false,
    };

    this.sounds = {
      loot: false,
      hit1: false,
      hit2: false,
      hurt: false,
      heal: false,
      chat: false,
      revive: false,
      death: false,
      firefox: false,
      achievement: false,
      kill1: false,
      kill2: false,
      noloot: false,
      teleport: false,
      chest: false,
      npc: false,
      'npc-end': false,
    };
  }

  parse(path, name, channels, callback) {
    const fullPath = `${path + name}.${this.format}`;
    const sound = document.createElement('audio');

    sound.addEventListener(
      'canplaythrough',
      function callbackPlayThrough() {
        this.removeEventListener('canplaythrough', callbackPlayThrough, false);

        if (callback) {
          callback();
        }
      },
      false,
    );

    sound.addEventListener(
      'error',
      () => {
        log.error(
          `The audible: ${name} could not be loaded - unsupported extension?`,
        );

        this.audibles[name] = null;
      },
      false,
    );

    sound.preload = 'auto';
    sound.autobuffer = true;
    sound.src = fullPath;

    sound.load();

    this.audibles[name] = [sound];

    _.times(channels - 1, () => {
      this.audibles[name].push(sound.cloneNode(true));
    });

    if (name in this.music) {
      this.music[name] = true;
    } else if (name in this.sounds) {
      this.sounds[name] = true;
    }
  }

  play(type, name) {
    if (!this.isEnabled() || !this.fileExists(name)) {
      return;
    }

    this.song = this.get(name);

    switch (type) {
      case Modules.AudioTypes.Music:
        this.fadeOut(() => {
          this.reset(this.song);
        });

        if (!this.song) {
          return;
        }

        this.song.volume = 0;
        this.song.play();
        this.fadeIn();
        break;

      case Modules.AudioTypes.SFX:
        if (!this.sounds[name]) {
          this.parse('audio/sounds/', name, 4);
        }

        if (!this.song) {
          return;
        }

        this.song.volume = this.getSFXVolume();
        this.song.play();
        break;

      default:
        break;
    }
  }

  update() {
    if (!this.isEnabled()) {
      return;
    }

    log.info(`updating ${this.songName}`);

    const song = this.getMusic(this.songName);

    if (song && !(this.song && this.song.name === song.name)) {
      if (this.game.renderer.mobile) {
        this.reset(this.song);
      } else {
        this.fadeSongOut();
      }

      if (song.name in this.music && !this.music[song.name]) {
        this.parse('audio/music/', song.name, 1);

        const music = this.audibles[song.name][0];

        music.loop = true;
        music.addEventListener(
          'ended',
          () => {
            music.play();
          },
          false,
        );
      }

      this.play(Modules.AudioTypes.Music, song.name);
    } else if (this.game.renderer.mobile) {
      this.reset(this.song);
    } else {
      this.fadeSongOut();
    }
  }

  fadeIn() {
    if (!this.song || this.song.fadingIn) {
      return;
    }

    this.clearFadeOut(this.song);

    this.song.fadingIn = setInterval(() => {
      this.song.volume += 0.02;

      if (this.song.volume >= this.getMusicVolume() - 0.02) {
        this.song.volume = this.getMusicVolume();
        this.clearFadeIn(this.song);
      }
    }, 100);
  }

  fadeOut(callback) {
    if (!this.song || this.song.fadingOut) {
      return;
    }

    this.clearFadeIn(this.song);

    this.song.fadingOut = setInterval(() => {
      if (this.song.volume) {
        this.song.volume -= 0.08;
      }

      if (this.song.volume <= 0.08) {
        this.song.volume = 0;

        if (callback) {
          callback(this.song);
        }

        clearInterval(this.song.fadingOut);
      }
    }, 100);
  }

  fadeSongOut() {
    if (!this.song) return;

    this.fadeOut(() => {
      this.reset(this.song);
    });

    this.song = null;
  }

  clearFadeIn() {
    if (this.song.fadingIn) {
      clearInterval(this.song.fadingIn);
      this.song.fadingIn = null; // eslint-disable-line
    }
  }

  clearFadeOut() {
    if (this.song.fadingOut) {
      clearInterval(this.song.fadingOut);
      this.song.fadingOut = null; // eslint-disable-line
    }
  }

  reset(song) {
    if (song) {
      this.song = song;
    }

    if (!this.song || !this.song.readyState > 0) {
      return;
    }

    this.song.pause();
    this.song.currentTime = 0;
  }

  stop() {
    if (!this.song) {
      return;
    }

    this.fadeOut(() => {
      this.reset(this.song);
      this.song = null;
    });
  }

  fileExists(name) {
    return name in this.music || name in this.sounds;
  }

  get(name) {
    if (!this.audibles[name]) {
      return null;
    }

    let audible = _.detect(this.audibles[name], sound => sound.ended || sound.paused);

    if (audible && audible.ended) {
      audible.currentTime = 0;
    } else {
      audible = this.audibles[name][0]; // eslint-disable-line
    }

    return audible;
  }

  getMusic(name) {
    return {
      sound: this.get(name),
      name,
    };
  }

  setSongVolume(volume) {
    this.song.volume = volume;
  }

  getSFXVolume() {
    return this.game.storage.data.settings.sfx / 100;
  }

  getMusicVolume() {
    return this.game.storage.data.settings.music / 100;
  }

  isEnabled() {
    return this.game.storage.data.settings.soundEnabled && this.enabled;
  }
}
