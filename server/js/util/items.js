var Items = {};

Items.Data = {};
Items.Ids = {};

Items.getData = function(name) {
    if (name in Items.Data)
        return Items.Data[name];

    return 'null';
};

Items.idToString = function(id) {
    if (id in Items.Ids)
        return Items.Ids[id].key;

    return 'null';
};

Items.idToName = function(id) {
    if (id in Items.Ids)
        return Items.Ids[id].name;

    return 'null';
};

Items.stringToId = function(name) {

    if (name in Items.Data)
        return Items.Data[name].id;
    else
        log.error('Item: ' + name + ' not found in the database.');

    return 'null';
};

Items.getWeaponLevel = function(weaponName) {
    if (Items.isWeapon(weaponName))
        return Items.Data[weaponName].attack;

    return -1;
};

Items.getArmourLevel = function(armourName) {
    if (Items.isArmour(armourName))
        return Items.Data[armourName].defense;

    return -1;
};

Items.isArcherWeapon = function(string) {
    if (string in Items.Data)
        return Items.Data[string].type === 'weaponarcher';

    return false;
};

Items.isWeapon = function(string) {
    if (string in Items.Data)
        return Items.Data[string].type === 'weapon' || Items.Data[string].type === 'weaponarcher';

    return false;
};

Items.isArmour = function(string) {
    if (string in Items.Data)
        return Items.Data[string].type === 'armor' || Items.Data[string].type === 'armorarcher';

    return false;
};

Items.isPendant = function(string) {
    if (string in Items.Data)
        return Items.Data[string].type === 'pendant';

    return false;
};

Items.isRing = function(string) {
    if (string in Items.Data)
        return Items.Data[string].type === 'ring';

    return false;
};

Items.isBoots = function(string) {
    if (string in Items.Data)
        return Items.Data[string].type === 'boots';

    return false;
};

Items.getType = function(id) {
    if (id in Items.Ids)
        return Items.Ids[id].type;

    return null;
};

Items.isStackable = function(id) {
    if (id in Items.Ids)
        return Items.Ids[id].stackable;

    return false;
};

Items.isEdible = function(id) {
    if (id in Items.Ids)
        return Items.Ids[id].edible;

    return false;
};

Items.maxStackSize = function(id) {
    if (id in Items.Ids)
        return Items.Ids[id].maxStackSize;

    return false;
};


Items.isShard = function(id) {
    return id === 253 || id === 254 || id === 255 || id === 256 || id === 257;
};

Items.isEnchantable = function(id) {
    return Items.getType(id) !== 'object' && Items.getType(id) !== 'craft';
};

Items.getShardTier = function(id) {
    if (id === 253)
        return 1;
    else if (id === 254)
        return 2;
    else if (id === 255)
        return 3;
    else if (id === 256)
        return 4;
    else if (id === 257)
        return 5;
};

Items.isEquippable = function(string) {
    return Items.isArmour(string) || Items.isWeapon(string) || Items.isPendant(string) || Items.isRing(string) || Items.isBoots(string);
};

Items.healsHealth = function(id) {
    if (id in Items.Ids)
        return Items.Ids[id].healsHealth > 0;
    
    return false;
};
   

Items.healsMana = function(id) {
    if (id in Items.Ids)
        return Items.Ids[id].healsMana > 0;
};

Items.getHealingFactor = function(id) {
    if (id in Items.Ids)
            return Items.Ids[id].healsHealth;

    return 0;
};

Items.getManaFactor = function(id) {
    if (id in Items.Ids)
            return Items.Ids[id].healsMana;
    return 0;
};

module.exports = Items;