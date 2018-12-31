define(["./equipment"], function(Equipment) {
  return Equipment.extend({
    init(name, string, count, ability, abilityLevel) {
      var self = this;

      self._super(name, string, count, ability, abilityLevel);

      self.level = -1;
      self.damage = -1;
      self.ranged = false;
    },

    exists() {
      return this._super();
    },

    setDamage(damage) {
      this.damage = damage;
    },

    setLevel(level) {
      this.level = level;
    },

    getDamage() {
      return this.damage;
    },

    getLevel() {
      return this.level;
    },

    getString() {
      return this._super();
    },

    update(name, string, count, ability, abilityLevel) {
      this._super(name, string, count, ability, abilityLevel);
    }
  });
});
