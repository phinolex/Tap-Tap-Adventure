var Ability = require("./ability");

module.exports = IceAttack = Ability.extend({
  init(name, type) {
    var self = this;

    this._super(name, type);
  }
});
