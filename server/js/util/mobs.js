var Mobs = {};

Mobs.Properties = {};
Mobs.Ids = {};
Mobs.Plugins = {};

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

Mobs.idHasCombatPlugin = function(id) {
    if(id in Mobs.Ids)
        if (Mobs.Ids[id].combatPlugin in Mobs.Plugins)
            return true;
    return false;
};

Mobs.combatPluginNew = function(id) {
    if (id in Mobs.Ids)
        if (Mobs.Ids[id].combatPlugin in Mobs.Plugins)
            return Mobs.Plugins[Mobs.Ids[id].combatPlugin];
};


module.exports = Mobs;