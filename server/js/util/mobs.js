var Mobs = {};

Mobs.Properties = {};
Mobs.Ids = {};

Mobs.idToString = function(id) {

    if (id in Mobs.Ids)
        return Mobs.Ids[id].key;

    return null;
};

Mobs.idToName = function(id) {

    if (id in Mobs.Ids)
        return Mobs.Ids[id].name;

    return null;
};

Mobs.getXp = function(id) {

    if (id in Mobs.Ids)
        return Mobs.Ids[id].xp;

    return -1;
};

Mobs.exists = function(id) {

    return id in Mobs.Ids;

};

module.exports = Mobs;