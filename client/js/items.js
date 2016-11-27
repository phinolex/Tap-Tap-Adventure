
define(['text!../shared/data/items.json', 'item', '../shared/js/itemtypes'], function(ItemsJson, Item) {
	var Items = {};
	var ItemData = {};
	var KindData = {};
	
	var itemParse = JSON.parse(ItemsJson);
	//log.info(JSON.stringify(itemParse));
	$.each( itemParse, function( itemKey, itemValue ) {
		if (itemValue.type == "weapon" || itemValue.type == "weaponarcher" || itemValue.type == "pendant" || itemValue.type == "ring") {
			Items[itemKey] = Item.extend({
				init: function(id, skillKind, skillLevel) {
					this._super(id, itemValue.kind, itemValue.type, skillKind, skillLevel);
				}
			});
		}
		else if (itemValue.type == "armor" || itemValue.type == "armorarcher" ||
			 itemValue.type == "object" || itemValue.type == "craft") {
			Items[itemKey] = Item.extend({
				init: function(id) {
					this._super(id, itemValue.kind, itemValue.type);
				}				
			});
		}
		ItemData[itemKey.toLowerCase()] = {
			key: itemKey.toLowerCase(),
			kind: (itemValue.kind) ? itemValue.kind : 0,
			type: (itemValue.type) ? itemValue.type : "object",
			attack: (itemValue.attack) ? itemValue.attack : 0,
			defense: (itemValue.defense) ? itemValue.defense : 0,
			name: (itemValue.name) ? itemValue.name : "Blank",
			buy: (itemValue.buy) ? itemValue.buy : 0,
			buyCount: (itemValue.buyCount) ? itemValue.buyCount : 0,
			spriteName: (itemValue.spriteName) ? itemValue.spriteName.toLowerCase():""
		};
		KindData[itemValue.kind] = ItemData[itemKey.toLowerCase()];
	});     

	ItemTypes.setItemData(ItemData);
	ItemTypes.setKindData(KindData);
	ItemTypes.setupStore();
    return Items;
});
