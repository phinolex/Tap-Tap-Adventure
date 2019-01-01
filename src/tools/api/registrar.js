var cls = require("../../server/js/lib/class"),
  redis = require("redis"),
  request = require("request");

function load() {
  var registrar = new Registrar();

  registrar.onReady(function() {});
}

module.exports = Registrar = cls.Class.extend({
  constructor() {
    

    this.client = redis.createClient("127.0.0.1", 6379, {
      socket_nodelay: true
    });

    this.readyCallback();
  },

  onReady(callback) {
    this.readyCallback = callback;
  }
});

load();
