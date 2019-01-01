define(["jquery"], function($) {
  return Class.extend({
    constructor(game) {
      

      this.game = game;

      this.shortcuts = $("#abilityShortcut");
    },

    getList() {
      return this.shortcuts.find("ul");
    }
  });
});
