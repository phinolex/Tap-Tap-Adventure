import $ from 'jquery';
import Inventory from '../interface/inventory';
import Profile from '../interface/profile/profile';
import Actions from '../interface/actions';
import Bank from '../interface/bank';
import Enchant from '../interface/enchant';
import Warp from '../interface/warp';
import log from '../lib/log';

export default class Interface {
  constructor(game) {
    this.game = game;

    this.notify = $('#notify');
    this.confirm = $('#confirm');
    this.message = $('#message');
    this.fade = $('#notifFade');
    this.done = $('#notifyDone');

    this.inventory = null;
    this.profile = null;
    this.actions = null;
    this.enchant = null;

    this.loadNotifications();
    this.loadActions();
    this.loadWarp();

    this.done.click(() => {
      this.hideNotify();
    });
  }

  resize() {
    if (this.inventory) {
      this.inventory.resize();
    }

    if (this.profile) {
      this.profile.resize();
    }

    if (this.bank) {
      this.bank.resize();
    }

    if (this.enchant) {
      this.enchant.resize();
    }
  }

  loadInventory(size, data) {
    /**
     * This can be called multiple times and can be used
     * to completely refresh the inventory.
     */

    this.inventory = new Inventory(this.game, size);
    this.inventory.load(data);
  }

  loadBank(size, data) {
    /**
     * Similar structure as the inventory, just that it
     * has two containers. The bank and the inventory.
     */

    this.bank = new Bank(this.game, this.inventory.container, size);
    this.bank.load(data);
    this.loadEnchant();
  }

  loadProfile() {
    if (!this.profile) {
      this.profile = new Profile(this.game);
    }
  }

  loadActions() {
    if (!this.actions) {
      this.actions = new Actions(this);
    }
  }

  loadEnchant() {
    if (!this.enchant) {
      this.enchant = new Enchant(this.game, this);
    }
  }

  loadWarp() {
    if (!this.warp) this.warp = new Warp(this.game, this);
  }

  loadNotifications() {
    const ok = $('#ok');
    const cancel = $('#cancel');
    const done = $('#done');

    /**
     * Simple warning dialogue
     */

    ok.click(() => {
      this.hideNotify();
    });

    /**
     * Callbacks responsible for
     * Confirmation dialogues
     */

    cancel.click(() => {
      this.hideConfirm();
    });

    done.click(() => {
      log.info(this.confirm.className);
      this.hideConfirm();
    });
  }

  hideAll() {
    if (this.inventory && this.inventory.isVisible()) {
      this.inventory.hide();
    }

    if (this.actions && this.actions.isVisible()) {
      this.actions.hide();
    }

    if (
      this.profile
      && (this.profile.isVisible() || this.profile.settings.isVisible())
    ) this.profile.hide();

    if (
      this.game.input
      && this.game.input.chatHandler
      && this.game.input.chatHandler.input.is(':visible')
    ) {
      this.game.input.chatHandler.hideInput();
    }

    if (this.bank && this.bank.isVisible()) {
      this.bank.hide();
    }

    if (this.enchant && this.enchant.isVisible()) {
      this.enchant.hide();
    }

    if (this.warp && this.warp.isVisible()) {
      this.warp.hide();
    }
  }

  displayNotify(message) {
    if (this.isNotifyVisible()) {
      return;
    }

    this.notify.css('display', 'block');
    this.fade.css('display', 'block');
    this.message.css('display', 'block');

    this.message.text(message);
  }

  displayConfirm(message) {
    if (this.isConfirmVisible()) {
      return;
    }

    this.confirm.css('display', 'block');
    this.confirm.text(message);
  }

  hideNotify() {
    this.fade.css('display', 'none');
    this.notify.css('display', 'none');
    this.message.css('display', 'none');
  }

  hideConfirm() {
    this.confirm.css('display', 'none');
  }

  getQuestPage() {
    return this.profile.quests;
  }

  isNotifyVisible() {
    return this.notify.css('display') === 'block';
  }

  isConfirmVisible() {
    return this.confirm.css('display') === 'block';
  }
}
