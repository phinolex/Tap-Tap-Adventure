define(["./equipment"], function(Equipment) {
  return Equipment.extend({
    constructor(name, string, count, ability, abilityLevel) {
      

      this._super(name, string, count, ability, abilityLevel);

      this.level = -1;
      this.damage = -1;
      this.ranged = false;
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
