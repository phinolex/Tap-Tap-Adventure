var cls = require("../../../../../lib/class"),
  Items = require("../../../../../util/items"),
  Messages = require("../../../../../network/messages"),
  Packets = require("../../../../../network/packets"),
  Utils = require("../../../../../util/utils");

module.exports = Enchant = cls.Class.extend({
  /**
   * Tier 1 - Damage/Armour boost (1-5%)
   * Tier 2 - Damage boost (1-10% & 10% for special ability or special ability level up)
   * Tier 3 - Damage boost (1-15% & 15% for special ability or special ability level up)
   * Tier 4 - Damage boost (1-20% & 20% for special ability or special ability level up)
   * Tier 5 - Damage boost (1-40% & 25% for special ability or special ability level up)
   */

  init(player) {
    var self = this;

    this.player = player;

    this.selectedItem = null;
    this.selectedShards = null;
  },

  convert(shard) {
    var self = this;

    if (!Items.isShard(shard.id) || !this.player.inventory.hasSpace()) return;

    var tier = Items.getShardTier(shard.id);

    if (shard.count < 11 && tier > 5) return;

    for (var i = 0; i < shard.count; i += 10) {
      this.player.inventory.remove(shard.id, 10, shard.index);

      this.player.inventory.add({
        id: shard.id + 1,
        count: 1,
        ability: -1,
        abilityLevel: -1
      });
    }
  },

  enchant() {
    var self = this;

    if (!this.selectedItem) {
      this.player.notify("You have not selected an item to enchant.");
      return;
    }

    if (!this.selectedShards) {
      this.player.notify("You have to select shards to infuse.");
      return;
    }

    if (!this.verify()) {
      this.player.notify("This item cannot be enchanted.");
      return;
    }

    if (this.selectedShards.count < 10) {
      this.player.notify("You must have a minimum of 10 shards to enchant.");
      return;
    }

    /**
     * Implement probabilities here based on the number of shards
     * and reason them out.
     */

    var tier = this.selectedItem.tier;

    this.selectedItem.count = Utils.randomInt(1, tier === 5 ? 40 : 5 * tier);

    if (tier < 2) return;

    if (this.hasAbility(this.selectedItem))
      if (this.selectedItem.abilityLevel < 5) this.selectedItem.abilityLevel++;
      else this.generateAbility();

    this.player.inventory.remove(
      this.selectedShards.id,
      10,
      this.selectedShards.index
    );
    this.player.sync();
  },

  generateAbility() {
    var self = this,
      type = Items.getType(this.selectedItem.id),
      probability = Utils.randomInt(0, 100);

    if (probability > 5 + 5 * this.selectedShards.tier) return;

    switch (type) {
      case "armor":
      case "armorarcher":
        this.selectedItem.ability = Utils.randomInt(2, 3);

        break;

      case "weapon":
        this.selectedItem.ability = Utils.randomInt(0, 1);

        break;

      case "weaponarcher":
        this.selectedItem.ability = Utils.randomInt(4, 5);

        break;

      case "pendant":
        break;

      case "ring":
        break;

      case "boots":
        break;
    }
  },

  verify() {
    return (
      Items.isEnchantable(this.selectedItem.id) &&
      Items.isShard(this.selectedShards.id)
    );
  },

  add(type, item) {
    var self = this,
      isItem = item === "item";

    if (isItem && !Items.isEnchantable(item.id)) return;

    if (type === "item") {
      if (this.selectedItem) this.remove("item");

      this.selectedItem = item;
    } else if (type === "shards") {
      if (this.selectedShards) this.remove("shards");

      this.selectedShards = item;
    }

    this.player.send(
      new Messages.Enchant(Packets.EnchantOpcode.Select, {
        type: type,
        index: item.index
      })
    );
  },

  remove(type) {
    var self = this,
      index;

    if (type === "item" && this.selectedItem) {
      index = this.selectedItem.index;

      this.selectedItem = null;
    } else if (type === "shards" && this.selectedShards) {
      index = this.selectedShards.index;

      this.selectedShards = null;
    }

    this.player.send(
      new Messages.Enchant(Packets.EnchantOpcode.Remove, {
        type: type,
        index: index
      })
    );
  },

  hasAbility(item) {
    return item.ability !== -1;
  }
});
