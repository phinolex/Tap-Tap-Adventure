define(["mobs", "items", "npcs", "warrior", "archer", "chest"], function(e, n, i, t, r, s) {
    var u = {};
    return u.createEntity = function(e, n, i, t, r) {
        if (!e) return void log.error("kind is undefined", !0);
        if (!_.isFunction(u.builders[e])) throw Error(e + " is not a valid Entity type");
        return u.builders[e](n, i, t, r)
    }, u.builders = [], u.builders[Types.Entities.ARCHERARMOR] = function(e) {
        return new n.ArcherArmor(e)
    }, u.builders[Types.Entities.LEATHERARCHERARMOR] = function(e) {
        return new n.LeatherarcherArmor(e)
    }, u.builders[Types.Entities.MAILARCHERARMOR] = function(e) {
        return new n.MailarcherArmor(e)
    }, u.builders[Types.Entities.PLATEARCHERARMOR] = function(e) {
        return new n.PlatearcherArmor(e)
    }, u.builders[Types.Entities.REDARCHERARMOR] = function(e) {
        return new n.RedarcherArmor(e)
    }, u.builders[Types.Entities.GOLDENARCHERARMOR] = function(e) {
        return new n.GoldenarcherArmor(e)
    }, u.builders[Types.Entities.GREENARCHERARMOR] = function(e) {
        return new n.GreenarcherArmor(e)
    }, u.builders[Types.Entities.GREENWINGARCHERARMOR] = function(e) {
        return new n.GreenwingarcherArmor(e)
    }, u.builders[Types.Entities.GUARDARCHERARMOR] = function(e) {
        return new n.GuardarcherArmor(e)
    }, u.builders[Types.Entities.REDGUARDARCHERARMOR] = function(e) {
        return new n.RedguardarcherArmor(e)
    }, u.builders[Types.Entities.WHITEARCHERARMOR] = function(e) {
        return new n.WhitearcherArmor(e)
    }, u.builders[Types.Entities.RATARCHERARMOR] = function(e) {
        return new n.RatarcherArmor(e)
    }, u.builders[Types.Entities.PIRATEARCHERARMOR] = function(e) {
        return new n.PiratearcherArmor(e)
    }, u.builders[Types.Entities.CHEOLIARCHERARMOR] = function(e) {
        return new n.CheoliarcherArmor(e)
    }, u.builders[Types.Entities.DOVAKINARCHERARMOR] = function(e) {
        return new n.DovakinarcherArmor(e)
    }, u.builders[Types.Entities.GBWINGARCHERARMOR] = function(e) {
        return new n.GbwingarcherArmor(e)
    }, u.builders[Types.Entities.REDWINGARCHERARMOR] = function(e) {
        return new n.RedwingarcherArmor(e)
    }, u.builders[Types.Entities.SNOWFOXARCHERARMOR] = function(e) {
        return new n.SnowfoxarcherArmor(e)
    }, u.builders[Types.Entities.WOLFARCHERARMOR] = function(e) {
        return new n.WolfarcherArmor(e)
    }, u.builders[Types.Entities.BLUEWINGARCHERARMOR] = function(e) {
        return new n.BluewingarcherArmor(e)
    }, u.builders[Types.Entities.FALLENARCHERARMOR] = function(e) {
        return new n.FallenarcherArmor(e)
    }, u.builders[Types.Entities.CRYSTALARCHERARMOR] = function(e) {
        return new n.CrystalarcherArmor(e)
    }, u.builders[Types.Entities.LEGOLASARMOR] = function(e) {
        return new n.LegolasArmor(e)
    }, u.builders[Types.Entities.ADHERERARCHERARMOR] = function(e) {
        return new n.AdhererarcherArmor(e)
    }, u.builders[Types.Entities.ARCHERSCHOOLUNIFORM] = function(e) {
        return new n.ArcherschoolUniform(e)
    }, u.builders[Types.Entities.COMBATUNIFORM] = function(e) {
        return new n.CombatUniform(e)
    }, u.builders[Types.Entities.GAYARCHERARMOR] = function(e) {
        return new n.GayarcherArmor(e)
    }, u.builders[Types.Entities.WOODENBOW] = function(e, i, t, r) {
        return new n.WoodenBow(e, t, r)
    }, u.builders[Types.Entities.PLASTICBOW] = function(e, i, t, r) {
        return new n.PlasticBow(e, t, r)
    }, u.builders[Types.Entities.IRONBOW] = function(e, i, t, r) {
        return new n.IronBow(e, t, r)
    }, u.builders[Types.Entities.REDBOW] = function(e, i, t, r) {
        return new n.RedBow(e, t, r)
    }, u.builders[Types.Entities.VIOLETBOW] = function(e, i, t, r) {
        return new n.VioletBow(e, t, r)
    }, u.builders[Types.Entities.DEATHBOW] = function(e, i, t, r) {
        return new n.DeathBow(e, t, r)
    }, u.builders[Types.Entities.GOLDENBOW] = function(e, i, t, r) {
        return new n.GoldenBow(e, t, r)
    }, u.builders[Types.Entities.WATERMELONBOW] = function(e, i, t, r) {
        return new n.WatermelonBow(e, t, r)
    }, u.builders[Types.Entities.GREENBOW] = function(e, i, t, r) {
        return new n.GreenBow(e, t, r)
    }, u.builders[Types.Entities.REDENELBOW] = function(e, i, t, r) {
        return new n.RedenelBow(e, t, r)
    }, u.builders[Types.Entities.MERMAIDBOW] = function(e, i, t, r) {
        return new n.MermaidBow(e, t, r)
    }, u.builders[Types.Entities.SEAHORSEBOW] = function(e, i, t, r) {
        return new n.SeahorseBow(e, t, r)
    }, u.builders[Types.Entities.HUNTERBOW] = function(e, i, t, r) {
        return new n.HunterBow(e, t, r)
    }, u.builders[Types.Entities.GREENLIGHTBOW] = function(e, i, t, r) {
        return new n.GreenlightBow(e, t, r)
    }, u.builders[Types.Entities.SKYLIGHTBOW] = function(e, i, t, r) {
        return new n.SkylightBow(e, t, r)
    }, u.builders[Types.Entities.REDLIGHTBOW] = function(e, i, t, r) {
        return new n.RedlightBow(e, t, r)
    }, u.builders[Types.Entities.CAPTAINBOW] = function(e, i, t, r) {
        return new n.CaptainBow(e, t, r)
    }, u.builders[Types.Entities.REDMETALBOW] = function(e, i, t, r) {
        return new n.RedmetalBow(e, t, r)
    }, u.builders[Types.Entities.MARINEBOW] = function(e, i, t, r) {
        return new n.MarineBow(e, t, r)
    }, u.builders[Types.Entities.JUSTICEBOW] = function(e, i, t, r) {
        return new n.JusticeBow(e, t, r)
    }, u.builders[Types.Entities.ROSEBOW] = function(e, i, t, r) {
        return new n.RoseBow(e, t, r)
    }, u.builders[Types.Entities.CRYSTALBOW] = function(e, i, t, r) {
        return new n.CrystalBow(e, t, r)
    }, u.builders[Types.Entities.GAYBOW] = function(e, i, t, r) {
        return new n.GayBow(e, t, r)
    }, u.builders[Types.Entities.FORESTBOW] = function(e, i, t, r) {
        return new n.ForestBow(e, t, r)
    }, u.builders[Types.Entities.SICKLEBOW] = function(e, i, t, r) {
        return new n.SickleBow(e, t, r)
    }, u.builders[Types.Entities.BLOODBOW] = function(e, i, t, r) {
        return new n.BloodBow(e, t, r)
    }, u.builders[Types.Entities.REDSICKLEBOW] = function(e, i, t, r) {
        return new n.RedsickleBow(e, t, r)
    }, u.builders[Types.Entities.WARRIOR] = function(e, n) {
        return new t(e, n)
    }, u.builders[Types.Entities.ARCHER] = function(e, n) {
        return new r(e, n)
    }, u.builders[Types.Entities.RAT] = function(n) {
        return new e.Rat(n)
    }, u.builders[Types.Entities.SKELETON] = function(n) {
        return new e.Skeleton(n)
    }, u.builders[Types.Entities.SKELETON2] = function(n) {
        return new e.Skeleton2(n)
    }, u.builders[Types.Entities.SPECTRE] = function(n) {
        return new e.Spectre(n)
    }, u.builders[Types.Entities.DEATHKNIGHT] = function(n) {
        return new e.Deathknight(n)
    }, u.builders[Types.Entities.GOBLIN] = function(n) {
        return new e.Goblin(n)
    }, u.builders[Types.Entities.OGRE] = function(n) {
        return new e.Ogre(n)
    }, u.builders[Types.Entities.CRAB] = function(n) {
        return new e.Crab(n)
    }, u.builders[Types.Entities.SNEK] = function(n) {
        return new e.Snek(n)
    }, u.builders[Types.Entities.EYE] = function(n) {
        return new e.Eye(n)
    }, u.builders[Types.Entities.BAT] = function(n) {
        return new e.Bat(n)
    }, u.builders[Types.Entities.WIZARD] = function(n) {
        return new e.Wizard(n)
    }, u.builders[Types.Entities.SKELETONKING] = function(n) {
        return new e.Skeletonking(n)
    }, u.builders[Types.Entities.ORC] = function(n) {
        return new e.Orc(n)
    }, u.builders[Types.Entities.GOLEM] = function(n) {
        return new e.Golem(n)
    }, u.builders[Types.Entities.OLDOGRE] = function(n) {
        return new e.Oldogre(n)
    }, u.builders[Types.Entities.MIMIC] = function(n) {
        return new e.Mimic(n)
    }, u.builders[Types.Entities.HOBGOBLIN] = function(n) {
        return new e.Hobgoblin(n)
    }, u.builders[Types.Entities.YELLOWMOUSE] = function(n) {
        return new e.Yellowmouse(n)
    }, u.builders[Types.Entities.WHITEMOUSE] = function(n) {
        return new e.Whitemouse(n)
    }, u.builders[Types.Entities.BROWNMOUSE] = function(n) {
        return new e.Brownmouse(n)
    }, u.builders[Types.Entities.REDMOUSE] = function(n) {
        return new e.Redmouse(n)
    }, u.builders[Types.Entities.REDGUARD] = function(n) {
        return new e.Redguard(n)
    }, u.builders[Types.Entities.INFECTEDGUARD] = function(n) {
        return new e.Infectedguard(n)
    }, u.builders[Types.Entities.LIVINGARMOR] = function(n) {
        return new e.Livingarmor(n)
    }, u.builders[Types.Entities.MERMAID] = function(n) {
        return new e.Mermaid(n)
    }, u.builders[Types.Entities.YELLOWFISH] = function(n) {
        return new e.Yellowfish(n)
    }, u.builders[Types.Entities.GREENFISH] = function(n) {
        return new e.Greenfish(n)
    }, u.builders[Types.Entities.REDFISH] = function(n) {
        return new e.Redfish(n)
    }, u.builders[Types.Entities.CLAM] = function(n) {
        return new e.Clam(n)
    }, u.builders[Types.Entities.PRETA] = function(n) {
        return new e.Preta(n)
    }, u.builders[Types.Entities.PIRATESKELETON] = function(n) {
        return new e.Pirateskeleton(n)
    }, u.builders[Types.Entities.PENGUIN] = function(n) {
        return new e.Penguin(n)
    }, u.builders[Types.Entities.MOLEKING] = function(n) {
        return new e.Moleking(n)
    }, u.builders[Types.Entities.DARKSKELETON] = function(n) {
        return new e.Darkskeleton(n)
    }, u.builders[Types.Entities.GREENPIRATESKELETON] = function(n) {
        return new e.Greenpirateskeleton(n)
    }, u.builders[Types.Entities.BLACKPIRATESKELETON] = function(n) {
        return new e.Blackpirateskeleton(n)
    }, u.builders[Types.Entities.REDPIRATESKELETON] = function(n) {
        return new e.Redpirateskeleton(n)
    }, u.builders[Types.Entities.YELLOWPRETA] = function(n) {
        return new e.Yellowpreta(n)
    }, u.builders[Types.Entities.BLUEPRETA] = function(n) {
        return new e.Bluepreta(n)
    }, u.builders[Types.Entities.MINIKNIGHT] = function(n) {
        return new e.Miniknight(n)
    }, u.builders[Types.Entities.WOLF] = function(n) {
        return new e.Wolf(n)
    }, u.builders[Types.Entities.PINKELF] = function(n) {
        return new e.Pinkelf(n)
    }, u.builders[Types.Entities.SKYELF] = function(n) {
        return new e.Skyelf(n)
    }, u.builders[Types.Entities.REDELF] = function(n) {
        return new e.Redelf(n)
    }, u.builders[Types.Entities.HERMITCRAB] = function(n) {
        return new e.Hermitcrab(n)
    }, u.builders[Types.Entities.ZOMBIE] = function(n) {
        return new e.Zombie(n)
    }, u.builders[Types.Entities.PIRATECAPTAIN] = function(n) {
        return new e.Piratecaptain(n)
    }, u.builders[Types.Entities.IRONOGRE] = function(n) {
        return new e.Ironogre(n)
    }, u.builders[Types.Entities.OGRELORD] = function(n) {
        return new e.Ogrelord(n)
    }, u.builders[Types.Entities.ADHERER] = function(n) {
        return new e.Adherer(n)
    }, u.builders[Types.Entities.ICEGOLEM] = function(n) {
        return new e.Icegolem(n)
    }, u.builders[Types.Entities.DESERTSCOLPION] = function(n) {
        return new e.Desertscolpion(n)
    }, u.builders[Types.Entities.DARKSCOLPION] = function(n) {
        return new e.Darkscolpion(n)
    }, u.builders[Types.Entities.VULTURE] = function(n) {
        return new e.Vulture(n)
    }, u.builders[Types.Entities.FORESTDRAGON] = function(n) {
        return new e.Forestdragon(n)
    }, u.builders[Types.Entities.CRYSTALSCOLPION] = function(n) {
        return new e.Crystalscolpion(n)
    }, u.builders[Types.Entities.ELIMINATOR] = function(n) {
        return new e.Eliminator(n)
    }, u.builders[Types.Entities.FROSTQUEEN] = function(n) {
        return new e.Frostqueen(n)
    }, u.builders[Types.Entities.SNOWRABBIT] = function(n) {
        return new e.Snowrabbit(n)
    }, u.builders[Types.Entities.SNOWWOLF] = function(n) {
        return new e.Snowwolf(n)
    }, u.builders[Types.Entities.ICEKNIGHT] = function(n) {
        return new e.Iceknight(n)
    }, u.builders[Types.Entities.MINIICEKNIGHT] = function(n) {
        return new e.Miniiceknight(n)
    }, u.builders[Types.Entities.SNOWELF] = function(n) {
        return new e.Snowelf(n)
    }, u.builders[Types.Entities.WHITEBEAR] = function(n) {
        return new e.Whitebear(n)
    }, u.builders[Types.Entities.COBRA] = function(n) {
        return new e.Cobra(n)
    }, u.builders[Types.Entities.GOLDGOLEM] = function(n) {
        return new e.Goldgolem(n)
    }, u.builders[Types.Entities.DARKREGION] = function(n) {
        return new e.Darkregion(n)
    }, u.builders[Types.Entities.DARKREGIONILLUSION] = function(n) {
        return new e.Darkregionillusion(n)
    }, u.builders[Types.Entities.NIGHTMAREREGION] = function(n) {
        return new e.Nightmareregion(n)
    }, u.builders[Types.Entities.DARKOGRE] = function(n) {
        return new e.Darkogre(n)
    }, u.builders[Types.Entities.PAIN] = function(n) {
        return new e.Pain(n)
    }, u.builders[Types.Entities.ICEVULTURE] = function(n) {
        return new e.Icevulture(n)
    }, u.builders[Types.Entities.REGIONHENCHMAN] = function(n) {
        return new e.Regionhenchman(n)
    }, u.builders[Types.Entities.PURPLEPRETA] = function(n) {
        return new e.Purplepreta(n)
    }, u.builders[Types.Entities.FLAREDEATHKNIGHT] = function(n) {
        return new e.Flaredeathknight(n)
    }, u.builders[Types.Entities.SNOWLADY] = function(n) {
        return new e.Snowlady(n)
    }, u.builders[Types.Entities.SEADRAGON] = function(n) {
        return new e.Seadragon(n)
    }, u.builders[Types.Entities.SHADOWREGION] = function(n) {
        return new e.Shadowregion(n)
    }, u.builders[Types.Entities.LIGHTNINGGUARDIAN] = function(n) {
        return new e.Lightningguardian(n)
    }, u.builders[Types.Entities.ENEL] = function(n) {
        return new e.Enel(n)
    }, u.builders[Types.Entities.MINIDRAGON] = function(n) {
        return new e.Minidragon(n)
    }, u.builders[Types.Entities.MINISEADRAGON] = function(n) {
        return new e.Miniseadragon(n)
    }, u.builders[Types.Entities.MINIEMPEROR] = function(n) {
        return new e.Miniemperor(n)
    }, u.builders[Types.Entities.SLIME] = function(n) {
        return new e.Slime(n)
    }, u.builders[Types.Entities.KAONASHI] = function(n) {
        return new e.Kaonashi(n)
    }, u.builders[Types.Entities.WINDGUARDIAN] = function(n) {
        return new e.Windguardian(n)
    }, u.builders[Types.Entities.SQUID] = function(n) {
        return new e.Squid(n)
    }, u.builders[Types.Entities.RHAPHIDOPHORIDAE] = function(n) {
        return new e.Rhaphidophoridae(n)
    }, u.builders[Types.Entities.BEE] = function(n) {
        return new e.Bee(n)
    }, u.builders[Types.Entities.ANT] = function(n) {
        return new e.Ant(n)
    }, u.builders[Types.Entities.RUDOLF] = function(n) {
        return new e.Rudolf(n)
    }, u.builders[Types.Entities.SANTAELF] = function(n) {
        return new e.Santaelf(n)
    }, u.builders[Types.Entities.SANTA] = function(n) {
        return new e.Santa(n)
    }, u.builders[Types.Entities.SOLDIERANT] = function(n) {
        return new e.Soldierant(n)
    }, u.builders[Types.Entities.REDCOCKROACH] = function(n) {
        return new e.Redcockroach(n)
    }, u.builders[Types.Entities.BLUECOCKROACH] = function(n) {
        return new e.Bluecockroach(n)
    }, u.builders[Types.Entities.SOYBEANBUG] = function(n) {
        return new e.Soybeanbug(n)
    }, u.builders[Types.Entities.EARTHWORM] = function(n) {
        return new e.Earthworm(n)
    }, u.builders[Types.Entities.CAT] = function(n) {
        return new e.Cat(n)
    }, u.builders[Types.Entities.FIRESPIDER] = function(n) {
        return new e.Firespider(n)
    }, u.builders[Types.Entities.SNOWMAN] = function(n) {
        return new e.Snowman(n)
    }, u.builders[Types.Entities.QUEENANT] = function(n) {
        return new e.Queenant(n)
    }, u.builders[Types.Entities.BEETLE] = function(n) {
        return new e.Beetle(n)
    }, u.builders[Types.Entities.HONGCHEOL] = function(n) {
        return new e.Hongcheol(n)
    }, u.builders[Types.Entities.BLAZESPIDER] = function(n) {
        return new e.Blazespider(n)
    }, u.builders[Types.Entities.WHITETIGER] = function(n) {
        return new e.Whitetiger(n)
    }, u.builders[Types.Entities.BLACKWIZARD] = function(n) {
        return new e.Blackwizard(n)
    }, u.builders[Types.Entities.SMALLDEVIL] = function(n) {
        return new e.Smalldevil(n)
    }, u.builders[Types.Entities.PIERROT] = function(n) {
        return new e.Pierrot(n)
    }, u.builders[Types.Entities.MANTIS] = function(n) {
        return new e.Mantis(n)
    }, u.builders[Types.Entities.POISONSPIDER] = function(n) {
        return new e.Poisonspider(n)
    }, u.builders[Types.Entities.BABYSPIDER] = function(n) {
        return new e.Babyspider(n)
    }, u.builders[Types.Entities.QUEENSPIDER] = function(n) {
        return new e.Queenspider(n)
    }, u.builders[Types.Entities.SKYDINOSAUR] = function(n) {
        return new e.Skydinosaur(n)
    }, u.builders[Types.Entities.CACTUS] = function(n) {
        return new e.Cactus(n)
    }, u.builders[Types.Entities.DEVILKAZYA] = function(n) {
        return new e.Devilkazya(n)
    }, u.builders[Types.Entities.CURSEDJANGSEUNG] = function(n) {
        return new e.Cursedjangseung(n)
    }, u.builders[Types.Entities.SUICIDEGHOST] = function(n) {
        return new e.Suicideghost(n)
    }, u.builders[Types.Entities.HELLSPIDER] = function(n) {
        return new e.Hellspider(n)
    }, u.builders[Types.Entities.FROG] = function(n) {
        return new e.Frog(n)
    }, u.builders[Types.Entities.CURSEDHAHOEMASK] = function(n) {
        return new e.Cursedhahoemask(n)
    }, u.builders[Types.Entities.JIRISANMOONBEAR] = function(n) {
        return new e.Jirisanmoonbear(n)
    }, u.builders[Types.Entities.SWORD1] = function(e, i, t, r) {
        return new n.Sword1(e, t, r)
    }, u.builders[Types.Entities.SWORD2] = function(e, i, t, r) {
        return new n.Sword2(e, t, r)
    }, u.builders[Types.Entities.AXE] = function(e, i, t, r) {
        return new n.Axe(e, t, r)
    }, u.builders[Types.Entities.REDSWORD] = function(e, i, t, r) {
        return new n.RedSword(e, t, r)
    }, u.builders[Types.Entities.BLUESWORD] = function(e, i, t, r) {
        return new n.BlueSword(e, t, r)
    }, u.builders[Types.Entities.GOLDENSWORD] = function(e, i, t, r) {
        return new n.GoldenSword(e, t, r)
    }, u.builders[Types.Entities.MORNINGSTAR] = function(e, i, t, r) {
        return new n.MorningStar(e, t, r)
    }, u.builders[Types.Entities.SIDESWORD] = function(e, i, t, r) {
        return new n.SideSword(e, t, r)
    }, u.builders[Types.Entities.SPEAR] = function(e, i, t, r) {
        return new n.Spear(e, t, r)
    }, u.builders[Types.Entities.SCIMITAR] = function(e, i, t, r) {
        return new n.Scimitar(e, t, r)
    }, u.builders[Types.Entities.TRIDENT] = function(e, i, t, r) {
        return new n.Trident(e, t, r)
    }, u.builders[Types.Entities.BLUESCIMITAR] = function(e, i, t, r) {
        return new n.Bluescimitar(e, t, r)
    }, u.builders[Types.Entities.HAMMER] = function(e, i, t, r) {
        return new n.Hammer(e, t, r)
    }, u.builders[Types.Entities.GREENLIGHTSABER] = function(e, i, t, r) {
        return new n.Greenlightsaber(e, t, r)
    }, u.builders[Types.Entities.SKYLIGHTSABER] = function(e, i, t, r) {
        return new n.Skylightsaber(e, t, r)
    }, u.builders[Types.Entities.REDLIGHTSABER] = function(e, i, t, r) {
        return new n.Redlightsaber(e, t, r)
    }, u.builders[Types.Entities.REDMETALSWORD] = function(e, i, t, r) {
        return new n.Redmetalsword(e, t, r)
    }, u.builders[Types.Entities.BASTARDSWORD] = function(e, i, t, r) {
        return new n.Bastardsword(e, t, r)
    }, u.builders[Types.Entities.HALBERD] = function(e, i, t, r) {
        return new n.Halberd(e, t, r)
    }, u.builders[Types.Entities.ROSE] = function(e, i, t, r) {
        return new n.Rose(e, t, r)
    }, u.builders[Types.Entities.ICEROSE] = function(e, i, t, r) {
        return new n.Icerose(e, t, r)
    }, u.builders[Types.Entities.JUSTICEHAMMER] = function(e, i, t, r) {
        return new n.Justicehammer(e, t, r)
    }, u.builders[Types.Entities.FIRESWORD] = function(e, i, t, r) {
        return new n.Firesword(e, t, r)
    }, u.builders[Types.Entities.WHIP] = function(e, i, t, r) {
        return new n.Whip(e, t, r)
    }, u.builders[Types.Entities.FORESTGUARDIANSWORD] = function(e, i, t, r) {
        return new n.Forestguardiansword(e, t, r)
    }, u.builders[Types.Entities.SICKLE] = function(e, i, t, r) {
        return new n.Sickle(e, t, r)
    }, u.builders[Types.Entities.PLUNGER] = function(e, i, t, r) {
        return new n.Plunger(e, t, r)
    }, u.builders[Types.Entities.REDSICKLE] = function(e, i, t, r) {
        return new n.Redsickle(e, t, r)
    }, u.builders[Types.Entities.DAYWALKER] = function(e, i, t, r) {
        return new n.Daywalker(e, t, r)
    }, u.builders[Types.Entities.PURPLECLOUDKALLEGE] = function(e, i, t, r) {
        return new n.Purplecloudkallege(e, t, r)
    }, u.builders[Types.Entities.SEARAGE] = function(e, i, t, r) {
        return new n.Searage(e, t, r)
    }, u.builders[Types.Entities.MAGICSPEAR] = function(e, i, t, r) {
        return new n.Magicspear(e, t, r)
    }, u.builders[Types.Entities.BREAKER] = function(e, i, t, r) {
        return new n.Breaker(e, t, r)
    }, u.builders[Types.Entities.ENELTRIDENT] = function(e, i, t, r) {
        return new n.Eneltrident(e, t, r)
    }, u.builders[Types.Entities.RAINBOWSWORD] = function(e, i, t, r) {
        return new n.Rainbowsword(e, t, r)
    }, u.builders[Types.Entities.TYPHOON] = function(e, i, t, r) {
        return new n.Typhoon(e, t, r)
    }, u.builders[Types.Entities.MEMME] = function(e, i, t, r) {
        return new n.Memme(e, t, r)
    }, u.builders[Types.Entities.CANDYBAR] = function(e, i, t, r) {
        return new n.Candybar(e, t, r)
    }, u.builders[Types.Entities.BUTCHERKNIFE] = function(e, i, t, r) {
        return new n.Butcherknife(e, t, r)
    }, u.builders[Types.Entities.FIRESHOT] = function(e, i, t, r) {
        return new n.Fireshot(e, t, r)
    }, u.builders[Types.Entities.COMB] = function(e, i, t, r) {
        return new n.Comb(e, t, r)
    }, u.builders[Types.Entities.SQUEAKYHAMMER] = function(e, i, t, r) {
        return new n.Squeakyhammer(e, t, r)
    }, u.builders[Types.Entities.FIREPLAY] = function(e, i, t, r) {
        return new n.Fireplay(e, t, r)
    }, u.builders[Types.Entities.WEASTAFF] = function(e, i, t, r) {
        return new n.Weastaff(e, t, r)
    }, u.builders[Types.Entities.PINKSWORD] = function(e, i, t, r) {
        return new n.Pinksword(e, t, r)
    }, u.builders[Types.Entities.CONFERENCECALL] = function(e, i, t, r) {
        return new n.Conferencecall(e, t, r)
    }, u.builders[Types.Entities.CACTUSAXE] = function(e, i, t, r) {
        return new n.Cactusaxe(e, t, r)
    }, u.builders[Types.Entities.DEVILKAZYASWORD] = function(e, i, t, r) {
        return new n.Devilkazyasword(e, t, r)
    }, u.builders[Types.Entities.BAMBOOSPEAR] = function(e, i, t, r) {
        return new n.Bamboospear(e, t, r)
    }, u.builders[Types.Entities.PAEWOLDO] = function(e, i, t, r) {
        return new n.Paewoldo(e, t, r)
    }, u.builders[Types.Entities.CLOTHARMOR] = function(e) {
        return new n.ClothArmor(e)
    }, u.builders[Types.Entities.MAILARMOR] = function(e) {
        return new n.MailArmor(e)
    }, u.builders[Types.Entities.LEATHERARMOR] = function(e) {
        return new n.LeatherArmor(e)
    }, u.builders[Types.Entities.PLATEARMOR] = function(e) {
        return new n.PlateArmor(e)
    }, u.builders[Types.Entities.REDARMOR] = function(e) {
        return new n.RedArmor(e)
    }, u.builders[Types.Entities.GOLDENARMOR] = function(e) {
        return new n.GoldenArmor(e)
    }, u.builders[Types.Entities.GREENARMOR] = function(e) {
        return new n.GreenArmor(e)
    }, u.builders[Types.Entities.GREENWINGARMOR] = function(e) {
        return new n.GreenWingArmor(e)
    }, u.builders[Types.Entities.GUARDARMOR] = function(e) {
        return new n.GuardArmor(e)
    }, u.builders[Types.Entities.REDGUARDARMOR] = function(e) {
        return new n.RedGuardArmor(e)
    }, u.builders[Types.Entities.WHITEARMOR] = function(e) {
        return new n.WhiteArmor(e)
    }, u.builders[Types.Entities.RATARMOR] = function(e) {
        return new n.RatArmor(e)
    }, u.builders[Types.Entities.BLUEPIRATEARMOR] = function(e) {
        return new n.BluepirateArmor(e)
    }, u.builders[Types.Entities.CHEOLIARMOR] = function(e) {
        return new n.CheoliArmor(e)
    }, u.builders[Types.Entities.DOVAKINARMOR] = function(e) {
        return new n.DovakinArmor(e)
    }, u.builders[Types.Entities.GBWINGARMOR] = function(e) {
        return new n.GbwingArmor(e)
    }, u.builders[Types.Entities.REDWINGARMOR] = function(e) {
        return new n.RedwingArmor(e)
    }, u.builders[Types.Entities.SNOWFOXARMOR] = function(e) {
        return new n.SnowfoxArmor(e)
    }, u.builders[Types.Entities.WOLFARMOR] = function(e) {
        return new n.WolfArmor(e)
    }, u.builders[Types.Entities.BLUEWINGARMOR] = function(e) {
        return new n.BluewingArmor(e)
    }, u.builders[Types.Entities.THIEFARMOR] = function(e) {
        return new n.ThiefArmor(e)
    }, u.builders[Types.Entities.NINJAARMOR] = function(e) {
        return new n.NinjaArmor(e)
    }, u.builders[Types.Entities.DRAGONARMOR] = function(e) {
        return new n.DragonArmor(e)
    }, u.builders[Types.Entities.FALLENARMOR] = function(e) {
        return new n.FallenArmor(e)
    }, u.builders[Types.Entities.PALADINARMOR] = function(e) {
        return new n.PaladinArmor(e)
    }, u.builders[Types.Entities.CRYSTALARMOR] = function(e) {
        return new n.CrystalArmor(e)
    }, u.builders[Types.Entities.ADHERERROBE] = function(e) {
        return new n.AdhererRobe(e)
    }, u.builders[Types.Entities.FROSTARMOR] = function(e) {
        return new n.FrostArmor(e)
    }, u.builders[Types.Entities.GAYARMOR] = function(e) {
        return new n.GayArmor(e)
    }, u.builders[Types.Entities.SCHOOLUNIFORM] = function(e) {
        return new n.SchoolUniform(e)
    }, u.builders[Types.Entities.BEAUTIFULLIFE] = function(e) {
        return new n.BeautifulLife(e)
    }, u.builders[Types.Entities.REGIONARMOR] = function(e) {
        return new n.RegionArmor(e)
    }, u.builders[Types.Entities.GHOSTRIDER] = function(e) {
        return new n.GhostRider(e)
    }, u.builders[Types.Entities.TAEKWONDO] = function(e) {
        return new n.Taekwondo(e)
    }, u.builders[Types.Entities.RABBITARMOR] = function(e) {
        return new n.RabbitArmor(e)
    }, u.builders[Types.Entities.PORTALARMOR] = function(e) {
        return new n.PortalArmor(e)
    }, u.builders[Types.Entities.PIRATEKING] = function(e) {
        return new n.PirateKing(e)
    }, u.builders[Types.Entities.SEADRAGONARMOR] = function(e) {
        return new n.SeadragonArmor(e)
    }, u.builders[Types.Entities.SHADOWREGIONARMOR] = function(e) {
        return new n.ShadowregionArmor(e)
    }, u.builders[Types.Entities.ENELARMOR] = function(e) {
        return new n.EnelArmor(e)
    }, u.builders[Types.Entities.MINISEADRAGONARMOR] = function(e) {
        return new n.MiniseadragonArmor(e)
    }, u.builders[Types.Entities.HUNIARMOR] = function(e) {
        return new n.HuniArmor(e)
    }, u.builders[Types.Entities.DAMBOARMOR] = function(e) {
        return new n.DamboArmor(e)
    }, u.builders[Types.Entities.SQUIDARMOR] = function(e) {
        return new n.SquidArmor(e)
    }, u.builders[Types.Entities.BEEARMOR] = function(e) {
        return new n.BeeArmor(e)
    }, u.builders[Types.Entities.BLUEDAMBOARMOR] = function(e) {
        return new n.BluedamboArmor(e)
    }, u.builders[Types.Entities.RUDOLFARMOR] = function(e) {
        return new n.RudolfArmor(e)
    }, u.builders[Types.Entities.CHRISTMASARMOR] = function(e) {
        return new n.ChristmasArmor(e)
    }, u.builders[Types.Entities.ROBOCOPARMOR] = function(e) {
        return new n.RobocopArmor(e)
    }, u.builders[Types.Entities.PINKCOCKROACHARMOR] = function(e) {
        return new n.PinkcockroachArmor(e)
    }, u.builders[Types.Entities.COCKROACHSUIT] = function(e) {
        return new n.CockroachSuit(e)
    }, u.builders[Types.Entities.DINOSAURARMOR] = function(e) {
        return new n.DinosaurArmor(e)
    }, u.builders[Types.Entities.CATARMOR] = function(e) {
        return new n.CatArmor(e)
    }, u.builders[Types.Entities.SNOWMANARMOR] = function(e) {
        return new n.SnowmanArmor(e)
    }, u.builders[Types.Entities.BEETLEARMOR] = function(e) {
        return new n.BeetleArmor(e)
    }, u.builders[Types.Entities.HONGCHEOLARMOR] = function(e) {
        return new n.HongcheolArmor(e)
    }, u.builders[Types.Entities.TIGERARMOR] = function(e) {
        return new n.TigerArmor(e)
    }, u.builders[Types.Entities.WIZARDROBE] = function(e) {
        return new n.WizardRobe(e)
    }, u.builders[Types.Entities.IRONKNIGHTARMOR] = function(e) {
        return new n.IronknightArmor(e)
    }, u.builders[Types.Entities.EVILARMOR] = function(e) {
        return new n.EvilArmor(e)
    }, u.builders[Types.Entities.GREENDAMBOARMOR] = function(e) {
        return new n.GreendamboArmor(e)
    }, u.builders[Types.Entities.REDDAMBOARMOR] = function(e) {
        return new n.ReddamboArmor(e)
    }, u.builders[Types.Entities.DEVILKAZYAARMOR] = function(e) {
        return new n.DevilkazyaArmor(e)
    }, u.builders[Types.Entities.BRIDALMASK] = function(e) {
        return new n.BridalMask(e)
    }, u.builders[Types.Entities.BLACKSPIDERARMOR] = function(e) {
        return new n.BlackspiderArmor(e)
    }, u.builders[Types.Entities.FROGARMOR] = function(e) {
        return new n.FrogArmor(e)
    }, u.builders[Types.Entities.BEARSEONBIARMOR] = function(e) {
        return new n.BearseonbiArmor(e)
    }, u.builders[Types.Entities.ADMINARMOR] = function(e) {
        return new n.AdminArmor(e)
    }, u.builders[Types.Entities.RAINBOWAPRO] = function(e) {
        return new n.RainbowApro(e)
    }, u.builders[Types.Entities.COKEARMOR] = function(e) {
        return new n.CokeArmor(e)
    }, u.builders[Types.Entities.FRIEDPOTATOARMOR] = function(e) {
        return new n.FriedpotatoArmor(e)
    }, u.builders[Types.Entities.BURGERARMOR] = function(e) {
        return new n.BurgerArmor(e)
    }, u.builders[Types.Entities.RADISHARMOR] = function(e) {
        return new n.RadishArmor(e)
    }, u.builders[Types.Entities.HALLOWEENJKARMOR] = function(e) {
        return new n.HalloweenJKArmor(e)
    }, u.builders[Types.Entities.FRANKENSTEINARMOR] = function(e) {
        return new n.FrankensteinArmor(e)
    }, u.builders[Types.Entities.PENDANT1] = function(e, i, t, r) {
        return new n.Pendant1(e, t, r)
    }, u.builders[Types.Entities.GREENPENDANT] = function(e, i, t, r) {
        return new n.GreenPendant(e, t, r)
    }, u.builders[Types.Entities.PEARLPENDANT] = function(e, i, t, r) {
        return new n.PearlPendant(e, t, r)
    }, u.builders[Types.Entities.MARBLEPENDANT] = function(e, i, t, r) {
        return new n.MarblePendant(e, t, r)
    }, u.builders[Types.Entities.RING1] = function(e, i, t, r) {
        return new n.Ring1(e, t, r)
    }, u.builders[Types.Entities.SPROUTRING] = function(e, i, t, r) {
        return new n.SproutRing(e, t, r)
    }, u.builders[Types.Entities.PEARLRING] = function(e, i, t, r) {
        return new n.PearlRing(e, t, r)
    }, u.builders[Types.Entities.SPIRITRING] = function(e, i, t, r) {
        return new n.SpiritRing(e, t, r)
    }, u.builders[Types.Entities.ESSENTIALRAGE] = function(e, i, t, r) {
        return new n.EssentialRage(e, t, r)
    }, u.builders[Types.Entities.FLASK] = function(e) {
        return new n.Flask(e)
    }, u.builders[Types.Entities.FIREPOTION] = function(e) {
        return new n.FirePotion(e)
    }, u.builders[Types.Entities.BURGER] = function(e) {
        return new n.Burger(e)
    }, u.builders[Types.Entities.CAKE] = function(e) {
        return new n.Cake(e)
    }, u.builders[Types.Entities.BOOK] = function(e) {
        return new n.Book(e)
    }, u.builders[Types.Entities.CD] = function(e) {
        return new n.Cd(e)
    }, u.builders[Types.Entities.SNOWPOTION] = function(e) {
        return new n.Snowpotion(e)
    }, u.builders[Types.Entities.ROYALAZALEA] = function(e) {
        return new n.Royalazalea(e)
    }, u.builders[Types.Entities.BLACKPOTION] = function(e) {
        return new n.Blackpotion(e)
    }, u.builders[Types.Entities.CHEST] = function(e) {
        return new s(e)
    }, u.builders[Types.Entities.GUARD] = function(e) {
        return new i.Guard(e)
    }, u.builders[Types.Entities.KING] = function(e) {
        return new i.King(e)
    }, u.builders[Types.Entities.VILLAGEGIRL] = function(e) {
        return new i.VillageGirl(e)
    }, u.builders[Types.Entities.VILLAGER] = function(e) {
        return new i.Villager(e)
    }, u.builders[Types.Entities.CODER] = function(e) {
        return new i.Coder(e)
    }, u.builders[Types.Entities.AGENT] = function(e) {
        return new i.Agent(e)
    }, u.builders[Types.Entities.RICK] = function(e) {
        return new i.Rick(e)
    }, u.builders[Types.Entities.SCIENTIST] = function(e) {
        return new i.Scientist(e)
    }, u.builders[Types.Entities.NYAN] = function(e) {
        return new i.Nyan(e)
    }, u.builders[Types.Entities.PRIEST] = function(e) {
        return new i.Priest(e)
    }, u.builders[Types.Entities.SORCERER] = function(e) {
        return new i.Sorcerer(e)
    }, u.builders[Types.Entities.OCTOCAT] = function(e) {
        return new i.Octocat(e)
    }, u.builders[Types.Entities.BEACHNPC] = function(e) {
        return new i.BeachNpc(e)
    }, u.builders[Types.Entities.FORESTNPC] = function(e) {
        return new i.ForestNpc(e)
    }, u.builders[Types.Entities.DESERTNPC] = function(e) {
        return new i.DesertNpc(e)
    }, u.builders[Types.Entities.LAVANPC] = function(e) {
        return new i.LavaNpc(e)
    }, u.builders[Types.Entities.BOXINGMAN] = function(e) {
        return new i.Boxingman(e)
    }, u.builders[Types.Entities.VAMPIRE] = function(e) {
        return new i.Vampire(e)
    }, u.builders[Types.Entities.DOCTOR] = function(e) {
        return new i.Doctor(e)
    }, u.builders[Types.Entities.ODDEYECAT] = function(e) {
        return new i.Oddeyecat(e)
    }, u.builders[Types.Entities.VENDINGMACHINE] = function(e) {
        return new i.Vendingmachine(e)
    }, u.builders[Types.Entities.FISHERMAN] = function(e) {
        return new i.Fisherman(e)
    }, u.builders[Types.Entities.OCTOPUS] = function(e) {
        return new i.Octopus(e)
    }, u.builders[Types.Entities.SOLDIER] = function(e) {
        return new i.Soldier(e)
    }, u.builders[Types.Entities.MERMAIDNPC] = function(e) {
        return new i.Mermaidnpc(e)
    }, u.builders[Types.Entities.SPONGE] = function(e) {
        return new i.Sponge(e)
    }, u.builders[Types.Entities.FAIRYNPC] = function(e) {
        return new i.Fairynpc(e)
    }, u.builders[Types.Entities.SHEPHERDBOY] = function(e) {
        return new i.Shepherdboy(e)
    }, u.builders[Types.Entities.ZOMBIEGF] = function(e) {
        return new i.Zombiegf(e)
    }, u.builders[Types.Entities.PIRATEGIRLNPC] = function(e) {
        return new i.Pirategirlnpc(e)
    }, u.builders[Types.Entities.BLUEBIKINIGIRLNPC] = function(e) {
        return new i.Bluebikinigirlnpc(e)
    }, u.builders[Types.Entities.REDBIKINIGIRLNPC] = function(e) {
        return new i.Redbikinigirlnpc(e)
    }, u.builders[Types.Entities.IAMVERYCOLDNPC] = function(e) {
        return new i.Iamverycoldnpc(e)
    }, u.builders[Types.Entities.ICEELFNPC] = function(e) {
        return new i.Iceelfnpc(e)
    }, u.builders[Types.Entities.REDSTOREMANNPC] = function(e) {
        return new i.Redstoremannpc(e)
    }, u.builders[Types.Entities.BLUESTOREMANNPC] = function(e) {
        return new i.Bluestoremannpc(e)
    }, u.builders[Types.Entities.ELFNPC] = function(e) {
        return new i.Elfnpc(e)
    }, u.builders[Types.Entities.SNOWSHEPHERDBOY] = function(e) {
        return new i.Snowshepherdboy(e)
    }, u.builders[Types.Entities.ANGELNPC] = function(e) {
        return new i.Angelnpc(e)
    }, u.builders[Types.Entities.MOMANGELNPC] = function(e) {
        return new i.Momangelnpc(e)
    }, u.builders[Types.Entities.SUPERIORANGELNPC] = function(e) {
        return new i.Superiorangelnpc(e)
    }, u.builders[Types.Entities.FIRSTSONANGELNPC] = function(e) {
        return new i.Firstsonangelnpc(e)
    }, u.builders[Types.Entities.SECONDSONANGELNPC] = function(e) {
        return new i.Secondsonangelnpc(e)
    }, u.builders[Types.Entities.MOJOJOJONPC] = function(e) {
        return new i.Mojojojonpc(e)
    }, u.builders[Types.Entities.ANCIENTMANUMENTNPC] = function(e) {
        return new i.Ancientmanumentnpc(e)
    }, u
});