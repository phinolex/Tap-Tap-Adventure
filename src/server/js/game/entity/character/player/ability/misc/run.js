var Ability = require("./ability");

module.exports = Run = Ability.extend({
  init(name, type) {
    var self = this;

    this._super(name, type);
  }
});
