
var Types = require("../../shared/js/gametypes");

var Properties = {
    wizard: {
        drops: {
            flask: 50,
            platearmor: 25,
            firepotion: 5
        },
        hp: 80,
        armor: 1,
        weapon: 1
    },
    crab: {
        drops: {
            flask: 90,
            firepotion: 10
        },
        hp: 25,
        armor: 1,
        weapon: 1
    },
    rat: {
        drops: {
            flask: 50,
            sword2: 20,
            plasticbow: 20,
            firepotion: 10
        },
        hp: 80,
        armor: 1,
        weapon: 1
    },
    bat: {
        drops: {
            flask: 50,
            sword2: 20,
            plasticbow: 20,
            pendant1: 5,
            ring1: 5
        },
        hp: 100,
        armor: 1,
        weapon: 1
    },
    goblin: {
        drops: {
            flask: 20,
            leatherarmor: 70,
            pendant1: 5,
            ring1: 5
        },
        hp: 140,
        armor: 1,
        weapon: 1
    },
    yellowfish: {
        drops: {
            flask: 50,
            leatherarmor: 20,
            leatherarcherarmor: 20,
            firepotion: 10
        },
        hp: 140,
        armor: 1,
        weapon: 1
    },
    skeleton: {
        drops: {
            flask: 40,
            axe: 20,
            ironbow: 15,
            firepotion: 15,
            pendant1: 5,
            ring1: 5
        },
        hp: 240,
        armor: 1,
        weapon: 1
    },
    greenfish: {
        drops: {
            flask: 40,
            axe: 20,
            ironbow: 20,
            firepotion: 10
        },
        hp: 240,
        armor: 1,
        weapon: 1
    },
    snek: {
        drops: {
            flask: 40,
            mailarmor: 20,
            mailarcherarmor: 20,
            firepotion: 10,
            pendant1: 5,
            ring1: 5
        },
        hp: 300,
        armor: 1,
        weapon: 1
    },
    redfish: {
        drops: {
            flask: 50,
            mailarmor: 20,
            mailarcherarmor: 20,
            firepotion: 10
        },
        hp: 300,
        armor: 1,
        weapon: 1
    },
    ogre: {
        drops: {
            burger: 10,
            flask: 40,
            morningstar: 19,
            redbow: 19,
            firepotion: 10,
            pendant1: 1,
            ring1: 1
        },
        hp: 300,
        armor: 1,
        weapon: 1
    },
    clam: {
        drops: {
            burger: 10,
            flask: 40,
            morningstar: 20,
            redbow: 20,
            firepotion: 10
        },
        hp: 300,
        armor: 1,
        weapon: 1
    },
    skeleton2: {
        drops: {
            flask: 40,
            platearmor: 20,
            platearcherarmor: 20,
            firepotion: 10,
            pendant1: 5,
            ring1: 5
        },
        hp: 300,
        armor: 1,
        weapon: 1
    },
    hermitcrab: {
        drops: {
            flask: 50,
            platearmor: 20,
            platearcherarmor: 20,
            firepotion: 10
        },
        hp: 300,
        armor: 1,
        weapon: 1
    },
    eye: {
        drops: {
            flask: 40,
            bluesword: 20,
            violetbow: 20,
            firepotion: 10,
            pendant1: 5,
            ring1: 5
        },
        hp: 300,
        armor: 1,
        weapon: 1
    },
    spectre: {
        drops: {
            flask: 30,
            redarmor: 20,
            redarcherarmor: 20,
            firepotion: 10,
            pendant1: 10,
            ring1: 10
        },
        hp: 300,
        armor: 1,
        weapon: 1

    },
    deathknight: {
        drops: {
            burger: 40,
            redsword: 20,
            deathbow: 20,
            firepotion: 10,
            pendant1: 5,
            ring1: 5
        },
        hp: 360,
        armor: 1,
        weapon: 1
    },
    skeletonking: {
        drops: {
            goldensword: 25,
            goldenarmor: 25,
            goldenarcherarmor: 25,
            goldenbow: 25
        },
        hp: 1400,
        armor: 1,
        weapon: 1
    },
    mimic: {
        drops: {
            greenarmor: 15,
            greenarcherarmor: 15,
            burger: 30,
            firepotion: 5,
            sproutring: 5,
            greenpendant: 5
        },
        hp: 540,
        armor: 1,
        weapon: 1

    },
    orc: {
        drops: {
            burger: 30,
            greenarmor: 15,
            greenarcherarmor: 15,
            firepotion: 5,
            sproutring: 5,
            greenpendant: 5

        },
        hp: 540,
        armor: 1,
        weapon: 1
    },
    oldogre: {
        drops: {
            burger: 30,
            greenwingarmor: 15,
            greenwingarcherarmor: 15,
            firepotion: 5,
            sproutring: 5,
            greenpendant: 5

        },
        hp: 700,
        armor: 1,
        weapon: 1
    },
    golem: {
        drops: {
            burger: 30,
            greenwingarmor: 15,
            greenwingarcherarmor: 15,
            firepotion: 5,
            sproutring: 5,
            greenpendant: 5

        },
        hp: 700,
        armor: 1,
        weapon: 1
    },
    hobgoblin: {
        drops: {
            burger: 30,
            sidesword: 10,
            watermelonbow: 10,
            firepotion: 5,
            sproutring: 5,
            greenpendant: 5

        },
        hp: 600,
        armor: 4,
        weapon: 2

    },
    yellowmouse: {
        drops: {
            burger: 30,
            spear: 10,
            greenbow: 10,
            firepotion: 5,
            sproutring: 5,
            greenpendant: 5

        },
        hp: 540,
        armor: 1,
        weapon: 1
    },
    brownmouse: {
        drops: {
            burger: 30,
            guardarmor: 15,
            guardarcherarmor: 15,
            firepotion: 5,
            sproutring: 5,
            greenpendant: 5

        },
        hp: 740,
        armor: 1,
        weapon: 1
    },
    redguard: {
        drops: {
            burger: 30,
            redguardarmor: 15,
            redguardarcherarmor: 15,
            firepotion: 5,
            sproutring: 5,
            greenpendant: 5

        },
        hp: 600,
        armor: 1,
        weapon: 1
    },
    redmouse: {
        drops: {
            burger: 30,
            scimitar: 10,
            redenelbow: 10,
            firepotion: 5,
            sproutring: 5,
            greenpendant: 5

        },
        hp: 800,
        armor: 1,
        weapon: 1

    },
    infectedguard: {
        drops: {
            burger: 30,
            whitearmor: 15,
            whitearcherarmor: 15,
            firepotion: 5,
            sproutring: 5,
            greenpendant: 5

        },
        hp: 800,
        armor: 1,
        weapon: 1
    },
    livingarmor: {
        drops: {
            burger: 30,
            whitearmor: 15,
            whitearcherarmor: 15,
            firepotion: 5,
            sproutring: 5,
            greenpendant: 5

        },
        hp: 800,
        armor: 1,
        weapon: 1
    },
    // Line
    whitemouse: {
        drops: {
            burger: 30,
            ratarmor: 15,
            ratarcherarmor: 15,
            firepotion: 5,
            sproutring: 5,
            greenpendant: 5

        },
        hp: 900,
        armor: 1,
        weapon: 1
    },
    mermaid: {
        drops: {
            burger: 30,
            trident: 10,
            mermaidbow: 10,
            firepotion: 5,
            pearlring: 5,
            pearlpendant: 5

        },
        hp: 1000,
        armor: 1,
        weapon: 1

    },
    preta: {
        drops: {
            burger: 30,
            bluescimitar: 10,
            seahorsebow: 10,
            firepotion: 5,
            pearlring: 5,
            pearlpendant: 5

        },
        hp: 1000,
        armor: 1,
        weapon: 1
    },
    pirateskeleton: {
        drops: {
            burger: 30,
            bluepiratearmor: 15,
            piratearcherarmor: 15,
            firepotion: 5,
            pearlring: 5,
            pearlpendant: 5

        },
        hp: 1000,
        armor: 1,
        weapon: 1
    },
    vulture: {
        drops: {
            burger: 30,
            firepotion: 10,
            pearlring: 5,
            pearlpendant: 5

        },
        hp: 1150,
        armor: 1,
        weapon: 1
    },
    penguin: {
        drops: {
            burger: 30,
            cheoliarmor: 15,
            cheoliarcherarmor: 15,
            firepotion: 5,
            pearlring: 5,
            pearlpendant: 5

        },
        hp: 1200,
        armor: 1,
        weapon: 1
    },
    desertscolpion: {
        drops: {
            burger: 30,
            firepotion: 5,
            pearlring: 5,
            pearlpendant: 5

        },
        hp: 1300,
        armor: 1,
        weapon: 1
    },
    moleking: {
        drops: {
            burger: 30,
            hammer: 10,
            hunterbow: 10,
            firepotion: 5,
            pearlring: 5,
            pearlpendant: 5

        },
        hp: 1400,
        armor: 1,
        weapon: 1
    },
    darkskeleton: {
        drops: {
            burger: 30,
            dovakinarmor: 15,
            dovakinarcherarmor: 15,
            firepotion: 5,
            pearlring: 5,
            pearlpendant: 5

        },
        hp: 1500,
        armor: 1,
        weapon: 1
    },
    darkscolpion: {
        drops: {
            burger: 30,
            firepotion: 5,
            pearlring: 5,
            pearlpendant: 5

        },
        hp: 1700,
        armor: 1,
        weapon: 1
    },
    greenpirateskeleton: {
        drops: {
            burger: 30,
            gbwingarmor: 15,
            gbwingarcherarmor: 15,
            firepotion: 5,
            pearlring: 5,
            pearlpendant: 5

        },
        hp: 1800,
        armor: 1,
        weapon: 1
    },
    blackpirateskeleton: {
        drops: {
            burger: 30,
            gbwingarmor: 15,
            gbwingarcherarmor: 15,
            firepotion: 5,
            pearlring: 5,
            pearlpendant: 5

        },
        hp: 1900,
        armor: 1,
        weapon: 1
    },
    pinkelf: {
        drops: {
            burger: 30,
            greenlightsaber: 5,
            greenlightbow: 15,
            firepotion: 5,
            pearlring: 5,
            pearlpendant: 5

        },
        hp: 2000,
        armor: 1,
        weapon: 1
    },
    redpirateskeleton: {
        drops: {
            burger: 30,
            gbwingarmor: 15,
            gbwingarcherarmor: 15,
            firepotion: 5,
            pearlring: 5,
            pearlpendant: 5

        },
        hp: 2100,
        armor: 1,
        weapon: 1
    },
    yellowpreta: {
        drops: {
            burger: 30,
            redwingarmor: 15,
            redwingarcherarmor: 15,
            firepotion: 5,
            pearlring: 5,
            pearlpendant: 5

        },
        hp: 2200,
        armor: 1,
        weapon: 1
    },
    bluepreta: {
        drops: {
            burger: 30,
            redwingarmor: 15,
            redwingarcherarmor: 15,
            firepotion: 5,
            pearlring: 5,
            pearlpendant: 5

        },
        hp: 2300,
        armor: 1,
        weapon: 1
    },
    miniknight: {
        drops: {
            burger: 30,
            snowfoxarmor: 15,
            snowfoxarcherarmor: 15,
            firepotion: 5,
            pearlring: 5,
            pearlpendant: 5

        },
        hp: 2438,
        armor: 1,
        weapon: 1
    },
    wolf: {
        drops: {
            burger: 30,
            wolfarmor: 15,
            wolfarcherarmor: 15,
            pearlring: 5,
            pearlpendant: 5

        },
        hp: 2584,
        armor: 1,
        weapon: 1
    },
    skyelf: {
        drops: {
            burger: 30,
            skylightsaber: 5,
            skylightbow: 15,
            firepotion: 5,
            pearlring: 5,
            pearlpendant: 5

        },
        hp: 2739,
        armor: 1,
        weapon: 1
    },
    redelf: {
        drops: {
            burger: 30,
            redlightsaber: 5,
            redlightbow: 15,
            firepotion: 5,
            pearlring: 5,
            pearlpendant: 5

        },
        hp: 2903,
        armor: 1,
        weapon: 1
    },
    zombie: {
        drops: {
            burger: 30,
            bluewingarmor: 15,
            bluewingarcherarmor: 15,
            firepotion: 5,
            pearlring: 5,
            pearlpendant: 5

        },
        hp: 3077,
        armor: 1,
        weapon: 1
    },
    piratecaptain: {
        drops: {
            burger: 30,
            bastardsword: 15,
            captainbow: 15,
            firepotion: 5,
            pearlring: 5,
            pearlpendant: 5

        },
        hp: 3201,
        armor: 1,
        weapon: 1
    },
    ironogre: {
        drops: {
            burger: 30,
            fallenarmor: 15,
            fallenarcherarmor: 15,
            royalazalea: 5,
            spiritring: 5,
            marblependant: 5

        },
        hp: 3329,
        armor: 1,
        weapon: 1
    },
    ogrelord: {
        drops: {
            burger: 30,
            redmetalsword: 15,
            redmetalbow: 15,
            royalazalea: 5,
            spiritring: 5,
            marblependant: 5

        },
        hp: 3462,
        armor: 1,
        weapon: 1
    },
    crystalscolpion: {
        drops: {
            burger: 30,
            crystalarmor: 15,
            crystalarcherarmor: 15,
            royalazalea: 5,
            spiritring: 5,
            marblependant: 5

        },
        hp: 3600,
        armor: 1,
        weapon: 1
    },
    eliminator: {
        drops: {
            burger: 30,
            paladinarmor: 10,
            legolasarmor: 10,
            justicehammer: 10,
            justicebow: 10,
            royalazalea: 5,
            spiritring: 5,
            marblependant: 5

        },
        hp: 3744,
        armor: 1,
        weapon: 1
    },
    adherer: {
        drops: {
            burger: 30,
            adhererrobe: 10,
            adhererarcherarmor: 10,
            royalazalea: 5,
            spiritring: 5,
            marblependant: 5

        },
        hp: 3894,
        armor: 1,
        weapon: 1
    },
    miniiceknight: {
        drops: {
            burger: 30,
            icerose: 10,
            marinebow: 15,
            rosebow: 15,
            royalazalea: 5,
            spiritring: 5,
            marblependant: 5

        },
        hp: 4050,
        armor: 1,
        weapon: 1
    },
    iceknight: {
        drops: {
            burger: 30,
            schooluniform: 15,
            archerschooluniform: 15,
            royalazalea: 5,
            spiritring: 5,
            marblependant: 5

        },
        hp: 4212,
        armor: 1,
        weapon: 1
    },
    icegolem: {
        drops: {
            burger: 30,
            halberd: 5,
            crystalbow: 15,
            royalazalea: 5,
            spiritring: 5,
            marblependant: 5

        },
        hp: 4380,
        armor: 1,
        weapon: 1
    },
    snowwolf: {
        drops: {
            burger: 10,
            taekwondo: 5,
            combatuniform: 5,
            royalazalea: 5,
            spiritring: 5,
            marblependant: 5

        },
        hp: 12523,
        armor: 3,
        weapon: 1
    },
    cobra: {
        drops: {
            burger: 30,
            whip: 15,
            gaybow: 15,
            royalazalea: 5,
            spiritring: 5,
            marblependant: 5

        },
        hp: 4738,
        armor: 1,
        weapon: 1
    },
    darkogre: {
        drops: {
            burger: 30,
            gayarmor: 15,
            gayarcherarmor: 15,
            royalazalea: 5,
            spiritring: 5,
            marblependant: 5

        },
        hp: 4927,
        armor: 1,
        weapon: 1
    },
    snowelf: {
        drops: {
            burger: 30,
            ninjaarmor: 15,
            royalazalea: 5,
            spiritring: 5,
            marblependant: 5

        },
        hp: 5124,
        armor: 1,
        weapon: 1
    },
    forestdragon: {
        drops: {
            burger: 30,
            forestguardiansword: 15,
            forestbow: 15,
            royalazalea: 5,
            spiritring: 5,
            marblependant: 5

        },
        hp: 5329,
        armor: 10,
        weapon: 2
    },
    pain: {
        drops: {
            burger: 30,
            beautifullife: 5,
            royalazalea: 5,
            spiritring: 5,
            marblependant: 5

        },
        hp: 5543,
        armor: 10,
        weapon: 7
    },
    whitebear: {
        drops: {
            burger: 30,
            thiefarmor: 15,
            royalazalea: 5,
            spiritring: 5,
            marblependant: 5

        },
        hp: 5764,
        armor: 5,
        weapon: 3
    },
    snowrabbit: {
        drops: {
            burger: 30,
            rabbitarmor: 15,
            royalazalea: 5,
            spiritring: 5,
            marblependant: 5

        },
        hp: 10995,
        armor: 5,
        weapon: 1
    },
    icevulture: {
        drops: {
            burger: 30,
            sickle: 5,
            sicklebow: 15,
            royalazalea: 5,
            spiritring: 5,
            marblependant: 5

        },
        hp: 6235,
        armor: 1,
        weapon: 4
    },
    darkregionillusion: {
        drops: {
            burger: 30,
            portalarmor: 15,
            royalazalea: 5,
            spiritring: 5,
            marblependant: 5

        },
        hp: 6484,
        armor: 1,
        weapon: 1
    },
    regionhenchman: {
        drops: {
            burger: 30,
            ghostrider: 5,
            royalazalea: 5,
            spiritring: 5,
            marblependant: 5

        },
        hp: 6744,
        armor: 1,
        weapon: 1
    },
    purplepreta: {
        drops: {
            burger: 30,
            plunger: 5,
            bloodbow: 15,
            royalazalea: 5,
            spiritring: 5,
            marblependant: 5

        },
        hp: 6946,
        armor: 1,
        weapon: 1
    },
    flaredeathknight: {
        drops: {
            burger: 30,
            redsickle: 5,
            redsicklebow: 15,
            royalazalea: 5,
            essentialrage: 5
        },
        hp: 7154,
        armor: 1,
        weapon: 1
    },
    snowlady: {
        drops: {
            burger: 30,
            daywalker: 5,
            royalazalea: 5,
            essentialrage: 5
        },
        hp: 7369,
        armor: 1,
        weapon: 1
    },
    frostqueen: {
        drops: {
            burger: 30,
            frostarmor: 15,
            royalazalea: 5,
            essentialrage: 5
        },
        hp: 7590,
        armor: 1,
        weapon: 1
    },
    darkregion: {
        drops: {
            burger: 30,
            regionarmor: 15,
            royalazalea: 5,
            essentialrage: 5
        },
        hp: 7818,
        armor: 1,
        weapon: 1
    },
    nightmareregion: {
        drops: {
            burger: 30,
            purplecloudkallege: 5,
            royalazalea: 5,
            essentialrage: 5
        },
        hp: 8052,
        armor: 1,
        weapon: 1
    },
    seadragon: {
        drops: {
            burger: 30,
            searage: 3,
            seadragonarmor: 3,
            royalazalea: 5,
            essentialrage: 5
        },
        hp: 8294,
        armor: 1,
        weapon: 1
    },
    shadowregion: {
        drops: {
            burger: 30,
            shadowregionarmor: 15,
            royalazalea: 5,
            essentialrage: 5
        },
        hp: 8543,
        armor: 1,
        weapon: 1
    },
    goldgolem: {
        drops: {
            burger: 30,
            pirateking: 5,
            royalazalea: 5,
            essentialrage: 5
        },
        hp: 8799,
        armor: 1,
        weapon: 1
    },
    lightningguardian: {
        drops: {
            burger: 30,
            breaker: 5,
            royalazalea: 5,
            essentialrage: 5
        },
        hp: 9063,
        armor: 1,
        weapon: 1
    },
    enel: {
        drops: {
            burger: 30,
            enelarmor: 3,
            eneltrident: 3,
            royalazalea: 5,
            essentialrage: 5
        },
        hp: 9426,
        armor: 1,
        weapon: 1
    },
    minidragon: {
        drops: {
            burger: 30,
            dragonarmor: 15,
            royalazalea: 5,
            essentialrage: 5
        },
        hp: 9803,
        armor: 1,
        weapon: 1
    },
    miniseadragon: {
        drops: {
            burger: 30,
            miniseadragonarmor: 15,
            royalazalea: 5,
            essentialrage: 5
        },
        hp: 10195,
        armor: 1,
        weapon: 1
    },
    miniemperor: {
        drops: {
            burger: 30,
            huniarmor: 20,
            royalazalea: 5,
            essentialrage: 5
        },
        hp: 10603,
        armor: 1,
        weapon: 1
    },
    slime: {
        drops: {
            burger: 30,
            rainbowsword: 15,
            royalazalea: 5,
            essentialrage: 5
        },
        hp: 11027,
        armor: 1,
        weapon: 1
    },
    kaonashi: {
        drops: {
            burger: 30,
            damboarmor: 15,
            royalazalea: 5,
            essentialrage: 5
        },
        hp: 11468,
        armor: 1,
        weapon: 1
    },
    windguardian: {
        drops: {
            burger: 30,
            typhoon: 15,
            royalazalea: 5,
            essentialrage: 5
        },
        hp: 11926,
        armor: 1,
        weapon: 1
    },
    squid: {
        drops: {
            burger: 30,
            squidarmor: 15,
            royalazalea: 5,
            essentialrage: 5
        },
        hp: 12404,
        armor: 1,
        weapon: 1
    },
    rhaphidophoridae: {
        drops: {
            burger: 30,
            memme: 4,
            royalazalea: 5,
            essentialrage: 5
        },
        hp: 12900,
        armor: 1,
        weapon: 1
    },
    bee: {
        drops: {
            burger: 30,
            beearmor: 15,
            royalazalea: 5,
            essentialrage: 5
        },
        hp: 13416,
        armor: 1,
        weapon: 1
    },
    ant: {
        drops: {
            burger: 30,
            bluedamboarmor: 15,
            royalazalea: 5,
            essentialrage: 5
        },
        hp: 23952,
        armor: 6,
        weapon: 4
    },
    rudolf: {
        drops: {
            burger: 30,
            rudolfarmor: 15,
            royalazalea: 5,
            essentialrage: 5
        },
        hp: 14510,
        armor: 1,
        weapon: 1
    },
    santaelf: {
        drops: {
            burger: 30,
            candybar: 15,
            royalazalea: 5,
            essentialrage: 5
        },
        hp: 15091,
        armor: 1,
        weapon: 1
    },
    santa: {
        drops: {
            burger: 30,
            christmasarmor: 15,
            royalazalea: 5,
            essentialrage: 5
        },
        hp: 15695,
        armor: 1,
        weapon: 1
    },
    soldierant: {
        drops: {
            burger: 30,
            robocoparmor: 15,
            royalazalea: 5,
            essentialrage: 5
        },
        hp: 16118,
        armor: 1,
        weapon: 1
    },
    redcockroach: {
        drops: {
            burger: 30,
            pinkcockroacharmor: 15,
            royalazalea: 5,
            essentialrage: 5
        },
        hp: 16554,
        armor: 1,
        weapon: 1
    },
    bluecockroach: {
        drops: {
            burger: 30,
            cockroachsuit: 15,
            royalazalea: 5,
            essentialrage: 5
        },
        hp: 17000,
        armor: 1,
        weapon: 1
    },
    soybeanbug: {
        drops: {
            burger: 30,
            butcherknife: 15,
            royalazalea: 5,
            essentialrage: 5
        },
        hp: 17460,
        armor: 1,
        weapon: 1
    },
    earthworm: {
        drops: {
            burger: 30,
            dinosaurarmor: 15,
            royalazalea: 5,
            essentialrage: 5
        },
        hp: 17931,
        armor: 1,
        weapon: 1
    },
    cat: {
        drops: {
            burger: 30,
            catarmor: 15,
            royalazalea: 5,
            essentialrage: 5
        },
        hp: 18415,
        armor: 1,
        weapon: 1
    },
    firespider: {
        drops: {
            burger: 30,
            fireshot: 15,
            royalazalea: 5,
            essentialrage: 5
        },
        hp: 18747,
        armor: 1,
        weapon: 1
    },
    snowman: {
        drops: {
            burger: 30,
            snowmanarmor: 15,
            royalazalea: 5,
            essentialrage: 5
        },
        hp: 19428,
        armor: 1,
        weapon: 1
    },
    queenant: {
        drops: {
            burger: 30,
            comb: 15,
            royalazalea: 5,
            essentialrage: 5
        },
        hp: 20133,
        armor: 1,
        weapon: 1
    },
    beetle: {
        drops: {
            burger: 30,
            beetlearmor: 15,
            royalazalea: 5,
            essentialrage: 5
        },
        hp: 20496,
        armor: 1,
        weapon: 1
    },
    hongcheol: {
        drops: {
            burger: 30,
            hongcheolarmor: 15,
            squeakyhammer: 15,
            royalazalea: 5,
            essentialrage: 5
        },
        hp: 20865,
        armor: 1,
        weapon: 1
    },
    blazespider: {
        drops: {
            burger: 30,
            fireplay: 15,
            royalazalea: 5,
            essentialrage: 5
        },
        hp: 21240,
        armor: 1,
        weapon: 1
    },
    whitetiger: {
        drops: {
            burger: 30,
            tigerarmor: 15,
            royalazalea: 5,
            essentialrage: 5
        },
        hp: 21622,
        armor: 1,
        weapon: 1
    },
    blackwizard: {
        drops: {
            burger: 30,
            weastaff: 15,
            wizardrobe: 2,
            royalazalea: 5
        },
        hp: 22012,
        armor: 1,
        weapon: 1
    },
    smalldevil: {
        drops: {
            burger: 30,
            ironknightarmor: 15,
            royalazalea: 5
        },
        hp: 22408,
        armor: 1,
        weapon: 1

    },
    pierrot: {
        drops: {
            burger: 30,
            evilarmor: 15,
            royalazalea: 5
        },
        hp: 22811,
        armor: 1,
        weapon: 1
    },
    mantis: {
        drops: {
            burger: 30,
            pinksword: 15,
            royalazalea: 5
        },
        hp: 23195,
        armor: 1,
        weapon: 1
    },
    poisonspider: {
        drops: {
            burger: 30,
            greendamboarmor: 15,
            royalazalea: 5
        },
        hp: 23980,
        armor: 1,
        weapon: 1
    },
    babyspider: {
        drops: {
            burger: 30,
            royalazalea: 5
        },
        hp: 7590,
        armor: 1,
        weapon: 1
    },
    queenspider: {
        drops: {
            burger: 30,
            reddamboarmor: 15,
            royalazalea: 5
        },
        hp: 24793,
        armor: 1,
        weapon: 1
    },
    skydinosaur: {
        drops: {
            burger: 30,
            conferencecall: 15,
            royalazalea: 5
        },
        hp: 25633,
        armor: 1,
        weapon: 1
    },
    cactus: {
        drops: {
            burger: 30,
            cactusaxe: 15,
            royalazalea: 5
        },
        hp: 26502,
        armor: 1,
        weapon: 1
    },
    devilkazya: {
        drops: {
            burger: 30,
            devilkazyaarmor: 15,
            devilkazyasword: 15,
            royalazalea: 5
        },
        hp: 27399,
        armor: 1,
        weapon: 1
    },
    cursedjangseung: {
        drops: {
            burger: 30,
            bridalmask: 15,
            royalazalea: 5
        },
        hp: 28328,
        armor: 1,
        weapon: 1
    },
    suicideghost: {
        drops: {
            burger: 30,
            bamboospear: 15,
            royalazalea: 5
        },
        hp: 29288,
        armor: 1,
        weapon: 1
    },
    hellspider: {
        drops: {
            burger: 30,
            blackspiderarmor: 15,
            royalazalea: 5
        },
        hp: 30280,
        armor: 1,
        weapon: 1
    },
    frog: {
        drops: {
            burger: 30,
            frogarmor: 15,
            royalazalea: 5
        },
        hp: 31306,
        armor: 1,
        weapon: 1
    },
    cursedhahoemask: {
        drops: {
            burger: 30,
            paewoldo: 15,
            royalazalea: 5
        },
        hp: 32367,
        armor: 1,
        weapon: 1
    },
    jirisanmoonbear: {
        drops: {
            burger: 30,
            bearseonbiarmor: 15,
            royalazalea: 5
        },
        hp: 33763,
        armor: 1,
        weapon: 1
    }
};

Properties.getArmorLevel = function(kind) {
    try {
        if(Types.isMob(kind)) {
            return Properties[Types.getKindAsString(kind)].armor;
        } else {
            return Types.getArmorRank(kind) + 1;
        }
    } catch(e) {
        log.error("No level found for armor: "+Types.getKindAsString(kind));
        log.error('Error stack: ' + e.stack);
    }
};

Properties.getWeaponLevel = function(kind) {
    try {
        if(Types.isMob(kind)) {
            return Properties[Types.getKindAsString(kind)].weapon;
        } else {
            return Types.getWeaponRank(kind) + 1;
        }
    } catch(e) {
        log.error("No level found for weapon: "+Types.getKindAsString(kind));
        log.error('Error stack: ' + e.stack);
    }
};

Properties.getHitPoints = function(kind) {
    return Properties[Types.getKindAsString(kind)].hp;
};
Properties.getExp = function(kind){
    return Properties[Types.getKindAsString(kind)].exp;
};

module.exports = Properties;