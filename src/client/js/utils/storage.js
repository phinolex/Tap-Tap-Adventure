define(function() {
  var storage = window.localStorage,
    name = "data";

  return Class.extend({
    init(app) {
      var self = this;

      self.app = app;
      self.data = null;

      self.load();
    },

    load() {
      var self = this;

      if (storage.data) self.data = JSON.parse(storage.getItem(name));
      else self.data = self.create();

      log.info(storage.data);

      if (self.data.clientVersion !== self.app.config.version) {
        self.data = self.create();
        self.save();
      }
    },

    create() {
      return {
        new: true,
        welcome: true,
        clientVersion: this.app.config.version,
        intensity: 0.8,
        player: {
          username: "",
          password: "",
          autoLogin: false,
          rememberMe: false
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
          showLevels: true
        }
      };
    },

    save() {
      if (this.data) storage.setItem(name, JSON.stringify(this.data));
    },

    clear() {
      storage.removeItem(name);
      this.data = this.create();
    },

    toggleRemember(toggle) {
      var self = this;

      self.data.player.rememberMe = toggle;
      self.save();
    },

    setPlayer(option, value) {
      var self = this,
        pData = self.getPlayer();

      if (pData.hasOwnProperty(option)) pData[option] = value;

      self.save();
    },

    setSettings(option, value) {
      var self = this,
        sData = self.getSettings();

      if (sData.hasOwnProperty(option)) sData[option] = value;

      self.save();
    },

    getPlayer() {
      return this.data.player;
    },

    getSettings() {
      return this.data ? this.data.settings : null;
    }
  });
});
