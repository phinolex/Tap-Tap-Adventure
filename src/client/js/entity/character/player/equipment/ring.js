define(["./equipment"], function(Equipment) {
  return Equipment.extend({
    constructor(name, string, count, ability, abilityLevel) {
      

      this._super(name, string, count, ability, abilityLevel);
    },

    update(name, string, count, ability, abilityLevel) {
      this._super(name, string, count, ability, abilityLevel);
    }
  });
});
