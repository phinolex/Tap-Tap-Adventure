
/* global Types, log, _ */

define(['mobs', 'items', 'npcs', 'warrior', 'chest'], function(Mobs, Items, NPCs, Warrior, Chest) {

    var EntityFactory = {};

    EntityFactory.createEntity = function(kind, id, name, skillKind, skillLevel) {
        if(!kind) {
            log.error("kind is undefined", true);
            return;
        }

        if(!_.isFunction(EntityFactory.builders[kind])) {
            throw Error(kind + " is not a valid Entity type");
        }

        return EntityFactory.builders[kind](id, name, skillKind, skillLevel);
    };

    //===== mobs ======

    EntityFactory.builders = [];

    //===== archer armors ======
    EntityFactory.builders[Types.Entities.ARCHERARMOR] = function(id) {
        return new Items.ArcherArmor(id);
    };
    EntityFactory.builders[Types.Entities.LEATHERARCHERARMOR] = function(id) {
        return new Items.LeatherarcherArmor(id);
    };
    EntityFactory.builders[Types.Entities.MAILARCHERARMOR] = function(id) {
        return new Items.MailarcherArmor(id);
    };
    EntityFactory.builders[Types.Entities.PLATEARCHERARMOR] = function(id) {
        return new Items.PlatearcherArmor(id);
    };
    EntityFactory.builders[Types.Entities.REDARCHERARMOR] = function(id) {
        return new Items.RedarcherArmor(id);
    };
    EntityFactory.builders[Types.Entities.GOLDENARCHERARMOR] = function(id) {
        return new Items.GoldenarcherArmor(id);
    };
    EntityFactory.builders[Types.Entities.GREENARCHERARMOR] = function(id) {
        return new Items.GreenarcherArmor(id);
    };
    EntityFactory.builders[Types.Entities.GREENWINGARCHERARMOR] = function(id) {
        return new Items.GreenwingarcherArmor(id);
    };
    EntityFactory.builders[Types.Entities.GUARDARCHERARMOR] = function(id) {
        return new Items.GuardarcherArmor(id);
    };
    EntityFactory.builders[Types.Entities.REDGUARDARCHERARMOR] = function(id) {
        return new Items.RedguardarcherArmor(id);
    };
    EntityFactory.builders[Types.Entities.WHITEARCHERARMOR] = function(id) {
        return new Items.WhitearcherArmor(id);
    };
    EntityFactory.builders[Types.Entities.RATARCHERARMOR] = function(id) {
        return new Items.RatarcherArmor(id);
    };
    EntityFactory.builders[Types.Entities.PIRATEARCHERARMOR] = function(id) {
        return new Items.PiratearcherArmor(id);
    };
    EntityFactory.builders[Types.Entities.CHEOLIARCHERARMOR] = function(id) {
        return new Items.CheoliarcherArmor(id);
    };
    EntityFactory.builders[Types.Entities.DOVAKINARCHERARMOR] = function(id) {
        return new Items.DovakinarcherArmor(id);
    };
    EntityFactory.builders[Types.Entities.GBWINGARCHERARMOR] = function(id) {
        return new Items.GbwingarcherArmor(id);
    };
    EntityFactory.builders[Types.Entities.REDWINGARCHERARMOR] = function(id) {
        return new Items.RedwingarcherArmor(id);
    };
    EntityFactory.builders[Types.Entities.SNOWFOXARCHERARMOR] = function(id) {
        return new Items.SnowfoxarcherArmor(id);
    };
    EntityFactory.builders[Types.Entities.WOLFARCHERARMOR] = function(id) {
        return new Items.WolfarcherArmor(id);
    };
    EntityFactory.builders[Types.Entities.BLUEWINGARCHERARMOR] = function(id) {
        return new Items.BluewingarcherArmor(id);
    };
    EntityFactory.builders[Types.Entities.FALLENARCHERARMOR] = function(id) {
        return new Items.FallenarcherArmor(id);
    };
    EntityFactory.builders[Types.Entities.CRYSTALARCHERARMOR] = function(id) {
        return new Items.CrystalarcherArmor(id);
    };
    EntityFactory.builders[Types.Entities.LEGOLASARMOR] = function(id) {
        return new Items.LegolasArmor(id);
    };
    EntityFactory.builders[Types.Entities.ADHERERARCHERARMOR] = function(id) {
        return new Items.AdhererarcherArmor(id);
    };
    EntityFactory.builders[Types.Entities.ARCHERSCHOOLUNIFORM] = function(id) {
        return new Items.ArcherschoolUniform(id);
    };
    EntityFactory.builders[Types.Entities.COMBATUNIFORM] = function(id) {
        return new Items.CombatUniform(id);
    };
    EntityFactory.builders[Types.Entities.GAYARCHERARMOR] = function(id) {
        return new Items.GayarcherArmor(id);
    };

    //===== archer weapons ======
    EntityFactory.builders[Types.Entities.WOODENBOW] = function(id, name, skillKind, skillLevel) {
        return new Items.WoodenBow(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.PLASTICBOW] = function(id, name, skillKind, skillLevel) {
        return new Items.PlasticBow(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.IRONBOW] = function(id, name, skillKind, skillLevel) {
        return new Items.IronBow(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.REDBOW] = function(id, name, skillKind, skillLevel) {
        return new Items.RedBow(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.VIOLETBOW] = function(id, name, skillKind, skillLevel) {
        return new Items.VioletBow(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.DEATHBOW] = function(id, name, skillKind, skillLevel) {
        return new Items.DeathBow(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.GOLDENBOW] = function(id, name, skillKind, skillLevel) {
        return new Items.GoldenBow(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.WATERMELONBOW] = function(id, name, skillKind, skillLevel) {
        return new Items.WatermelonBow(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.GREENBOW] = function(id, name, skillKind, skillLevel) {
        return new Items.GreenBow(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.REDENELBOW] = function(id, name, skillKind, skillLevel) {
        return new Items.RedenelBow(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.MERMAIDBOW] = function(id, name, skillKind, skillLevel) {
        return new Items.MermaidBow(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.SEAHORSEBOW] = function(id, name, skillKind, skillLevel) {
        return new Items.SeahorseBow(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.HUNTERBOW] = function(id, name, skillKind, skillLevel) {
        return new Items.HunterBow(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.GREENLIGHTBOW] = function(id, name, skillKind, skillLevel) {
        return new Items.GreenlightBow(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.SKYLIGHTBOW] = function(id, name, skillKind, skillLevel) {
        return new Items.SkylightBow(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.REDLIGHTBOW] = function(id, name, skillKind, skillLevel) {
        return new Items.RedlightBow(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.CAPTAINBOW] = function(id, name, skillKind, skillLevel) {
        return new Items.CaptainBow(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.REDMETALBOW] = function(id, name, skillKind, skillLevel) {
        return new Items.RedmetalBow(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.MARINEBOW] = function(id, name, skillKind, skillLevel) {
        return new Items.MarineBow(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.JUSTICEBOW] = function(id, name, skillKind, skillLevel) {
        return new Items.JusticeBow(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.ROSEBOW] = function(id, name, skillKind, skillLevel) {
        return new Items.RoseBow(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.CRYSTALBOW] = function(id, name, skillKind, skillLevel) {
        return new Items.CrystalBow(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.GAYBOW] = function(id, name, skillKind, skillLevel) {
        return new Items.GayBow(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.FORESTBOW] = function(id, name, skillKind, skillLevel) {
        return new Items.ForestBow(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.SICKLEBOW] = function(id, name, skillKind, skillLevel) {
        return new Items.SickleBow(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.BLOODBOW] = function(id, name, skillKind, skillLevel) {
        return new Items.BloodBow(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.REDSICKLEBOW] = function(id, name, skillKind, skillLevel) {
        return new Items.RedsickleBow(id, skillKind, skillLevel);
    };
    
    //===== mobs ======


    EntityFactory.builders[Types.Entities.WARRIOR] = function(id, name) {
        return new Warrior(id, name);
    };
    EntityFactory.builders[Types.Entities.ARCHER] = function(id, name) {
        return new Warrior(id, name);
    };

    EntityFactory.builders[Types.Entities.RAT] = function(id) {
        return new Mobs.Rat(id);
    };

    EntityFactory.builders[Types.Entities.SKELETON] = function(id) {
        return new Mobs.Skeleton(id);
    };

    EntityFactory.builders[Types.Entities.SKELETON2] = function(id) {
        return new Mobs.Skeleton2(id);
    };

    EntityFactory.builders[Types.Entities.SPECTRE] = function(id) {
        return new Mobs.Spectre(id);
    };
    
    EntityFactory.builders[Types.Entities.DEATHKNIGHT] = function(id) {
        return new Mobs.Deathknight(id);
    };

    EntityFactory.builders[Types.Entities.GOBLIN] = function(id) {
        return new Mobs.Goblin(id);
    };

    EntityFactory.builders[Types.Entities.OGRE] = function(id) {
        return new Mobs.Ogre(id);
    };

    EntityFactory.builders[Types.Entities.CRAB] = function(id) {
        return new Mobs.Crab(id);
    };

    EntityFactory.builders[Types.Entities.SNEK] = function(id) {
        return new Mobs.Snek(id);
    };

    EntityFactory.builders[Types.Entities.EYE] = function(id) {
        return new Mobs.Eye(id);
    };

    EntityFactory.builders[Types.Entities.BAT] = function(id) {
        return new Mobs.Bat(id);
    };

    EntityFactory.builders[Types.Entities.WIZARD] = function(id) {
        return new Mobs.Wizard(id);
    };

    EntityFactory.builders[Types.Entities.SKELETONKING] = function(id) {
        return new Mobs.Skeletonking(id);
    };
    EntityFactory.builders[Types.Entities.ORC] = function(id) {
        return new Mobs.Orc(id);
    };
    EntityFactory.builders[Types.Entities.GOLEM] = function(id) {
        return new Mobs.Golem(id);
    };
    EntityFactory.builders[Types.Entities.OLDOGRE] = function(id) {
        return new Mobs.Oldogre(id);
    };
    EntityFactory.builders[Types.Entities.MIMIC] = function(id) {
        return new Mobs.Mimic(id);
    };
    EntityFactory.builders[Types.Entities.HOBGOBLIN] = function(id) {
        return new Mobs.Hobgoblin(id);
    };
    EntityFactory.builders[Types.Entities.YELLOWMOUSE] = function(id) {
        return new Mobs.Yellowmouse(id);
    };
    EntityFactory.builders[Types.Entities.WHITEMOUSE] = function(id) {
        return new Mobs.Whitemouse(id);
    };
    EntityFactory.builders[Types.Entities.BROWNMOUSE] = function(id) {
        return new Mobs.Brownmouse(id);
    };
    EntityFactory.builders[Types.Entities.REDMOUSE] = function(id) {
        return new Mobs.Redmouse(id);
    };
    EntityFactory.builders[Types.Entities.REDGUARD] = function(id) {
        return new Mobs.Redguard(id);
    };
    EntityFactory.builders[Types.Entities.INFECTEDGUARD] = function(id) {
        return new Mobs.Infectedguard(id);
    };
    EntityFactory.builders[Types.Entities.LIVINGARMOR] = function(id) {
        return new Mobs.Livingarmor(id);
    };
    EntityFactory.builders[Types.Entities.MERMAID] = function(id) {
        return new Mobs.Mermaid(id);
    };
    EntityFactory.builders[Types.Entities.YELLOWFISH] = function(id) {
        return new Mobs.Yellowfish(id);
    };
    EntityFactory.builders[Types.Entities.GREENFISH] = function(id) {
        return new Mobs.Greenfish(id);
    };
    EntityFactory.builders[Types.Entities.REDFISH] = function(id) {
        return new Mobs.Redfish(id);
    };
    EntityFactory.builders[Types.Entities.CLAM] = function(id) {
        return new Mobs.Clam(id);
    };
    EntityFactory.builders[Types.Entities.PRETA] = function(id) {
        return new Mobs.Preta(id);
    };
    EntityFactory.builders[Types.Entities.PIRATESKELETON] = function(id) {
        return new Mobs.Pirateskeleton(id);
    };
    EntityFactory.builders[Types.Entities.PENGUIN] = function(id) {
        return new Mobs.Penguin(id);
    };
    EntityFactory.builders[Types.Entities.MOLEKING] = function(id) {
        return new Mobs.Moleking(id);
    };
    EntityFactory.builders[Types.Entities.DARKSKELETON] = function(id) {
        return new Mobs.Darkskeleton(id);
    };
    EntityFactory.builders[Types.Entities.GREENPIRATESKELETON] = function(id) {
        return new Mobs.Greenpirateskeleton(id);
    };
    EntityFactory.builders[Types.Entities.BLACKPIRATESKELETON] = function(id) {
        return new Mobs.Blackpirateskeleton(id);
    };
    EntityFactory.builders[Types.Entities.REDPIRATESKELETON] = function(id) {
        return new Mobs.Redpirateskeleton(id);
    };
    EntityFactory.builders[Types.Entities.YELLOWPRETA] = function(id) {
        return new Mobs.Yellowpreta(id);
    };
    EntityFactory.builders[Types.Entities.BLUEPRETA] = function(id) {
        return new Mobs.Bluepreta(id);
    };
    EntityFactory.builders[Types.Entities.MINIKNIGHT] = function(id) {
        return new Mobs.Miniknight(id);
    };
    EntityFactory.builders[Types.Entities.WOLF] = function(id) {
        return new Mobs.Wolf(id);
    };
    EntityFactory.builders[Types.Entities.PINKELF] = function(id) {
        return new Mobs.Pinkelf(id);
    };
    EntityFactory.builders[Types.Entities.SKYELF] = function(id) {
        return new Mobs.Skyelf(id);
    };
    EntityFactory.builders[Types.Entities.REDELF] = function(id) {
        return new Mobs.Redelf(id);
    };
    EntityFactory.builders[Types.Entities.HERMITCRAB] = function(id) {
        return new Mobs.Hermitcrab(id);
    };
    EntityFactory.builders[Types.Entities.ZOMBIE] = function(id) {
        return new Mobs.Zombie(id);
    };
    EntityFactory.builders[Types.Entities.PIRATECAPTAIN] = function(id) {
        return new Mobs.Piratecaptain(id);
    };
    EntityFactory.builders[Types.Entities.IRONOGRE] = function(id) {
        return new Mobs.Ironogre(id);
    };
    EntityFactory.builders[Types.Entities.OGRELORD] = function(id) {
        return new Mobs.Ogrelord(id);
    };
    EntityFactory.builders[Types.Entities.ADHERER] = function(id) {
        return new Mobs.Adherer(id);
    };
    EntityFactory.builders[Types.Entities.ICEGOLEM] = function(id) {
        return new Mobs.Icegolem(id);
    };    
    EntityFactory.builders[Types.Entities.DESERTSCOLPION] = function(id) {
        return new Mobs.Desertscolpion(id);
    };
    EntityFactory.builders[Types.Entities.DARKSCOLPION] = function(id) {
        return new Mobs.Darkscolpion(id);
    };
    EntityFactory.builders[Types.Entities.VULTURE] = function(id) {
        return new Mobs.Vulture(id);
    };
    EntityFactory.builders[Types.Entities.FORESTDRAGON] = function(id) {
        return new Mobs.Forestdragon(id);
    };
    EntityFactory.builders[Types.Entities.CRYSTALSCOLPION] = function(id) {
        return new Mobs.Crystalscolpion(id);
    };
    EntityFactory.builders[Types.Entities.ELIMINATOR] = function(id) {
        return new Mobs.Eliminator(id);
    };
    EntityFactory.builders[Types.Entities.FROSTQUEEN] = function(id) {
        return new Mobs.Frostqueen(id);
    };
    EntityFactory.builders[Types.Entities.SNOWRABBIT] = function(id) {
        return new Mobs.Snowrabbit(id);
    };
    EntityFactory.builders[Types.Entities.SNOWWOLF] = function(id) {
        return new Mobs.Snowwolf(id);
    };
    EntityFactory.builders[Types.Entities.ICEKNIGHT] = function(id) {
        return new Mobs.Iceknight(id);
    };
    EntityFactory.builders[Types.Entities.MINIICEKNIGHT] = function(id) {
        return new Mobs.Miniiceknight(id);
    };
    EntityFactory.builders[Types.Entities.SNOWELF] = function(id) {
        return new Mobs.Snowelf(id);
    };
    EntityFactory.builders[Types.Entities.WHITEBEAR] = function(id) {
        return new Mobs.Whitebear(id);
    };
    EntityFactory.builders[Types.Entities.COBRA] = function(id) {
        return new Mobs.Cobra(id);
    };
    EntityFactory.builders[Types.Entities.GOLDGOLEM] = function(id) {
        return new Mobs.Goldgolem(id);
    };
    EntityFactory.builders[Types.Entities.DARKREGION] = function(id) {
        return new Mobs.Darkregion(id);
    };
    EntityFactory.builders[Types.Entities.DARKREGIONILLUSION] = function(id) {
        return new Mobs.Darkregionillusion(id);
    };
    EntityFactory.builders[Types.Entities.NIGHTMAREREGION] = function(id) {
        return new Mobs.Nightmareregion(id);
    };
    EntityFactory.builders[Types.Entities.DARKOGRE] = function(id) {
        return new Mobs.Darkogre(id);
    };
    EntityFactory.builders[Types.Entities.PAIN] = function(id) {
        return new Mobs.Pain(id);
    };
    EntityFactory.builders[Types.Entities.ICEVULTURE] = function(id) {
        return new Mobs.Icevulture(id);
    };
    EntityFactory.builders[Types.Entities.REGIONHENCHMAN] = function(id) {
        return new Mobs.Regionhenchman(id);
    };
    EntityFactory.builders[Types.Entities.PURPLEPRETA] = function(id) {
        return new Mobs.Purplepreta(id);
    };
    EntityFactory.builders[Types.Entities.FLAREDEATHKNIGHT] = function(id) {
        return new Mobs.Flaredeathknight(id);
    };
    EntityFactory.builders[Types.Entities.SNOWLADY] = function(id) {
        return new Mobs.Snowlady(id);
    };
    EntityFactory.builders[Types.Entities.SEADRAGON] = function(id) {
        return new Mobs.Seadragon(id);
    };
    EntityFactory.builders[Types.Entities.SHADOWREGION] = function(id) {
        return new Mobs.Shadowregion(id);
    };
    EntityFactory.builders[Types.Entities.LIGHTNINGGUARDIAN] = function(id) {
        return new Mobs.Lightningguardian(id);
    };
    EntityFactory.builders[Types.Entities.ENEL] = function(id) {
        return new Mobs.Enel(id);
    };
    EntityFactory.builders[Types.Entities.MINIDRAGON] = function(id) {
        return new Mobs.Minidragon(id);
    };
    EntityFactory.builders[Types.Entities.MINISEADRAGON] = function(id) {
        return new Mobs.Miniseadragon(id);
    };
    EntityFactory.builders[Types.Entities.MINIEMPEROR] = function(id) {
        return new Mobs.Miniemperor(id);
    };
    EntityFactory.builders[Types.Entities.SLIME] = function(id) {
        return new Mobs.Slime(id);
    };
    EntityFactory.builders[Types.Entities.KAONASHI] = function(id) {
        return new Mobs.Kaonashi(id);
    };
    EntityFactory.builders[Types.Entities.WINDGUARDIAN] = function(id) {
        return new Mobs.Windguardian(id);
    };
    EntityFactory.builders[Types.Entities.SQUID] = function(id) {
        return new Mobs.Squid(id);
    };
    EntityFactory.builders[Types.Entities.RHAPHIDOPHORIDAE] = function(id) {
        return new Mobs.Rhaphidophoridae(id);
    };
    EntityFactory.builders[Types.Entities.BEE] = function(id) {
        return new Mobs.Bee(id);
    };
    EntityFactory.builders[Types.Entities.ANT] = function(id) {
        return new Mobs.Ant(id);
    };
    EntityFactory.builders[Types.Entities.RUDOLF] = function(id) {
        return new Mobs.Rudolf(id);
    };
    EntityFactory.builders[Types.Entities.SANTAELF] = function(id) {
        return new Mobs.Santaelf(id);
    };
    EntityFactory.builders[Types.Entities.SANTA] = function(id) {
        return new Mobs.Santa(id);
    };
    EntityFactory.builders[Types.Entities.SOLDIERANT] = function(id) {
        return new Mobs.Soldierant(id);
    };
    EntityFactory.builders[Types.Entities.REDCOCKROACH] = function(id) {
        return new Mobs.Redcockroach(id);
    };
    EntityFactory.builders[Types.Entities.BLUECOCKROACH] = function(id) {
        return new Mobs.Bluecockroach(id);
    };
    EntityFactory.builders[Types.Entities.SOYBEANBUG] = function(id) {
        return new Mobs.Soybeanbug(id);
    };
    EntityFactory.builders[Types.Entities.EARTHWORM] = function(id) {
        return new Mobs.Earthworm(id);
    };
    EntityFactory.builders[Types.Entities.CAT] = function(id) {
        return new Mobs.Cat(id);
    };
    EntityFactory.builders[Types.Entities.FIRESPIDER] = function(id) {
        return new Mobs.Firespider(id);
    };
    EntityFactory.builders[Types.Entities.SNOWMAN] = function(id) {
        return new Mobs.Snowman(id);
    };
    EntityFactory.builders[Types.Entities.QUEENANT] = function(id) {
        return new Mobs.Queenant(id);
    };
    EntityFactory.builders[Types.Entities.BEETLE] = function(id) {
        return new Mobs.Beetle(id);
    };
    EntityFactory.builders[Types.Entities.HONGCHEOL] = function(id) {
        return new Mobs.Hongcheol(id);
    };
    EntityFactory.builders[Types.Entities.BLAZESPIDER] = function(id) {
        return new Mobs.Blazespider(id);
    };
    EntityFactory.builders[Types.Entities.WHITETIGER] = function(id) {
        return new Mobs.Whitetiger(id);
    };
    EntityFactory.builders[Types.Entities.BLACKWIZARD] = function(id) {
        return new Mobs.Blackwizard(id);
    };
    EntityFactory.builders[Types.Entities.SMALLDEVIL] = function(id) {
        return new Mobs.Smalldevil(id);
    };
    EntityFactory.builders[Types.Entities.PIERROT] = function(id) {
        return new Mobs.Pierrot(id);
    };
    EntityFactory.builders[Types.Entities.MANTIS] = function(id) {
        return new Mobs.Mantis(id);
    };
    EntityFactory.builders[Types.Entities.POISONSPIDER] = function(id) {
        return new Mobs.Poisonspider(id);
    };
    EntityFactory.builders[Types.Entities.BABYSPIDER] = function(id) {
        return new Mobs.Babyspider(id);
    };
    EntityFactory.builders[Types.Entities.QUEENSPIDER] = function(id) {
        return new Mobs.Queenspider(id);
    };
    EntityFactory.builders[Types.Entities.SKYDINOSAUR] = function(id) {
        return new Mobs.Skydinosaur(id);
    };
    EntityFactory.builders[Types.Entities.CACTUS] = function(id) {
        return new Mobs.Cactus(id);
    };
    EntityFactory.builders[Types.Entities.DEVILKAZYA] = function(id) {
        return new Mobs.Devilkazya(id);
    };
    EntityFactory.builders[Types.Entities.CURSEDJANGSEUNG] = function(id) {
        return new Mobs.Cursedjangseung(id);
    };
    EntityFactory.builders[Types.Entities.SUICIDEGHOST] = function(id) {
        return new Mobs.Suicideghost(id);
    };
    EntityFactory.builders[Types.Entities.HELLSPIDER] = function(id) {
        return new Mobs.Hellspider(id);
    };
    EntityFactory.builders[Types.Entities.FROG] = function(id) {
        return new Mobs.Frog(id);
    };
    EntityFactory.builders[Types.Entities.CURSEDHAHOEMASK] = function(id) {
        return new Mobs.Cursedhahoemask(id);
    };
    EntityFactory.builders[Types.Entities.JIRISANMOONBEAR] = function(id) {
        return new Mobs.Jirisanmoonbear(id);
    };

    //===== items ======
 
    EntityFactory.builders[Types.Entities.SWORD1] = function(id, name, skillKind, skillLevel) {
        return new Items.Sword1(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.SWORD2] = function(id, name, skillKind, skillLevel) {
        return new Items.Sword2(id, skillKind, skillLevel);
    };

    EntityFactory.builders[Types.Entities.AXE] = function(id, name, skillKind, skillLevel) {
        return new Items.Axe(id, skillKind, skillLevel);
    };

    EntityFactory.builders[Types.Entities.REDSWORD] = function(id, name, skillKind, skillLevel) {
        return new Items.RedSword(id, skillKind, skillLevel);
    };

    EntityFactory.builders[Types.Entities.BLUESWORD] = function(id, name, skillKind, skillLevel) {
        return new Items.BlueSword(id, skillKind, skillLevel);
    };

    EntityFactory.builders[Types.Entities.GOLDENSWORD] = function(id, name, skillKind, skillLevel) {
        return new Items.GoldenSword(id, skillKind, skillLevel);
    };

    EntityFactory.builders[Types.Entities.MORNINGSTAR] = function(id, name, skillKind, skillLevel) {
        return new Items.MorningStar(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.SIDESWORD] = function(id, name, skillKind, skillLevel) {
        return new Items.SideSword(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.SPEAR] = function(id, name, skillKind, skillLevel) {
        return new Items.Spear(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.SCIMITAR] = function(id, name, skillKind, skillLevel) {
        return new Items.Scimitar(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.TRIDENT] = function(id, name, skillKind, skillLevel) {
        return new Items.Trident(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.BLUESCIMITAR] = function(id, name, skillKind, skillLevel) {
        return new Items.Bluescimitar(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.HAMMER] = function(id, name, skillKind, skillLevel) {
        return new Items.Hammer(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.GREENLIGHTSABER] = function(id, name, skillKind, skillLevel) {
        return new Items.Greenlightsaber(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.SKYLIGHTSABER] = function(id, name, skillKind, skillLevel) {
        return new Items.Skylightsaber(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.REDLIGHTSABER] = function(id, name, skillKind, skillLevel) {
        return new Items.Redlightsaber(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.REDMETALSWORD] = function(id, name, skillKind, skillLevel) {
        return new Items.Redmetalsword(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.BASTARDSWORD] = function(id, name, skillKind, skillLevel) {
        return new Items.Bastardsword(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.HALBERD] = function(id, name, skillKind, skillLevel) {
        return new Items.Halberd(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.ROSE] = function(id, name, skillKind, skillLevel) {
        return new Items.Rose(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.ICEROSE] = function(id, name, skillKind, skillLevel) {
        return new Items.Icerose(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.JUSTICEHAMMER] = function(id, name, skillKind, skillLevel) {
        return new Items.Justicehammer(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.FIRESWORD] = function(id, name, skillKind, skillLevel) {
        return new Items.Firesword(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.WHIP] = function(id, name, skillKind, skillLevel) {
        return new Items.Whip(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.FORESTGUARDIANSWORD] = function(id, name, skillKind, skillLevel) {
        return new Items.Forestguardiansword(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.SICKLE] = function(id, name, skillKind, skillLevel) {
        return new Items.Sickle(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.PLUNGER] = function(id, name, skillKind, skillLevel) {
        return new Items.Plunger(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.REDSICKLE] = function(id, name, skillKind, skillLevel) {
        return new Items.Redsickle(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.DAYWALKER] = function(id, name, skillKind, skillLevel) {
        return new Items.Daywalker(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.PURPLECLOUDKALLEGE] = function(id, name, skillKind, skillLevel) {
        return new Items.Purplecloudkallege(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.SEARAGE] = function(id, name, skillKind, skillLevel) {
        return new Items.Searage(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.MAGICSPEAR] = function(id, name, skillKind, skillLevel) {
        return new Items.Magicspear(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.BREAKER] = function(id, name, skillKind, skillLevel) {
        return new Items.Breaker(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.ENELTRIDENT] = function(id, name, skillKind, skillLevel) {
        return new Items.Eneltrident(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.RAINBOWSWORD] = function(id, name, skillKind, skillLevel) {
        return new Items.Rainbowsword(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.TYPHOON] = function(id, name, skillKind, skillLevel) {
        return new Items.Typhoon(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.MEMME] = function(id, name, skillKind, skillLevel) {
        return new Items.Memme(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.CANDYBAR] = function(id, name, skillKind, skillLevel) {
        return new Items.Candybar(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.BUTCHERKNIFE] = function(id, name, skillKind, skillLevel) {
        return new Items.Butcherknife(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.FIRESHOT] = function(id, name, skillKind, skillLevel) {
        return new Items.Fireshot(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.COMB] = function(id, name, skillKind, skillLevel) {
        return new Items.Comb(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.SQUEAKYHAMMER] = function(id, name, skillKind, skillLevel) {
        return new Items.Squeakyhammer(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.FIREPLAY] = function(id, name, skillKind, skillLevel) {
        return new Items.Fireplay(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.WEASTAFF] = function(id, name, skillKind, skillLevel) {
        return new Items.Weastaff(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.PINKSWORD] = function(id, name, skillKind, skillLevel) {
        return new Items.Pinksword(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.CONFERENCECALL] = function(id, name, skillKind, skillLevel) {
        return new Items.Conferencecall(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.CACTUSAXE] = function(id, name, skillKind, skillLevel) {
        return new Items.Cactusaxe(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.DEVILKAZYASWORD] = function(id, name, skillKind, skillLevel) {
        return new Items.Devilkazyasword(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.BAMBOOSPEAR] = function(id, name, skillKind, skillLevel) {
        return new Items.Bamboospear(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.PAEWOLDO] = function(id, name, skillKind, skillLevel) {
        return new Items.Paewoldo(id, skillKind, skillLevel);
    };

    EntityFactory.builders[Types.Entities.CLOTHARMOR] = function(id) {
        return new Items.ClothArmor(id);
    };
    EntityFactory.builders[Types.Entities.MAILARMOR] = function(id) {
        return new Items.MailArmor(id);
    };

    EntityFactory.builders[Types.Entities.LEATHERARMOR] = function(id) {
        return new Items.LeatherArmor(id);
    };

    EntityFactory.builders[Types.Entities.PLATEARMOR] = function(id) {
        return new Items.PlateArmor(id);
    };

    EntityFactory.builders[Types.Entities.REDARMOR] = function(id) {
        return new Items.RedArmor(id);
    };

    EntityFactory.builders[Types.Entities.GOLDENARMOR] = function(id) {
        return new Items.GoldenArmor(id);
    };
    EntityFactory.builders[Types.Entities.GREENARMOR] = function(id) {
        return new Items.GreenArmor(id);
    };
    EntityFactory.builders[Types.Entities.GREENWINGARMOR] = function(id) {
        return new Items.GreenWingArmor(id);
    };
    EntityFactory.builders[Types.Entities.GUARDARMOR] = function(id) {
        return new Items.GuardArmor(id);
    };
    EntityFactory.builders[Types.Entities.REDGUARDARMOR] = function(id) {
        return new Items.RedGuardArmor(id);
    };
    EntityFactory.builders[Types.Entities.WHITEARMOR] = function(id) {
        return new Items.WhiteArmor(id);
    };
    EntityFactory.builders[Types.Entities.RATARMOR] = function(id) {
        return new Items.RatArmor(id);
    };
    EntityFactory.builders[Types.Entities.BLUEPIRATEARMOR] = function(id) {
        return new Items.BluepirateArmor(id);
    };
    EntityFactory.builders[Types.Entities.CHEOLIARMOR] = function(id) {
        return new Items.CheoliArmor(id);
    };
    EntityFactory.builders[Types.Entities.DOVAKINARMOR] = function(id) {
        return new Items.DovakinArmor(id);
    };
    EntityFactory.builders[Types.Entities.GBWINGARMOR] = function(id) {
        return new Items.GbwingArmor(id);
    };
    EntityFactory.builders[Types.Entities.REDWINGARMOR] = function(id) {
        return new Items.RedwingArmor(id);
    };
    EntityFactory.builders[Types.Entities.SNOWFOXARMOR] = function(id) {
        return new Items.SnowfoxArmor(id);
    };
    EntityFactory.builders[Types.Entities.WOLFARMOR] = function(id) {
        return new Items.WolfArmor(id);
    };
    EntityFactory.builders[Types.Entities.BLUEWINGARMOR] = function(id) {
        return new Items.BluewingArmor(id);
    };
    EntityFactory.builders[Types.Entities.THIEFARMOR] = function(id) {
        return new Items.ThiefArmor(id);
    };
    EntityFactory.builders[Types.Entities.NINJAARMOR] = function(id) {
        return new Items.NinjaArmor(id);
    };
    EntityFactory.builders[Types.Entities.DRAGONARMOR] = function(id) {
        return new Items.DragonArmor(id);
    };
    EntityFactory.builders[Types.Entities.FALLENARMOR] = function(id) {
        return new Items.FallenArmor(id);
    };
    EntityFactory.builders[Types.Entities.PALADINARMOR] = function(id) {
        return new Items.PaladinArmor(id);
    };
    EntityFactory.builders[Types.Entities.CRYSTALARMOR] = function(id) {
        return new Items.CrystalArmor(id);
    };
    EntityFactory.builders[Types.Entities.ADHERERROBE] = function(id) {
        return new Items.AdhererRobe(id);
    };
    EntityFactory.builders[Types.Entities.FROSTARMOR] = function(id) {
        return new Items.FrostArmor(id);
    };
    EntityFactory.builders[Types.Entities.GAYARMOR] = function(id) {
        return new Items.GayArmor(id);
    };
    EntityFactory.builders[Types.Entities.SCHOOLUNIFORM] = function(id) {
        return new Items.SchoolUniform(id);
    };
    EntityFactory.builders[Types.Entities.BEAUTIFULLIFE] = function(id) {
        return new Items.BeautifulLife(id);
    };
    EntityFactory.builders[Types.Entities.REGIONARMOR] = function(id) {
        return new Items.RegionArmor(id);
    };
    EntityFactory.builders[Types.Entities.GHOSTRIDER] = function(id) {
        return new Items.GhostRider(id);
    };
    EntityFactory.builders[Types.Entities.TAEKWONDO] = function(id) {
        return new Items.Taekwondo(id);
    };
    EntityFactory.builders[Types.Entities.RABBITARMOR] = function(id) {
        return new Items.RabbitArmor(id);
    };
    EntityFactory.builders[Types.Entities.PORTALARMOR] = function(id) {
        return new Items.PortalArmor(id);
    };
    EntityFactory.builders[Types.Entities.PIRATEKING] = function(id) {
        return new Items.PirateKing(id);
    };
    EntityFactory.builders[Types.Entities.SEADRAGONARMOR] = function(id) {
        return new Items.SeadragonArmor(id);
    };
    EntityFactory.builders[Types.Entities.SHADOWREGIONARMOR] = function(id) {
        return new Items.ShadowregionArmor(id);
    };
    EntityFactory.builders[Types.Entities.ENELARMOR] = function(id) {
        return new Items.EnelArmor(id);
    };
    EntityFactory.builders[Types.Entities.MINISEADRAGONARMOR] = function(id) {
        return new Items.MiniseadragonArmor(id);
    };
    EntityFactory.builders[Types.Entities.HUNIARMOR] = function(id) {
        return new Items.HuniArmor(id);
    };
    EntityFactory.builders[Types.Entities.DAMBOARMOR] = function(id) {
        return new Items.DamboArmor(id);
    };
    EntityFactory.builders[Types.Entities.SQUIDARMOR] = function(id) {
        return new Items.SquidArmor(id);
    };
    EntityFactory.builders[Types.Entities.BEEARMOR] = function(id) {
        return new Items.BeeArmor(id);
    };
    EntityFactory.builders[Types.Entities.BLUEDAMBOARMOR] = function(id) {
        return new Items.BluedamboArmor(id);
    };
    EntityFactory.builders[Types.Entities.RUDOLFARMOR] = function(id) {
        return new Items.RudolfArmor(id);
    };
    EntityFactory.builders[Types.Entities.CHRISTMASARMOR] = function(id) {
        return new Items.ChristmasArmor(id);
    };
    EntityFactory.builders[Types.Entities.ROBOCOPARMOR] = function(id) {
        return new Items.RobocopArmor(id);
    };
    EntityFactory.builders[Types.Entities.PINKCOCKROACHARMOR] = function(id) {
        return new Items.PinkcockroachArmor(id);
    };
    EntityFactory.builders[Types.Entities.COCKROACHSUIT] = function(id) {
        return new Items.CockroachSuit(id);
    };
    EntityFactory.builders[Types.Entities.DINOSAURARMOR] = function(id) {
        return new Items.DinosaurArmor(id);
    };
    EntityFactory.builders[Types.Entities.CATARMOR] = function(id) {
        return new Items.CatArmor(id);
    };
    EntityFactory.builders[Types.Entities.SNOWMANARMOR] = function(id) {
        return new Items.SnowmanArmor(id);
    };
    EntityFactory.builders[Types.Entities.BEETLEARMOR] = function(id) {
        return new Items.BeetleArmor(id);
    };
    EntityFactory.builders[Types.Entities.HONGCHEOLARMOR] = function(id) {
        return new Items.HongcheolArmor(id);
    };
    EntityFactory.builders[Types.Entities.TIGERARMOR] = function(id) {
        return new Items.TigerArmor(id);
    };
    EntityFactory.builders[Types.Entities.WIZARDROBE] = function(id) {
        return new Items.WizardRobe(id);
    };
    EntityFactory.builders[Types.Entities.IRONKNIGHTARMOR] = function(id) {
        return new Items.IronknightArmor(id);
    };
    EntityFactory.builders[Types.Entities.EVILARMOR] = function(id) {
        return new Items.EvilArmor(id);
    };
    EntityFactory.builders[Types.Entities.GREENDAMBOARMOR] = function(id) {
        return new Items.GreendamboArmor(id);
    };
    EntityFactory.builders[Types.Entities.REDDAMBOARMOR] = function(id) {
        return new Items.ReddamboArmor(id);
    };
    EntityFactory.builders[Types.Entities.DEVILKAZYAARMOR] = function(id) {
        return new Items.DevilkazyaArmor(id);
    };
    EntityFactory.builders[Types.Entities.BRIDALMASK] = function(id) {
        return new Items.BridalMask(id);
    };
    EntityFactory.builders[Types.Entities.BLACKSPIDERARMOR] = function(id) {
        return new Items.BlackspiderArmor(id);
    };
    EntityFactory.builders[Types.Entities.FROGARMOR] = function(id) {
        return new Items.FrogArmor(id);
    };
    EntityFactory.builders[Types.Entities.BEARSEONBIARMOR] = function(id) {
        return new Items.BearseonbiArmor(id);
    };

    EntityFactory.builders[Types.Entities.ADMINARMOR] = function(id) {
        return new Items.AdminArmor(id);
    };
    EntityFactory.builders[Types.Entities.RAINBOWAPRO] = function(id) {
        return new Items.RainbowApro(id);
    };
    EntityFactory.builders[Types.Entities.COKEARMOR] = function(id) {
        return new Items.CokeArmor(id);
    };
    EntityFactory.builders[Types.Entities.FRIEDPOTATOARMOR] = function(id) {
        return new Items.FriedpotatoArmor(id);
    };
    EntityFactory.builders[Types.Entities.BURGERARMOR] = function(id) {
        return new Items.BurgerArmor(id);
    };
    EntityFactory.builders[Types.Entities.RADISHARMOR] = function(id) {
        return new Items.RadishArmor(id);
    };
    EntityFactory.builders[Types.Entities.HALLOWEENJKARMOR] = function(id) {
        return new Items.HalloweenJKArmor(id);
    };
    EntityFactory.builders[Types.Entities.FRANKENSTEINARMOR] = function(id) {
        return new Items.FrankensteinArmor(id);
    };

    EntityFactory.builders[Types.Entities.PENDANT1] = function(id, name, skillKind, skillLevel) {
        return new Items.Pendant1(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.GREENPENDANT] = function(id, name, skillKind, skillLevel) {
        return new Items.GreenPendant(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.PEARLPENDANT] = function(id, name, skillKind, skillLevel) {
        return new Items.PearlPendant(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.MARBLEPENDANT] = function(id, name, skillKind, skillLevel) {
        return new Items.MarblePendant(id, skillKind, skillLevel);
    };

    EntityFactory.builders[Types.Entities.RING1] = function(id, name, skillKind, skillLevel) {
        return new Items.Ring1(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.SPROUTRING] = function(id, name, skillKind, skillLevel) {
        return new Items.SproutRing(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.PEARLRING] = function(id, name, skillKind, skillLevel) {
        return new Items.PearlRing(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.SPIRITRING] = function(id, name, skillKind, skillLevel) {
        return new Items.SpiritRing(id, skillKind, skillLevel);
    };
    EntityFactory.builders[Types.Entities.ESSENTIALRAGE] = function(id, name, skillKind, skillLevel) {
        return new Items.EssentialRage(id, skillKind, skillLevel);
    };

    EntityFactory.builders[Types.Entities.FLASK] = function(id) {
        return new Items.Flask(id);
    };
    
    EntityFactory.builders[Types.Entities.FIREPOTION] = function(id) {
        return new Items.FirePotion(id);
    };

    EntityFactory.builders[Types.Entities.BURGER] = function(id) {
        return new Items.Burger(id);
    };
    
    EntityFactory.builders[Types.Entities.CAKE] = function(id) {
        return new Items.Cake(id);
    };
    EntityFactory.builders[Types.Entities.BOOK] = function(id) {
        return new Items.Book(id);
    };
    EntityFactory.builders[Types.Entities.CD] = function(id) {
        return new Items.Cd(id);
    };
    EntityFactory.builders[Types.Entities.SNOWPOTION] = function(id) {
        return new Items.Snowpotion(id);
    };
    EntityFactory.builders[Types.Entities.ROYALAZALEA] = function(id) {
        return new Items.Royalazalea(id);
    };
    EntityFactory.builders[Types.Entities.BLACKPOTION] = function(id) {
        return new Items.Blackpotion(id);
    };

    EntityFactory.builders[Types.Entities.CHEST] = function(id) {
        return new Chest(id);
    };


    //====== NPCs ======

    EntityFactory.builders[Types.Entities.GUARD] = function(id) {
        return new NPCs.Guard(id);
    };

    EntityFactory.builders[Types.Entities.KING] = function(id) {
        return new NPCs.King(id);
    };

    EntityFactory.builders[Types.Entities.VILLAGEGIRL] = function(id) {
        return new NPCs.VillageGirl(id);
    };

    EntityFactory.builders[Types.Entities.VILLAGER] = function(id) {
        return new NPCs.Villager(id);
    };
    
    EntityFactory.builders[Types.Entities.CODER] = function(id) {
        return new NPCs.Coder(id);
    };

    EntityFactory.builders[Types.Entities.AGENT] = function(id) {
        return new NPCs.Agent(id);
    };

    EntityFactory.builders[Types.Entities.RICK] = function(id) {
        return new NPCs.Rick(id);
    };

    EntityFactory.builders[Types.Entities.SCIENTIST] = function(id) {
        return new NPCs.Scientist(id);
    };

    EntityFactory.builders[Types.Entities.NYAN] = function(id) {
        return new NPCs.Nyan(id);
    };

    EntityFactory.builders[Types.Entities.PRIEST] = function(id) {
        return new NPCs.Priest(id);
    };
    
    EntityFactory.builders[Types.Entities.SORCERER] = function(id) {
        return new NPCs.Sorcerer(id);
    };

    EntityFactory.builders[Types.Entities.OCTOCAT] = function(id) {
        return new NPCs.Octocat(id);
    };
    
    EntityFactory.builders[Types.Entities.BEACHNPC] = function(id) {
        return new NPCs.BeachNpc(id);
    };
    
    EntityFactory.builders[Types.Entities.FORESTNPC] = function(id) {
        return new NPCs.ForestNpc(id);
    };
    
    EntityFactory.builders[Types.Entities.DESERTNPC] = function(id) {
        return new NPCs.DesertNpc(id);
    };
    
    EntityFactory.builders[Types.Entities.LAVANPC] = function(id) {
        return new NPCs.LavaNpc(id);
    };
    EntityFactory.builders[Types.Entities.BOXINGMAN] = function(id) {
        return new NPCs.Boxingman(id);
    };
    EntityFactory.builders[Types.Entities.VAMPIRE] = function(id) {
        return new NPCs.Vampire(id);
    };
    EntityFactory.builders[Types.Entities.DOCTOR] = function(id) {
        return new NPCs.Doctor(id);
    };
    EntityFactory.builders[Types.Entities.ODDEYECAT] = function(id) {
        return new NPCs.Oddeyecat(id);
    };
    EntityFactory.builders[Types.Entities.VENDINGMACHINE] = function(id) {
        return new NPCs.Vendingmachine(id);
    };
    EntityFactory.builders[Types.Entities.FISHERMAN] = function(id) {
        return new NPCs.Fisherman(id);
    };
    EntityFactory.builders[Types.Entities.OCTOPUS] = function(id) {
        return new NPCs.Octopus(id);
    };
    EntityFactory.builders[Types.Entities.SOLDIER] = function(id) {
        return new NPCs.Soldier(id);
    };
    EntityFactory.builders[Types.Entities.MERMAIDNPC] = function(id) {
        return new NPCs.Mermaidnpc(id);
    };
    EntityFactory.builders[Types.Entities.SPONGE] = function(id) {
        return new NPCs.Sponge(id);
    };
    EntityFactory.builders[Types.Entities.FAIRYNPC] = function(id) {
        return new NPCs.Fairynpc(id);
    };
    EntityFactory.builders[Types.Entities.SHEPHERDBOY] = function(id) {
        return new NPCs.Shepherdboy(id);
    };
    EntityFactory.builders[Types.Entities.ZOMBIEGF] = function(id) {
        return new NPCs.Zombiegf(id);
    };
    EntityFactory.builders[Types.Entities.PIRATEGIRLNPC] = function(id) {
        return new NPCs.Pirategirlnpc(id);
    };
    EntityFactory.builders[Types.Entities.BLUEBIKINIGIRLNPC] = function(id) {
        return new NPCs.Bluebikinigirlnpc(id);
    };
    EntityFactory.builders[Types.Entities.REDBIKINIGIRLNPC] = function(id) {
        return new NPCs.Redbikinigirlnpc(id);
    };
    EntityFactory.builders[Types.Entities.IAMVERYCOLDNPC] = function(id) {
        return new NPCs.Iamverycoldnpc(id);
    };
    EntityFactory.builders[Types.Entities.ICEELFNPC] = function(id) {
        return new NPCs.Iceelfnpc(id);
    };
    EntityFactory.builders[Types.Entities.REDSTOREMANNPC] = function(id) {
        return new NPCs.Redstoremannpc(id);
    };
    EntityFactory.builders[Types.Entities.BLUESTOREMANNPC] = function(id) {
        return new NPCs.Bluestoremannpc(id);
    };
    EntityFactory.builders[Types.Entities.ELFNPC] = function(id) {
        return new NPCs.Elfnpc(id);
    };
    EntityFactory.builders[Types.Entities.SNOWSHEPHERDBOY] = function(id) {
        return new NPCs.Snowshepherdboy(id);
    };
    EntityFactory.builders[Types.Entities.ANGELNPC] = function(id) {
        return new NPCs.Angelnpc(id);
    };
    EntityFactory.builders[Types.Entities.MOMANGELNPC] = function(id) {
        return new NPCs.Momangelnpc(id);
    };
    EntityFactory.builders[Types.Entities.SUPERIORANGELNPC] = function(id) {
        return new NPCs.Superiorangelnpc(id);
    };
    EntityFactory.builders[Types.Entities.FIRSTSONANGELNPC] = function(id) {
        return new NPCs.Firstsonangelnpc(id);
    };
    EntityFactory.builders[Types.Entities.SECONDSONANGELNPC] = function(id) {
        return new NPCs.Secondsonangelnpc(id);
    };
    EntityFactory.builders[Types.Entities.MOJOJOJONPC] = function(id) {
        return new NPCs.Mojojojonpc(id);
    };
    EntityFactory.builders[Types.Entities.ANCIENTMANUMENTNPC] = function(id) {
        return new NPCs.Ancientmanumentnpc(id);
    };


    return EntityFactory;
});