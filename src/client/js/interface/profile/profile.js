/* global log, _, Packets */

define([
  "jquery",
  "./pages/state",
  "./pages/ability",
  "./pages/settings",
  "./pages/quest"
], function($, State, Ability, Settings, Quest) {
  return Class.extend({
    init(game) {
      var self = this;

      this.game = game;

      this.body = $("#profileDialog");
      this.button = $("#profileButton");

      this.next = $("#next");
      this.previous = $("#previous");

      this.activePage = null;
      this.activeIndex = 0;
      this.pages = [];

      this.load();
    },

    load() {
      var self = this;

      this.button.click(function() {
        this.game.interface.hideAll();
        this.settings.hide();

        if (this.isVisible()) {
          this.hide();
          this.button.removeClass("active");
        } else {
          this.show();
          this.button.addClass("active");
        }

        if (!this.activePage.loaded) this.activePage.load();

        this.game.socket.send(Packets.Click, [
          "profile",
          this.button.hasClass("active")
        ]);
      });

      this.next.click(function() {
        if (this.activeIndex + 1 < this.pages.length)
          this.setPage(this.activeIndex + 1);
        else this.next.removeClass("enabled");
      });

      this.previous.click(function() {
        if (this.activeIndex > 0) this.setPage(this.activeIndex - 1);
        else this.previous.removeClass("enabled");
      });

      this.state = new State(this.game);
      this.ability = new Ability(this.game);
      this.settings = new Settings(this.game);
      this.quests = new Quest(this.game);

      this.pages.push(this.state, this.quests, this.ability);

      this.activePage = this.state;

      if (this.activeIndex === 0 && this.activeIndex !== this.pages.length)
        this.next.addClass("enabled");
    },

    update() {
      var self = this;

      _.each(this.pages, function(page) {
        page.update();
      });
    },

    resize() {
      var self = this;

      _.each(this.pages, function(page) {
        page.resize();
      });
    },

    setPage(index) {
      var self = this,
        page = this.pages[index];

      this.clear();

      if (page.isVisible()) return;

      this.activePage = page;
      this.activeIndex = index;

      if (this.activeIndex + 1 === this.pages.length)
        this.next.removeClass("enabled");
      else if (this.activeIndex === 0) this.previous.removeClass("enabled");
      else {
        this.previous.addClass("enabled");
        this.next.addClass("enabled");
      }

      page.show();
    },

    show() {
      var self = this;

      this.body.fadeIn("slow");
      this.button.addClass("active");
    },

    hide() {
      var self = this;

      this.body.fadeOut("fast");
      this.button.removeClass("active");

      if (this.settings) this.settings.hide();
    },

    isVisible() {
      return this.body.css("display") === "block";
    },

    clear() {
      var self = this;

      if (this.activePage) this.activePage.hide();
    },

    getScale() {
      return this.game.getScaleFactor();
    }
  });
});
