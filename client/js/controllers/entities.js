/* global log, _, Modules, Packets */

define(['../renderer/grids', '../entity/objects/chest',
        '../entity/character/character', '../entity/character/player/player',
        '../entity/objects/item', './sprites', '../entity/character/mob/mob',
        '../entity/character/npc/npc', '../entity/objects/projectile'],
    function(Grids, Chest, Character, Player, Item, Sprites, Mob, NPC, Projectile) {

    return Class.extend({

        init: function(game) {
            var self = this;

            self.game = game;
            self.renderer = game.renderer;

            self.grids = null;
            self.sprites = null;

            self.entities = {};
            self.decrepit = {};
        },

        load: function() {
            var self = this;

            self.game.app.sendStatus('Loading sprites');

            if (!self.sprites) {
                self.sprites = new Sprites(self.game.renderer);

                self.sprites.onLoadedSprites(function() {
                    self.game.input.loadCursors();
                });
            }

            self.game.app.sendStatus('Loading grids');

            if (!self.grids)
                self.grids = new Grids(self.game.map);
        },

        update: function() {
            var self = this;

            if (self.sprites)
                self.sprites.updateSprites();
        },

        create: function(type, info) {
            var self = this,
                id = info.shift(),
                kind, name, x, y, entity;

            if (type !== 'player' && type !== 'projectile') {
                kind = info.shift();
                name = info.shift();
                x = info.shift();
                y = info.shift();
            }

            if (id === self.game.player.id)
                return;

            switch (type) {

                case 'projectile':
                    var pType = info.shift(),
                        attacker = self.get(info.shift()),
                        target = self.get(info.shift()),
                        damage = info.shift(),
                        pName = info.shift(),
                        special = info.shift();

                    if (!attacker || !target)
                        return;

                    attacker.lookAt(target);

                    var projectile = new Projectile(id, pType, attacker);

                    projectile.setStart(attacker.x, attacker.y);
                    projectile.setTarget(target);

                    projectile.setSprite(self.getSprite(pName));
                    projectile.setAnimation('travel', 60);

                    projectile.angled = true;
                    projectile.type = type;
                    projectile.special = special;

                    projectile.onImpact(function() {

                        if (projectile.special === Modules.Hits.Explosive)
                            projectile.setSprite(self.get('explosion-fireball'));

                        /**
                         * Don't fool yourself, the client only knows the damage as a number,
                         * you cannot change or exploit it in any way client-sided.
                         */

                        if (self.game.player.id === projectile.owner.id || target.id === self.game.player.id)
                            self.game.socket.send(Packets.Projectile, [Packets.ProjectileOpcode.Impact, id, target.id]);

                        self.game.info.create(Modules.Hits.Damage, [damage, target.id === self.game.player.id], target.x, target.y);

                        target.triggerHealthBar();

                        self.unregisterPosition(projectile);
                        delete self.entities[projectile.getId()];

                    });

                    self.addEntity(projectile);

                    attacker.performAction(attacker.orientation, Modules.Actions.Attack);
                    attacker.triggerHealthBar();

                    return;

                case 'npc':

                    var npc = new NPC(id, kind);

                    entity = npc;

                    break;

                case 'item':

                    var count = info.shift(),
                        ability = info.shift(),
                        abilityLevel = info.shift();

                    var item = new Item(id, kind, count, ability, abilityLevel);

                    entity = item;

                    break;

                case 'mob':

                    var mob = new Mob(id, kind),
                        hitPoints = info.shift(),
                        maxHitPoints = info.shift(),
                        attackRange = info.shift(),
                        mLevel = info.shift();

                    mob.setHitPoints(hitPoints);
                    mob.setMaxHitPoints(maxHitPoints);
                    mob.attackRange = attackRange;

                    mob.level = mLevel;

                    entity = mob;

                    break;

                case 'player':

                    var player = new Player();

                    name = info.shift();
                    x = info.shift();
                    y = info.shift();

                    var rights = info.shift(),
                        level = info.shift(),
                        pvp = info.shift(),
                        hitPointsData = info.shift(),
                        pvpKills = info.shift(),
                        pvpDeaths = info.shift(),
                        armourData = info.shift(),
                        weaponData = info.shift(),
                        pendantData = info.shift(),
                        ringData = info.shift(),
                        bootsData = info.shift();

                    player.setId(id);
                    player.setName(name);

                    player.setGridPosition(x, y);
                    player.rights = rights;
                    player.level = level;
                    player.pvp = pvp;

                    player.setHitPoints(hitPointsData[0]);
                    player.setMaxHitPoints(hitPointsData[1]);

                    player.pvpKills = pvpKills;
                    player.pvpDeaths = pvpDeaths;

                    player.setSprite(self.getSprite(armourData[1]));
                    player.idle();

                    player.setEquipment(Modules.Equipment.Armour, armourData);
                    player.setEquipment(Modules.Equipment.Weapon, weaponData);
                    player.setEquipment(Modules.Equipment.Pendant, pendantData);
                    player.setEquipment(Modules.Equipment.Ring, ringData);
                    player.setEquipment(Modules.Equipment.Boots, bootsData);

                    player.type = type;
                    player.loadHandler(self.game);

                    self.addEntity(player);

                    return;
            }

            if (!entity)
                return;

            entity.setGridPosition(x, y);
            entity.setName(name);
            entity.setSprite(self.getSprite(type === 'item' ? 'item-' + kind : kind));

            entity.idle();
            entity.type = type;

            self.addEntity(entity);

            /**
             * We should add callbacks for items as well in
             * the future. Just so we have full control over them
             */

            if (type !== 'item' && entity.handler) {
                entity.handler.setGame(self.game);
                entity.handler.load();
            }

        },

        get: function(id) {
            var self = this;

            if (id in self.entities)
                return self.entities[id];

            return null;
        },

        exists: function(id) {
            return id in this.entities;
        },

        clearPlayers: function(exception) {
            var self = this;

            _.each(self.entities, function(entity) {
                if (entity.id !== exception.id && entity.type === 'player') {
                    self.grids.removeFromRenderingGrid(entity, entity.gridX, entity.gridY);
                    self.grids.removeFromPathingGrid(entity.gridX, entity.gridY);

                    delete self.entities[entity.id];
                }
            });

            self.grids.resetPathingGrid();
        },

        addEntity: function(entity) {
            var self = this;

            if (self.entities[entity.id])
                return;

            self.entities[entity.id] = entity;
            self.registerPosition(entity);

            if (!(entity instanceof Item && entity.dropped) && !self.renderer.isPortableDevice())
                entity.fadeIn(self.game.time);

        },

        removeItem: function(item) {
            var self = this;

            if (!item)
                return;

            self.grids.removeFromItemGrid(item, item.gridX, item.gridY);
            self.grids.removeFromRenderingGrid(item, item.gridX, item.gridY);

            delete self.entities[item.id];
        },

        registerPosition: function(entity) {
            var self = this;

            if (!entity)
                return;

            if (entity.type === 'player' || entity.type === 'mob' || entity.type === 'npc') {

                self.grids.addToEntityGrid(entity, entity.gridX, entity.gridY);

                if (entity.type !== 'player')
                    self.grids.addToPathingGrid(entity.gridX, entity.gridY);
            }

            if (entity.type === 'item')
                self.grids.addToItemGrid(entity, entity.gridX, entity.gridY);

            self.grids.addToRenderingGrid(entity, entity.gridX, entity.gridY);
        },

        registerDuality: function(entity) {
            var self = this;

            if (!entity)
                return;

            self.grids.entityGrid[entity.gridY][entity.gridX][entity.id] = entity;

            self.grids.addToRenderingGrid(entity, entity.gridX, entity.gridY);

            if (entity.nextGridX > -1 && entity.nextGridY > -1) {
                self.grids.entityGrid[entity.nextGridY][entity.nextGridX][entity.id] = entity;

                if (!(entity instanceof Player))
                    self.grids.pathingGrid[entity.nextGridY][entity.nextGridX] = 1;
            }
        },

        unregisterPosition: function(entity) {
            var self = this;

            if (!entity)
                return;

            self.grids.removeEntity(entity);
        },

        getSprite: function(name) {
            return this.sprites.sprites[name];
        },

        getAll: function() {
            return this.entities;
        },

        forEachEntity: function(callback) {
            _.each(this.entities, function(entity) { callback(entity) }) ;
        },

        forEachEntityAround: function(x, y, radius, callback) {
            var self = this;

            for (var i = x - radius, max_i = x + radius; i <= max_i; i++) {
                for (var j = y - radius, max_j = y + radius; j <= max_j; j++) {
                    if (self.map.isOutOfBounds(i, j))
                        continue;

                    _.each(self.grids.renderingGrid[j][i], function(entity) {
                        callback(entity);
                    })
                }
            }
        }

    });

});