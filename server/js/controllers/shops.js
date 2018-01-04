var cls = require('../lib/class'),
    Shops = require('../util/shops'),
    Messages = require('../network/messages'),
    Packets = require('../network/packets');

module.exports = Shops = cls.Class.extend({

    init: function(world) {
        var self = this;

        self.world = world;

    },

    open: function(player, shopId) {
        var self = this;

        player.send(new Messages.Shop(Packets.Shop, {
            instance: player.instance,
            npcId: shopId,
            shopData: self.getShopData(shopId)
        }));
    },

    buy: function(player, shopId, itemId, count) {
        var self = this,
            cost = Shops.getCost(shopId, itemId, count);


        self.refresh();
    },

    refresh: function() {
        var self = this;


    },

    getShopData: function(id) {
        var self = this;

        if (!Shops.isShopNPC(id))
            return;

        return {
            items: Shops.getItems(id),
            counts: Shops.getCount(id)
        }
    }


});