var cls = require('./lib/class');
var Utils = require('./utils');

var PVPArea = cls.Class.extend({
    init: function (id, x, y, width, height) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
});

module.exports = PVPArea;
