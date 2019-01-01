var cls = require("../../../../lib/class"),
  Modules = require("../../../../util/modules");

module.exports = Trade = cls.Class.extend({
  /**
   * We maintain a trade instance for every player,
   * and we trigger it whenever the trading is
   * started and/or requested.
   */

  init(player) {
    var self = this;

    this.player = player;
    this.oPlayer = null;

    this.requestee = null;

    this.state = null;
    this.subState = null;

    this.playerItems = [];
    this.oPlayerItems = [];
  },

  start() {
    var self = this;

    this.oPlayer = this.requestee;
    this.state = Modules.Trade.Started;
  },

  stop() {
    var self = this;

    this.oPlayer = null;
    this.state = null;
    this.subState = null;
    this.requestee = null;

    this.playerItems = [];
    this.oPlayerItems = [];
  },

  finalize() {
    var self = this;

    if (!this.player.inventory.containsSpaces(this.oPlayerItems.length)) return;

    for (var i in this.oPlayerItems) {
      var item = this.oPlayerItems[i];

      if (!item || item.id === -1) continue;

      this.oPlayer.inventory.remove(item.id, item.count, item.index);
      this.player.inventory.add(item);
    }
  },

  select(slot) {
    var self = this,
      item = this.player.inventory.slots[slot];

    if (!item || item.id === -1 || this.playerItems.indexOf(item) < 0) return;

    this.playerItems.push(item);
  },

  request(oPlayer) {
    var self = this;

    this.requestee = oPlayer;

    if (oPlayer.trade.getRequestee() === this.player.instance) this.start();
  },

  accept() {
    var self = this;

    this.subState = Modules.Trade.Accepted;

    if (this.oPlayer.trade.subState === Modules.Trade.Accepted) {
      this.finalize();
      this.oPlayer.trade.finalize();
    }
  },

  getRequestee() {
    var self = this;

    if (!this.requestee) return null;

    return this.requestee.instance;
  },

  decline() {
    this.stop();
  },

  isStarted() {
    return this.state !== null;
  }
});
