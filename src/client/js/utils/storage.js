/* global window */
import log from '../lib/log';

const storage = window.localStorage;
const name = 'data';

export default class Storage {
  constructor(app) {
    this.app = app;
    this.data = null;

    this.load();
  }

  load() {
    if (storage.data) {
      this.data = JSON.parse(storage.getItem(name));
    } else {
      this.data = this.create();
    }

    log.info('loading localstorage', storage.data);

    if (this.data.clientVersion !== this.app.config.version) {
      this.data = this.create();
      this.save();
    }
  }

  create() {
    return {
      new: true,
      welcome: true,
      clientVersion: this.app.config.version,
      intensity: 0.8,
      player: {
        username: '',
        password: '',
        autoLogin: false,
        rememberMe: false,
      },

      settings: {
        music: 100,
        sfx: 100,
        brightness: 100,
        soundEnabled: true,
        FPSCap: true,
        centerCamera: true,
        debug: false,
        showNames: true,
        showLevels: true,
      },
    };
  }

  save() {
    if (this.data) {
      storage.setItem(name, JSON.stringify(this.data));
    }
  }

  clear() {
    storage.removeItem(name);
    this.data = this.create();
  }

  toggleRemember(toggle) {
    this.data.player.rememberMe = toggle;
    this.save();
  }

  setPlayer(option, value) {
    const pData = this.getPlayer();

    if (pData.hasOwnProperty(option)) { // eslint-disable-line
      pData[option] = value;
    }

    this.save();
  }

  setSettings(option, value) {
    const sData = this.getSettings();

    if (sData.hasOwnProperty(option)) { // eslint-disable-line
      sData[option] = value;
    }

    this.save();
  }

  getPlayer() {
    return this.data.player;
  }

  getSettings() {
    return this.data ? this.data.settings : null;
  }
}
