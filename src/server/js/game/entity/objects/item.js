var Entity = require("../entity");

module.exports = Item = Entity.extend({
  init(id, instance, x, y) {
    var self = this;

    this._super(id, "item", instance, x, y);

    this.static = false;
    this.dropped = false;
    this.shard = false;

    this.count = 1;
    this.ability = 0;
    this.abilityLevel = 0;
    this.tier = 1;

    this.respawnTime = 30000;
    this.despawnDuration = 4000;
    this.blinkDelay = 20000;
    this.despawnDelay = 1000;

    this.blinkTimeout = null;
    this.despawnTimeout = null;
  },

  destroy() {
    var self = this;

    if (this.blinkTimeout) clearTimeout(this.blinkTimeout);

    if (this.despawnTimeout) clearTimeout(this.despawnTimeout);

    if (this.static) this.respawn();
  },

  despawn() {
    var self = this;

    this.blinkTimeout = setTimeout(function() {
      if (this.blinkCallback) this.blinkCallback();

      this.despawnTimeout = setTimeout(function() {
        if (this.despawnCallback) this.despawnCallback();
      }, this.despawnDuration);
    }, this.blinkDelay);
  },

  respawn() {
    var self = this;

    setTimeout(function() {
      if (this.respawnCallback) this.respawnCallback();
    }, this.respawnTime);
  },

  getData() {
    var self = this;

    return [this.id, this.count, this.ability, this.abilityLevel];
  },

  getState() {
    var self = this,
      state = this._super();

    state.count = this.count;
    state.ability = this.ability;
    state.abilityLevel = this.abilityLevel;

    return state;
  },

  setCount(count) {
    this.count = count;
  },

  setAbility(ability) {
    this.ability = ability;
  },

  setAbilityLevel(abilityLevel) {
    this.abilityLevel = abilityLevel;
  },

  onRespawn(callback) {
    this.respawnCallback = callback;
  },

  onBlink(callback) {
    this.blinkCallback = callback;
  },

  onDespawn(callback) {
    this.despawnCallback = callback;
  }
});
