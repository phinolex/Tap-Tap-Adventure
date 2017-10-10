/* global Class, log, Packets, Modules, Detect, _ */

define(['./renderer/renderer', './utils/storage',
        './map/map', './network/socket', './entity/character/player/player',
        './renderer/updater', './controllers/entities', './controllers/input',
        './entity/character/player/playerhandler', './utils/pathfinder',
        './controllers/zoning', './controllers/info', './controllers/bubble',
        './controllers/interface', './controllers/audio', './controllers/pointer',
        './utils/modules', './network/packets'],
        function(Renderer, LocalStorage, Map, Socket, Player, Updater,
                 Entities, Input, PlayerHandler, Pathfinder, Zoning, Info, Bubble, Interface, Audio, Pointer) {

    return Class.extend({

        init: function(app) {
            var self = this;

            self.app = app;

            self.id = -1;

            self.socket = null;
            self.messages = null;
            self.renderer = null;
            self.updater = null;
            self.storage = null;
            self.entities = null;
            self.input = null;
            self.map = null;
            self.playerHandler = null;
            self.pathfinder = null;
            self.zoning = null;
            self.info = null;
            self.interface = null;
            self.audio = null;

            self.player = null;

            self.stopped = false;
            self.started = false;
            self.ready = false;
            self.loaded = false;

            self.time = new Date();

            self.pvp = false;
            self.population = -1;

            self.lastTime = new Date().getTime();

            self.loadRenderer();
            self.loadControllers();
        },

        start: function() {
            var self = this;

            if (self.started)
                return;

            self.app.fadeMenu();
            self.tick();

            self.started = true;
        },

        stop: function() {
            var self = this;

            self.stopped = false;
            self.started = false;
            self.ready = false;
        },

        tick: function() {
            var self = this;

            if (self.ready) {

                self.time = new Date().getTime();

                self.renderer.render();
                self.updater.update();

                if (!self.stopped)
                    requestAnimFrame(self.tick.bind(self));
            }
        },

        unload: function() {
            var self = this;

            self.socket = null;
            self.messages = null;
            self.renderer = null;
            self.updater = null;
            self.storage = null;
            self.entities = null;
            self.input = null;
            self.map = null;
            self.playerHandler = null;
            self.pathfinder = null;
            self.zoning = null;
            self.info = null;
            self.interface = null;

            self.audio.stop();
            self.audio = null;
        },

        loadRenderer: function() {
            var self = this,
                background = document.getElementById('background'),
                foreground = document.getElementById('foreground'),
                textCanvas = document.getElementById('textCanvas'),
                entities = document.getElementById('entities'),
                cursor = document.getElementById('cursor');

            self.app.sendStatus('Initializing render engine');

            self.setRenderer(new Renderer(background, entities, foreground, textCanvas, cursor, self));
        },

        loadControllers: function() {
            var self = this,
                hasWorker = self.app.hasWorker();

            self.app.sendStatus(hasWorker ? 'Loading maps - asynchronous' : null);

            if (hasWorker)
                self.loadMap();

            self.app.sendStatus('Loading local storage');

            self.setStorage(new LocalStorage());

            self.app.sendStatus('Initializing network socket');

            self.setSocket(new Socket(self));
            self.setMessages(self.socket.messages);
            self.setInput(new Input(self));

            self.app.sendStatus('Loading controllers');

            self.setEntityController(new Entities(self));

            self.setInfo(new Info(self));

            self.setBubble(new Bubble(self));

            self.setPointer(new Pointer(self));

            self.setAudio(new Audio(self));

            self.setInterface(new Interface(self));

            self.implementStorage();

            if (!hasWorker) {
                self.app.sendStatus(null);
                self.loaded = true;
            }
        },

        loadMap: function() {
            var self = this;

            self.map = new Map(self);

            self.map.onReady(function() {

                self.app.sendStatus('Loading the pathfinder');

                self.setPathfinder(new Pathfinder(self.map.width, self.map.height));

                self.renderer.setMap(self.map);
                self.renderer.loadCamera();

                self.app.sendStatus('Loading updater');

                self.setUpdater(new Updater(self));

                self.entities.load();

                self.renderer.setEntities(self.entities);

                self.app.sendStatus(null);

                self.loaded = true;
            });
        },

        connect: function() {
            var self = this;

            self.app.cleanErrors();

            setTimeout(function() {
                self.socket.connect();
            }, 1000);

            self.messages.onHandshake(function(data) {

                self.id = data.shift();
                self.development = data.shift();

                self.ready = true;

                if (!self.player)
                    self.createPlayer();

                if (!self.map)
                    self.loadMap();

                self.app.updateLoader('Logging in');

                if (self.app.isRegistering()) {
                    var registerInfo = self.app.registerFields,
                        username = registerInfo[0].val(),
                        password = registerInfo[1].val(),
                        email = registerInfo[3].val();

                    self.socket.send(Packets.Intro, [Packets.IntroOpcode.Register, username, password, email]);
                } else {
                    var loginInfo = self.app.loginFields,
                        name = loginInfo[0].val(),
                        pass = loginInfo[1].val();

                    self.socket.send(Packets.Intro, [Packets.IntroOpcode.Login, name, pass]);

                    if (self.hasRemember()) {
                        self.storage.data.player.username = name;
                        self.storage.data.player.password = pass;
                    } else {
                        self.storage.data.player.username = '';
                        self.storage.data.player.password = '';
                    }

                    self.storage.save();
                }
            });

            self.messages.onWelcome(function(data) {

                self.player.load(data);

                self.input.setPosition(self.player.getX(), self.player.getY());

                self.start();
                self.postLoad();
            });

            self.messages.onEquipment(function(opcode, info) {

                switch (opcode) {
                    case Packets.EquipmentOpcode.Batch:

                        for (var i = 0; i < info.length; i++)
                            self.player.setEquipment(i, info[i]);

                        self.interface.loadProfile();

                        break;

                    case Packets.EquipmentOpcode.Equip:
                        var equipmentType = info.shift(),
                            name = info.shift(),
                            string = info.shift(),
                            count = info.shift(),
                            ability = info.shift(),
                            abilityLevel = info.shift();

                        self.player.setEquipment(equipmentType, [name, string, count, ability, abilityLevel]);

                        self.interface.profile.update();

                        break;

                    case Packets.EquipmentOpcode.Unequip:

                        var type = info.shift();

                        self.player.unequip(type);

                        if (type === 'armour')
                            self.player.setSprite(self.getSprite(self.player.getSpriteName()));


                        self.interface.profile.update();

                        break;
                }

            });

            self.messages.onSpawn(function(data) {
                var mobData = data.shift(),
                    type = mobData.shift();

                self.entities.create(type, mobData);
            });

            self.messages.onEntityList(function(data) {
                var ids = _.pluck(self.entities.getAll(), 'id'),
                    known = _.intersection(ids, data),
                    newIds = _.difference(data, known);

                self.entities.decrepit = _.reject(self.entities.getAll(), function(entity) {
                    return _.include(known, entity.id) || entity.id === self.player.id;
                });

                self.entities.clean();

                self.socket.send(Packets.Who, newIds);
            });

            self.messages.onSync(function(data) {
                var entity = self.entities.get(data.id);

                if (!entity || entity.type !== 'player')
                    return;

                if (data.hitPoints) {
                    entity.hitPoints = data.hitPoints;
                    entity.maxHitPoints = data.maxHitPoints;
                }

                if (data.mana) {
                    entity.mana = data.mana;
                    entity.maxMana = data.maxMana;
                }

                if (data.experience) {
                    entity.experience = data.experience;
                    entity.level = data.level;
                }

                if (data.armour)
                    entity.setSprite(self.getSprite(data.armour));

                if (data.weapon)
                    entity.setEquipment(Modules.Equipment.Weapon, data.weapon);

                self.interface.profile.update();
            });

            self.messages.onMovement(function(data) {
                var opcode = data.shift(),
                    info = data.shift();

                switch(opcode) {
                    case Packets.MovementOpcode.Move:
                        var id = info.shift(),
                            x = info.shift(),
                            y = info.shift(),
                            forced = info.shift(),
                            teleport = info.shift(),
                            entity = self.entities.get(id);

                        if (!entity)
                            return;

                        if (forced)
                            entity.stop(true);

                        self.moveCharacter(entity, x, y);

                        break;

                    case Packets.MovementOpcode.Follow:
                        var follower = self.entities.get(info.shift()),
                            followee = self.entities.get(info.shift());

                        if (!followee || !follower)
                            return;

                        follower.follow(followee);

                        break;
                }

            });

            self.messages.onTeleport(function(data) {
                var id = data.shift(),
                    x = data.shift(),
                    y = data.shift(),
                    isPlayer = id === self.player.id,
                    entity = self.entities.get(id);

                if (!entity)
                    return;

                entity.stop(true);
                entity.frozen = true;

                self.entities.unregisterPosition(entity);

                entity.setGridPosition(x, y);

                if (isPlayer) {

                    self.entities.clearPlayers(self.player);
                    self.player.clearHealthBar();
                    self.renderer.camera.centreOn(entity);
                    self.renderer.updateAnimatedTiles();

                } else {
                    delete self.entities.entities[entity.id];
                    return;
                }

                self.socket.send(Packets.Request, [self.player.id]);

                self.entities.registerPosition(entity);

                entity.frozen = false;

            });

            self.messages.onDespawn(function(id) {
                var entity = self.entities.get(id);

                if (!entity)
                    return;

                entity.dead = true;

                entity.stop();

                if (entity.type === 'item') {
                    self.entities.removeItem(entity);
                    return;
                }

                if (entity.id !== self.player.id && self.player.getDistance(entity) < 5)
                    self.audio.play(Modules.AudioTypes.SFX, 'kill' + Math.floor(Math.random() * 2 + 1));

                entity.hitPoints = 0;

                entity.setSprite(self.getSprite('death'));

                if (self.player.hasTarget() && self.player.target.id === entity.id)
                    self.player.removeTarget();

                entity.animate('death', 120, 1, function() {
                    self.entities.unregisterPosition(entity);
                    delete self.entities.entities[entity.id];
                });
            });

            self.messages.onCombat(function(data) {
                var opcode = data.shift(),
                    attacker = self.entities.get(data.shift()),
                    target = self.entities.get(data.shift());

                if (!target || !attacker)
                    return;

                switch (opcode) {
                    case Packets.CombatOpcode.Initiate:
                        attacker.setTarget(target);

                        target.addAttacker(attacker);
                        target.setTarget(attacker);

                        if (target.id === self.player.id || attacker.id === self.player.id)
                            self.socket.send(Packets.Combat, [Packets.CombatOpcode.Initiate, attacker.id, target.id]);

                        break;

                    case Packets.CombatOpcode.Hit:

                        var hit = data.shift(),
                            isPlayer = target.id === self.player.id;

                        attacker.lookAt(target);
                        attacker.performAction(attacker.orientation, Modules.Actions.Attack);

                        switch (hit.type) {
                            case Modules.Hits.Damage:
                            case Modules.Hits.Stun:

                                if (attacker.id === self.player.id && hit.damage > 0)
                                    self.audio.play(Modules.AudioTypes.SFX, 'hit' + Math.floor(Math.random() * 2 + 1));

                                break;

                            case Modules.Hits.Critical:

                                break;
                        }

                        self.info.create(hit.type, [hit.damage, isPlayer], target.x, target.y);

                        attacker.triggerHealthBar();
                        target.triggerHealthBar();

                        if (isPlayer && hit.damage > 0)
                            self.audio.play(Modules.AudioTypes.SFX, 'hurt');

                        break;

                    case Packets.CombatOpcode.Finish:

                        if (target) {
                            target.removeTarget();
                            target.forget();
                        }

                        if (attacker)
                            attacker.removeTarget();

                        break;
                }
            });

            self.messages.onAnimation(function(id, info) {
                var entity = self.entities.get(id),
                    animation = info.shift(),
                    speed = info.shift(),
                    count = info.shift();

                if (!entity)
                    return;

                entity.animate(animation, speed, count);
            });

            self.messages.onProjectile(function(type, info) {
                switch (type) {
                    case Packets.ProjectileOpcode.Create:

                        self.entities.create('projectile', info);

                        break;
                }
            });

            self.messages.onPopulation(function(population) {
                self.population = population;
            });

            self.messages.onPoints(function(data) {
                var id = data.shift(),
                    hitPoints = data.shift(),
                    mana = data.shift(),
                    entity = self.entities.get(id);

                if (!entity)
                    return;

                if (hitPoints) {
                    entity.setHitPoints(hitPoints);

                    if (self.player.hasTarget() && self.player.target.id === entity.id && self.input.overlay.updateCallback)
                        self.input.overlay.updateCallback(hitPoints);
                }

                if (mana)
                    entity.setMana(mana);
            });

            self.messages.onNetwork(function() {
                self.socket.send(Packets.Network, [Packets.NetworkOpcode.Pong]);
            });

            self.messages.onChat(function(info) {
                var id = info.shift(),
                    text = info.shift(),
                    duration = info.shift(),
                    withBubble = info.shift(),
                    entity = self.entities.get(id);

                //TODO - Add colour control from the server side.

                if (!entity)
                    return;

                if (!duration)
                    duration = 5000;

                if (withBubble) {
                    self.bubble.create(id, text, self.time, duration);
                    self.bubble.setTo(entity);

                    self.audio.play(Modules.AudioTypes.SFX, 'npctalk');
                }

                log.info(entity);

                log.info(entity.type);

                if (entity.type === 'player')
                    self.input.chatHandler.add(entity.username, text);
            });

            self.messages.onCommand(function(info) {

                /**
                 * This is for random miscellaneous commands that require
                 * a specific action done by the client as opposed to
                 * packet-oriented ones.
                 */
            });

            self.messages.onInventory(function(opcode, info) {

                switch (opcode) {
                    case Packets.InventoryOpcode.Batch:

                        var inventorySize = info.shift(),
                            data = info.shift();

                        self.interface.loadInventory(inventorySize, data);

                        break;

                    case Packets.InventoryOpcode.Add:

                        if (!self.interface.inventory)
                            return;

                        self.interface.inventory.add(info);

                        if (!self.interface.bank)
                            return;

                        self.interface.bank.addInventory(info);

                        break;

                    case Packets.InventoryOpcode.Remove:

                        if (!self.interface.inventory)
                            return;

                        self.interface.inventory.remove(info);

                        if (!self.interface.bank)
                            return;

                        self.interface.bank.removeInventory(info);

                        break;
                }

            });

            self.messages.onBank(function(opcode, info) {
                switch(opcode) {

                    case Packets.BankOpcode.Batch:

                        var bankSize = info.shift(),
                            data = info.shift();

                        self.interface.loadBank(bankSize, data);

                        break;


                    case Packets.BankOpcode.Add:

                        if (!self.interface.bank)
                            return;

                        self.interface.bank.add(info);

                        break;

                    case Packets.BankOpcode.Remove:

                        self.interface.bank.remove(info);

                        break;
                }
            });

            self.messages.onAbility(function(opcode, info) {

            });

            self.messages.onQuest(function(opcode, info) {

                switch (opcode) {
                    case Packets.QuestOpcode.Batch:

                        self.interface.getQuestPage().load(info.quests, info.achievements);

                        break;

                    case Packets.QuestOpcode.Progress:

                        self.interface.getQuestPage().progress(info);

                        break;

                    case Packets.QuestOpcode.Finish:

                        self.interface.getQuestPage().finish(info);

                        break;
                }

            });

            self.messages.onNotification(function(opcode, message) {

                switch (opcode) {
                    case Packets.NotificationOpcode.Ok:

                        self.interface.displayNotify(message);

                        break;

                    case Packets.NotificationOpcode.YesNo:

                        self.interface.displayConfirm(message);

                        break;

                    case Packets.NotificationOpcode.Text:

                        self.input.chatHandler.add('WORLD', message);

                        break;
                }

            });

            self.messages.onBlink(function(instance) {
                var item = self.entities.get(instance);

                if (!item)
                    return;

                item.blink(150);
            });

            self.messages.onHeal(function(info) {
                var entity = self.entities.get(info.id);

                if (!entity)
                    return;

                switch (info.type) {
                    case 'health':

                        self.info.create(Modules.Hits.Heal, [info.amount], entity.x, entity.y);

                        break;

                    case 'mana':

                        self.info.create(Modules.Hits.Mana, [info.amount], entity.x, entity.y);

                        break;
                }

                entity.triggerHealthBar();
            });

            self.messages.onExperience(function(info) {
                var entity = self.entities.get(info.id);

                if (!entity || entity.type !== 'player')
                    return;

                entity.experience = info.experience;

                if (entity.level !== info.level) {
                    entity.level = info.level;
                    self.info.create(Modules.Hits.LevelUp, null, entity.x, entity.y);
                } else if (entity.id === self.player.id)
                    self.info.create(Modules.Hits.Experience, [info.amount], entity.x, entity.y);

            });

            self.messages.onDeath(function(id) {
                var entity = self.entities.get(id);

                if (!entity || id !== self.player.id)
                    return;

                self.audio.play(Modules.AudioTypes.SFX, 'death');

                self.player.dead = true;
                self.player.removeTarget();
                self.player.orientation = Modules.Orientation.Down;

                self.app.body.addClass('death');
            });

            self.messages.onAudio(function(song) {
                self.audio.songName = song;

                if (Detect.isSafari() && !self.audio.song)
                    return;

                self.audio.update();
            });

            self.messages.onNPC(function(opcode, info) {

                switch(opcode) {

                    case Packets.NPCOpcode.Talk:

                        var entity = self.entities.get(info.id),
                            messages = info.text,
                            isNPC = !info.nonNPC,
                            message;

                        if (!entity)
                            return;

                        if (!messages) {
                            entity.talkIndex = 0;
                            return;
                        }

                        message = isNPC ? entity.talk(messages) : messages;

                        if (isNPC) {
                            var bubble = self.bubble.create(info.id, message, self.time, 5000);

                            self.bubble.setTo(entity);

                            if (self.renderer.mobile && self.renderer.autoCentre)
                                self.renderer.camera.centreOn(self.player);

                            if (bubble) {
                                bubble.setClickable();

                                bubble.element.click(function() {
                                    var entity = self.entities.get(bubble.id);

                                    if (entity)
                                        self.input.click({x: entity.gridX, y: entity.gridY});
                                });
                            }

                        } else {
                            self.bubble.create(info.id, message, self.time, 5000);
                            self.bubble.setTo(entity);
                        }

                        var sound = 'npc';

                        if (!message && isNPC) {
                            sound = 'npc-end';
                            self.bubble.destroy(info.id);
                        }

                        self.audio.play(Modules.AudioTypes.SFX, sound);

                        break;

                    case Packets.NPCOpcode.Bank:
                        self.interface.bank.display();
                        break;

                    case Packets.NPCOpcode.Enchant:
                        self.interface.enchant.display();
                        break;
                }

            });

            self.messages.onRespawn(function(id, x, y) {
                if (id !== self.player.id) {
                    log.error('Player id mismatch.');
                    return;
                }

                self.player.setGridPosition(x, y);

                self.entities.addEntity(self.player);

                self.renderer.camera.centreOn(self.player);

                self.player.currentAnimation = null;

                self.player.setSprite(self.getSprite(self.player.getSpriteName()));

                self.player.idle();

                self.player.dead = false;
            });

            self.messages.onEnchant(function(opcode, info) {
                var type = info.type,
                    index = info.index;

                switch (opcode) {
                    case Packets.EnchantOpcode.Select:

                        self.interface.enchant.add(type, index);

                        break;

                    case Packets.EnchantOpcode.Remove:

                        self.interface.enchant.moveBack(type, index);

                        break;

                }

            });

            self.messages.onGuild(function(opcode, info) {

                switch (opcode) {

                    case Packets.GuildOpcode.Create:

                        break;

                    case Packets.GuildOpcode.Join:

                        break;
                }

            });

            self.messages.onPointer(function(opcode, info) {

                switch (opcode) {
                    case Packets.PointerOpcode.NPC:
                        var entity = self.entities.get(info.id);

                        if (!entity)
                            return;

                        self.pointer.create(entity.id, Modules.Pointers.Entity);
                        self.pointer.setToEntity(entity);

                        break;

                    case Packets.PointerOpcode.Location:

                        self.pointer.create(info.id, Modules.Pointers.Position);
                        self.pointer.setToPosition(info.id, info.x * 16, info.y * 16);

                        break;

                    case Packets.PointerOpcode.Relative:

                        self.pointer.create(info.id, Modules.Pointers.Relative);
                        self.pointer.setRelative(info.id, info.x, info.y);

                        break;

                    case Packets.PointerOpcode.Remove:

                        self.pointer.clean();

                        break;
                }

            });

            self.messages.onPVP(function(id, pvp) {

                if (self.player.id === id)
                    self.pvp = pvp;
                else {
                    var entity = self.entities.get(id);

                    if (entity)
                        entity.pvp = pvp;
                }

            });

        },

        postLoad: function() {
            var self = this;

            /**
             * Call this after the player has been welcomed
             * by the server and the client received the connection.
             */

            self.renderer.loadStaticSprites();

            self.getCamera().setPlayer(self.player);

            self.renderer.renderedFrame[0] = -1;

            self.entities.addEntity(self.player);

            var defaultSprite = self.getSprite(self.player.getSpriteName());

            self.player.setSprite(defaultSprite);
            self.player.idle();

            self.socket.send(Packets.Ready, [true]);

            self.playerHandler = new PlayerHandler(self, self.player);

            self.renderer.updateAnimatedTiles();

            self.zoning = new Zoning(self);

            self.updater.setSprites(self.entities.sprites);

            if (self.storage.data.new) {
                self.storage.data.new = false;
                self.storage.save();
            }
        },

        implementStorage: function() {
            var self = this,
                loginName = $('#loginNameInput'),
                loginPassword = $('#loginPasswordInput');

            loginName.prop('readonly', false);
            loginPassword.prop('readonly', false);

            if (!self.hasRemember())
                return;

            if (self.getStorageUsername() !== '')
                loginName.val(self.getStorageUsername());

            if (self.getStoragePassword() !== '')
                loginPassword.val(self.getStoragePassword());

            $('#rememberMe').addClass('active');
        },

        setPlayerMovement: function(direction) {
            this.player.direction = direction;
        },

        movePlayer: function(x, y) {
            this.moveCharacter(this.player, x, y);
        },

        moveCharacter: function(character, x, y) {
            if (!character)
                return;

            character.go(x, y);
        },

        findPath: function(character, x, y, ignores) {
            var self = this,
                grid = self.entities.grids.pathingGrid,
                path = [];

            if (self.map.isColliding(x, y) || !self.pathfinder || !character)
                return path;

            if (ignores)
                _.each(ignores, function(entity) { self.pathfinder.ignoreEntity(entity); });

            path = self.pathfinder.find(grid, character, x, y, false);

            if (ignores)
                self.pathfinder.clearIgnores();
            
            return path;
        },

        onInput: function(inputType, data) {
            this.input.handle(inputType, data);
        },

        handleDisconnection: function(noError) {
            var self = this;

            /**
             * This function is responsible for handling sudden
             * disconnects of a player whilst in the game, not
             * menu-based errors.
             */

            if (!self.started)
                return;

            self.stop();
            self.renderer.stop();

            self.unload();

            self.app.showMenu();

            if (noError) {
                self.app.sendError(null, 'You have been disconnected from the server');
                self.app.statusMessage = null;
            }

            self.loadRenderer();
            self.loadControllers();

            self.app.toggleLogin(false);
            self.app.updateLoader('');
        },

        respawn: function() {
            var self = this;

            self.audio.play(Modules.AudioTypes.SFX, 'revive');
            self.app.body.removeClass('death');

            self.socket.send(Packets.Respawn, [self.player.id]);
        },

        tradeWith: function(player) {
            var self = this;

            if (!player || player.id === self.player.id)
                return;

            self.socket.send(Packets.Trade, [Packets.TradeOpcode.Request, player.id]);
        },

        resize: function() {
            var self = this;

            self.renderer.resize();

            if (self.pointer)
                self.pointer.resize();
        },

        createPlayer: function() {
            this.player = new Player();
        },

        getScaleFactor: function() {
            return this.app.getScaleFactor();
        },

        getStorage: function() {
            return this.storage;
        },

        getCamera: function() {
            return this.renderer.camera;
        },

        getSprite: function(spriteName) {
            return this.entities.getSprite(spriteName);
        },

        getEntityAt: function(x, y, ignoreSelf) {
            var self = this,
                entities = self.entities.grids.renderingGrid[y][x];

            if (_.size(entities) > 0)
                return entities[_.keys(entities)[ignoreSelf ? 1 : 0]];

            var items = self.entities.grids.itemGrid[y][x];

            if (_.size(items) > 0) {
                _.each(items, function(item) {
                    if (item.stackable)
                        return item;
                });

                return items[_.keys(items)[0]];
            }
        },

        getStorageUsername: function() {
            return this.storage.data.player.username;
        },

        getStoragePassword: function() {
            return this.storage.data.player.password;
        },

        hasRemember: function() {
            return this.storage.data.player.rememberMe;
        },

        setRenderer: function(renderer) {
            if (!this.renderer)
                this.renderer = renderer;
        },

        setStorage: function(storage) {
            if (!this.storage)
                this.storage = storage;
        },

        setSocket: function(socket) {
            if (!this.socket)
                this.socket = socket;
        },

        setMessages: function(messages) {
            if (!this.messages)
                this.messages = messages;
        },

        setUpdater: function(updater) {
            if (!this.updater)
                this.updater = updater;
        },

        setEntityController: function(entities) {
            if (!this.entities)
                this.entities = entities;
        },

        setInput: function(input) {
            var self = this;

            if (!self.input) {
                self.input = input;
                self.renderer.setInput(self.input);
            }
        },

        setPathfinder: function(pathfinder) {
            if (!this.pathfinder)
                this.pathfinder = pathfinder;
        },

        setInfo: function(info) {
            if (!this.info)
                this.info = info;
        },

        setBubble: function(bubble) {
            if (!this.bubble)
                this.bubble = bubble;
        },

        setPointer: function(pointer) {
            if (!this.pointer)
                this.pointer = pointer;
        },

        setInterface: function(intrface) {
            if (!this.interface)
                this.interface = intrface;
        },

        setAudio: function(audio) {
            if (!this.audio)
                this.audio = audio;
        }

    });

});