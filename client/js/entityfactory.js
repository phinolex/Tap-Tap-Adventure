/* global Types, log, _ */
define(['text!../shared/data/items.json',
        'text!../shared/data/mobs.json',
        'text!../shared/data/npcs.json',
        'items', 'mobs','mobdata', 'npcs', 'pet', 'player', 'chest', 'gather', 'gatherdata'],
    function(ItemsJSON, MobsJSON, NPCsJSON, Items, Mobs, MobData, NPCs, Pet, Player, Chest, Gather, GatherData) {

        var EntityFactory = {};

        EntityFactory.createEntity = function(kind, id, name, skillKind, skillLevel) {
            if(!kind) {
                log.info("ERROR - kind is undefined: " + kind + " " + id + " " + name, true);
                return;
            }
            // If Pets
            var regExp = /^9[0-9].*$/;
            if (regExp.test(id) && MobData.Kinds[kind])
            {
                log.info("PET CREATED");
                return new Pet(id, kind, name);
            }

            // If Gather
            var regExp = /^8[0-9].*$/;
            if (regExp.test(id) && GatherData.Kinds[kind])
            {
                //log.info("GATHER CREATED");
                return new Gather(id, kind);
            }


            if(!_.isFunction(EntityFactory.builders[kind])) {
                throw Error(kind + " is not a valid Entity type");
            }

            return EntityFactory.builders[kind](id, name, skillKind, skillLevel);
        };

        EntityFactory.builders = [];

        //===== Items ======
        var itemParse = JSON.parse(ItemsJSON);
        //log.info(JSON.stringify(itemParse));
        $.each( itemParse, function( itemKey, itemValue ) {
            if (itemValue.type == "weapon" ||
                itemValue.type == "weaponarcher" || itemValue.type == "pendant" || itemValue.type == "ring")
            {
                EntityFactory.builders[itemValue.kind] = function(id, name, skillKind, skillLevel) {

                    return new Items[itemKey](id, skillKind, skillLevel);
                };
            }
            else if (itemValue.type == "armor" ||
                itemValue.type == "armorarcher" ||
                itemValue.type == "object" ||
                itemValue.type == "craft")
            {
                EntityFactory.builders[itemValue.kind] = function(id) {
                    return new Items[itemKey](id);
                };
            }
            else if (itemValue.type == "chest")
            {
                EntityFactory.builders[37] = function(id) {
                    return new Chest(id);
                };
            }
        });

        //===== Mobs ======
        var mobParse = JSON.parse(MobsJSON);
        //log.info(JSON.stringify(mobParse));
        $.each( mobParse, function( mobKey, mobValue ) {
            EntityFactory.builders[mobValue.kind] = function(id) {
                return new Mobs[mobKey.toLowerCase()](id);
            };
        });

        //===== NPCs ======
        var npcParse = JSON.parse(NPCsJSON);
        //log.info(JSON.stringify(npcParse));
        $.each( npcParse, function( itemKey, itemValue ) {
            EntityFactory.builders[itemValue.npcId] = function(id) {
                return new NPCs[itemKey](id);
            };
        });

        EntityFactory.builders[1] = function(id, name, game) { // Kind Warrior
            return new Player(id, name, game);
        };

        //EntityFactory.builders[500] = function(id, kind, name) { // Kind Pet
        //    return new Pet(id, kind, name);
        //};

        return EntityFactory;
    });
