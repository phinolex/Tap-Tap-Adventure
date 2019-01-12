/* global document */
import _ from 'underscore';
import log from '../lib/log';
import Modules from '../utils/modules';

/**
 * Contorls audio and sfx in the game
 * @class
 */
export default class Audio {
  /**
   * Default constructor
   * @param {Game} instance of the game
   */
  constructor(game) {
    /**
    * An instance of the game
    * @type {Game}
    */
    this.game = game;

    /**
    * An object with all of the music and sfxs
    * @type {Object}
    */
    this.audibles = {};

    /**
    * The format of the audibles
    * @type {String}
    */
    this.format = 'mp3';

    /**
    * An instance of the song
    * @type {Object}
    */
    this.song = null;

    /**
    * The name of the song
    * @type {String}
    */
    this.songName = null;

    /**
    * Whether or not music is on in the game
    * @type {Boolean}
    */
    this.enabled = true;


    /**
    * All the music in the game
    * @type {Object}
    */
    this.music = {};

    /**
    * All the SFX in the game
    * @type {Object}
    */
    this.sfx = {};

    this.load();
  }

  /**
   * Loads the music and sfx in the game
   */
  load() {
    this.music = {
      codingroom: false,
      smalltown: false,
      village: false,
      beach: false,
      spookyship: false,
      meadowofthepast: false,
    };

    this.sfx = {
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

  /**
   * Default constructor
   * @param {String} path to the audio file
   * @param {String} name the name of the audio file
   * @param {Array} channels an array of audio channels
   * @param {Function} callback the function to call when done parsing
   * the audio file
   */
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
    } else if (name in this.sfx) {
      this.sfx[name] = true;
    }
  }

  /**
   * Play a specific audio file
   * @param {String} type Modules.AudioTypes.Music|Modules.AudioTypes.SFX
   * @param {String} name the name of the audio file
   * @return {Boolean}
   */
  play(type, name) {
    if (!this.isEnabled() || !this.fileExists(name)) {
      log.info('Audio is disabled');
      return false;
    }

    this.song = this.get(name);

    switch (type) {
      case Modules.AudioTypes.Music:
        this.fadeOut(() => {
          this.reset(this.song);
        });

        if (!this.song) {
          log.info(`${name} - music could not be loaded`);
          return false;
        }

        this.song.volume = 0;
        this.song.play();
        this.fadeIn();
        break;
      case Modules.AudioTypes.SFX:
        if (!this.sfx[name]) {
          this.parse('assets/audio/sfx/', name, 4);
        }

        if (!this.song) {
          log.info(`${name} - sfx could not be loaded`);
          return false;
        }

        this.song.volume = this.getSFXVolume();
        this.song.play();
        break;
      default:
        return false;
    }

    return true;
  }

  /**
   * Update a song to replay, fade in, fade out or reset
   * @return {Boolean}
   */
  update() {
    if (!this.isEnabled()) {
      return false;
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

    return true;
  }

  /**
   * Fade in the active song
   * @return {Boolean}
   */
  fadeIn() {
    if (!this.song || this.song.fadingIn) {
      return false;
    }

    this.clearFadeOut(this.song);

    this.song.fadingIn = setInterval(() => {
      this.song.volume += 0.02;

      if (this.song.volume >= this.getMusicVolume() - 0.02) {
        this.song.volume = this.getMusicVolume();
        this.clearFadeIn(this.song);
      }
    }, 100);

    return true;
  }

  /**
   * Fade out the active song
   * @param {Function} callback trigger this callback when the fade out is done
   * @return {Boolean}
   */
  fadeOut(callback) {
    if (!this.song || this.song.fadingOut) {
      return false;
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

    return true;
  }

  /**
   * Triggers the song to fade out and then resets it
   * @return {Boolean}
   */
  fadeSongOut() {
    if (!this.song) {
      return false;
    }

    this.fadeOut(() => {
      this.reset(this.song);
    });

    this.song = null;
    return true;
  }

  /**
   * Clear the fade in interval
   * @return {Boolean}
   */
  clearFadeIn() {
    if (this.song.fadingIn) {
      clearInterval(this.song.fadingIn);
      this.song.fadingIn = null; // eslint-disable-line
      return true;
    }
    return false;
  }

  /**
   * Clears the fade out interval
   * @return {Boolean}
   */
  clearFadeOut() {
    if (this.song.fadingOut) {
      clearInterval(this.song.fadingOut);
      this.song.fadingOut = null; // eslint-disable-line
      return true;
    }
    return false;
  }

  /**
   * Resets a song so that it's ready to play from the beginning again
   * @return {Boolean}
   */
  reset(song) {
    if (song) {
      this.song = song;
    }

    if (!this.song || !this.song.readyState > 0) {
      return false;
    }

    this.song.pause();
    this.song.currentTime = 0;
    return true;
  }

  /**
   * Stop playing a song
   * @return {Boolean}
   */
  stop() {
    if (!this.song) {
      return false;
    }

    this.fadeOut(() => {
      this.reset(this.song);
      this.song = null;
    });

    return true;
  }

  /**
   * checks to see if this song file exists in the music list
   * @param {String} name the name of the song
   * @return {Boolean} returns true if it exists
   */
  fileExists(name) {
    return name in this.music || name in this.sfx;
  }

  /**
   * Return the song
   * @param {String} name the name of the song
   * @return {Boolean}
   */
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

  /**
   * Returns an object with the sound and the name of the sound
   * @param {String} name the name of the music
   * @return {Object}
   * {
   *  sound: instance of the music,
   *  name: name of the song
   * }
   */
  getMusic(name) {
    return {
      sound: this.get(name),
      name,
    };
  }

  /**
   * Set the volume level on the sound
   * @param {Number} volume the volume level
   * @return {Boolean}
   */
  setSongVolume(volume) {
    this.song.volume = volume;
    return true;
  }

  /**
   * Return the SFX volume
   * @return {Number}
   */
  getSFXVolume() {
    return this.game.storage.data.settings.sfx / 100;
  }

  /**
   * Return the music volume
   * @return {Number}
   */
  getMusicVolume() {
    return this.game.storage.data.settings.music / 100;
  }

  /**
   * Returns true if the users sound is enabled
   * @return {Boolean}
   */
  isEnabled() {
    return this.game.storage.data.settings.soundEnabled && this.enabled;
  }
}
