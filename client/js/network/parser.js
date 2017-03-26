define(['./incoming'], function(Incoming) {
   
    var Parser = Class.extend({
        
        init: function(game, client) {
            var self = this;

            self.incoming = new Incoming(game, client);

            self.game = game;
            self.client = client;
            self.renderer = self.game.renderer;
            self.player = self.game.player;
            self.camera = self.game.camera;

            self.client.onConnected(function() {
                log.info('Creating player..');
                self.game.addPlayer();
            });

            self.client.onEntityList(function(list) {
                self.game.parseEntityList(list);
            });

            self.client.onWelcome(function(id, name, x, y, hp, mana, armor, weapon, experience, inventory, inventoryNumber, inventorySize,
                                           inventorySkillKind, inventorySkillLevel, bankSize, bankKind, bankNumber, bankSkillKind,
                                           bankSkillLevel, achievementNumber, achievementFound, achievementProgress, doubleExp, expMultiplier, 
                                           membership, kind, rights, pClass, pendant, ring, boots) {

                log.info('Player: ' + self.player);

                self.player.id = id;
                self.player.name = name;
                self.player.kind = kind;
                self.player.rights = rights;
                self.player.setClass(parseInt(pClass));
                self.player.setGridPosition(x, y);
                self.player.setMaxHitPoints(hp);
                self.player.setMaxMana(mana);
                self.player.setLook(armor);
                self.player.setWeaponName(weapon);
                self.player.setPendant(pendant);
                self.player.setRing(ring);
                self.player.setBoots(boots);
                self.player.experience = experience;
                self.game.inventoryHandler.loadInventory(inventorySize, inventory, inventoryNumber, inventorySkillKind, inventorySkillLevel);
                self.game.bankHandler.loadBank(bankSize, bankKind, bankNumber, bankSkillKind, bankSkillLevel);
                self.game.shopHandler.setMaxInventoryNumber(maxInventoryNumber);
                self.game.achievementHandler.initAchievement(achievementFound, achievementProgress);


                self.camera.setRealCoords();

                self.game.resetZone();
                self.game.initPlayer();
                self.game.updateBars(); //Merge exp bar into the updateBars() function
                self.game.updateExpBar(); //TODO
                self.game.updatePlateauMode();

                self.game.addEntity(self.player);

                self.player.dirtyRect = self.renderer.getEntityBoundingRect(self.player);

                self.client.sendSkillLoad();

                self.game.chatHandler.show();
                self.game.initializeAchievements();
                self.game.loadInAppPurchases();
                self.game.audioManager.updateMusic();

                self.renderer.forceRedraw = true;
                self.renderer.clearScreen(self.renderer.context);
                self.renderer.cleanPathing();
                self.renderer.drawBackground(self.renderer.background, '#12100D');

                self.game.resetCamera();

                self.incoming.loadCallbacks();

                self.game.gamestart_callback();

                if (self.game.hasNeverStarted) {
                    self.game.start();
                    started_callback({
                        success: true
                    });
                }
            });
        }
        
    });
    
    return Parser;
    
});