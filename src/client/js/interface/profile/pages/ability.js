define(["jquery", "../page"], function($, Page) {
  return Page.extend({
    constructor(game) {
      

      this.super("#skillPage");

      this.game = game;
    }
  });
});
