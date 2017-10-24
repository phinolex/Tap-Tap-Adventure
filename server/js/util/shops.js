var Shops = {};

Shops.Data = {};
Shops.Ids = {};

Shops.isShop = function(id) {
    return !!Shops.Ids[id];
};

Shops.getItems = function(id) {
    return Shops.Ids[id].items;
};

Shops.getCount = function(id) {
    return Shops.Ids[id].count;
};


module.exports = Shops;