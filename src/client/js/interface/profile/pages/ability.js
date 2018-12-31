define(["jquery", "../page"], function($, Page) {
  return Page.extend({
    init(game) {
      var self = this;

      self._super("#skillPage");

      self.game = game;
    }
  });
});
