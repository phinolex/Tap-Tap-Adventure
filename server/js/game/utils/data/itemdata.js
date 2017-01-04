var _ = require("underscore"),
    ItemTypes = require("../../../../../shared/js/itemtypes"),
    ItemsJson = require("../../../../../shared/data/items.json");


var ItemData = {};
var KindData = {};

//log.info(ItemsJson);
_.each( ItemsJson, function( value, key ) {
	ItemData[key.toLowerCase()] = {
		key: key.toLowerCase(),
		kind: (value.kind) ? value.kind : 0,
		type: (value.type) ? value.type : "object",
		attack: (value.attack) ? value.attack : 0,
		defense: (value.defense) ? value.defense : 0,
        pLevel: (value.pLevel) ? value.pLevel : 0,
        rLevel: (value.rLevel) ? value.rLevel : 0,
		name: (value.name) ? value.name : "Blank",
		buy: (value.buy) ? value.buy : 0,
		buyCount: (value.buyCount) ? value.buyCount : 0
	};
	KindData[value.kind] = ItemData[key.toLowerCase()];
});

ItemTypes.setItemData(ItemData);
ItemTypes.setKindData(KindData);
ItemTypes.setupStore();

module.exports.Properties = ItemData;
module.exports.Kinds = KindData;

