define(["jquery"], function($) {
  return Class.extend({
    init(game) {
      var self = this;

      self.game = game;

      self.shortcuts = $("#abilityShortcut");
    },

    getList() {
      return this.shortcuts.find("ul");
    }
  });
});
