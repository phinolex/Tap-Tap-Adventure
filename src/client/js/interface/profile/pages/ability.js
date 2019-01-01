define(["jquery", "../page"], function($, Page) {
  return Page.extend({
    constructor(game) {
      

      this._super("#skillPage");

      this.game = game;
    }
  });
});
