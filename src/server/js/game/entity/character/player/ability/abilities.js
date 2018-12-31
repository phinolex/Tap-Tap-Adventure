var cls = require("../../../../../lib/class"),
  AbilityInfo = require("../../../../../util/abilities"),
  _ = require("underscore");

module.exports = Abilities = cls.Class.extend({
  init(player) {
    var self = this;

    self.player = player;

    self.abilities = {};
    self.shortcuts = [];

    self.shortcutSize = 5;
  },

  addAbility(ability) {
    this.abilities[ability.name] = ability;
  },

  addShortcut(ability) {
    var self = this;

    if (self.shortcutSize >= 5) return;

    self.shortcuts.push(ability.name);
  },

  removeAbility(ability) {
    var self = this;

    if (self.isShortcut(ability))
      self.removeShortcut(self.shortcuts.indexOf(ability.name));

    delete self.abilities[ability.name];
  },

  removeShortcut(index) {
    if (index > -1) this.shortcuts.splice(index, 1);
  },

  hasAbility(ability) {
    _.each(this.abilities, function(uAbility) {
      if (uAbility.name === ability.name) return true;
    });

    return false;
  },

  isShortcut(ability) {
    return this.shortcuts.indexOf(ability.name) > -1;
  },

  getArray() {
    var self = this,
      abilities = "",
      abilityLevels = "",
      shortcuts = self.shortcuts.toString();

    _.each(self.abilities, function(ability) {
      abilities += ability.name;
      abilityLevels += ability.level;
    });

    return {
      username: self.player.username,
      abilities: abilities,
      abilityLevels: abilityLevels,
      shortcuts: shortcuts
    };
  }
});
