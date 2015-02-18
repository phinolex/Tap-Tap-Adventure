
define(['item'], function(Item) {

    var Items = {
        
        Sword1: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.SWORD1, "weapon", skillKind, skillLevel);
            }
        }),
        Sword2: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.SWORD2, "weapon", skillKind, skillLevel);
            }
        }),

        Axe: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.AXE, "weapon", skillKind, skillLevel);
            }
        }),

        RedSword: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.REDSWORD, "weapon", skillKind, skillLevel);
            }
        }),

        BlueSword: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.BLUESWORD, "weapon", skillKind, skillLevel);
            }
        }),

        GoldenSword: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.GOLDENSWORD, "weapon", skillKind, skillLevel);
            }
        }),

        MorningStar: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.MORNINGSTAR, "weapon", skillKind, skillLevel);
            }
        }),
        SideSword: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.SIDESWORD, "weapon", skillKind, skillLevel);
            }
        }),
        Spear: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.SPEAR, "weapon", skillKind, skillLevel);
            }
        }),
        Scimitar: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.SCIMITAR, "weapon", skillKind, skillLevel);
            }
        }),
        Trident: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.TRIDENT, "weapon", skillKind, skillLevel);
            }
        }),
        Bluescimitar: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.BLUESCIMITAR, "weapon", skillKind, skillLevel);
            }
        }),
        Hammer: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.HAMMER, "weapon", skillKind, skillLevel);
            }
        }),
        Greenlightsaber: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.GREENLIGHTSABER, "weapon", skillKind, skillLevel);
            }
        }),
        Skylightsaber: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.SKYLIGHTSABER, "weapon", skillKind, skillLevel);
            }
        }),
        Redlightsaber: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.REDLIGHTSABER, "weapon", skillKind, skillLevel);
            }
        }),
        Redmetalsword: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.REDMETALSWORD, "weapon", skillKind, skillLevel);
            }
        }),
        Bastardsword: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.BASTARDSWORD, "weapon", skillKind, skillLevel);
            }
        }),
        Halberd: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.HALBERD, "weapon", skillKind, skillLevel);
            }
        }),
        Rose: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.ROSE, "weapon", skillKind, skillLevel);
            }
        }),
        Icerose: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.ICEROSE, "weapon", skillKind, skillLevel);
            }
        }),
        Justicehammer: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.JUSTICEHAMMER, "weapon", skillKind, skillLevel);
            }
        }),
        Firesword: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.FIRESWORD, "weapon", skillKind, skillLevel);
            }
        }),
        Whip: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.WHIP, "weapon", skillKind, skillLevel);
            }
        }),
        Forestguardiansword: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.FORESTGUARDIANSWORD, "weapon", skillKind, skillLevel);
            }
        }),
        Sickle: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.SICKLE, "weapon", skillKind, skillLevel);
            }
        }),
        Plunger: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.PLUNGER, "weapon", skillKind, skillLevel);
            }
        }),
        Redsickle: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.REDSICKLE, "weapon", skillKind, skillLevel);
            }
        }),
        Daywalker: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.DAYWALKER, "weapon", skillKind, skillLevel);
            }
        }),
        Purplecloudkallege: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.PURPLECLOUDKALLEGE, "weapon", skillKind, skillLevel);
            }
        }),
        Searage: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.SEARAGE, "weapon", skillKind, skillLevel);
            }
        }),
        Magicspear: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.MAGICSPEAR, "weapon", skillKind, skillLevel);
            }
        }),
        Breaker: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.BREAKER, "weapon", skillKind, skillLevel);
            }
        }),
        Eneltrident: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.ENELTRIDENT, "weapon", skillKind, skillLevel);
            }
        }),
        Rainbowsword: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.RAINBOWSWORD, "weapon", skillKind, skillLevel);
            }
        }),
        Typhoon: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.TYPHOON, "weapon", skillKind, skillLevel);
            }
        }),
        Memme: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.MEMME, "weapon", skillKind, skillLevel);
            }
        }),
        Candybar: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.CANDYBAR, "weapon", skillKind, skillLevel);
            }
        }),
        Butcherknife: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.BUTCHERKNIFE, "weapon", skillKind, skillLevel);
            }
        }),
        Fireshot: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.FIRESHOT, "weapon", skillKind, skillLevel);
            }
        }),
        Comb: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.COMB, "weapon", skillKind, skillLevel);
            }
        }),
        Squeakyhammer: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.SQUEAKYHAMMER, "weapon", skillKind, skillLevel);
            }
        }),
        Fireplay: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.FIREPLAY, "weapon", skillKind, skillLevel);
            }
        }),
        Weastaff: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.WEASTAFF, "weapon", skillKind, skillLevel);
            }
        }),
        Pinksword: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.PINKSWORD, "weapon", skillKind, skillLevel);
            }
        }),
        Conferencecall: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.CONFERENCECALL, "weapon", skillKind, skillLevel);
            }
        }),
        Cactusaxe: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.CACTUSAXE, "weapon", skillKind, skillLevel);
            }
        }),
        Devilkazyasword: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.DEVILKAZYASWORD, "weapon", skillKind, skillLevel);
            }
        }),
        Bamboospear: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.BAMBOOSPEAR, "weapon", skillKind, skillLevel);
            }
        }),
        Paewoldo: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.PAEWOLDO, "weapon", skillKind, skillLevel);
            }
        }),


        ClothArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.CLOTHARMOR, "armor");
            }
        }),

        LeatherArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.LEATHERARMOR, "armor");
            }
        }),

        MailArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.MAILARMOR, "armor");
            }
        }),

        PlateArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.PLATEARMOR, "armor");
            }
        }),

        RedArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.REDARMOR, "armor");
            }
        }),

        GoldenArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.GOLDENARMOR, "armor");
            }
        }),
        GreenArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.GREENARMOR, "armor");
            }
        }),
        GreenWingArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.GREENWINGARMOR, "armor");
            }
        }),
        GuardArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.GUARDARMOR, "armor");
            }
        }),
        RedGuardArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.REDGUARDARMOR, "armor");
            }
        }),
        WhiteArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.WHITEARMOR, "armor");
            }
        }),
        RatArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.RATARMOR, "armor");
            }
        }),
        BluepirateArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.BLUEPIRATEARMOR, "armor");
            }
        }),
        CheoliArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.CHEOLIARMOR, "armor");
            }
        }),
        DovakinArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.DOVAKINARMOR, "armor");
            }
        }),
        GbwingArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.GBWINGARMOR, "armor");
            }
        }),
        RedwingArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.REDWINGARMOR, "armor");
            }
        }),
        SnowfoxArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.SNOWFOXARMOR, "armor");
            }
        }),
        WolfArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.WOLFARMOR, "armor");
            }
        }),
        BluewingArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.BLUEWINGARMOR, "armor");
            }
        }),
        ThiefArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.THIEFARMOR, "armor");
            }
        }),
        NinjaArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.NINJAARMOR, "armor");
            }
        }),
        DragonArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.DRAGONARMOR, "armor");
            }
        }),
        FallenArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.FALLENARMOR, "armor");
            }
        }),
        PaladinArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.PALADINARMOR, "armor");
            }
        }),
        CrystalArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.CRYSTALARMOR, "armor");
            }
        }),
        AdhererRobe: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.ADHERERROBE, "armor");
            }
        }),
        FrostArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.FROSTARMOR, "armor");
            }
        }),
        GayArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.GAYARMOR, "armor");
            }
        }),
        SchoolUniform: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.SCHOOLUNIFORM, "armor");
            }
        }),
        BeautifulLife: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.BEAUTIFULLIFE, "armor");
            }
        }),
        RegionArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.REGIONARMOR, "armor");
            }
        }),
        GhostRider: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.GHOSTRIDER, "armor");
            }
        }),
        Taekwondo: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.TAEKWONDO, "armor");
            }
        }),
        AdminArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.ADMINARMOR, "armor");
            }
        }),
        RabbitArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.RABBITARMOR, "armor");
            }
        }),
        PortalArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.PORTALARMOR, "armor");
            }
        }),
        PirateKing: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.PIRATEKING, "armor");
            }
        }),
        SeadragonArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.SEADRAGONARMOR, "armor");
            }
        }),
        ShadowregionArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.SHADOWREGIONARMOR, "armor");
            }
        }),
        EnelArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.ENELARMOR, "armor");
            }
        }),
        MiniseadragonArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.MINISEADRAGONARMOR, "armor");
            }
        }),
        HuniArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.HUNIARMOR, "armor");
            }
        }),
        DamboArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.DAMBOARMOR, "armor");
            }
        }),
        SquidArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.SQUIDARMOR, "armor");
            }
        }),
        BeeArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.BEEARMOR, "armor");
            }
        }),
        BluedamboArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.BLUEDAMBOARMOR, "armor");
            }
        }),
        RudolfArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.RUDOLFARMOR, "armor");
            }
        }),
        ChristmasArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.CHRISTMASARMOR, "armor");
            }
        }),
        RobocopArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.ROBOCOPARMOR, "armor");
            }
        }),
        PinkcockroachArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.PINKCOCKROACHARMOR, "armor");
            }
        }),
        CockroachSuit: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.COCKROACHSUIT, "armor");
            }
        }),
        DinosaurArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.DINOSAURARMOR, "armor");
            }
        }),
        CatArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.CATARMOR, "armor");
            }
        }),
        SnowmanArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.SNOWMANARMOR, "armor");
            }
        }),
        BeetleArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.BEETLEARMOR, "armor");
            }
        }),
        HongcheolArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.HONGCHEOLARMOR, "armor");
            }
        }),
        TigerArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.TIGERARMOR, "armor");
            }
        }),
        WizardRobe: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.WIZARDROBE, "armor");
            }
        }),
        IronknightArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.IRONKNIGHTARMOR, "armor");
            }
        }),
        EvilArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.EVILARMOR, "armor");
            }
        }),
        GreendamboArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.GREENDAMBOARMOR, "armor");
            }
        }),
        ReddamboArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.REDDAMBOARMOR, "armor");
            }
        }),
        DevilkazyaArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.DEVILKAZYAARMOR, "armor");
            }
        }),
        BridalMask: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.BRIDALMASK, "armor");
            }
        }),
        BlackspiderArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.BLACKSPIDERARMOR, "armor");
            }
        }),
        FrogArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.FROGARMOR, "armor");
            }
        }),
        BearseonbiArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.BEARSEONBIARMOR, "armor");
            }
        }),

        RainbowApro: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.RAINBOWAPRO, "armor");
            }
        }),
        CokeArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.COKEARMOR, "armor");
            }
        }),
        FriedpotatoArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.FRIEDPOTATOARMOR, "armor");
            }
        }),
        BurgerArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.BURGERARMOR, "armor");
            }
        }),
        RadishArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.RADISHARMOR, "armor");
            }
        }),
        HalloweenJKArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.HALLOWEENJKARMOR, "armor");
            }
        }),
        FrankensteinArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.FRANKENSTEINARMOR, "armor");
            }
        }),

        Flask: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.FLASK, "object");
            }
        }),
        
        Cake: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.CAKE, "object");
            }
        }),

        Burger: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.BURGER, "object");
            }
        }),

        FirePotion: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.FIREPOTION, "object");
            },
    
            onLoot: function(player) {
                player.startInvincibility();
            }
        }),
        Book: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.BOOK, "object");
            }
        }),
        Cd: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.CD, "object");
            }
        }),
        Snowpotion: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.SNOWPOTION, "object");
            }
        }),
        Royalazalea: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.ROYALAZALEA, "object");
            }
        }),
        Blackpotion: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.BLACKPOTION, "object");
            }
        }),

        ArcherArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.ARCHERARMOR, "armor");
            }
        }),
        LeatherarcherArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.LEATHERARCHERARMOR, "armor");
            }
        }),
        MailarcherArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.MAILARCHERARMOR, "armor");
            }
        }),
        PlatearcherArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.PLATEARCHERARMOR, "armor");
            }
        }),
        RedarcherArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.REDARCHERARMOR, "armor");
            }
        }),
        GoldenarcherArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.GOLDENARCHERARMOR, "armor");
            }
        }),
        GreenarcherArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.GREENARCHERARMOR, "armor");
            }
        }),
        GreenwingarcherArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.GREENWINGARCHERARMOR, "armor");
            }
        }),
        GuardarcherArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.GUARDARCHERARMOR, "armor");
            }
        }),
        RedguardarcherArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.REDGUARDARCHERARMOR, "armor");
            }
        }),
        WhitearcherArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.WHITEARCHERARMOR, "armor");
            }
        }),
        RatarcherArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.RATARCHERARMOR, "armor");
            }
        }),
        PiratearcherArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.PIRATEARCHERARMOR, "armor");
            }
        }),
        CheoliarcherArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.CHEOLIARCHERARMOR, "armor");
            }
        }),
        DovakinarcherArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.DOVAKINARCHERARMOR, "armor");
            }
        }),
        GbwingarcherArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.GBWINGARCHERARMOR, "armor");
            }
        }),
        RedwingarcherArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.REDWINGARCHERARMOR, "armor");
            }
        }),
        SnowfoxarcherArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.SNOWFOXARCHERARMOR, "armor");
            }
        }),
        WolfarcherArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.WOLFARCHERARMOR, "armor");
            }
        }),
        BluewingarcherArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.BLUEWINGARCHERARMOR, "armor");
            }
        }),
        FallenarcherArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.FALLENARCHERARMOR, "armor");
            }
        }),
        CrystalarcherArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.CRYSTALARCHERARMOR, "armor");
            }
        }),
        LegolasArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.LEGOLASARMOR, "armor");
            }
        }),
        AdhererarcherArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.ADHERERARCHERARMOR, "armor");
            }
        }),
        ArcherschoolUniform: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.ARCHERSCHOOLUNIFORM, "armor");
            }
        }),
        CombatUniform: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.COMBATUNIFORM, "armor");
            }
        }),
        GayarcherArmor: Item.extend({
            init: function(id) {
                this._super(id, Types.Entities.GAYARCHERARMOR, "armor");
            }
        }),

        WoodenBow: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.WOODENBOW, "weapon", skillKind, skillLevel);
            }
        }),
        PlasticBow: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.PLASTICBOW, "weapon", skillKind, skillLevel);
            }
        }),
        IronBow: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.IRONBOW, "weapon", skillKind, skillLevel);
            }
        }),
        RedBow: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.REDBOW, "weapon", skillKind, skillLevel);
            }
        }),
        VioletBow: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.VIOLETBOW, "weapon", skillKind, skillLevel);
            }
        }),
        DeathBow: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.DEATHBOW, "weapon", skillKind, skillLevel);
            }
        }),
        GoldenBow: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.GOLDENBOW, "weapon", skillKind, skillLevel);
            }
        }),
        WatermelonBow: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.WATERMELONBOW, "weapon", skillKind, skillLevel);
            }
        }),
        GreenBow: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.GREENBOW, "weapon", skillKind, skillLevel);
            }
        }),
        RedenelBow: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.REDENELBOW, "weapon", skillKind, skillLevel);
            }
        }),
        MermaidBow: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.MERMAIDBOW, "weapon", skillKind, skillLevel);
            }
        }),
        SeahorseBow: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.SEAHORSEBOW, "weapon", skillKind, skillLevel);
            }
        }),
        HunterBow: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.HUNTERBOW, "weapon", skillKind, skillLevel);
            }
        }),
        GreenlightBow: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.GREENLIGHTBOW, "weapon", skillKind, skillLevel);
            }
        }),
        SkylightBow: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.SKYLIGHTBOW, "weapon", skillKind, skillLevel);
            }
        }),
        RedlightBow: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.REDLIGHTBOW, "weapon", skillKind, skillLevel);
            }
        }),
        CaptainBow: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.CAPTAINBOW, "weapon", skillKind, skillLevel);
            }
        }),
        RedmetalBow: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.REDMETALBOW, "weapon", skillKind, skillLevel);
            }
        }),
        MarineBow: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.MARINEBOW, "weapon", skillKind, skillLevel);
            }
        }),
        JusticeBow: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.JUSTICEBOW, "weapon", skillKind, skillLevel);
            }
        }),
        RoseBow: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.ROSEBOW, "weapon", skillKind, skillLevel);
            }
        }),
        CrystalBow: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.CRYSTALBOW, "weapon", skillKind, skillLevel);
            }
        }),
        GayBow: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.GAYBOW, "weapon", skillKind, skillLevel);
            }
        }),
        ForestBow: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.FORESTBOW, "weapon", skillKind, skillLevel);
            }
        }),
        SickleBow: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.SICKLEBOW, "weapon", skillKind, skillLevel);
            }
        }),
        BloodBow: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.BLOODBOW, "weapon", skillKind, skillLevel);
            }
        }),
        RedsickleBow: Item.extend({
            init: function(id, skillKind, skillLevel) {
                this._super(id, Types.Entities.REDSICKLEBOW, "weapon", skillKind, skillLevel);
            }
        })

    };

    return Items;
});
