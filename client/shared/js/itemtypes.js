/* global bootKind, _, exports, module, Types */

var ItemTypes = {};
var ItemData = {};
var KindData = {};

ItemTypes.ItemData = ItemData;
ItemTypes.KindData = KindData;

ItemTypes.setItemData = function(itemData) {
	ItemData = itemData;
	//log.info(JSON.stringify(ItemData));
	ItemTypes.ItemData = itemData;
};

ItemTypes.setKindData = function(kindData) {
	//log.info(JSON.stringify(kindData));
	KindData = kindData;
	ItemTypes.KindData = kindData;
};

ItemTypes.getKindFromString = function (name) {
    //if (name == null) return 0;
    try {
    	 if(name in ItemData) {
    	 	 //log.info("kind:"+ItemData[name].kind);
    	 	 return ItemData[name].kind;
    	 }
    	 else {
    	 	 return null;
    	 }
    } catch(e) {
        log.error("No kind found for name: "+name);
        log.error('Error stack: ' + e.stack);
    }
}


ItemTypes.getKindAsString = function(kind) {
    //if (kind == null) return null;
    try {
	    if(kind in KindData) {
	        //log.info("key:"+KindData[kind].key);
		return KindData[kind].key;
	    }
    } catch(e) {
        log.error("No kind found for kind: "+kind);
        log.error('Error stack: ' + e.stack);
    }
};

// getKeyAsString

ItemTypes.getName = function(kind) {
    //if (kind == null) return false;
    try {
    	var item = KindData[kind];
    	if (!item) return '';
        return item.name;
   } catch(e) {
        log.error("No name found for item: "+KindData[kind]);
        log.error('Error stack: ' + e.stack);
    }	
}

ItemTypes.getWeaponLevel = function(kind) {
    //if (kind == null) return false;
    try {
    	var item = KindData[kind];
    	if (!item) return 0;
        return item.attack;
    } catch(e) {
        log.error("No level found for weapon: "+KindData[kind]);
        log.error('Error stack: ' + e.stack);
    }
};


ItemTypes.getArmorLevel = function(kind) {
    //if (kind == null) return false;
    try {
    	var item = KindData[kind];
        if (!item) return 0;
    	return item.defense;
    } catch(e) {
        log.error("No level found for armor: "+KindData[kind]);
        log.error('Error stack: ' + e.stack);
    }
};

ItemTypes.getItemByLevel = function(type, level) {
	for (var kind in KindData)
	{
	    var item = KindData[kind];
	    if ((item.type == "armor" || item.type == "armorarcher") &&
		item.type == type && level == item.defense)
	    {
		return item;
	    }
	    if ((item.type == "weapon" || item.type == "weaponarcher") &&
		item.type == type && level == item.attack)
	    {
		return item;
	    }
	    
	}
	return null;
};


ItemTypes.getType = function(kind) {
    //if (kind == null) return false;
    try {
    	var item = KindData[kind];
        return item.type;
    } catch(e) {
        log.error("No type found for item: "+kind);
        log.error('Error stack: ' + e.stack);
    }
};

ItemTypes.getBuyPrice = function(itemName) {
    	var item = ItemData[itemName];
        if (!item) return 0;
        
        if (item.type == "weapon" || item.type == "weaponarcher") {
        	return Math.floor(Math.pow(1.4,item.attack+1));
        } else if (item.type == "armor" || item.type == "armorarcher") {
        	return Math.floor(Math.pow(1.4,item.defense+1));
        } else if (item.type == "object" && item.buy > 0) {
        	if (item.buyCount > 1)
        		return (item.buy * item.buyCount);
        	else
        		return item.buy;
        }
    	return 0;
};

ItemTypes.getSellPrice = function(itemName) {    	
	return Math.floor( ItemTypes.getBuyPrice(itemName) / 3) ;
};

ItemTypes.getBuyPriceByKind = function(itemKind) {
    	var item = KindData[itemKind];
        if (!item) return 0;
        
        if (item.type == "weapon" || item.type == "weaponarcher") {
        	return Math.floor(Math.pow(1.4,item.attack+1));
        } else if (item.type == "armor" || item.type == "armorarcher") {
        	return Math.floor(Math.pow(1.4,item.defense+1));
        } else if (item.type == "object" && item.buy > 0) {
        	if (item.buyCount > 1)
        		return (item.buy * item.buyCount);
        	else
        		return item.buy;
        }
    	return 0;
};

ItemTypes.getSellPriceByKind = function(itemKind) {    	
	return Math.floor( ItemTypes.getBuyPriceByKind(itemKind) / 3) ;
};

ItemTypes.getEnchantPrice = function(itemName, enchantLevel) {
    	var item = ItemData[itemName];
        if (!item) return 0;
        
        var level;
        if (item.type == "weapon" || item.type == "weaponarcher") {
        	level = item.attack;
        	
        } else if (item.type == "armor" || item.type == "armorarcher") {
        	level = item.defense;
        }
        return Math.floor(Math.pow(1.4,level + enchantLevel + 1));
};

ItemTypes.getItemDataByKind = function (kind) {
       for (var key in ItemData) {
       	       var value = ItemData[key];
		if (value.kind == kind) {
			return value;
		}
	};
	return null;
}

ItemTypes.isArmor = function(kind) {
    var item = KindData[kind];
    if (!item) return false;
    return item.type === "armor";
};

ItemTypes.isArcherArmor = function(kind) {
    var item = KindData[kind];
    if (!item) return false;
    return item.type === "armorarcher";
};

ItemTypes.isWeapon = function(kind) {
    var item = KindData[kind];
    if (!item) return false;
    return item.type === "weapon";
};

ItemTypes.isArcherWeapon = function(kind) {
    var item = KindData[kind];
    if (!item) return false;
    return item.type === "weaponarcher";
};

ItemTypes.isObject = function(kind) {
    var item = KindData[kind];
    if (!item) return false;
    return item.type === "object";
};

ItemTypes.isBenef = function(kind) {
    var item = KindData[kind];
    if (!item) return false;
    return item.type === "benef";
};

ItemTypes.isCraft = function(kind) {
    var item = KindData[kind];
    //if (!item) return false;
    return item.type === "craft";
};


ItemTypes.isGold = function(kind) {
    return kind === 400;
};

ItemTypes.isConsumableItem = function(kind) {
    return kind === 35 
        || kind === 36
        || kind === 212
        || kind === 401
        || kind === 450
        || kind === 451
    	|| kind === 452;        
};

ItemTypes.isHealingItem = function(kind) {
    return kind === 35
        || kind === 36
        || kind === 401;
};

ItemTypes.isMount = function(kind) {
    return kind === 450
    || kind === 451
    || kind === 452;	
};

ItemTypes.isExpendableItem = function(kind) {
    return ItemTypes.isConsumableItem(kind)
        || kind === 38
        || kind === 39;
};

ItemTypes.isChest = function(kind) {
    return kind === 37;
};

ItemTypes.isItem = function (kind) {
    var item = ItemTypes.getItemDataByKind(kind);
    if (!item) return false;
    return item.type == "weaponarcher" ||
    	item.type == "weapon" ||
    	item.type == "armor" ||
    	item.type == "armorarcher" ||
    	item.type == "object" ||
    	item.type == "craft";
}

// TODO - what should the callback be?
ItemTypes.forEachKind = function(callback) {
    for(var k in itemData) {
    	//log.info("k="+JSON.stringify(k));
        callback(KindData[k], k);
    }
};

ItemTypes.forEachArmorKind = function(callback) {
    Types.forEachKind(function(kind, kindName) {
        if(ItemTypes.isArmor(kind)) {
            callback(kind, kindName);
        }
    });
};
ItemTypes.forEachWeaponKind = function(callback) {
    Types.forEachKind(function(kind, kindName) {
        if(ItemTypes.isWeapon(kind)) {
            callback(kind, kindName);
        }
    });
};


ItemTypes.forEachArcherArmorKind = function(callback) {
    Types.forEachKind(function(kind, kindName) {
        if(ItemTypes.isArcherArmor(kind)) {
            callback(kind, kindName);
        }
    });
};
ItemTypes.forEachArcherWeaponKind = function(callback) {
    Types.forEachKind(function(kind, kindName) {
        if(ItemTypes.isArcherWeapon(kind)) {
            callback(kind, kindName);
        }
    });
};


ItemTypes.getItemListBy = function (itemType) {
    var ItemsList = [];
    for(var k in ItemData) {
    	var item = ItemData[k];
        if (itemType == 1 && item.type == "object" && item.buy > 0)
        {
            ItemsList.push({
		name: k,
		kind: item.kind,
		buyCount: item.buyCount,
		buyPrice: ItemTypes.getBuyPrice(k)
            });
        }
        else if (itemType == 2 && (item.type == "armor" || item.type == "armorarcher") && item.defense >= 10) {
            ItemsList.push({
		name: k,
		kind: item.kind,
		buyCount: item.buyCount,
		buyPrice: ItemTypes.getBuyPrice(k),
		rank: item.defense
            });
        }
        else if (itemType == 3 && (item.type == "weapon" || item.type == "weaponarcher") && item.attack >= 10) {
            ItemsList.push({
		name: k,
		kind: item.kind,
		buyCount: item.buyCount,
		buyPrice: ItemTypes.getBuyPrice(k),
		rank: item.attack
            });        	
        }
        
    }
    if (ItemsList.length > 0 && ItemsList[0].rank > 0)
	ItemsList.sort(function(a, b) {
	    return a.rank - b.rank;
    });
    return ItemsList;
};

ItemTypes.setupStore = function() 
{
	ItemTypes.Store.Potions = ItemTypes.getItemListBy(1);
	ItemTypes.Store.Armors = ItemTypes.getItemListBy(2);
	ItemTypes.Store.Weapons = ItemTypes.getItemListBy(3);	
};

ItemTypes.Store = {
    isBuy: function(itemName) {
        var item = ItemData[itemName];
        if (!item) return false;
        return (item.buy > 0) ? true : false;        
    },
    isBuyMultiple: function(itemName) {
    	var item = ItemData[itemName];
        if (!item) return false;
    	return (item.buyCount > 0) ? true : false;
    },
    isSell: function(itemName) {
        var item = ItemData[itemName];
        if (!item) return false;
        return (item.buy >= 2) ? true : false;        
    },
    getBuyCount: function(itemName) {
    	var item = ItemData[itemName];
        if (!item) return false;
    	return (item.buyCount > 1) ? item.buyCount : 1;
    },
};


if(!(typeof exports === 'undefined')) {
    module.exports = ItemTypes;
}
