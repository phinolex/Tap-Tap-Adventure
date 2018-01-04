var Shops = {},
    _ = require('underscore');

Shops.Data = {};
Shops.Ids = {};

Shops.isShopNPC = function(npcId) {
    return npcId in Shops.Ids;
};

Shops.getItems = function(id) {
    return Shops.Ids[id].items;
};

Shops.getItemCount = function(id) {
    return Shops.getItems(id).length;
};

Shops.getCost = function(shopId, itemId, count) {
    /**
     * Reason for the shopId variable is because some shops
     * may have different prices for the same item. A way to
     * spice up the game.
     */

    var shop = Shops.Ids[shopId],
        index = shop.items.indexOf(itemId);

    if (!index)
        return;

    return shop.prices[index] * count;
};

Shops.getCount = function(id) {
    var count = Shops.Ids[id].count,
        counts = [];

    if (_.isArray(count))
        return count;

    for (var i = 0; i < Shops.getItemCount(id); i++)
        counts.push(count);

    return counts;
};


module.exports = Shops;