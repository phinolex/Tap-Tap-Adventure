define(function() {
    var Incoming = Class.extend({
        init: function(packetHandler) {
            var self = this;

            self.packetHandler = packetHandler;
        }
    });
});