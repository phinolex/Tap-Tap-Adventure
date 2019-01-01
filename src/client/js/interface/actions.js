/* global _, log */

define(["jquery"], function($) {
  return Class.extend({
    init(intrfce) {
      var self = this;

      this.interface = intrfce;

      this.body = $("#actionContainer");
      this.drop = $("#dropDialog");
      this.dropInput = $("#dropCount");

      this.pBody = $("#pActions");
      this.follow = $("#follow");
      this.trade = $("#tradeAction");

      this.activeClass = null;

      this.miscButton = null;

      this.load();
    },

    load() {
      var self = this,
        dropAccept = $("#dropAccept"),
        dropCancel = $("#dropcancel");

      dropAccept.click(function(event) {
        if (this.activeClass === "inventory")
          this.interface.inventory.clickAction(event);
      });

      dropCancel.click(function(event) {
        if (this.activeClass === "inventory")
          this.interface.inventory.clickAction(event);
      });
    },

    loadDefaults(activeClass) {
      var self = this;

      this.activeClass = activeClass;

      switch (this.activeClass) {
        case "inventory":
          var dropButton = $('<div id="drop" class="actionButton">Drop</div>');

          this.add(dropButton);

          break;

        case "profile":
          break;
      }
    },

    add(button, misc) {
      var self = this;

      this.body.find("ul").prepend($("<li></li>").append(button));

      button.click(function(event) {
        if (this.activeClass === "inventory")
          this.interface.inventory.clickAction(event);
      });

      if (misc) this.miscButton = button;
    },

    removeMisc() {
      var self = this;

      this.miscButton.remove();
      this.miscButton = null;
    },

    reset() {
      var self = this,
        buttons = this.getButtons();

      for (var i = 0; i < buttons.length; i++) $(buttons[i]).remove();
    },

    show() {
      this.body.fadeIn("fast");
    },

    showPlayerActions(player, mouseX, mouseY) {
      var self = this;

      if (!player) return;

      this.pBody.fadeIn("fast");
      this.pBody.css({
        left: mouseX - this.pBody.width() / 2 + "px",
        top: mouseY + this.pBody.height() / 2 + "px"
      });

      this.follow.click(function() {
        this.getPlayer().follow(player);

        this.hidePlayerActions();
      });

      this.trade.click(function() {
        this.getGame().tradeWith(player);

        this.hidePlayerActions();
      });
    },

    hide() {
      this.body.fadeOut("slow");
    },

    hidePlayerActions() {
      this.pBody.fadeOut("fast");
    },

    displayDrop(activeClass) {
      var self = this;

      this.activeClass = activeClass;

      this.drop.fadeIn("fast");

      this.dropInput.focus();
      this.dropInput.select();
    },

    hideDrop() {
      var self = this;

      this.drop.fadeOut("slow");

      this.dropInput.blur();
      this.dropInput.val("");
    },

    getButtons() {
      return this.body.find("ul").find("li");
    },

    getGame() {
      return this.interface.game;
    },

    getPlayer() {
      return this.interface.game.player;
    },

    isVisible() {
      return this.body.css("display") === "block";
    }
  });
});
