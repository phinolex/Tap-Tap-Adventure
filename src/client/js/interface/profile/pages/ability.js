define(["jquery", "../page"], function($, Page) {
  return Page.extend({
    init(game) {
      var self = this;

      this._super("#skillPage");

      this.game = game;
    }
  });
});
