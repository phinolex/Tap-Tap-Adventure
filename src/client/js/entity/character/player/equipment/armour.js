define(["./equipment"], function(Equipment) {
  return Equipment.extend({
    init(name, string, count, ability, abilityLevel) {
      var self = this;

      this._super(name, string, count, ability, abilityLevel);

      this.defence = -1;
    },

    setDefence(defence) {
      this.defence = defence;
    },

    getDefence() {
      return this.defence;
    },

    update(name, string, count, ability, abilityLevel) {
      this._super(name, string, count, ability, abilityLevel);
    }
  });
});
