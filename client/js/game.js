
/* global Types, log, _, self, Class, CharacterDialog */

define(['infomanager', 'bubble', 'renderer', 'map', 'animation', 'sprite',
        'tile', 'gameclient', 'audio', 'updater', 'transition',
        'pathfinder', 'entity', 'item', 'items', 'mob', 'npc', 'npcdata', 'player', 'character', 'chest', 'mount',
        'pet', 'mobs', 'mobdata', 'gather', 'exceptions', 'config', 'chathandler', 'warpmanager', 'textwindowhandler',
        'menu', 'boardhandler', 'kkhandler', 'shophandler', 'playerpopupmenu', 'classpopupmenu', 'achievemethandler',
        'rankinghandler', 'inventoryhandler', 'bankhandler', 'partyhandler','bools', 'iteminfodialog',
        'skillhandler', 'statehandler', 'storedialog', 'auctiondialog', 'enchantdialog', 'bankdialog', 'craftdialog', 'guild',
        'gamedata', 'button2', 'util',
        '../shared/js/gametypes', '../shared/js/itemtypes'],
    function(InfoManager, BubbleManager, Renderer, Map, Animation, Sprite, AnimatedTile,
             GameClient, AudioManager, Updater, Transition, Pathfinder,
             Entity, Item, Items, Mob, Npc, NpcData, Player, Character, Chest, Mount, Pet, Mobs, MobData, Gather, Exceptions, config,
             ChatHandler, WarpManager, TextWindowHandler, Menu, BoardHandler, KkHandler,
             ShopHandler, PlayerPopupMenu, ClassPopupMenu, AchievementHandler, RankingHandler,
             InventoryHandler, BankHandler, PartyHandler, Bools, ItemInfoDialog, SkillHandler, StateHandler,
             StoreDialog, AuctionDialog, EnchantDialog, BankDialog, CraftDialog, Guild, GameData, Button2, Util) {
        var Game = Class.extend({
            init: function(app) {
                $('head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', 'css/game.css') );

                this.app = app;
                this.app.config = config;
                this.ready = false;
                this.started = false;
                this.hasNeverStarted = true;
                this.gameButtons = [];
                this.renderer = null;
                this.camera = null;
                this.updater = null;
                this.pathfinder = null;
                this.chatinput = null;
                this.bubbleManager = null;
                this.audioManager = null;

                this.renderbackground = false;


                // Game state
                this.entities = {};
                this.deathpositions = {};
                this.entityGrid = null;
                this.pathingGrid = null;
                this.renderingGrid = null;
                this.itemGrid = null;
                this.currentCursor = null;
                this.mouse = { x: 0, y: 0 };
                this.zoningQueue = [];
                this.previousClickPosition = {};

                this.notifyPVPMessageSent = false;
                this.cursorVisible = true;
                this.selectedX = 0;
                this.selectedY = 0;
                this.selectedCellVisible = false;
                this.targetColor = "rgba(255, 255, 255, 0.5)";
                this.targetCellVisible = true;
                this.hoveringTarget = false;
                this.hoveringPlayer = false;
                this.hoveringMob = false;
                this.hoveringItem = false;
                this.hoveringCollidingTile = false;
                this.stepCount = 0;

                // Global chats
                this.chats = 0;
                this.maxChats = 3;
                this.globalChatColor = '#A6FFF9';

                // Item Info
                this.itemInfoOn = true;

                this.menu = new Menu();
                this.infoManager = new InfoManager(this);
                this.achievementHandler = new AchievementHandler(this);
                this.kkhandler = new KkHandler();
                this.chathandler = new ChatHandler(this, this.kkhandler);
                this.shopHandler = new ShopHandler(this);
                this.boardhandler = new BoardHandler(this);
                this.playerPopupMenu = new PlayerPopupMenu(this);
                this.partyHandler = new PartyHandler(this);
                this.rankingHandler = new RankingHandler(this);
                this.statehandler = new StateHandler(this);

                // FPS
                this.lastFPSTime = new Date().getTime();
                this.FPSCount = 0;

                this.logicTime = new Date().getTime();

                // zoning
                this.currentZoning = null;

                this.cursors = {};

                this.sprites = {};

                // tile animation
                this.animatedTiles = null;

                // debug
                this.debugPathing = false;

                this.latestCharData = [];

                // Shortcut Healing
                this.healShortCut = -1;
                this.hpGuide = 0;
                this.autoEattingHandler = null;
                // pvp
                this.pvpFlag = false;
                //
                this.dialogs = [];
                this.characterDialog = new CharacterDialog(this);
                this.dialogs.push(this.characterDialog);

                this.itemInfoDialog = new ItemInfoDialog(this);
                this.dialogs.push(this.itemInfoDialog);

                //New Stuff
                this.soundButton = null;

                this.doubleEXP = false;
                this.expMultiplier = 1;
                this.membership = false;

                this.showInventory = 0;
                this.activeCircle = null;

                this.selectedSkillIndex = 0;

                /**
                 * Settings - For player
                 */

                this.showPlayerNames = true;
                this.musicOn = true;
                this.sfxOn = true;
                this.frameColour = "default";
                this.autoRetaliate = false;


                //Bank
                this.bankShowing = false;



                this.spriteNames = [ "item-frankensteinarmor", "ancientmanumentnpc", "provocationeffect",
                    "bearseonbiarmor", "item-bearseonbiarmor", "frankensteinarmor",
                    "item-gayarcherarmor", "redsicklebow", "item-redsicklebow", "jirisanmoonbear",
                    "halloweenjkarmor", "item-halloweenjkarmor", "mojojojonpc", "gayarcherarmor",
                    "combatuniform", "item-combatuniform", "bloodbow", "item-bloodbow",
                    "item-paewoldo", "cursedhahoemask", "secondsonangelnpc", "item-essentialrage",
                    "sicklebow", "item-sicklebow", "radisharmor", "item-radisharmor", "paewoldo",
                    "firstsonangelnpc", "archerschooluniform", "item-archerschooluniform",
                    "item-forestbow", "adhererarcherarmor", "item-adhererarcherarmor",
                    "supercateffect", "burgerarmor", "item-burgerarmor", "item-marblependant",
                    "friedpotatoarmor", "item-friedpotatoarmor", "superiorangelnpc", "forestbow",
                    "frogarmor", "legolasarmor", "item-legolasarmor", "gaybow", "item-gaybow",
                    "crystalbow", "item-crystalbow", "momangelnpc", "frog", "item-frogarmor",
                    "crystalarcherarmor", "item-crystalarcherarmor", "item-cokearmor",
                    "item-blackspiderarmor", "item-rainbowapro", "item-spiritring", "cokearmor",
                    "fallenarcherarmor", "hellspider", "blackspiderarmor", "rainbowapro",
                    "item-rosebow", "item-pearlpendant", "angelnpc", "item-fallenarcherarmor",
                    "bluewingarcherarmor", "item-bamboospear", "item-bluewingarcherarmor",
                    "item-justicebow", "snowshepherdboy", "suicideghost", "bamboospear",
                    "item-pearlring", "wolfarcherarmor", "item-wolfarcherarmor", "justicebow",
                    "item-snowfoxarcherarmor", "marinebow", "item-marinebow", "cursedjangseung",
                    "redwingarcherarmor", "bridalmask", "item-bridalmask", "snowfoxarcherarmor",
                    "item-redmetalbow", "item-devilkazyasword", "item-redwingarcherarmor",
                    "item-gbwingarcherarmor", "item-captainbow", "redmetalbow", "devilkazyasword",
                    "devilkazyaarmor", "item-devilkazyaarmor", "gbwingarcherarmor", "captainbow",
                    "dovakinarcherarmor", "item-dovakinarcherarmor", "devilkazya", "elfnpc",
                    "skylightbow", "item-greenpendant", "redlightbow", "item-redlightbow",
                    "cheoliarcherarmor", "item-cheoliarcherarmor", "item-skylightbow", "rosebow",
                    "item-piratearcherarmor", "item-greenlightbow", "item-cactusaxe",
                    "item-hunterbow", "item-sproutring", "piratearcherarmor", "greenlightbow",
                    "bluestoremannpc", "ratarcherarmor", "item-ratarcherarmor", "hunterbow",
                    "seahorsebow", "item-seahorsebow", "iceelfnpc", "redstoremannpc",
                    "item-conferencecall", "whitearcherarmor", "item-whitearcherarmor", "cactus",
                    "item-redguardarcherarmor", "skydinosaur", "conferencecall", "cactusaxe",
                    "item-reddamboarmor", "mermaidbow", "item-mermaidbow", "redguardarcherarmor",
                    "iamverycoldnpc", "item-blackpotion", "queenspider", "reddamboarmor",
                    "bluebikinigirlnpc", "babyspider", "redenelbow", "item-redenelbow",
                    "item-guardarcherarmor", "item-greenbow", "pirategirlnpc", "redbikinigirlnpc",
                    "greendamboarmor", "item-greendamboarmor", "guardarcherarmor", "greenbow",
                    "mantis", "item-pinksword", "item-greenwingarcherarmor", "poisonspider",
                    "watermelonbow", "item-watermelonbow", "pinksword", "greenwingarcherarmor",
                    "shepherdboy", "zombiegf", "greenarcherarmor", "item-greenarcherarmor",
                    "item-ironknightarmor", "goldenbow", "item-goldenbow", "item-evilarmor",
                    "weastaff", "item-weastaff", "smalldevil", "ironknightarmor", "fairynpc",
                    "item-goldenarcherarmor", "blackwizard", "wizardrobe", "item-wizardrobe",
                    "whitetiger", "tigerarmor", "item-tigerarmor", "goldenarcherarmor", "pierrot",
                    "deathbow", "item-deathbow", "fireplay", "item-fireplay", "blazespider",
                    "squeakyhammer", "item-squeakyhammer", "violetbow", "item-violetbow",
                    "item-redbow", "hongcheol", "hongcheolarmor", "item-hongcheolarmor",
                    "item-platearcherarmor", "item-beetlearmor", "item-redarcherarmor", "redbow",
                    "mailarcherarmor", "item-mailarcherarmor", "queenant", "platearcherarmor",
                    "snowmanarmor", "item-snowmanarmor", "plasticbow", "item-plasticbow", "comb",
                    "goldmedal", "silvermedal", "bronzemedal", "sponge", "snowman", "item-comb",
                    "item-archerarmor", "firespider", "fireshot", "item-fireshot", "item-ironbow",
                    "item-catarmor", "leatherarcherarmor", "item-leatherarcherarmor", "ironbow",
                    "item-dinosaurarmor", "mermaidnpc", "healeffect", "cat", "catarmor", "beetle",
                    "soldier", "fisherman", "octopus", "earthworm", "dinosaurarmor", "evilarmor",
                    "item-butcherknife", "shieldbenef", "bucklerbenef", "criticaleffect",
                    "cockroachsuit", "item-cockroachsuit", "soybeanbug", "butcherknife",
                    "item-pinkcockroacharmor", "vendingmachine", "bluecockroach", "beetlearmor",
                    "item-robocoparmor", "redcockroach", "pinkcockroacharmor", "oddeyecat",
                    "candybar", "item-candybar", "vampire", "christmasarmor", "santa",
                    "item-christmasarmor", "doctor", "soldierant", "robocoparmor", "stuneffect",
                    "rudolf", "rudolfarmor", "item-rudolfarmor", "boxingman", "santaelf",
                    "ant", "bluedamboarmor", "item-bluedamboarmor", "archerarmor", "woodenbow",
                    "rhaphidophoridae", "memme", "item-memme", "bee", "beearmor", "item-beearmor",
                    "typhoon", "item-typhoon", "windguardian", "squid", "squidarmor",
                    "kaonashi", "damboarmor", "item-damboarmor", "item-royalazalea",
                    "rainbowsword", "item-rainbowsword", "item-sword1", "item-squidarmor",
                    "miniemperor", "huniarmor", "item-huniarmor", "slime", "item-woodenbow",
                    "miniseadragon", "miniseadragonarmor", "item-miniseadragonarmor",
                    "eneltrident", "item-eneltrident", "item-snowpotion", "minidragon",
                    "magicspear", "item-magicspear", "enelarmor", "item-enelarmor",
                    "lightningguardian", "breaker", "item-breaker", "enel", "flaredanceeffect",
                    "shadowregion", "shadowregionarmor", "item-shadowregionarmor",
                    "seadragon", "seadragonarmor", "item-seadragonarmor", "searage",
                    "item-searage", "purplecloudkallege", "item-purplecloudkallege",
                    "snowlady", "daywalker", "item-daywalker", "pirateking", "item-pirateking",
                    "hermitcrab", "zombie", "piratecaptain", "ironogre", "ogrelord", "adherer",
                    "icegolem", "flaredeathknight", "redsickle", "item-redsickle",
                    "regionhenchman", "plunger", "item-plunger", "purplepreta", "sickle",
                    "item-sickle", "icevulture", "portalarmor", "item-portalarmor",
                    "item-adminarmor", "adminarmor", "pain", "rabbitarmor", "item-rabbitarmor",
                    "crystalscolpion", "eliminator", "firebenef", "taekwondo", "item-taekwondo",
                    "darkogre", "item-book", "item-cd", "frostqueen", "snowrabbit", "snowwolf",
                    "iceknight", "miniiceknight", "snowelf", "whitebear", "cobra", "goldgolem",
                    "darkregion", "darkregionillusion", "nightmareregion", "justicehammer",
                    "item-justicehammer", "firesword", "item-firesword", "whip", "item-whip",
                    "forestguardiansword", "item-forestguardiansword", "gayarmor",
                    "item-gayarmor", "schooluniform", "item-schooluniform", "beautifullife",
                    "item-beautifullife", "regionarmor", "item-regionarmor", "ghostrider",
                    "item-ghostrider", "desertscolpion", "darkscolpion", "vulture",
                    "forestdragon", "bluewingarmor", "item-bluewingarmor", "thiefarmor",
                    "item-thiefarmor", "ninjaarmor", "item-ninjaarmor", "dragonarmor",
                    "item-dragonarmor", "fallenarmor", "item-fallenarmor", "paladinarmor",
                    "item-paladinarmor", "crystalarmor", "item-crystalarmor", "adhererrobe",
                    "item-adhererrobe", "frostarmor", "item-frostarmor", "redmetalsword",
                    "item-redmetalsword", "bastardsword", "item-bastardsword", "halberd",
                    "item-halberd", "rose", "item-rose", "icerose", "item-icerose", "hand",
                    "sword", "loot", "target", "talk", "sparks", "shadow16", "rat", "skeleton",
                    "skeleton2", "spectre", "skeletonking", "deathknight", "ogre", "crab",
                    "snek", "eye", "bat", "goblin", "wizard", "guard", "king", "villagegirl",
                    "villager", "coder", "agent", "rick", "scientist", "nyan", "priest",
                    "sorcerer", "octocat", "beachnpc", "forestnpc", "desertnpc", "lavanpc",
                    "clotharmor", "item-clotharmor", "leatherarmor", "mailarmor", "platearmor",
                    "redarmor", "goldenarmor", "firefox", "death", "sword1", "axe", "chest",
                    "sword2", "redsword", "bluesword", "goldensword", "item-sword2", "item-axe",
                    "item-redsword", "item-bluesword", "item-goldensword", "item-leatherarmor",
                    "item-mailarmor", "item-platearmor", "item-redarmor", "item-goldenarmor",
                    "item-flask", "item-cake", "item-burger", "morningstar", "item-morningstar",
                    "item-firepotion", "orc", "oldogre", "golem", "mimic", "hobgoblin",
                    "greenarmor", "greenwingarmor", "item-greenarmor", "item-greenwingarmor",
                    "redmouse", "redguard", "scimitar", "item-scimitar", "redguardarmor",
                    "item-redguardarmor", "whitearmor", "item-whitearmor", "infectedguard",
                    "livingarmor", "mermaid", "trident", "item-trident", "ratarmor",
                    "item-ratarmor", "yellowfish", "greenfish", "redfish", "clam", "preta",
                    "pirateskeleton", "bluescimitar", "item-bluescimitar", "bluepiratearmor",
                    "item-bluepiratearmor", "penguin", "moleking", "cheoliarmor",
                    "item-cheoliarmor", "hammer", "item-hammer", "darkskeleton", "redarcherarmor",
                    "greenpirateskeleton", "blackpirateskeleton", "redpirateskeleton",
                    "yellowpreta", "bluepreta", "miniknight", "wolf", "dovakinarmor",
                    "item-dovakinarmor", "gbwingarmor", "item-gbwingarmor", "redwingarmor",
                    "item-redwingarmor", "snowfoxarmor", "item-snowfoxarmor", "wolfarmor",
                    "item-wolfarmor", "pinkelf", "greenlightsaber", "item-greenlightsaber",
                    "skyelf", "skylightsaber", "item-skylightsaber", "redelf", "redlightsaber",
                    "item-redlightsaber", "item-sidesword", "sidesword", "yellowmouse",
                    "whitemouse", "brownmouse", "spear", "item-spear", "guardarmor",
                    "item-guardarmor",
                    "item-pendant1", "item-ring1", "item-gold", "item-bigflask",
                    "item-mountseadragon", "item-mountforestdragon", "item-mountwhitetiger",
                    "item-armorbinding",
                    "item-armorcommon",
                    "item-armorpatches",
                    "item-armorrare",
                    "item-armoruncommon",
                    "item-bowcommon",
                    "item-bowlimb",
                    "item-bowrare",
                    "item-bowstring",
                    "item-bowuncommon",
                    "item-branch",
                    "item-cloth",
                    "item-element",
                    "item-leaf",
                    "item-mineral",
                    "item-rock",
                    "item-seed",
                    "item-weaponblade",
                    "item-weaponcommon",
                    "item-weaponhilt",
                    "item-weaponrare",
                    "item-weaponuncommon",
                    "item-wood",
                ];
            },


            setup: function($bubbleContainer, canvas, backgroundbuffer, background, foreground, textcanvas, toptextcanvas, input) {
                this.setBubbleManager(new BubbleManager($bubbleContainer));
                this.setRenderer(new Renderer(this, canvas, backgroundbuffer, background, foreground, textcanvas, toptextcanvas));
                this.camera = this.renderer.camera;
                this.inventoryHandler = new InventoryHandler(this);
                this.bankHandler = new BankHandler(this);
                this.setChatInput(input);

                this.storeDialog = new StoreDialog(this);
                this.dialogs.push(this.storeDialog);
                this.enchantDialog = new EnchantDialog(this);
                this.dialogs.push(this.enchantDialog);
                this.bankDialog = new BankDialog(this);
                this.dialogs.push(this.bankDialog);
                this.auctionDialog = new AuctionDialog(this);
                this.dialogs.push(this.auctionDialog);
                this.craftDialog = new CraftDialog(this);
                this.dialogs.push(this.craftDialog);

                this.classPopupMenu = new ClassPopupMenu(this);
            },


            setRenderer: function(renderer) {
                this.renderer = renderer;
            },

            setUpdater: function(updater) {
                this.updater = updater;
            },

            setPathfinder: function(pathfinder) {
                this.pathfinder = pathfinder;
            },

            setChatInput: function(element) {
                this.chatinput = element;
            },

            setBubbleManager: function(bubbleManager) {
                this.bubbleManager = bubbleManager;
            },

            loadMap: function() {
                var self = this;

                this.map = new Map(!this.renderer.upscaledRendering, this);

                this.map.ready(function() {
                    log.info("Map loaded.");
                    var tilesetIndex = self.renderer.upscaledRendering ? 0 : self.renderer.scale - 1;
                    self.renderer.setTileset(self.map.tilesets[tilesetIndex]);
                });
            },

            initPlayer: function() {


                this.app.initTargetHud();

                //alert (this.player.getSpriteName());
                this.player.setSprite(this.sprites[this.player.getSpriteName()]);

                this.player.idle();

                log.debug("Finished initPlayer");
            },

            initShadows: function() {
                this.shadows = {};
                this.shadows["small"] = this.sprites["shadow16"];
            },

            initCursors: function() {
                this.cursors["hand"] = this.sprites["hand"];
                this.cursors["sword"] = this.sprites["sword"];
                this.cursors["loot"] = this.sprites["loot"];
                this.cursors["target"] = this.sprites["target"];
                this.cursors["arrow"] = this.sprites["arrow"];
                this.cursors["talk"] = this.sprites["talk"];
                this.cursors["join"] = this.sprites["talk"];
            },

            initAnimations: function() {
                this.targetAnimation = new Animation("idle_down", 4, 0, 16, 16);
                this.targetAnimation.setSpeed(50);

                this.sparksAnimation = new Animation("idle_down", 6, 0, 16, 16);
                this.sparksAnimation.setSpeed(120);

                this.benefAnimation = new Animation("idle_down", 8, 0, 48, 48);
                this.benefAnimation.setSpeed(120);

                this.benef10Animation = new Animation("idle_down", 10, 0, 32, 32);
                this.benef10Animation.setSpeed(80);

                this.benef4Animation = new Animation("idle_down", 4, 0, 48, 48);
                this.benef4Animation.setSpeed(80);
            },

            getAchievementById: function(id) {
                var found = null;
                _.each(this.achievements, function(achievement, key) {
                    if(achievement.id === parseInt(id)) {
                        found = achievement;
                    }
                });
                return found;
            },

            initHurtSprites: function() {
                var self = this;
                for (var sprite in self.sprites) {
                    var kind = ItemTypes.getKindFromString(sprite);
                    if (kind) {
                        if (ItemTypes.isArmor(kind) || ItemTypes.isArcherArmor(kind)) {
                            try {
                                self.sprites[sprite].createHurtSprite();
                            } catch (e) {
                                continue;
                            }

                        }
                    }
                }
            },

            initSilhouettes: function() {
                var self = this;

                for (var sprite in self.sprites) {
                    var kind = ItemTypes.getKindFromString(sprite);
                    if (kind) {
                        if (!ItemTypes.isArmor(kind) && !ItemTypes.isWeapon(kind) && !ItemTypes.isArcherArmor(kind) && !ItemTypes.isArcherWeapon(kind)) {
                            try {
                                self.sprites[sprite].createSilhouette();
                            } catch (e) { continue; }
                        }
                    }
                }
            },


            loadSprite: function(name) {
                if(this.renderer.upscaledRendering || this.renderer.mobile) {
                    this.spritesets[0][name] = new Sprite(name, 1);
                    this.spritesets[1][name] = new Sprite(name, 2);
                } else if (this.renderer.tablet) {
                    this.spritesets[1][name] = new Sprite(name, 2);
                }
                else {
                    this.spritesets[0][name] = new Sprite(name, 1);
                    this.spritesets[1][name] = new Sprite(name, 2);
                    this.spritesets[2][name] = new Sprite(name, 3);
                }
            },

            setSpriteScale: function(scale) {
                var self = this;

                if(this.renderer.upscaledRendering || scale == 1)
                    this.sprites = this.spritesets[0];
                else
                    this.sprites = this.spritesets[scale - 1];

                _.each(this.entities, function(entity) {
                    //entity.sprite = null;
                    entity.setSprite(self.sprites[entity.getSpriteName()]);
                });
                this.initHurtSprites();
                this.initShadows();
                this.initCursors();
            },

            loadSprites: function() {
                log.info("Loading sprites...");
                this.spritesets = [];
                this.spritesets[0] = {};
                this.spritesets[1] = {};
                this.spritesets[2] = {};
                _.map(this.spriteNames, this.loadSprite, this);
                this.setSpriteScale(this.renderer.scale);
            },

            spritesLoaded: function() {
                if(_.any(this.sprites, function(sprite) { return !sprite.isLoaded; })) {
                    return false;
                }
                return true;
            },

            setCursor: function(name, orientation) {
                if(name in this.cursors) {
                    this.currentCursor = this.cursors[name];
                    this.currentCursorOrientation = orientation;
                } else {
                    log.error("Unknown cursor name :"+name);
                }
            },

            updateCursorLogic: function() {
                if(this.hoveringCollidingTile && this.started) {
                    this.targetColor = "rgba(255, 50, 50, 0.5)";
                }
                else {
                    this.targetColor = "rgba(255, 255, 255, 0.5)";
                }

                if(this.hoveringPlayer && this.started) {
                    if(this.player.pvpFlag || (this.namedEntity && this.namedEntity instanceof Player && this.namedEntity.isWanted)) {
                        this.setCursor("sword");
                    } else {
                        this.setCursor("hand");
                    }
                    this.hoveringTarget = false;
                    this.hoveringMob = false;
                    this.targetCellVisible = false;
                } else if(this.hoveringMob && this.started) {
                    this.setCursor("sword");
                    this.hoveringTarget = false;
                    this.hoveringPlayer = false;
                    this.targetCellVisible = false;
                }
                else if(this.hoveringNpc && this.started) {
                    this.setCursor("talk");
                    this.hoveringTarget = false;
                    this.targetCellVisible = false;
                }
                else if((this.hoveringItem || this.hoveringChest) && this.started) {
                    this.setCursor("loot");
                    this.hoveringTarget = false;
                    this.targetCellVisible = true;
                }
                else {
                    this.setCursor("hand");
                    this.hoveringTarget = false;
                    this.hoveringPlayer = false;
                    this.targetCellVisible = true;
                }
            },

            focusPlayer: function() {
                this.renderer.camera.lookAt(this.player);
            },

            addEntity: function(entity) {
                var self = this;
                if(this.entities[entity.id] === undefined) {
                    this.entities[entity.id] = entity;
                    this.registerEntityPosition(entity);

                    if(!(entity instanceof Item && entity.wasDropped)
                        && !(this.renderer.mobile || this.renderer.tablet)) {
                        entity.fadeIn(this.currentTime);
                    }

                    if(this.renderer.mobile || this.renderer.tablet) {
                        entity.onDirty(function(e) {
                            if(self.camera.isVisible(e)) {
                                e.dirtyRect = self.renderer.getEntityBoundingRect(e);
                                self.checkOtherDirtyRects(e.dirtyRect, e, e.gridX, e.gridY);
                            }
                        });
                    }
                }
                else {
                    log.error("This entity already exists : " + entity.id + " ("+entity.kind+")");
                }
            },

            removeEntity: function(entity) {
                if(entity.id in this.entities) {
                    this.unregisterEntityPosition(entity);
                    delete this.entities[entity.id];
                }
                else {
                    log.error("Cannot remove entity. Unknown ID : " + entity.id);
                }
            },

            addItem: function(item, x, y) {
                item.setSprite(this.sprites[item.getSpriteName()]);
                item.setGridPosition(x, y);
                item.setAnimation("idle", 150);
                this.addEntity(item);

                //Display info about the item upon creation (dropping, or any appearance on the ground)
                //this.createBubble(item.id, item.getInfoMsg());
                //this.assignBubbleTo(item);
            },

            removeItem: function(item) {
                if(item) {
                    this.removeFromItemGrid(item, item.gridX, item.gridY);
                    this.removeFromRenderingGrid(item, item.gridX, item.gridY);
                    delete this.entities[item.id];
                } else {
                    log.error("Cannot remove item. Unknown ID : " + item.id);
                }
            },

            initPathingGrid: function() {
                this.pathingGrid = [];
                for(var i=0; i < this.map.height; i += 1) {
                    this.pathingGrid[i] = [];
                    for(var j=0; j < this.map.width; j += 1) {
                        this.pathingGrid[i][j] = this.map.grid[i][j];
                    }
                }
                log.info("Initialized the pathing grid with static colliding cells.");
            },

            initEntityGrid: function() {
                this.entityGrid = [];
                log.info(this.map.height);
                log.info(this.map.width);
                for(var i=0; i < this.map.height; i += 1) {
                    this.entityGrid[i] = [];
                    for(var j=0; j < this.map.width; j += 1) {
                        this.entityGrid[i][j] = {};
                    }
                }
                log.info("Initialized the entity grid.");
            },

            initRenderingGrid: function() {
                this.renderingGrid = [];
                for(var i=0; i < this.map.height; i += 1) {
                    this.renderingGrid[i] = [];
                    for(var j=0; j < this.map.width; j += 1) {
                        this.renderingGrid[i][j] = {};
                    }
                }
                log.info("Initialized the rendering grid.");
            },

            initItemGrid: function() {
                this.itemGrid = [];
                for(var i=0; i < this.map.height; i += 1) {
                    this.itemGrid[i] = [];
                    for(var j=0; j < this.map.width; j += 1) {
                        this.itemGrid[i][j] = {};
                    }
                }
                log.info("Initialized the item grid.");
            },

            /**
             *
             */
            initAnimatedTiles: function() {
                var self = this,
                    m = this.map;

                this.animatedTiles = [];
                this.forEachVisibleTile(function (id, index) {
                    if(m.isAnimatedTile(id)) {
                        var tile = new AnimatedTile(id, m.getTileAnimationLength(id), m.getTileAnimationDelay(id), index),
                            pos = self.map.tileIndexToGridPosition(tile.index);

                        tile.x = pos.x;
                        tile.y = pos.y;
                        self.animatedTiles.push(tile);
                    }
                }, 1, false);
                //log.info("Initialized animated tiles.");
            },

            addToRenderingGrid: function(entity, x, y) {
                if(!this.map.isOutOfBounds(x, y)) {
                    this.renderingGrid[y][x][entity.id] = entity;
                }
            },

            removeFromRenderingGrid: function(entity, x, y) {
                if(entity && this.renderingGrid[y][x] && entity.id in this.renderingGrid[y][x]) {
                    delete this.renderingGrid[y][x][entity.id];
                }
            },

            removeFromEntityGrid: function(entity, x, y) {
                if(entity && this.entityGrid[y][x] && entity.id in this.entityGrid[y][x]) {
                    delete this.entityGrid[y][x][entity.id];
                    //log.info("x: "+x+",y:"+y+",id:"+entity.id+" removed from grid");
                }
            },

            removeFromItemGrid: function(item, x, y) {
                if(item && this.itemGrid[y][x][item.id]) {
                    delete this.itemGrid[y][x][item.id];
                }
            },

            removeFromPathingGrid: function(x, y) {
                this.pathingGrid[y][x] = 0;
            },

            /**
             * Registers the entity at two adjacent positions on the grid at the same time.
             * This situation is temporary and should only occur when the entity is moving.
             * This is useful for the hit testing algorithm used when hovering entities with the mouse cursor.
             *
             * @param {Entity} entity The moving entity
             */
            registerEntityDualPosition: function(entity) {
                if(entity) {
                    this.entityGrid[entity.gridY][entity.gridX][entity.id] = entity;

                    this.addToRenderingGrid(entity, entity.gridX, entity.gridY);

                    if(entity.nextGridX >= 0 && entity.nextGridY >= 0) {
                        this.entityGrid[entity.nextGridY][entity.nextGridX][entity.id] = entity;
                        if(!(entity instanceof Player) && !(entity instanceof Pet)) {
                            this.pathingGrid[entity.nextGridY][entity.nextGridX] = 1;
                        }
                    }
                }
            },

            /**
             * Clears the position(s) of this entity in the entity grid.
             *
             * @param {Entity} entity The moving entity
             */
            unregisterEntityPosition: function(entity) {
                if(entity) {
                    this.removeFromEntityGrid(entity, entity.gridX, entity.gridY);
                    this.removeFromPathingGrid(entity.gridX, entity.gridY);

                    this.removeFromRenderingGrid(entity, entity.gridX, entity.gridY);

                    if(entity.nextGridX >= 0 && entity.nextGridY >= 0) {
                        this.removeFromEntityGrid(entity, entity.nextGridX, entity.nextGridY);
                        this.removeFromPathingGrid(entity.nextGridX, entity.nextGridY);
                    }
                }
            },

            registerEntityPosition: function(entity) {
                var x = entity.gridX,
                    y = entity.gridY;

                if(entity) {
                    if(entity instanceof Character || entity instanceof Chest || entity instanceof Gather) {
                        //if(!(entity instanceof Player))
                        //log.info("x: "+x+",y:"+y+",id:"+entity.id+" added to grid");

                        this.entityGrid[y][x][entity.id] = entity;
                        if(!(entity instanceof Player) && !(entity instanceof Pet)) {
                            this.pathingGrid[y][x] = 1;
                        }
                    }
                    if(entity instanceof Item) {
                        this.itemGrid[y][x][entity.id] = entity;
                    }
                    this.addToRenderingGrid(entity, x, y);
                }
            },

            setServerOptions: function(host, port, username, userpw, email, newuserpw, pClass) {
                this.host = host;
                this.port = port;
                this.username = this.capitalizeFirstLetter(username.toLowerCase());
                this.userpw = userpw;
                this.email = email;
                this.newuserpw = newuserpw;
                this.pClass = parseInt(pClass);
            },

            capitalizeFirstLetter: function(string) {

                return string.charAt(0).toUpperCase() + string.slice(1);
            },

            loadAudio: function() {
                this.audioManager = new AudioManager(this);
            },

            loadWarp: function() {
                this.warpManager = new WarpManager(this);
            },

            initMusicAreas: function() {
                var self = this;
                _.each(this.map.musicAreas, function(area) {
                    self.audioManager.addArea(area.x, area.y, area.w, area.h, area.id);
                });
            },

            run: function(action, started_callback) {
                var self = this;

                this.loadSprites();
                this.setUpdater(new Updater(this));
                this.camera = this.renderer.camera;



                var wait = setInterval(function() {
                    if(self.map.isLoaded /*&& self.spritesLoaded()*/) {

                        //log.debug('All sprites loaded.');
                        log.debug('Map is loaded.');
                        self.connect(action, started_callback);
                        clearInterval(wait);
                    }
                }, 200);
            },

            tick: function() {
                this.currentTime = new Date().getTime();

                if(this.started) {
                    this.updater.update();
                    this.updateCursorLogic();
                    this.renderer.renderFrame();
                }

                if(!this.isStopped)
                    requestAnimFrame(this.tick.bind(this));

            },

            start: function() {
                this.tick();
                log.info("Game loop started.");
            },

            stop: function() {
                log.info("Game stopped.");
                this.isStopped = true;
            },

            entityIdExists: function(id) {
                return id in this.entities;
            },

            getEntityById: function(id) {
                if(id in this.entities) {
                    return this.entities[id];
                }
            },


            getEntityByName: function(name){
                for(id in this.entities){
                    var entity = this.entities[id];
                    if(entity.name === name){
                        return entity;
                    }
                }
                return null;
            },

            getEntityByKind: function(kind){
                for(id in this.entities){
                    var entity = this.entities[id];
                    if(entity.kind === kind){
                        return entity;
                    }
                }
                return null;
            },


            loadGameData: function() {
                var self = this;
                self.loadAudio();
                self.loadWarp();

                self.initMusicAreas();

                self.initCursors();
                self.initAnimations();
                self.initShadows();
                self.initHurtSprites();
                //self.initSilhouettes();

                self.initEntityGrid();
                self.initItemGrid();

                self.initPathingGrid();
                self.initRenderingGrid();
                self.initAnimatedTiles();

                self.setPathfinder(new Pathfinder(self.map.width, self.map.height));

                self.initPlayer();
                self.setCursor("hand");
            },

            connect: function(action, started_callback) {
                var self = this,
                    connecting = false; // always in dispatcher mode in the build version

                this.client = new GameClient(this.host, this.port);
                this.boardhandler.setClient(this.client);

                this.client.fail_callback = function(reason){
                    started_callback({
                        success: false,
                        reason: reason
                    });
                    self.started = false;
                };

                //>>excludeStart("prodHost", pragmas.prodHost);
                //>>excludeEnd("prodHost");

                //>>includeStart("prodHost", pragmas.prodHost);
                if(!connecting) {

                    this.client.connect(false); // Always use dispatcher in production
                }
                //>>includeEnd("prodHost");

                this.client.onDispatched(function(host, port) {
                    log.debug("Dispatched to game server "+host+ ":"+port);

                    self.client.host = host;
                    self.client.port = port;
                    self.client.connect(); // connect to actual game server


                });

                this.client.onConnected(function() {
                    log.info("Starting client/server handshake");

                    // Player
                    self.player = new Player("player", "", this);
                    self.player.moveUp = false;
                    self.player.moveDown = false;
                    self.player.moveLeft = false;
                    self.player.moveRight = false;
                    self.loadGameData();
                    self.player.name = self.username;
                    self.player.pw = self.userpw;
                    self.player.pClass = parseInt(self.pClass);
                    self.player.email = self.email;
                    self.started = true;
                    self.ready = true;




                    switch (action)
                    {
                        case "loadcharacter":
                            log.info("sendLogin");
                            self.client.sendLogin(self.player);
                            break;
                        case "createcharacter":
                            self.client.sendCreate(self.player);
                            break;
                    }
                    /*if (self.renderer.tablet || self.renderer.mobile)
                     {
                     log.info("Loading Joystick");
                     self.joystick = new VirtualJoystick({
                     container	: document.getElementById('canvas'),
                     mouseSupport	: true,
                     });
                     log.info("Joystick Loaded");
                     }
                     */
                });

                this.client.onEntityList(function(list) {
                    var entityIds = _.pluck(self.entities, 'id'),
                        knownIds = _.intersection(entityIds, list),
                        newIds = _.difference(list, knownIds);

                    self.obsoleteEntities = _.reject(self.entities, function(entity) {
                        return _.include(knownIds, entity.id) || entity.id === self.player.id;
                    });

                    // Destroy entities outside of the player's zone group
                    self.removeObsoleteEntities();

                    // Ask the server for spawn information about unknown entities
                    if(_.size(newIds) > 0) {
                        self.client.sendWho(newIds);
                    }
                });

                this.client.onWelcome(function(id, name, x, y, hp, mana, armor, weapon,
                                               experience,
                                               inventory, inventoryNumber, maxInventoryNumber,
                                               inventorySkillKind, inventorySkillLevel,
                                               maxBankNumber, bankKind, bankNumber,
                                               bankSkillKind, bankSkillLevel,
                                               achievementNumber, achievementFound, achievementProgress,
                                               doubleExp, expMultiplier, membership, kind, rights, pClass) {

                    self.loadGameData();
                    self.player.id = id;
                    self.playerId = id;
                    self.player.kind = kind;
                    self.player.name = name;
                    self.player.rights = rights;
                    self.player.experience = experience;
                    self.player.level = Types.getLevel(experience);
                    self.player.setGridPosition(x, y);
                    self.player.setMaxHitPoints(hp);
                    self.player.setMaxMana(mana);
                    self.player.setArmorName(armor);
                    self.player.setSpriteName(armor);
                    self.player.setWeaponName(weapon);
                    self.player.skillHandler = new SkillHandler(self);
                    self.camera.setRealCoords();
                    self.resetZone();
                    self.doubleEXP = doubleExp;
                    self.expMultiplier = expMultiplier;
                    self.membership = membership;
                    self.inventoryHandler.initInventory(maxInventoryNumber, inventory, inventoryNumber, inventorySkillKind, inventorySkillLevel);
                    self.shopHandler.setMaxInventoryNumber(maxInventoryNumber);
                    self.bankHandler.initBank(maxBankNumber, bankKind, bankNumber, bankSkillKind, bankSkillLevel);

                    self.initPlayer();
                    self.updateBars();
                    self.updateExpBar();

                    self.player.setClass(parseInt(pClass));

                    //self.initAnimatedTiles();
                    //self.renderer.renderStaticCanvases();
                    //log.info("self.renderbackground");


                    self.resetCamera();
                    self.updatePlateauMode();
                    self.audioManager.updateMusic();
                    self.addEntity(self.player);
                    self.player.dirtyRect = self.renderer.getEntityBoundingRect(self.player);
                    self.achievementHandler.initAchievement(achievementFound, achievementProgress);

                    //log.info("send skill load");
                    self.client.sendSkillLoad();
                    //Welcome message
                    self.chathandler.show();
                    self.renderbackground = true;
                    self.renderer.forceRedraw = true;
                    //self.chathandler.addNotification("Welcome to Tap Tap Adventure!");

                    if (self.doubleEXP) {
                        self.chathandler.addNotification("Double EXP is currently on.");
                    }
                    if (self.membership) {
                        self.chathandler.addNotification("You are currently a member");
                    }

                    self.initializeAchievements();

                    self.player.onStartPathing(function(path) {
                        var i = path.length - 1,
                            x =  path[i][0],
                            y =  path[i][1];

                        if(self.player.isMovingToLoot()) {
                            self.player.isLootMoving = false;
                        }

                        // Target cursor position
                        self.selectedX = x;
                        self.selectedY = y;

                        self.selectedCellVisible = true;

                        if(self.renderer.mobile || self.renderer.tablet) {
                            self.drawTarget = true;
                            self.clearTarget = true;
                            self.renderer.targetRect = self.renderer.getTargetBoundingRect();
                            self.checkOtherDirtyRects(self.renderer.targetRect, null, self.selectedX, self.selectedY);
                        }
                    });

                    self.player.onCheckAggro(function() {
                        self.forEachMob(function(mob) {
                            if((mob.isAggressive === true) && !mob.isAttacking() && self.player.isNear(mob, mob.aggroRange)) {
                                self.player.aggro(mob);
                            }
                        });
                    });

                    self.player.onAggro(function(mob) {
                        if(!mob.isWaitingToAttack(self.player) && !self.player.isAttackedBy(mob)) {
                            if (mob.level * 2 > self.player.level) {
                                self.player.log_info("Aggroed by " + mob.id + " at ("+self.player.gridX+", "+self.player.gridY+")");
                                self.client.sendAggro(mob);
                                mob.waitToAttack(self.player);
                            }
                        }
                    });

                    self.player.onBeforeStep(function() {
                        /*var blockingEntity = self.getEntityAt(self.player.nextGridX, self.player.nextGridY);
                         if(blockingEntity && blockingEntity.id !== self.playerId) {
                         log.debug("Blocked by " + blockingEntity.id);
                         }*/
                        self.unregisterEntityPosition(self.player);
                    });

                    self.player.onStep(function() {
                        for (var i=0; i < self.player.pets.length; ++i)
                        {
                            var pet = self.player.pets[i];
                            log.info("Pet follow Step");
                            pet.follow(this);
                        }

                        if(self.player.hasNextStep())
                            self.registerEntityDualPosition(self.player);


                        // TODO - Sometimes isnt called so next zone isnt loaded.
                        if(self.isZoningTile(self.player.gridX, self.player.gridY))
                        {
                            //alert ("called");
                            self.enqueueZoningFrom(self.player.gridX, self.player.gridY);
                        }

                        self.player.forEachAttacker(self.makeAttackerFollow);


                        self.updatePlayerCheckpoint();
                        //self.client.sendStep(self.player);
                        self.stepCount++;
                        if(!self.player.isDead) {
                            self.audioManager.updateMusic();
                            if (self.renderer.mobile && self.stepCount >= 2) {
                                self.renderer.cleanPathing();
                                self.stepCount++;
                            }
                        }
                    });

                    self.client.onPVPChange(function(pvpFlag) {
                        self.player.flagPVP(pvpFlag);
                        //self.pvpFlag = pvpFlag;
                    });

                    self.client.onCharData(function(attackSpeed, movementSpeed, walkSpeed, idleSpeed, attackRate) {
                        if (self.player.isDead)
                            return;

                        var charData = [attackSpeed, movementSpeed, walkSpeed, idleSpeed, attackRate];
                        self.latestCharData = charData;

                        self.player.setData(charData);
                    });

                    self.player.onStopPathing(function(x, y) {
                        for (var i=0; i < self.player.pets.length; ++i)
                        {
                            var pet = self.player.pets[i];
                            pet.follow(self.player);
                        }

                        self.client.sendMoveEntity2(self.player.id, x, y, 2);

                        if(self.player.hasTarget()) {
                            self.player.lookAtTarget();
                        }

                        self.selectedCellVisible = false;

                        if(self.isItemAt(x, y)) {
                            var item = self.getItemAt(x, y);

                            try {
                                self.client.sendLoot(item);
                            } catch(e) {
                                throw e;
                            }
                        }

                        if (self.player.pvpFlag && !self.notifyPVPMessageSent) {
                            self.chathandler.addGameNotification("Notification", "You are currently in a PvP area.");
                            self.notifyPVPMessageSent = true;
                            self.pvpFlag = true;
                        } else {
                            if (!self.player.pvpFlag && self.notifyPVPMessageSent) {
                                self.chathandler.addGameNotification("Notification", "You are no longer in the PvP area.");
                                self.notifyPVPMessageSent = false;
                                self.pvpFlag = false;
                            }
                        }

                        if(!self.player.hasTarget() && self.map.isDoor(x, y)) {
                            var dest = self.map.getDoorDestination(x, y);

                            if(dest.level > self.player.level) {
                                self.unregisterEntityPosition(self.player);
                                self.registerEntityPosition(self.player);
                                return;
                            }
                            if(dest.admin === 1 && self.player.admin === null) {
                                self.unregisterEntityPosition(self.player);
                                self.registerEntityPosition(self.player);
                                return;
                            }

                            self.player.setGridPosition(dest.x, dest.y);
                            self.player.nextGridX = dest.x;
                            self.player.nextGridY = dest.y;
                            self.player.turnTo(dest.orientation);

                            self.client.sendTeleport(self.player.id, dest.x, dest.y);

                            self.resetZone();

                            self.player.forEachAttacker(function(attacker) {
                                attacker.disengage();
                                attacker.idle();
                            });

                            self.updatePlateauMode();

                            if(self.renderer.mobile || self.renderer.tablet) {
                                // When rendering with dirty rects, clear the whole screen when entering a door.
                                self.renderer.clearScreen(self.renderer.context);
                            }

                            if(dest.portal) {
                                self.audioManager.playSound("teleport");
                            }

                            //if(!self.player.isDead) {
                            //    self.audioManager.updateMusic();
                            //}
                            self.camera.setRealCoords();

                            self.renderer.drawBackground(self.renderer.background, "#12100D");
                            self.renderbackground = true;
                            self.renderer.forceRedraw = true;

                            for (var i=0; i < self.player.pets.length; ++i)
                            {
                                var pet = self.player.pets[i];
                                pet.path = null;
                                pet.setGridPosition(dest.x, dest.y);
                            }
                        }

                        if(self.player.target instanceof Npc)
                            self.makeNpcTalk(self.player.target);
                        else if(self.player.target instanceof Chest) {
                            self.client.sendOpen(self.player.target);
                            self.audioManager.playSound("chest");
                        }

                        self.player.forEachAttacker(function(attacker) {
                            if(!attacker.isAdjacentNonDiagonal(self.player)) {
                                attacker.follow(self.player);
                            }
                        });

                        self.unregisterEntityPosition(self.player);
                        self.registerEntityPosition(self.player);


                        if(!(self.player.moveUp || self.player.moveDown || self.player.moveLeft || self.player.moveRight))
                            self.renderer.forceRedraw = true;


                        if (self.renderer.mobile)
                            self.renderer.cleanPathing();

                    });

                    self.player.onRequestPath(function(x, y) {
                        var ignored = [self.player]; // Always ignore self

                        if(self.player.hasTarget()) {

                            ignored.push(self.player.target);
                        }

                        var path = self.findPath(self.player, x, y, ignored);
                        if (path)
                            self.client.sendMoveEntity2(self.player.id, x, y, 1);
                        return path;
                    });

                    self.player.onDeath(function() {
                        log.info(self.playerId + " is dead");
                        self.client.sendDeath(self.playerId);
                        self.player.skillHandler.clear();
                        self.player.stopBlinking();

                        // FIX - Hack to fix dissappear bug.
                        self.player.kind = 1;

                        self.player.setSprite(self.sprites["death"]);
                        self.player.animate("death", 120, 1, function() {
                            log.info(self.playerId + " was removed");

                            self.removeEntity(self.player);
                            self.removeFromRenderingGrid(self.player, self.player.gridX, self.player.gridY);

                            self.player = null;
                            self.client.disable();

                            setTimeout(function() {
                                self.playerdeath_callback();
                            }, 1000);

                        });

                        self.player.forEachAttacker(function(attacker) {
                            attacker.disengage();
                            attacker.idle();
                        });

                        self.audioManager.fadeOutCurrentMusic();
                        self.audioManager.playSound("death");
                    });

                    self.player.onHasMoved(function(player) {
                        self.initAnimatedTiles();
                        self.assignBubbleTo(player);
                    });


                    self.player.onArmorLoot(function(armorName) {
                        self.player.switchArmor(armorName, self.sprites[armorName]);
                    });

                    self.client.onSpawnItem(function(item, x, y) {
                        log.info("Spawned " + ItemTypes.getKindAsString(item.kind) + " (" + item.id + ") at "+x+", "+y);
                        self.addItem(item, x, y);
                    });

                    self.client.onSpawnChest(function(chest, x, y) {
                        log.info("Spawned chest (" + chest.id + ") at "+x+", "+y);
                        chest.setSprite(self.sprites[chest.getSpriteName()]);
                        chest.setGridPosition(x, y);
                        chest.setAnimation("idle_down", 150);
                        self.addEntity(chest, x, y);

                        chest.onOpen(function() {
                            chest.stopBlinking();
                            chest.setSprite(self.sprites["death"]);
                            chest.setAnimation("death", 120, 1, function() {
                                log.info(chest.id + " was removed");
                                self.removeEntity(chest);
                                self.removeFromRenderingGrid(chest, chest.gridX, chest.gridY);
                                self.previousClickPosition = {};
                                self.player.removeTarget();
                            });
                        });
                    });

                    self.client.onSpawnCharacter(function(entity, x, y, orientation, targetId, playerId) {
                        if(!self.entityIdExists(entity.id)) {
                            try {
                                if(entity.id !== self.playerId) {
                                    entity.setSprite(self.sprites[entity.getSpriteName()]);
                                    entity.setGridPosition(x, y);
                                    entity.setOrientation(orientation);
                                    entity.idle();

                                    self.addEntity(entity);

                                    var entityName;
                                    if (entity instanceof Mob)
                                        entityName = MobData.Kinds[entity.kind].name;
                                    else if (entity instanceof Npc)
                                        entityName = NpcData.Kinds[entity.kind].name;
                                    else if (entity instanceof Pet)
                                        entityName = "Pet";

                                    else
                                        entityName = ItemTypes.getKindAsString(entity.kind)
                                    log.debug("Spawned " + entityName + " (" + entity.id + ") at "+entity.gridX+", "+entity.gridY);

                                    if (entity instanceof Pet) {
                                        log.info("playerId="+playerId);
                                        var player = self.getEntityById(entity.playerId);
                                        if (player)
                                            player.pets.push(entity);
                                    }

                                    if (entity instanceof Gather) {
                                        entity.onDeath(function() {
                                            if(entity instanceof Gather) {
                                                self.deathpositions[entity.id] = {x: entity.gridX, y: entity.gridY};
                                            }
                                        });
                                    }
                                    else if(entity instanceof Character) {
                                        entity.onBeforeStep(function() {
                                            self.unregisterEntityPosition(entity);
                                            //log.info("unreg x:"+entity.gridX+",y:"+entity.gridY);
                                        });

                                        entity.onStep(function() {
                                            if(!entity.isDying) {
                                                if (!entity instanceof Player)
                                                    self.registerEntityDualPosition(entity);

                                                if(self.player && self.player.target === entity) {
                                                    self.makeAttackerFollow(self.player);

                                                    log.info(entity.moveSpeed);
                                                    log.info("entity: " + entity.gridX + " " + entity.gridY);
                                                }

                                                entity.forEachAttacker(function(attacker) {
                                                    if(attacker.isAdjacent(attacker.target)) {
                                                        attacker.lookAtTarget();
                                                    } else {
                                                        attacker.follow(entity);
                                                    }
                                                });
                                                //if (entity instanceof Player)
                                                //{
                                                self.addToRenderingGrid(entity, entity.gridX, entity.gridY);
                                                //}

                                            }


                                        });

                                        entity.onStopPathing(function(x, y) {

                                            if (entity instanceof Pet)
                                                self.client.sendMoveEntity(entity);
                                            if(!entity.isDying) {

                                                if(entity.hasTarget() && entity.isAdjacent(entity.target)) {
                                                    entity.lookAtTarget();
                                                }

                                                entity.forEachAttacker(function(attacker) {
                                                    if(!attacker.isAdjacentNonDiagonal(entity) && attacker.id !== self.playerId) {
                                                        attacker.follow(entity);
                                                    }
                                                });


                                                self.unregisterEntityPosition(entity);
                                                self.registerEntityPosition(entity);
                                            }
                                        });

                                        entity.onRequestPath(function(x, y) {
                                            if (entity instanceof Pet)
                                                return self.findPath(entity, x, y);

                                            var ignored = [entity], // Always ignore self
                                                ignoreTarget = function(target) {
                                                    ignored.push(target);

                                                    // also ignore other attackers of the target entity
                                                    target.forEachAttacker(function(attacker) {
                                                        ignored.push(attacker);
                                                    });
                                                };

                                            if(entity.hasTarget()) {
                                                ignoreTarget(entity.target);
                                            } else if(entity.previousTarget) {
                                                // If repositioning before attacking again, ignore previous target
                                                // See: tryMovingToADifferentTile()
                                                ignoreTarget(entity.previousTarget);
                                            }
                                            return self.findPath(entity, x, y, ignored);
                                        });

                                        entity.onDeath(function() {

                                            if(entity instanceof Mob) {
                                                // Keep track of where mobs die in order to spawn their dropped items
                                                // at the right position later.
                                                log.info("entity: " + entity.gridX + " y: " + entity.gridY);
                                                self.deathpositions[entity.id] = {x: entity.gridX, y: entity.gridY};
                                            }

                                            entity.isDying = true;
                                            entity.setSprite(self.sprites[entity instanceof Mobs.rat ? "rat" : "death"]);
                                            entity.animate("death", 120, 1, function() {

                                                self.removeEntity(entity);
                                                self.removeFromRenderingGrid(entity, entity.gridX, entity.gridY);
                                            });

                                            entity.forEachAttacker(function(attacker) {
                                                attacker.disengage();
                                            });

                                            if(self.player.target && self.player.target.id === entity.id) {
                                                self.player.disengage();
                                            }

                                            // Upon death, this entity is removed from both grids, allowing the player
                                            // to click very fast in order to loot the dropped item and not be blocked.
                                            // The entity is completely removed only after the death animation has ended.
                                            self.removeFromEntityGrid(entity, entity.gridX, entity.gridY);
                                            self.removeFromPathingGrid(entity.gridX, entity.gridY);

                                            if(self.camera.isVisible(entity)) {
                                                self.audioManager.playSound("kill"+Math.floor(Math.random()*2+1));
                                            }

                                            if (entity instanceof Player)
                                            {
                                                for(var i=0; i < entity.pets.length; ++i)
                                                {
                                                    var pet = entity.pets[i];
                                                    self.removeFromRenderingGrid(pet, pet.gridX, pet.gridY);
                                                }
                                            }
                                            self.updateCursor();
                                        });

                                        entity.onHasMoved(function(entity) {
                                            self.assignBubbleTo(entity); // Make chat bubbles follow moving entities

                                        });

                                        if(entity instanceof Mob) {
                                            if(targetId) {
                                                var player = self.getEntityById(targetId);
                                                if(player)
                                                    self.createAttackLink(entity, player);
                                            }
                                        }
                                    }
                                }
                            }
                            catch(e) {
                                log.error(e);
                            }
                        } else {
                            log.debug("Character "+entity.id+" already exists. Don't respawn.");
                        }
                    });

                    self.client.onDespawnEntity(function(entityId) {
                        var entity = self.getEntityById(entityId);

                        if(entity) {
                            var entityName;

                            if (entity instanceof Mob)
                                entityName = MobData.Kinds[entity.kind].name;
                            else if (entity instanceof Npc)
                                entityName = NpcData.Kinds[entity.kind].name;
                            else if (entity instanceof Item)
                            {
                                entityName = ItemTypes.getKindAsString(entity.kind);
                            }
                            log.debug("Despawned " + entityName + " (" + entity.id + ") at "+entity.gridX+", "+entity.gridY);

                            if(entity.gridX === self.previousClickPosition.x
                                && entity.gridY === self.previousClickPosition.y) {
                                self.previousClickPosition = {};
                            }

                            if(entity instanceof Item) {
                                self.removeItem(entity);
                            } else if(entity instanceof Character) {
                                entity.forEachAttacker(function(attacker) {
                                    if(attacker.canReachTarget())
                                        attacker.hit();

                                });
                                entity.die();
                            } else if(entity instanceof Chest) {
                                entity.open();
                            } else if (entity instanceof Gather) {
                                entity.die();
                            }

                            entity.clean();
                            //self.unregisterEntityPosition(entity);
                        }
                    });

                    self.client.onItemBlink(function(id) {
                        var item = self.getEntityById(id);

                        if(item)
                            item.blink(150);

                    });

                    self.client.onEntityMove(function(id, x, y) {
                        var entity = null;

                        if (self.player.isDead == true)
                            return;


                        if(id !== self.playerId) {
                            entity = self.getEntityById(id);

                            if(entity) {
                                entity.disengage();
                                entity.idle();
                                entity.lookAtTarget();

                                self.makeCharacterGoTo(entity, x, y);
                            }
                        }
                    });

                    self.client.onEntityDestroy(function(id) {
                        var entity = self.getEntityById(id);
                        if(entity) {
                            if(entity instanceof Item) {
                                self.removeItem(entity);
                            } else {
                                self.removeEntity(entity);
                            }
                            log.debug("Entity was destroyed: "+entity.id);
                        }
                    });

                    self.client.onPlayerMoveToItem(function(playerId, itemId) {
                        var player, item;

                        if(playerId !== self.playerId) {
                            player = self.getEntityById(playerId);
                            item = self.getEntityById(itemId);

                            if(player && item) {
                                self.makeCharacterGoTo(player, item.gridX, item.gridY);
                            }
                        }
                    });

                    self.client.onEntityAttack(function(attackerId, targetId) {
                        var attacker = self.getEntityById(attackerId),
                            target = self.getEntityById(targetId);

                        //log.info("onEntityAttack");
                        if (attacker) {
                            attacker.hit();
                            attacker.lookAtTarget();
                        }
                        /*
                         if (attacker instanceof Player && target instanceof Player)
                         return;*/

                        if(attacker && target && attacker.id !== self.playerId) {

                            if(attacker && target instanceof Player && target.id !== self.playerId && target.target && target.target.id === attacker.id && attacker.getDistanceToEntity(target) < 1) {
                                setTimeout(function() {
                                    self.createAttackLink(attacker, target);
                                }, 400); // delay to prevent other players attacking mobs from ending up on the same tile as they walk towards each other.
                            } else {
                                self.createAttackLink(attacker, target);
                            }

                        }

                    });

                    self.client.onPlayerDamageMob(function(mobId, points, healthPoints, maxHp) {
                        var mob = self.getEntityById(mobId);
                        if(mob && points) {
                            self.infoManager.addDamageInfo(-points, mob.x, mob.y - 15, "inflicted");
                        }
                        if(self.player.hasTarget()){
                            self.updateTarget(mobId, points, healthPoints, maxHp);
                        }


                    });

                    self.client.onPlayerKillMob(function(id, level, exp) {
                        var mob = self.getEntityById(id);
                        if (self.doubleEXP) {
                            var mobExp = exp * 2;
                        } else {
                            var mobExp = exp * self.expMultiplier;
                        }
                        if (self.player.level != level) {
                            self.infoManager.addDamageInfo("Level " + level, self.player.x, self.player.y - 15, "exp", 5000);
                        }
                        else
                        {
                            self.infoManager.addDamageInfo("+"+mobExp+" exp", self.player.x, self.player.y - 15, "exp", 3000);
                        }
                        self.player.level = level;
                        self.player.experience += mobExp;
                        self.updateExpBar();

                        //self.infoManager.addDamageInfo("+"+mobExp+" exp", self.player.x, self.player.y - 15, "exp", 3000);

                        var expInThisLevel = self.player.experience - Types.expForLevel[self.player.level-1];
                        var expForLevelUp = Types.expForLevel[self.player.level] - Types.expForLevel[self.player.level-1];
                        var expPercentThisLevel = (100*expInThisLevel/expForLevelUp);

                        //var mobName = Types.getKindAsString(kind);

                    });
                    self.client.onWanted(function (id, isWanted) {
                        var player = self.getEntityById(id);
                        if(player && (player instanceof Player)) {
                            player.isWanted = isWanted;
                        }
                    });
                    self.client.onBank(function (bankNumber, itemKind, itemNumber,
                                                 itemSkillKind, itemSkillLevel)
                    {
                        //alert("onBank - bankNumber="+bankNumber+",itemKind="+itemKind);
                        self.bankHandler.setBank(bankNumber, itemKind, itemNumber, itemSkillKind, itemSkillLevel);
                        self.bankDialog.bankFrame.open();
                    });

                    self.client.onPartyInvite(function (id) {

                        var invitee = self.getEntityById(id);

                        self.partyHandler.inviteconfirm(invitee);

                    });

                    self.client.onPlayerChangeHealth(function(points, isRegen) {
                        var player = self.player,
                            diff,
                            isHurt;

                        if(player && !player.isDead) {
                            isHurt = points <= player.hitPoints;
                            diff = points - player.hitPoints;
                            player.hitPoints = points;

                            // If they have healing Items then auto use them.
                            if (player.hitPoints < (player.maxHitPoints * 0.2)) {
                                var potions = [
                                    401,
                                    36,
                                    35
                                ];

                                var slot;
                                for(var i = 0; i < potions.length; ++i)
                                {
                                    slot = self.inventoryHandler.getItemInventorSlotByKind(potions[i]);
                                    if (slot >= 0)
                                        self.eat(slot);
                                }
                            }

                            if(player.hitPoints <= 0) {
                                player.die();
                                return;
                            }

                            if(isHurt) {
                                player.hurt();
                                self.infoManager.addDamageInfo(diff, player.x, player.y - 15, "received");
                                self.audioManager.playSound("hurt");


                                if(self.playerhurt_callback) {
                                    self.playerhurt_callback();
                                }
                            } else if(!isRegen){
                                self.infoManager.addDamageInfo("+"+diff, player.x, player.y - 15, "healed");
                            }
                            self.updateBars();
                        }
                    });

                    self.client.onPlayerPoints(function(maxHp, maxMana, currentHp, currentMana) {
                        log.info("Received Player Points: " + currentHp);
                        self.player.maxHitPoints = maxHp;
                        self.player.maxMana = maxMana;
                        self.player.hitPoints = currentHp;
                        self.player.mana = currentMana;

                        self.updateBars();
                    });

                    self.client.onPlayerEquipItem(function(playerId, itemKind) {
                        var player = self.getEntityById(playerId);

                        //alert("itemKind:"+itemKind);
                        var itemName;
                        if (itemKind == -1) { // Unequip Weapon
                            player.setAtkRange(1);
                            player.kind = 1;
                            player.setWeaponName(null);
                            return;
                        }
                        else if (itemKind == -2) // Unequip Armor
                        {
                            player.switchArmor('clotharmor', self.sprites['clotharmor']);
                            return;
                        }

                        itemName = ItemTypes.getKindAsString(itemKind);

                        if(player) {
                            if(ItemTypes.isArmor(itemKind) || ItemTypes.isArcherArmor(itemKind)) {
                                player.switchArmor(itemName, self.sprites[itemName]);
                                if(self.player.id === player.id){
                                    self.audioManager.playSound("loot");
                                }
                            } else if(ItemTypes.isWeapon(itemKind) || ItemTypes.isArcherWeapon(itemKind)) {
                                player.switchWeapon(itemName, self.sprites[itemName]);
                                if(self.player.id === player.id){
                                    self.audioManager.playSound("loot");
                                }
                            } else if(ItemTypes.isBenef(itemKind)){
                                player.setBenef(itemKind);
                                if(self.player.id === player.id){

                                    self.audioManager.playSound("firefox");
                                }
                            } else if(ItemTypes.isConsumableItem(itemKind)){
                                player.setConsumable(itemKind);
                            }
                        }
                    });

                    self.client.onPlayerTeleport(function(id, x, y) {

                        var entity = null,
                            currentOrientation;

                        if (id == self.playerId) {

                            self.player.setGridPosition(x, y);
                            self.player.nextGridX = x;
                            self.player.nextGridY = y;

                            self.resetZone();

                            self.player.forEachAttacker(function(attacker) {
                                attacker.disengage();
                                attacker.idle();
                            });

                            self.updatePlateauMode();

                            self.camera.setRealCoords();

                            self.renderer.drawBackground(self.renderer.background, "#12100D");
                            self.renderbackground = true;
                            self.renderer.forceRedraw = true;

                            if (self.renderer.mobile || self.renderer.tablet)
                                this.renderer.clearScreen(this.renderer.context);


                            for (var i = 0; i < self.player.pets.length; ++i) {
                                var pet = self.player.pets[i];
                                pet.path = null;
                                pet.setGridPosition(x, y);
                            }

                            self.unregisterEntityPosition(self.player);
                            self.registerEntityPosition(self.player);
                        } else {
                            entity = self.getEntityById(id);

                            if(entity) {
                                currentOrientation = entity.orientation;

                                self.makeCharacterTeleportTo(entity, x, y);
                                entity.setOrientation(currentOrientation);

                                entity.forEachAttacker(function(attacker) {
                                    attacker.disengage();
                                    attacker.idle();
                                    attacker.stop();
                                });
                            }
                        }
                    });

                    self.client.onDropItem(function(item, mobId) {
                        var pos = self.getEntityById(mobId);

                        if(pos) {
                            self.addItem(item, pos.gridX, pos.gridY);
                            self.updateCursor();
                        }
                    });

                    self.client.onChatMessage(function(entityId, message) {
                        if(!self.chathandler.processReceiveMessage(entityId, message)){
                            var entity = self.getEntityById(entityId);
                            self.createBubble(entityId, message);
                            self.assignBubbleTo(entity);
                            self.chathandler.addNormalChat(entity, message);
                            if (entity.name == "Tachyon") {
                                self.renderer.setNightMode();
                                log.info("Setting night mode");
                            }
                        }
                        self.audioManager.playSound("chat");
                    });

                    self.client.onPopulationChange(function(worldPlayers, totalPlayers) {
                        if(self.nbplayers_callback) {
                            self.nbplayers_callback(worldPlayers, totalPlayers);
                        }
                    });

                    self.client.onDisconnected(function(message) {
                        if(self.player) {
                            self.player.die();
                        }
                        if(self.disconnect_callback) {
                            self.disconnect_callback(message);
                        }
                        for(var index = 0; index < self.dialogs.length; index++) {
                            self.dialogs[index].hide();
                        }
                    });
                    self.client.onAchievement(function(data){
                        self.achievementHandler.handleAchievement(data);
                    });
                    self.client.onInventory(function(inventoryNumber, itemKind, itemNumber, itemSkillKind, itemSkillLevel){
                        //self.shopHandler.initSellInventory();
                        //alert("onInventory - inventoryNumber="+inventoryNumber+",itemKind="+itemKind);
                        if(itemKind){
                            self.inventoryHandler.setInventory(itemKind, inventoryNumber, itemNumber, itemSkillKind, itemSkillLevel, this.scale);
                        } else if(itemKind === null){
                            self.inventoryHandler.makeEmptyInventory(inventoryNumber);
                        }
                        if (self.bankDialog.visible)
                            self.bankDialog.inventoryFrame.open();
                    });
                    self.client.onTalkToNPC(function(npcKind, achievementId, isCompleted){
                        var npc = self.getEntityByKind(npcKind);
                        if (isCompleted)
                        {
                            var achievement = self.achievementHandler.getNPCAchievement(achievementId);
                            var msg = npc.talk(achievement, true);
                            if(msg) {
                                self.createBubble(npc.id, msg);
                                self.assignBubbleTo(npc);
                                self.audioManager.playSound("npc");
                                setTimeout(function () {
                                    self.destroyBubble(npc.id);
                                    self.audioManager.playSound("npc-end");
                                }, 5000);
                            }
                            //} else {

                            //    self.destroyBubble(npc.id);
                            //    self.audioManager.playSound("npc-end");
                            //}

                        }
                    });
                    self.client.onNotify(function(msg){
                        self.showNotification(msg);
                    });

                    self.client.onCharacterInfo(function(datas) {
                        self.characterDialog.show(datas);
                    });
                    /*
                     self.client.onRanking(function(message){
                     self.rankingHandler.handleRanking(message);
                     });
                     */

                    self.client.onParty(function (members) {
                        self.partyHandler.setMembers(members);
                    });

                    self.client.onMana(function(mana, maxMana) {
                        self.player.mana = mana;
                        self.player.maxMana = maxMana;
                        self.updateBars();
                    });
                    self.client.onShop(function(message){
                        self.shopHandler.handleShop(message);
                    });

                    self.client.onAuction(function(message){
                        var type = message[0];
                        var itemCount = message[1];

                        if (!itemCount || itemCount == 0) {
                            if (type >= 2)
                            {
                                self.auctionDialog.storeFrame.pages[type-1].items=null;
                                self.auctionDialog.storeFrame.pages[type-1].reload();
                            }
                            else
                            {
                                self.auctionDialog.storeFrame.pages[0].items=null;
                                self.auctionDialog.storeFrame.pages[0].reload();
                            }
                            return;
                        }

                        var itemData = [];
                        for (var i = 0; i < itemCount; ++i)
                        {
                            itemData.push({
                                index: message[2+(i*7)],
                                kind: message[3+(i*7)],
                                player: message[4+(i*7)],
                                count: message[5+(i*7)],
                                skillKind: message[6+(i*7)],
                                skillLevel: message[7+(i*7)],
                                buy: message[8+(i*7)]
                            });
                        }
                        if (itemData.length > 0 && type >= 2)
                        {
                            //log.info(JSON.stringify(itemData));
                            self.auctionDialog.storeFrame.pages[type-1].setItems(itemData);
                            self.auctionDialog.storeFrame.pages[type-1].reload();
                        }
                        else
                        {
                            self.auctionDialog.storeFrame.pages[0].setItems(itemData);
                            self.auctionDialog.storeFrame.pages[0].reload();
                        }
                    });

                    self.client.onSkill(function(message){
                        var msgType = message[0];
                        var id = message[1];
                        var skillLevel = message[2];
                        var entity = self.getEntityById(id);
                        if(entity){
                            if(msgType === "critical"){
                                entity.isCritical = true;
                            } else if(msgType === "heal"){
                                entity.isHeal = true;
                            } else if(msgType === "flareDance"){
                                entity.isFlareDance = true;
                            } else if(msgType === "flareDanceOff"){
                                entity.isFlareDance = false;
                            } else if(msgType === "stun"){
                                entity.stun(skillLevel);
                            } else if(msgType === "superCat"){
                                entity.isSuperCat = true;
                                if(skillLevel === 1){
                                    entity.moveSpeed -= 30;
                                } else if(skillLevel === 2){
                                    entity.moveSpeed -= 40;
                                }
                            } else if(msgType === "superCatOff"){
                                entity.isSuperCat = false;
                                entity.moveSpeed = 120;
                            } else if(msgType === "provocation"){
                                entity.provocation(skillLevel);
                            }
                        }
                    });

                    self.client.onSkillInstall(function(datas) {
                        //self.player.setSkill(datas[1], datas[2]);
                        self.player.skillHandler.install(datas[0], datas[1]);
                    });

                    self.client.onSkillLoad(function(datas) {
                        var skillIndex = datas[0];
                        var skillName = datas[1];
                        var skillLevel = datas[2];

                        self.player.setSkill(skillName, skillLevel, skillIndex);
                        self.characterDialog.frame.pages[1].setSkill(skillName, skillLevel);

                    });

                    self.client.onClassSwitch(function (pClass) {
                        self.player.setClass(parseInt(pClass));
                    });

                    self.gamestart_callback();

                    if(self.hasNeverStarted) {
                        self.start();
                        started_callback({success: true});
                    }
                });
                this.client.connection.emit('html_client');
                log.info("onWelcome - loaded");
            },

            initializeAchievements: function() {
                var self = this;
                self.app.initAchievementList(self.achievementHandler.achievements);
                self.app.initUnlockedAchievements(self.achievementHandler.achievements);
            },

            /**
             * Links two entities in an attacker<-->target relationship.
             * This is just a utility method to wrap a set of instructions.
             *
             * @param {Entity} attacker The attacker entity
             * @param {Entity} target The target entity
             */
            createAttackLink: function(attacker, target) {
                if(attacker.hasTarget()) {
                    attacker.removeTarget();
                }
                attacker.engage(target);

                if(attacker.id !== this.playerId) {
                    target.addAttacker(attacker);
                }
            },

            /**
             * Converts the current mouse position on the screen to world grid coordinates.
             * @returns {Object} An object containing x and y properties.
             */
            getMouseGridPosition: function() {
                this.camera.setRealCoords();
                var r = this.renderer,
                    c = this.camera,
                    mx = this.mouse.x,
                    my = this.mouse.y,
                    s = r.scale,
                    ts = r.tilesize,
                    tss = (ts * s),
                    offsetX = mx % tss,
                    offsetY = my % tss,
                    x = ((mx - offsetX) / tss) + c.gridX,
                    y = ((my - offsetY) / tss) + c.gridY;
                //alert(zoom);
                return { x: x, y: y };
            },

            /**
             * Moves a character to a given location on the world grid.
             *
             * @param {Number} x The x coordinate of the target location.
             * @param {Number} y The y coordinate of the target location.
             */
            makeCharacterGoTo: function(character, x, y) {
                if(!this.map.isOutOfBounds(x, y)) {
                    character.go(x, y);
                }
            },

            /**
             *
             */
            makeCharacterTeleportTo: function(character, x, y) {
                if(!this.map.isOutOfBounds(x, y)) {
                    this.unregisterEntityPosition(character);

                    character.setGridPosition(x, y);
                    if (character.pets)
                    {
                        for(var i=0; i < character.pets.length; ++i)
                        {
                            var pet = character.pets[i];
                            pet.setGridPosition(x,y);
                        }
                    }

                    this.registerEntityPosition(character);
                    this.assignBubbleTo(character);
                } else {
                    log.debug("Teleport out of bounds: "+x+", "+y);
                }
            },
            makePlayerAttackNext: function()
            {

                pos = {
                    x: this.player.gridX,
                    y: this.player.gridY
                };
                switch(this.player.orientation)
                {
                    case Types.Orientations.DOWN:
                        pos.y += 1;
                        this.makePlayerAttackTo(pos);
                        break;
                    case Types.Orientations.UP:
                        pos.y -= 1;
                        this.makePlayerAttackTo(pos);
                        break;
                    case Types.Orientations.LEFT:
                        pos.x -= 1;
                        this.makePlayerAttackTo(pos);
                        break;
                    case Types.Orientations.RIGHT:
                        pos.x += 1;
                        this.makePlayerAttackTo(pos);
                        break;

                    default:
                        break;
                }
            },

            /**
             *
             */
            makePlayerAttackTo: function(pos)
            {
                entity = this.getEntityAt(pos.x, pos.y);
                if(entity instanceof Mob) {
                    this.makePlayerAttack(entity);
                }
            },

            /**
             * Moves the current player to a given target location.
             * @see makeCharacterGoTo
             */
            makePlayerGoTo: function(x, y) {
                this.makeCharacterGoTo(this.player, x, y);
            },

            /**
             * Moves the current player towards a specific item.
             * @see makeCharacterGoTo
             */
            makePlayerGoToItem: function(item) {
                if(item) {
                    this.player.isLootMoving = true;
                    this.makePlayerGoTo(item.gridX, item.gridY);
                    this.client.sendLootMove(item, item.gridX, item.gridY);
                }
            },

            /**
             *
             */
            makePlayerTalkTo: function(npc) {
                if(npc) {
                    this.player.setTarget(npc);
                    this.player.follow(npc);
                }
            },

            makePlayerOpenChest: function(chest) {
                if(chest) {
                    this.player.setTarget(chest);
                    this.player.follow(chest);
                }
            },

            /**
             *
             */
            makePlayerAttack: function(mob) {
                this.createAttackLink(this.player, mob);
                this.client.sendAttack(mob);
            },

            /**
             *
             */
            makeNpcTalk: function(npc) {
                var msg;
                if (!this.player.isAdjacentNonDiagonal(npc))
                    return;

                var msg;
                if(npc) {
                    if(NpcData.Kinds[npc.kind].name==="Shop")
                    {
                        this.storeDialog.show();
                    } else if (NpcData.Kinds[npc.kind].name==="Bank") {
                        this.bankDialog.show();
                    } else if (NpcData.Kinds[npc.kind].name==="Enchant") {
                        this.enchantDialog.show();
                    } else if (NpcData.Kinds[npc.kind].name==="Auction") {
                        this.auctionDialog.show();
                    } else if (NpcData.Kinds[npc.kind].name==="King") {
                        this.classPopupMenu.open();
                    } else if (NpcData.Kinds[npc.kind].name==="Coder") {
                        this.craftDialog.show();
                    } else {
                        msg = this.achievementHandler.talkToNPC(npc);
                        this.previousClickPosition = {};
                        if (msg) {

                            this.createBubble(npc.id, msg);
                            this.assignBubbleTo(npc);
                            this.audioManager.playSound("npc");
                        }
                        else {
                            this.destroyBubble(npc.id);
                            this.audioManager.playSound("npc-end");
                        }
                    }
                    this.player.removeTarget();
                }
            },


            /**
             * Loops through all the entities currently present in the game.
             * @param {Function} callback The function to call back (must accept one entity argument).
             */
            forEachEntity: function(callback) {
                _.each(this.entities, function(entity) {
                    callback(entity);
                });
            },

            /**
             * Same as forEachEntity but only for instances of the Mob subclass.
             * @see forEachEntity
             */
            forEachMob: function(callback) {
                _.each(this.entities, function(entity) {
                    if(entity instanceof Mob && !(entity instanceof Pet)) {
                        callback(entity);
                    }
                });
            },

            /**
             * Loops through all entities visible by the camera and sorted by depth :
             * Lower 'y' value means higher depth.
             * Note: This is used by the Renderer to know in which order to render entities.
             */

            forEachVisibleEntityByDepth: function(callback) {
                var self = this,
                    m = this.map;

                this.camera.forEachVisibleValidPosition(function(x, y) {
                    if(self.renderingGrid[y][x]) {
                        _.each(self.renderingGrid[y][x], function(entity) {
                            callback(entity);
                        });
                    }
                }, this.renderer.mobile ? 1 : 2, m);

            },

            /**
             *
             */
            forEachVisibleTileIndex: function(callback, extra, optimized) {
                var m = this.map;

                if (optimized)
                {
                    this.camera.forEachNewTile(function(x, y) {
                        callback(m.GridPositionToTileIndex(x, y) - 1);
                    }, extra, m);
                }
                else
                {
                    this.camera.forEachVisibleValidPosition(function(x, y) {
                        callback(m.GridPositionToTileIndex(x, y) - 1);
                    }, extra, m);
                }
            },

            /**
             *
             */

            forEachVisibleTile: function(callback, extra, optimized) {
                var self = this,
                    m = this.map;

                if(m.isLoaded) {
                    this.forEachVisibleTileIndex(function(tileIndex) {
                        if(_.isArray(m.data[tileIndex])) {
                            _.each(m.data[tileIndex], function(id) {
                                callback(id-1, tileIndex);
                            });
                        }
                        else {
                            if(_.isNaN(m.data[tileIndex]-1)) {
                                //throw Error("Tile number for index:"+tileIndex+" is NaN");
                            } else {
                                callback(m.data[tileIndex]-1, tileIndex);
                            }
                        }
                    }, extra, optimized);
                }
            },

            /**
             *
             */
            forEachAnimatedTile: function(callback) {
                if(this.animatedTiles) {
                    _.each(this.animatedTiles, function(tile) {
                        callback(tile);
                    });
                }
            },

            /**
             * Returns the entity located at the given position on the world grid.
             * @returns {Entity} the entity located at (x, y) or null if there is none.
             */
            getEntityAt: function(x, y) {
                if(this.map.isOutOfBounds(x, y) || !this.entityGrid) {
                    return null;
                }

                var entities = this.entityGrid[y][x],
                    entity = null;
                if(_.size(entities) > 0) {
                    entity = entities[_.keys(entities)[0]];
                } else {
                    entity = this.getItemAt(x, y);
                }
                return entity;
            },

            getEntityByName: function (name) {
                var entity;
                $.each(this.entities, function (i, v) {
                    if (v instanceof Player && v.name.toLowerCase() == name.toLowerCase())
                    {
                        entity = v;
                        return false;
                    }
                });
                return entity;
            },

            getMobAt: function(x, y) {
                var entity = this.getEntityAt(x, y);
                if(entity && (entity instanceof Mob && !(entity instanceof Pet))) {
                    return entity;
                }
                return null;
            },

            getPlayerAt: function(x, y) {
                var entity = this.getEntityAt(x, y);
                if(entity && (entity instanceof Player) && (entity !== this.player)) {
                    return entity;
                }
                return null;
            },

            getNpcAt: function(x, y) {
                var entity = this.getEntityAt(x, y);
                if(entity && (entity instanceof Npc)) {
                    return entity;
                }
                return null;
            },

            getChestAt: function(x, y) {
                var entity = this.getEntityAt(x, y);
                if(entity && (entity instanceof Chest)) {
                    return entity;
                }
                return null;
            },

            getItemAt: function(x, y) {
                if(this.map.isOutOfBounds(x, y) || !this.itemGrid) {
                    return null;
                }
                var items = this.itemGrid[y][x],
                    item = null;

                if(_.size(items) > 0) {
                    // If there are potions/burgers stacked with equipment items on the same tile, always get expendable items first.
                    _.each(items, function(i) {
                        if(ItemTypes.isExpendableItem(i.kind)) {
                            item = i;
                        };
                    });

                    // Else, get the first item of the stack
                    if(!item) {
                        item = items[_.keys(items)[0]];
                    }
                }
                return item;
            },

            /**
             * Returns true if an entity is located at the given position on the world grid.
             * @returns {Boolean} Whether an entity is at (x, y).
             */
            isEntityAt: function(x, y) {
                return !_.isNull(this.getEntityAt(x, y));
            },

            isMobAt: function(x, y) {
                return !_.isNull(this.getMobAt(x, y));
            },
            isPlayerAt: function(x, y) {
                return !_.isNull(this.getPlayerAt(x, y));
            },

            isItemAt: function(x, y) {
                return !_.isNull(this.getItemAt(x, y));
            },

            isNpcAt: function(x, y) {
                return !_.isNull(this.getNpcAt(x, y));
            },

            isChestAt: function(x, y) {
                return !_.isNull(this.getChestAt(x, y));
            },

            /**
             * Finds a path to a grid position for the specified character.
             * The path will pass through any entity present in the ignore list.
             */
            findPath: function(character, x, y, ignoreList) {
                var self = this,
                    grid = this.pathingGrid,
                    path = [],
                    isPlayer = (character === this.player);

                if(this.map.isColliding(x, y)) {
                    self.renderer.forceRedraw = true;
                    return path;
                }

                if(this.pathfinder && character) {
                    if(ignoreList) {
                        _.each(ignoreList, function(entity) {
                            self.pathfinder.ignoreEntity(entity);
                        });
                    }

                    path = this.pathfinder.findPath(grid, character, x, y, false);

                    if(ignoreList) {
                        this.pathfinder.clearIgnoreList();
                    }
                } else {
                    log.error("Error while finding the path to "+x+", "+y+" for "+character.id);
                }
                return path;
            },

            /**
             * Toggles the visibility of the pathing grid for debugging purposes.
             */
            togglePathingGrid: function() {
                if(this.debugPathing) {
                    this.debugPathing = false;
                } else {
                    this.debugPathing = true;
                }
            },

            /**
             * Toggles the visibility of the FPS counter and other debugging info.
             */
            toggleDebugInfo: function() {
                if(this.renderer && this.renderer.isDebugInfoVisible) {
                    this.renderer.isDebugInfoVisible = false;
                } else {
                    this.renderer.isDebugInfoVisible = true;
                }
            },

            /**
             *
             */
            movecursor: function() {
                var mouse = this.getMouseGridPosition(),
                    x = mouse.x,
                    y = mouse.y;

                this.cursorVisible = true;

                if(this.player && !this.renderer.mobile && !this.renderer.tablet) {
                    this.hoveringCollidingTile = this.map.isColliding(x, y) && !this.map.isDoor(x,y);
                    this.hoveringPlateauTile = this.player.isOnPlateau ? !this.map.isPlateau(x, y) : this.map.isPlateau(x, y);
                    this.hoveringMob = this.isMobAt(x, y);
                    this.hoveringPlayer = this.isPlayerAt(x, y);
                    this.hoveringItem = this.isItemAt(x, y);
                    this.hoveringNpc = this.isNpcAt(x, y);
                    this.hoveringOtherPlayer = this.isPlayerAt(x, y);
                    this.hoveringChest = this.isChestAt(x, y);

                    if(this.hoveringMob || this.hoveringPlayer || this.hoveringNpc || this.hoveringChest || this.hoveringOtherPlayer || this.hoveringItem) {
                        var entity = this.getEntityAt(x, y);

                        this.player.showTarget(entity);
                        if(!entity.isHighlighted && this.renderer.supportsSilhouettes) {
                            if(this.lastHovered) {
                                this.lastHovered.setHighlight(false);
                            }
                            entity.setHighlight(true);
                        }
                        this.lastHovered = entity;
                    }
                    else if(this.lastHovered) {
                        this.lastHovered.setHighlight(null);
                        if(this.timeout === undefined && !this.player.hasTarget()) {
                            var self = this;
                            this.timeout = setTimeout(function(){
                                $('#inspector').fadeOut('fast');
                                $('#inspector .health').text('');
                                self.player.inspecting = null;
                            }, 200);
                            this.timeout = undefined;
                        }
                        this.lastHovered = null;
                    }
                }
            },

            /**
             * Moves the player one space, if possible
             */
            keys: function(pos, orientation) {
                this.hoveringCollidingTile = false;
                this.hoveringPlateauTile = false;

                if((pos.x === this.previousClickPosition.x
                    && pos.y === this.previousClickPosition.y)) {
                    return;
                } else {
                    if(!this.player.disableKeyboardNpcTalk)
                        this.previousClickPosition = pos;
                }

                if(!this.player.isMoving()) {
                    this.cursorVisible = false;
                    this.processInput(pos);
                }
            },

            click: function() {
                var pos = this.getMouseGridPosition();
                var entity;

                //this.inventoryHandler.hideAllInventory();
                this.playerPopupMenu.close();

                for(var i = 0; i < this.dialogs.length; i++) {
                    if(this.dialogs[i].visible){
                        this.dialogs[i].hide();
                    }
                }

                if (this.menu.selectedEquipped !== null)
                {
                    var clickedMenu = this.menu.isClickedInventoryMenu(pos, this.camera);
                    var equippedNumber = this.menu.selectedEquipped;
                    if(clickedMenu === 2){
                        if (equippedNumber) {
                            this.unequip(equippedNumber);
                            this.menu.close();
                        }
                        return;

                    }
                    else if(clickedMenu === 1){
                        if (equippedNumber) {
                            this.client.sendInventory("empty", -equippedNumber, 1);
                            this.menu.close();
                        }
                        return;
                    } else{
                        this.menu.close();
                    }
                }
                else if(this.menu.selectedInventory !== null){
                    var inventoryNumber = this.menu.selectedInventory;
                    var clickedMenu = this.menu.isClickedInventoryMenu(pos, this.camera);
                    var itemKind = this.inventoryHandler.inventory[inventoryNumber];


                    if(clickedMenu === 4){
                        if(itemKind === 200){
                            this.enchantPendant(inventoryNumber);
                            this.menu.close();
                        }
                        return;
                    } else if(clickedMenu === 3
                        && itemKind !== 39
                        && itemKind !== 306
                        && itemKind !== 173
                        && itemKind !== 400)
                    {
                        if(ItemTypes.isConsumableItem(itemKind)) {
                            this.healShortCut = inventoryNumber === this.healShortCut ? -1 : inventoryNumber;
                            this.menu.close();
                        } else if(itemKind === 200){
                            this.enchantRing(inventoryNumber);
                            this.menu.close();
                        }
                        return;
                    } else if(clickedMenu === 2
                        && itemKind !== 39
                        && itemKind !== 173
                        && itemKind !== 400)
                    {
                        if(ItemTypes.isConsumableItem(itemKind)){
                            this.eat(inventoryNumber);
                            return;
                        } else if(itemKind === 200){
                            this.enchantWeapon(inventoryNumber);
                            return;
                        } else if(itemKind === 306){
                            this.enchantBloodsucking(inventoryNumber);
                            return;
                        } else{
                            this.equip(inventoryNumber);
                            return;
                        }
                    } else if(clickedMenu === 1) {
                        this.menu.close();
                        this.dropItem(inventoryNumber);
                        return;
                    } else{
                        this.menu.close();
                    }
                } else {
                    this.menu.close();
                }



                /*if(pos.x === this.previousClickPosition.x
                 && pos.y === this.previousClickPosition.y) {
                 return;
                 } else {
                 this.previousClickPosition = pos;
                 }*/

                this.processInput(pos);
            },

            dropItem: function(inventoryNumber) {
                var itemKind = this.inventoryHandler.inventory[inventoryNumber];
                if((ItemTypes.isConsumableItem(itemKind) || ItemTypes.isGold(itemKind)) &&
                    (this.inventoryHandler.inventoryCount[inventoryNumber] > 1))
                {
                    $('#dropCount').val(this.inventoryHandler.inventoryCount[inventoryNumber]);
                    this.app.showDropDialog(inventoryNumber);
                } else {
                    this.client.sendInventory("empty", inventoryNumber, 1);
                    this.inventoryHandler.makeEmptyInventory(inventoryNumber);
                }
            },


            rightClick: function() {
                var pos = this.getMouseGridPosition();

                if(pos.x === this.camera.gridX+this.camera.gridW-2
                    && pos.y === this.camera.gridY+this.camera.gridH-1){
                    if(this.inventoryHandler.inventory[0]){
                        if(ItemTypes.isConsumableItem(this.inventoryHandler.inventory[0]))
                            this.eat(0);
                    }
                    return;
                } else if(pos.x === this.camera.gridX+this.camera.gridW-1
                    && pos.y === this.camera.gridY+this.camera.gridH-1){
                    if(this.inventoryHandler.inventory[1]){
                        if(ItemTypes.isConsumableItem(this.inventoryHandler.inventory[1]))
                            this.eat(1);
                    }
                } else {
                    if((this.healShortCut >= 0) && this.inventoryHandler.inventory[this.healShortCut]) {
                        if(ItemTypes.isConsumableItem(this.inventoryHandler.inventory[this.healShortCut]))
                            this.eat(this.healShortCut);
                    }
                }
            },
            /**
             * Processes game logic when the user triggers a click/touch event during the game.
             */
            processInput: function(pos) {
                var entity;

                if (this.started && this.player && !this.player.isDead)
                {
                    if (this.activeCircle)
                    {
                        var inv = this.getCircleSelected(this.mouse.x, this.mouse.y);
                        if (inv) {
                            log.info(inv.item)
                            log.info(inv.index)
                            if (ItemTypes.isArmor(inv.item) || ItemTypes.isArcherArmor(inv.item))
                            {

                                this.equip(inv.index);
                            }
                            else if (ItemTypes.isWeapon(inv.item) || ItemTypes.isArcherWeapon(inv.item))
                            {
                                this.equip(inv.index);
                            }
                            else if (ItemTypes.isConsumableItem(inv.item))
                            {
                                this.eat(inv.index);
                            }
                            this.activeCircle = null;
                            this.showInventory = 0;
                            return;
                        }
                        else
                            this.activeCircle = null;
                    }
                }

                if(this.started
                    && this.player
                        //&& !this.isZoning()
                        //&& !this.isZoningTile(this.player.nextGridX, this.player.nextGridY)
                    && !this.player.isDead
                    && !this.hoveringCollidingTile
                    && !this.hoveringPlateauTile) {
                    entity = this.getEntityAt(pos.x, pos.y);

                    if(entity === this.player && (!this.renderer.mobile || !this.renderer.tablet)) {
                        this.showInventory = ++this.showInventory % 4;
                        if (this.showInventory == 1)
                            this.makeConsumablesCircle();
                        else if (this.showInventory == 2)
                            this.makeWeaponsCircle();
                        else if (this.showInventory == 3)
                            this.makeArmorsCircle();
                        else
                            this.activeCircle = null;
                    }

                    if (this.map.isDoor(pos.x,pos.y))
                    {
                        this.makePlayerGoTo(pos.x, pos.y);
                        return;
                    }
                    if (entity instanceof Entity)
                        this.renderer.forceRedraw = true;

                    if (entity instanceof Pet)
                    {
                        this.makePlayerGoTo(pos.x, pos.y);
                        return;
                    }
                    if(entity instanceof Player && entity !== this.player && (!this.player.pvpFlag || !this.pvpFlag) && !this.map.isDoor(entity.gridX,entity.gridY)){
                        this.playerPopupMenu.click(entity);
                    } else if((entity instanceof Mob) && !(entity instanceof Pet) || (entity instanceof Player && entity !== this.player && (this.player.pvpFlag && this.pvpFlag))) {
                        this.makePlayerAttack(entity);
                    } else if(entity instanceof Item) {
                        this.makePlayerGoToItem(entity);
                    } else if(entity instanceof Npc) {

                        if(this.player.isAdjacentNonDiagonal(entity) === false) {
                            this.makePlayerTalkTo(entity);
                        } else {
                            if(!this.player.disableKeyboardNpcTalk) {
                                this.makeNpcTalk(entity);

                                if(this.player.moveUp || this.player.moveDown || this.player.moveLeft || this.player.moveRight)
                                    this.player.disableKeyboardNpcTalk = true;
                            }
                        }
                    } else if(entity instanceof Chest) {
                        this.makePlayerOpenChest(entity);
                    } else if(entity instanceof Gather) {
                        if (this.player.isAdjacentNonDiagonal(entity) === true) {
                            this.client.sendGather(entity.id);
                        }

                    } else if (!this.joystick || ((this.renderer.tablet || this.renderer.mobile) && this.joystick.isActive())) {
                        this.makePlayerGoTo(pos.x, pos.y);

                    }
                }
            },

            isMobOnSameTile: function(mob, x, y) {
                var X = x || mob.gridX,
                    Y = y || mob.gridY,
                    list = this.entityGrid[Y][X],
                    result = false;

                _.each(list, function(entity) {
                    if(entity instanceof Mob && !(entity instanceof Pet) && entity.id !== mob.id) {
                        result = true;
                    }
                });
                return result;
            },

            getFreeAdjacentNonDiagonalPosition: function(entity) {
                var self = this,
                    result = null;

                entity.forEachAdjacentNonDiagonalPosition(function(x, y, orientation) {
                    if(!result && !self.map.isColliding(x, y) && !self.isMobAt(x, y)) {
                        result = {x: x, y: y, o: orientation};
                    }
                });
                return result;
            },

            tryMovingToADifferentTile: function(character) {
                var attacker = character,
                    target = character.target;


                if(attacker && target && target instanceof Player && attacker instanceof Mob && !(attacker instanceof Pet)) {
                    this.forEachEntityAround(attacker.gridX,attacker.gridY, 1, function (e) {
                        //log.info("fe pos ("+attacker.gridX+","+attacker.gridY+")");
                        //log.info("fe e.next ("+e.nextGridX+","+e.nextGridY+")");
                        if (attacker.nextGridX == e.nextGridX &&
                            attacker.nextGridY == e.nextGridY)
                        {
                            return false;
                        }
                    });

                    if (!target.isMoving() && attacker.getDistanceToEntity(target) === 0) {
                        var pos;

                        switch(target.orientation) {
                            case Types.Orientations.UP:
                                pos = {x: target.gridX, y: target.gridY - 1, o: target.orientation}; break;
                            case Types.Orientations.DOWN:
                                pos = {x: target.gridX, y: target.gridY + 1, o: target.orientation}; break;
                            case Types.Orientations.LEFT:
                                pos = {x: target.gridX - 1, y: target.gridY, o: target.orientation}; break;
                            case Types.Orientations.RIGHT:
                                pos = {x: target.gridX + 1, y: target.gridY, o: target.orientation}; break;
                        }

                        if(pos && !(attacker instanceof Pet)) {
                            // TODO - Preventing Mobs and Players standing on same tile
                            attacker.previousTarget = target;
                            attacker.disengage();
                            attacker.idle();

                            this.makeCharacterGoTo(attacker, pos.x, pos.y);
                            target.adjacentTiles[pos.o] = true;

                            return true;
                        }
                    }

                    if(!target.isMoving() && attacker.isAdjacentNonDiagonal(target) && this.isMobOnSameTile(attacker)) {
                        var pos = this.getFreeAdjacentNonDiagonalPosition(target);

                        // avoid stacking mobs on the same tile next to a player
                        // by making them go to adjacent tiles if they are available
                        if(pos && !target.adjacentTiles[pos.o]) {
                            if(this.player && this.player.target && attacker.id === this.player.target.id) {
                                return false; // never unstack the player's target
                            }

                            attacker.previousTarget = target;
                            attacker.disengage();
                            attacker.idle();
                            this.makeCharacterGoTo(attacker, pos.x, pos.y);
                            target.adjacentTiles[pos.o] = true;

                            return true;
                        }
                    }
                }
                return false;
            },


            /**
             *
             */
            onCharacterUpdate: function(character) {
                var time = this.currentTime,
                    self = this;

                if (character instanceof Pet)
                {
                    //var player = self.getEntityById(character.playerId);
                    //if (player && player.target)
                    //	    character.target = player.target;
                    if (character.target && !character.target.isDead)
                    {
                        if (character.isNear(character.target,1)) {
                            character.lookAtTarget();
                            character.hit();
                        }
                        character.follow(character.target);
                    }
                }

                // If mob has finished moving to a different tile in order to avoid stacking, attack again from the new position.
                if(character.previousTarget && !character.isMoving() && character instanceof Mob && !(character instanceof Pet)) {
                    var t = character.previousTarget;

                    if(this.getEntityById(t.id)) { // does it still exist?
                        character.previousTarget = null;
                        this.createAttackLink(character, t);
                        return;
                    }
                }

                if(!character.isStunned && character.isAttacking() && (!character.previousTarget || character.id === this.playerId)) {
                    var isMoving = this.tryMovingToADifferentTile(character); // Don't let multiple mobs stack on the same tile when attacking a player.

                    if(character.canAttack(time)) {
                        if(!isMoving) { // don't hit target if moving to a different tile.
                            if (character.hasTarget() && character.target instanceof Pet)
                            {

                                log.info("PETTTTT");
                                return;
                            }
                            if(character.hasTarget() && character.getOrientationTo(character.target) !== character.orientation) {
                                character.lookAtTarget();
                            }


                            character.hit();


                            if(character.id === this.playerId) {
                                this.client.sendHit(character.target);

                            }

                            if(character instanceof Player && this.camera.isVisible(character)) {
                                this.audioManager.playSound("hit"+Math.floor(Math.random()*2+1));
                            }
                        }
                    } else {
                        if(character.hasTarget()
                            && character.isDiagonallyAdjacent(character.target)
                            && character.target instanceof Player
                            && !character.target.isMoving())
                        {
                            character.follow(character.target);
                        }
                    }
                }
            },

            /**
             *
             */
            isZoningTile: function(x, y) {
                if (this.player.gridX % 8 === 0 ||
                    this.player.gridY % 8 === 0)
                    return true;
                return false;
            },

            /**
             *
             */
            getZoningOrientation: function(x, y) {
                var orientation = "",
                    c = this.camera;

                x = x - c.gridX;
                y = y - c.gridY;

                if(x === 0) {
                    orientation = Types.Orientations.LEFT;
                }
                else if(y === 0) {
                    orientation = Types.Orientations.UP;
                }
                else if(x === c.gridW-1) {
                    orientation = Types.Orientations.RIGHT;
                }
                else if(y === c.gridH-1) {
                    orientation = Types.Orientations.DOWN;
                }

                return orientation;
            },

            startZoningFrom: function(x, y) {
                this.zoningOrientation = this.getZoningOrientation(x, y);

                if(this.renderer.mobile || this.renderer.tablet) {
                    var z = this.zoningOrientation,
                        c = this.camera,
                        ts = this.renderer.tilesize,
                        x = c.x,
                        y = c.y,
                        xoffset = (c.gridW - 2) * ts,
                        yoffset = (c.gridH - 2) * ts;

                    if(z === Types.Orientations.LEFT || z === Types.Orientations.RIGHT) {
                        x = (z === Types.Orientations.LEFT) ? c.x - xoffset : c.x + xoffset;
                    } else if(z === Types.Orientations.UP || z === Types.Orientations.DOWN) {
                        y = (z === Types.Orientations.UP) ? c.y - yoffset : c.y + yoffset;
                    }
                    //c.setPosition(x, y);

                    this.renderer.clearScreen(this.renderer.context);
                    this.endZoning();

                    // Force immediate drawing of all visible entities in the new zone
                    this.forEachVisibleEntityByDepth(function(entity) {
                        entity.setDirty();
                    });
                }
                else {
                    this.currentZoning = new Transition();
                }
                this.bubbleManager.clean();
                this.client.sendZone();
            },

            enqueueZoningFrom: function(x, y) {
                this.zoningQueue.push({x: x, y: y});

                if(this.zoningQueue.length >= 1) {
                    //var x = this.zoningQueue[0].x;
                    //var y = this.zoningQueue[0].y;
                    this.startZoningFrom(x,y);
                }
            },

            endZoning: function() {
                this.currentZoning = null;
                this.resetZone();
                this.zoningQueue.shift();

                if(this.zoningQueue.length > 0) {
                    var pos = this.zoningQueue[0];
                    this.startZoningFrom(pos.x, pos.y);
                }
            },

            isZoning: function() {
                return !_.isNull(this.currentZoning);
            },

            resetZone: function() {
                this.bubbleManager.clean();
                //this.initAnimatedTiles();
                //this.renderer.renderStaticCanvases();
                this.renderbackground = true;
            },

            resetCamera: function() {
                //this.camera.focusEntity(this.player);
                this.resetZone();
            },

            say: function(message) {
                //All commands must be handled server sided.
                if(!this.chathandler.processSendMessage(message)){
                    this.client.sendChat(message);
                }

            },

            createBubble: function(id, message) {
                this.bubbleManager.create(id, message, this.currentTime);
            },

            destroyBubble: function(id) {
                this.bubbleManager.destroyBubble(id);
            },

            assignBubbleTo: function(character) {
                if (character)
                    var bubble = this.bubbleManager.getBubbleById(character.id);

                if(bubble) {
                    var s = this.renderer.scale,
                        t = 16 * s, // tile size
                        x = ((character.x - this.camera.x) * s),
                        w = parseInt(bubble.element.css('width')) + 24,
                        offset = (w / 2) - (t / 2),
                        offsetY,
                        y;

                    if(character instanceof Npc) {
                        offsetY = 0;
                    } else {
                        if(s === 2) {
                            if(this.renderer.mobile) {
                                offsetY = 0;
                            } else {
                                offsetY = 15;
                            }
                        } else {
                            offsetY = 12;
                        }
                    }

                    y = ((character.y - this.camera.y) * s) - (t * 2) - offsetY;

                    bubble.element.css('left', x - offset + 'px');
                    bubble.element.css('top', y + 'px');
                }
            },

            respawn: function() {
                log.debug("Beginning respawn");

                this.entities = {};
                this.initEntityGrid();
                this.initPathingGrid();
                this.initRenderingGrid();


                this.player = new Player("player", this.username, this);

                this.player.pw = this.userpw;
                this.player.email = this.email;

                this.initPlayer();



                this.started = true;
                this.client.enable();
                this.client.sendLogin(this.player);

                if(this.renderer.mobile || this.renderer.tablet) {
                    this.renderer.clearScreen(this.renderer.context);
                }

                this.client.sendMoveEntity(this.player);

                log.debug("Finished respawn");
            },

            onGameStart: function(callback) {
                this.gamestart_callback = callback;
            },

            onDisconnect: function(callback) {
                this.disconnect_callback = callback;
            },

            onPlayerDeath: function(callback) {
                this.playerdeath_callback = callback;
            },

            onUpdateTarget: function(callback){
                this.updatetarget_callback = callback;
            },
            onPlayerExpChange: function(callback){
                this.playerexp_callback = callback;
            },

            onPlayerHealthChange: function(callback) {
                this.playerhp_callback = callback;
            },

            onPlayerManaChange: function(callback) {

                this.playermana_callback = callback;
            },

            onPlayerHurt: function(callback) {
                this.playerhurt_callback = callback;
            },


            onNbPlayersChange: function(callback) {
                this.nbplayers_callback = callback;
            },
            onGuildPopulationChange: function(callback) {
                this.nbguildplayers_callback = callback;
            },
            onNotification: function(callback) {
                this.notification_callback = callback;
            },

            resize: function() {
                var x = this.camera.x,
                    y = this.camera.y,
                    currentScale = this.renderer.scale,
                    newScale = this.renderer.getScaleFactor();

                this.renderer.rescale(newScale);
                this.camera = this.renderer.camera;

                this.renderer.renderStaticCanvases();
                this.renderbackground = true;

                this.inventoryHandler.inventoryDisplayShow();
                if (this.player) {
                    this.player.skillHandler.displayShortcuts();
                }
                if (this.storeDialog.visible)
                    this.storeDialog.rescale();
                if (this.enchantDialog.visible) {
                    this.enchantDialog.rescale();
                }
                if (this.bankDialog.visible) {
                    this.bankDialog.rescale();
                }
            },

            updateBars: function() {
                if(this.player && this.playerhp_callback && this.playermana_callback) {
                    this.playerhp_callback(this.player.hitPoints, this.player.maxHitPoints);
                    this.playermana_callback(this.player.mana, this.player.maxMana);
                }
            },

            updateExpBar: function(){
                if(this.player && this.playerexp_callback){
                    var level = this.player.level;
                    var expInThisLevel = this.player.experience - Types.expForLevel[this.player.level-1];
                    var expForLevelUp = Types.expForLevel[this.player.level] - Types.expForLevel[this.player.level-1];
                    this.playerexp_callback(level, expInThisLevel, expForLevelUp);
                }
            },
            updateTarget: function(targetId, points, healthPoints, maxHp){
                if(this.player.hasTarget() && this.updatetarget_callback){
                    var target = this.getEntityById(targetId);
                    if(target instanceof Mob){
                        target.name = MobData.Kinds[target.kind].name;
                    }
                    target.points = points;
                    target.healthPoints = healthPoints;
                    target.maxHp = maxHp;
                    this.updatetarget_callback(target);
                }
            },

            getDeadMobPosition: function(mobId) {
                var position;

                if(mobId in this.deathpositions) {
                    position = this.deathpositions[mobId];
                    delete this.deathpositions[mobId];
                }
                return position;
            },


            showNotification: function(message) {
                if(this.storeDialog.visible) {
                    if (message == "buy" || message == "sold") {
                        this.storeDialog.inventoryFrame.open();
                    }
                    else {
                        this.storeDialog.notify(message);
                    }
                } else if(this.auctionDialog.visible) {
                    if (message == "buy" || message == "sold") {
                        this.auctionDialog.inventoryFrame.open();
                        this.auctionDialog.storeFrame.open();

                        this.auctionDialog.storeFrame.pageMyAuctions.reload();
                        this.auctionDialog.storeFrame.pageArmor.reload();
                        this.auctionDialog.storeFrame.pageWeapon.reload();

                    }
                    else {
                        this.auctionDialog.notify(message);
                    }
                } else if(this.enchantDialog.visible) {
                    if (message == "enchanted") {
                        this.enchantDialog.inventoryFrame.open();
                    }
                    else {
                        this.enchatDialog.notify(message);
                    }
                } else if(this.craftDialog.visible) {
                    if (message == "craft") {
                        this.craftDialog.inventoryFrame.open();
                    }
                    else {
                        this.craftDialog.notify(message);
                    }
                } else {
                    this.chathandler.addNotification(message);
                }
            },

            removeObsoleteEntities: function() {
                var nb = _.size(this.obsoleteEntities),
                    self = this;

                if(nb > 0) {
                    _.each(this.obsoleteEntities, function(entity) {
                        //if(entity.id != self.player.id) { // never remove yourself
                        if(!(entity instanceof Player) && !(entity instanceof Pet)) { // never remove Players or Pets.
                            log.info("Removed Entity: "+ entity.id);
                            self.removeEntity(entity);
                        }
                    });
                    //log.debug("Removed "+nb+" entities: "+_.pluck(_.reject(this.obsoleteEntities, function(id) { return id === self.player.id }), 'id'));
                    this.obsoleteEntities = null;
                }
            },

            /**
             * Fake a mouse move event in order to update the cursor.
             *
             * For instance, to get rid of the sword cursor in case the mouse is still hovering over a dying mob.
             * Also useful when the mouse is hovering a tile where an item is appearing.
             */
            updateCursor: function() {
                if(!this.cursorVisible)
                    var keepCursorHidden = true;

                this.movecursor();
                this.updateCursorLogic();

                if(keepCursorHidden)
                    this.cursorVisible = false;
            },

            /**
             * Change player plateau mode when necessary
             */
            updatePlateauMode: function() {
                if(this.map.isPlateau(this.player.gridX, this.player.gridY)) {
                    this.player.isOnPlateau = true;
                } else {
                    this.player.isOnPlateau = false;
                }
            },

            updatePlayerCheckpoint: function() {
                var checkpoint = this.map.getCurrentCheckpoint(this.player);

                if(checkpoint) {
                    var lastCheckpoint = this.player.lastCheckpoint;
                    if(!lastCheckpoint || (lastCheckpoint && lastCheckpoint.id !== checkpoint.id)) {
                        this.player.lastCheckpoint = checkpoint;
                        this.client.sendCheck(checkpoint.id);
                    }
                }
            },

            checkUnderground: function() {
                var music = this.audioManager.getSurroundingMusic(this.player);

                if(music) {
                    if(music.name === 'cave') {

                    }
                }
            },

            makeAttackerFollow: function(attacker) {
                var target = attacker.target;

                if(attacker.isAdjacent(attacker.target)) {
                    attacker.lookAtTarget();
                } else {
                    attacker.follow(target);
                }
            },

            forEachEntityAround: function(x, y, r, callback) {
                for(var i = x-r, max_i = x+r; i <= max_i; i += 1) {
                    for(var j = y-r, max_j = y+r; j <= max_j; j += 1) {
                        //log.info("i="+i+",j="+j);
                        if(!this.map.isOutOfBounds(i, j)) {
                            _.each(this.renderingGrid[j][i], function(entity) {
                                callback(entity);
                            });
                        }
                    }
                }
            },

            checkOtherDirtyRects: function(r1, source, x, y) {
                var r = this.renderer;

                this.forEachEntityAround(x, y, 2, function(e2) {
                    if(source && source.id && e2.id === source.id) {
                        return;
                    }
                    if(!e2.isDirty) {
                        var r2 = r.getEntityBoundingRect(e2);
                        if(r.isIntersecting(r1, r2)) {
                            e2.setDirty();
                        }
                    }
                });

                if(source && !(source.hasOwnProperty("index"))) {
                    this.forEachAnimatedTile(function(tile) {
                        if(!tile.isDirty) {
                            var r2 = r.getTileBoundingRect(tile);
                            if(r.isIntersecting(r1, r2)) {
                                tile.isDirty = true;
                            }
                        }
                    });
                }

                if(!this.drawTarget && this.selectedCellVisible) {
                    var targetRect = r.getTargetBoundingRect();
                    if(r.isIntersecting(r1, targetRect)) {
                        this.drawTarget = true;
                        this.renderer.targetRect = targetRect;
                    }
                }
            },

            toggleItemInfo: function(){
                if(this.itemInfoOn){
                    this.itemInfoOn = false;
                } else{
                    this.itemInfoOn = true;
                }
            },
            closeItemInfo: function (){
                this.itemInfoOn = false;
            },
            keyDown: function(key){
                var self = this;
                if(key >= 49 && key <= 54){ // 1, 2, 3, 4, 5, 6
                    var inventoryNumber = key - 49;
                    if(ItemTypes.isConsumableItem(this.inventoryHandler.inventory[inventoryNumber])){
                        this.eat(inventoryNumber);
                    }
                }
            },
            equip: function(inventoryNumber){
                var itemKind = this.inventoryHandler.inventory[inventoryNumber];

                if(ItemTypes.isArmor(itemKind) || ItemTypes.isArcherArmor(itemKind)){
                    this.client.sendInventory("armor", inventoryNumber, 1);
                } else if(ItemTypes.isWeapon(itemKind) || ItemTypes.isArcherWeapon(itemKind)){
                    this.client.sendInventory("weapon", inventoryNumber, 1);
                }
                this.menu.close();
            },
            unequip: function(index) {
                if(index == 1){
                    this.client.sendInventory("weapon", -index, 1);
                } else if(index == 2){
                    this.client.sendInventory("armor", -index, 1);
                }
            },

            avatar: function(inventoryNumber){
                this.client.sendInventory("avatar", inventoryNumber, 1);
                this.audioManager.playSound("loot");
                this.menu.close();
            },
            eat: function(inventoryNumber){
                var kind = this.inventoryHandler.inventory[inventoryNumber];
                if(kind && this.inventoryHandler.healingCoolTimeCallback === null &&
                    (ItemTypes.isConsumableItem(kind) ||
                    (ItemTypes.isHealingItem(kind) && this.player.hitPoints < this.player.maxHitPoints)))
                {
                    if(this.inventoryHandler.decInventory(inventoryNumber)){
                        this.client.sendInventory("eat", inventoryNumber, 1);
                        this.audioManager.playSound("heal");
                    }
                }
                this.menu.close();
            },
            makeEntitiesCircle: function(inventories, radius, center) {
                var os = this.renderer.upscaledRendering ? 1 : this.renderer.scale;
                var slice = 2 * Math.PI / inventories.length;
                mouseCollide=[];
                for (var i = 0; i < inventories.length; ++i)
                {
                    var angle = slice * i;
                    var x = ~~(center.x + radius * Math.cos(angle));
                    var y = ~~(center.y + radius * Math.sin(angle));
                    var filename = "item-"+ItemTypes.KindData[inventories[i].item].key;
                    var item = this.sprites[filename];

                    mouseCollide.push({"x": x, "y": y,
                        "w": item.width * os * 1.1,
                        "h": item.height * os * 1.1,
                        "inv": inventories[i]});
                }
                return mouseCollide;
            },
            makeConsumablesCircle: function()
            {
                if (!this.player || jQuery.isEmptyObject(ItemTypes.KindData))
                    return;

                var consumables = [];
                for (var i=0; i < 6; ++i)
                {
                    var item = this.inventoryHandler.inventory[i];
                    if (!item) continue;
                    consumables.push({"item": item, "index": i});
                }
                var radius = 36 * this.renderer.scale;
                var point = {"x": this.renderer.canvas.width / 2,"y": this.renderer.canvas.height / 2};
                this.activeCircle = this.makeEntitiesCircle(consumables, radius, point);
            },

            makeWeaponsCircle: function ()
            {
                if (!this.player || jQuery.isEmptyObject(ItemTypes.KindData))
                    return;

                var weapons = [];
                for (var i=6; i < 24; ++i)
                {
                    var item = this.inventoryHandler.inventory[i];
                    if (!item) continue;
                    //log.info("item.kind="+item.kind);
                    if (ItemTypes.isWeapon(item) || ItemTypes.isArcherWeapon(item))
                        weapons.push({"item": item, "index": i});
                }
                var radius = 48 * this.renderer.scale;
                var point = {"x": this.renderer.canvas.width / 2,"y": this.renderer.canvas.height / 2};
                this.activeCircle = this.makeEntitiesCircle(weapons, radius, point);
            },

            makeArmorsCircle: function ()
            {
                if (!this.player || jQuery.isEmptyObject(ItemTypes.KindData))
                    return;

                var armors = [];
                for (var i=6; i < 24; ++i)
                {
                    var item = this.inventoryHandler.inventory[i];
                    if (!item) continue;
                    if (ItemTypes.isArmor(item) || ItemTypes.isArcherArmor(item))
                        armors.push({"item": item, "index": i});
                }
                var radius = 48 * this.renderer.scale;

                var point = {"x": this.renderer.canvas.width / 2,"y": this.renderer.canvas.height / 2};
                this.activeCircle = this.makeEntitiesCircle(armors, radius, point);
            },

            getCircleSelected: function (x, y) {
                for (var i = 0; i < this.activeCircle.length; ++i)
                {
                    var circleItem = this.activeCircle[i];

                    log.info("x:" +x+",y:"+y);
                    log.info("circleItem.x:" +circleItem.x+",circleItem.y:"+circleItem.y);
                    log.info("circleItem.w:" +circleItem.w+",circleItem.h:"+circleItem.h);
                    if (x >= circleItem.x && x <= circleItem.x + circleItem.w &&
                        y >= circleItem.y && y <= circleItem.y + circleItem.h)
                    {
                        return this.activeCircle[i].inv;
                    }
                }
                return null;
            }
        });

        return Game;
    });