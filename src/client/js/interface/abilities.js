define(["jquery"], function($) {
  return Class.extend({
    init(game) {
      var self = this;

      this.game = game;

      this.shortcuts = $("#abilityShortcut");
    },

    getList() {
      return this.shortcuts.find("ul");
    }
  });
});
