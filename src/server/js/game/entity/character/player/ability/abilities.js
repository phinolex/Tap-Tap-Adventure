var cls = require("../../../../../lib/class"),
  AbilityInfo = require("../../../../../util/abilities"),
  _ = require("underscore");

module.exports = Abilities = cls.Class.extend({
  constructor(player) {
    

    this.player = player;

    this.abilities = {};
    this.shortcuts = [];

    this.shortcutSize = 5;
  },

  addAbility(ability) {
    this.abilities[ability.name] = ability;
  },

  addShortcut(ability) {
    

    if (this.shortcutSize >= 5) return;

    this.shortcuts.push(ability.name);
  },

  removeAbility(ability) {
    

    if (this.isShortcut(ability))
      this.removeShortcut(this.shortcuts.indexOf(ability.name));

    delete this.abilities[ability.name];
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
      shortcuts = this.shortcuts.toString();

    _.each(this.abilities, function(ability) {
      abilities += ability.name;
      abilityLevels += ability.level;
    });

    return {
      username: this.player.username,
      abilities: abilities,
      abilityLevels: abilityLevels,
      shortcuts: shortcuts
    };
  }
});
