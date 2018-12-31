define(function() {
  /**
   * The children of these classes are responsible for
   * clear and concise ways of organizing stats of weapons
   * in the client side. This does not dictate the damage,
   * defense or bonus stats, it's just for looks.
   */

  return Class.extend({
    init(name, string, count, ability, abilityLevel) {
      var self = this;

      self.name = name;
      self.string = string;
      self.count = count;
      self.ability = ability;
      self.abilityLevel = abilityLevel;
    },

    exists() {
      return this.name !== null && this.name !== "null";
    },

    getName() {
      return this.name;
    },

    getString() {
      return this.string;
    },

    getCount() {
      return this.count;
    },

    getAbility() {
      return this.ability;
    },

    getAbilityLevel() {
      return this.abilityLevel;
    },

    update(name, string, count, ability, abilityLevel) {
      var self = this;

      self.name = name;
      self.string = string;
      self.count = count;
      self.ability = ability;
      self.abilityLevel = abilityLevel;
    }
  });
});
