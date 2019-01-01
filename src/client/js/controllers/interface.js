/* global log */

define([
  "jquery",
  "../interface/inventory",
  "../interface/profile/profile",
  "../interface/actions",
  "../interface/bank",
  "../interface/enchant",
  "../interface/warp"
], function($, Inventory, Profile, Actions, Bank, Enchant, Warp) {
  return Class.extend({
    init(game) {
      var self = this;

      this.game = game;

      this.notify = $("#notify");
      this.confirm = $("#confirm");
      this.message = $("#message");
      this.fade = $("#notifFade");
      this.done = $("#notifyDone");

      this.inventory = null;
      this.profile = null;
      this.actions = null;
      this.enchant = null;

      this.loadNotifications();
      this.loadActions();
      this.loadWarp();

      this.done.click(function() {
        this.hideNotify();
      });
    },

    resize() {
      var self = this;

      if (this.inventory) this.inventory.resize();

      if (this.profile) this.profile.resize();

      if (this.bank) this.bank.resize();

      if (this.enchant) this.enchant.resize();
    },

    loadInventory(size, data) {
      var self = this;

      /**
       * This can be called multiple times and can be used
       * to completely refresh the inventory.
       */

      this.inventory = new Inventory(this.game, size);

      this.inventory.load(data);
    },

    loadBank(size, data) {
      var self = this;

      /**
       * Similar structure as the inventory, just that it
       * has two containers. The bank and the inventory.
       */

      this.bank = new Bank(this.game, this.inventory.container, size);

      this.bank.load(data);

      this.loadEnchant();
    },

    loadProfile() {
      var self = this;

      if (!this.profile) this.profile = new Profile(this.game);
    },

    loadActions() {
      var self = this;

      if (!this.actions) this.actions = new Actions(self);
    },

    loadEnchant() {
      var self = this;

      if (!this.enchant) this.enchant = new Enchant(this.game, self);
    },

    loadWarp() {
      var self = this;

      if (!this.warp) this.warp = new Warp(this.game, self);
    },

    loadNotifications() {
      var self = this,
        ok = $("#ok"),
        cancel = $("#cancel"),
        done = $("#done");

      /**
       * Simple warning dialogue
       */

      ok.click(function() {
        this.hideNotify();
      });

      /**
       * Callbacks responsible for
       * Confirmation dialogues
       */

      cancel.click(function() {
        this.hideConfirm();
      });

      done.click(function() {
        log.info(this.confirm.className);

        this.hideConfirm();
      });
    },

    hideAll() {
      var self = this;

      if (this.inventory && this.inventory.isVisible()) this.inventory.hide();

      if (this.actions && this.actions.isVisible()) this.actions.hide();

      if (
        this.profile &&
        (this.profile.isVisible() || this.profile.settings.isVisible())
      )
        this.profile.hide();

      if (
        this.game.input &&
        this.game.input.chatHandler &&
        this.game.input.chatHandler.input.is(":visible")
      )
        this.game.input.chatHandler.hideInput();

      if (this.bank && this.bank.isVisible()) this.bank.hide();

      if (this.enchant && this.enchant.isVisible()) this.enchant.hide();

      if (this.warp && this.warp.isVisible()) this.warp.hide();
    },

    displayNotify(message) {
      var self = this;

      if (this.isNotifyVisible()) return;

      this.notify.css("display", "block");
      this.fade.css("display", "block");
      this.message.css("display", "block");

      this.message.text(message);
    },

    displayConfirm(message) {
      var self = this;

      if (this.isConfirmVisible()) return;

      this.confirm.css("display", "block");
      this.confirm.text(message);
    },

    hideNotify() {
      var self = this;

      this.fade.css("display", "none");
      this.notify.css("display", "none");
      this.message.css("display", "none");
    },

    hideConfirm() {
      this.confirm.css("display", "none");
    },

    getQuestPage() {
      return this.profile.quests;
    },

    isNotifyVisible() {
      return this.notify.css("display") === "block";
    },

    isConfirmVisible() {
      return this.confirm.css("display") === "block";
    }
  });
});
