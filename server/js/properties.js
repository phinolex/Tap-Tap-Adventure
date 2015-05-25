
var Types = require("../../shared/js/gametypes");

var Properties = {
    wizard: {
        drops: {
            flask: 50,
            platearmor: 5,
            firepotion: 5
        },
        hp: 80,
        armor: 1,
        weapon: 1
    },
    crab: {
        drops: {
            flask: 50,
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
            sword2: 19,
            plasticbow: 19,
            firepotion: 10,

            ring1: 1
        },
        hp: 100,
        armor: 1,
        weapon: 1
    },
    goblin: {
        drops: {
            flask: 50,
            leatherarmor: 19,
            leatherarcherarmor: 19,
            firepotion: 10,

            ring1: 1
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
            axe: 19,
            ironbow: 19,
            firepotion: 10,

            ring1: 1
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
            flask: 50,
            mailarmor: 19,
            mailarcherarmor: 19,
            firepotion: 10,

            ring1: 1
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
            flask: 50,
            platearmor: 19,
            platearcherarmor: 19,
            firepotion: 10,

            ring1: 1
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
            flask: 50,
            bluesword: 19,
            violetbow: 19,
            firepotion: 10,

            ring1: 1
        },
        hp: 300,
        armor: 1,
        weapon: 1
    },
    spectre: {
        drops: {
            flask: 30,
            redarmor: 19,
            redarcherarmor: 19,
            firepotion: 10,

            ring1: 1
        },
        hp: 300,
        armor: 1,
        weapon: 1

    },
    deathknight: {
        drops: {
            burger: 30,
            redsword: 19,
            deathbow: 19,
            firepotion: 10,

            ring1: 1
        },
        hp: 360,
        armor: 1,
        weapon: 1
    },
    skeletonking: {
        drops: {
            goldensword: 50,
            goldenarcherarmor: 25,
            goldenbow: 25
        },
        hp: 1400,
        armor: 1,
        weapon: 1
    },
    mimic: {
        drops: {
            greenarmor: 10,
            greenarcherarmor: 10,
            burger: 30,
            firepotion: 5,
            sproutring: 1

        },
        hp: 540,
        armor: 1,
        weapon: 1

    },
    orc: {
        drops: {
            burger: 30,
            greenarmor: 10,
            greenarcherarmor: 10,
            firepotion: 5,
            sproutring: 1

        },
        hp: 540,
        armor: 1,
        weapon: 1
    },
    oldogre: {
        drops: {
            burger: 30,
            greenwingarmor: 10,
            greenwingarcherarmor: 10,
            firepotion: 5,
            sproutring: 1

        },
        hp: 700,
        armor: 1,
        weapon: 1
    },
    golem: {
        drops: {
            burger: 30,
            greenwingarmor: 10,
            greenwingarcherarmor: 10,
            firepotion: 5,
            sproutring: 1

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
            sproutring: 1

        },
        hp: 800,
        armor: 1,
        weapon: 1

    },
    yellowmouse: {
        drops: {
            burger: 30,
            spear: 10,
            greenbow: 10,
            firepotion: 5,
            sproutring: 1

        },
        hp: 540,
        armor: 1,
        weapon: 1
    },
    brownmouse: {
        drops: {
            burger: 30,
            guardarmor: 10,
            guardarcherarmor: 10,
            firepotion: 5,
            sproutring: 1

        },
        hp: 740,
        armor: 1,
        weapon: 1
    },
    redguard: {
        drops: {
            burger: 30,
            redguardarmor: 10,
            redguardarcherarmor: 10,
            firepotion: 5,
            sproutring: 1

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
            sproutring: 1

        },
        hp: 800,
        armor: 1,
        weapon: 1

    },
    infectedguard: {
        drops: {
            burger: 30,
            whitearmor: 10,
            whitearcherarmor: 10,
            firepotion: 5,
            sproutring: 1

        },
        hp: 800,
        armor: 1,
        weapon: 1
    },
    livingarmor: {
        drops: {
            burger: 30,
            whitearmor: 10,
            whitearcherarmor: 10,
            firepotion: 5,
            sproutring: 1

        },
        hp: 800,
        armor: 1,
        weapon: 1
    },
    // Line
    whitemouse: {
        drops: {
            burger: 30,
            ratarmor: 10,
            ratarcherarmor: 10,
            firepotion: 5,
            sproutring: 1

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
            pearlring: 1

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
            pearlring: 1

        },
        hp: 1000,
        armor: 1,
        weapon: 1
    },
    pirateskeleton: {
        drops: {
            burger: 30,
            bluepiratearmor: 10,
            piratearcherarmor: 10,
            firepotion: 5,
            pearlring: 1

        },
        hp: 1000,
        armor: 1,
        weapon: 1
    },
    vulture: {
        drops: {
            burger: 30,
            firepotion: 10,
            pearlring: 1

        },
        hp: 1150,
        armor: 1,
        weapon: 1
    },
    penguin: {
        drops: {
            burger: 30,
            cheoliarmor: 10,
            cheoliarcherarmor: 10,
            firepotion: 5,
            pearlring: 1

        },
        hp: 1200,
        armor: 1,
        weapon: 1
    },
    desertscolpion: {
        drops: {
            burger: 30,
            firepotion: 5,
            pearlring: 1

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
            pearlring: 1

        },
        hp: 1400,
        armor: 1,
        weapon: 1
    },
    darkskeleton: {
        drops: {
            burger: 30,
            dovakinarmor: 5,
            dovakinarcherarmor: 5,
            firepotion: 5,
            pearlring: 1

        },
        hp: 1500,
        armor: 1,
        weapon: 1
    },
    darkscolpion: {
        drops: {
            burger: 30,
            firepotion: 5,
            pearlring: 1

        },
        hp: 1700,
        armor: 1,
        weapon: 1
    },
    greenpirateskeleton: {
        drops: {
            burger: 30,
            gbwingarmor: 5,
            gbwingarcherarmor: 5,
            firepotion: 5,
            pearlring: 1

        },
        hp: 1800,
        armor: 1,
        weapon: 1
    },
    blackpirateskeleton: {
        drops: {
            burger: 30,
            gbwingarmor: 5,
            gbwingarcherarmor: 5,
            firepotion: 5,
            pearlring: 1

        },
        hp: 1900,
        armor: 1,
        weapon: 1
    },
    pinkelf: {
        drops: {
            burger: 30,
            greenlightsaber: 5,
            greenlightbow: 5,
            firepotion: 5,
            pearlring: 1

        },
        hp: 2000,
        armor: 1,
        weapon: 1
    },
    redpirateskeleton: {
        drops: {
            burger: 30,
            gbwingarmor: 5,
            gbwingarcherarmor: 5,
            firepotion: 5,
            pearlring: 1

        },
        hp: 2100,
        armor: 1,
        weapon: 1
    },
    yellowpreta: {
        drops: {
            burger: 30,
            redwingarmor: 5,
            redwingarcherarmor: 5,
            firepotion: 5,
            pearlring: 1

        },
        hp: 2200,
        armor: 1,
        weapon: 1
    },
    bluepreta: {
        drops: {
            burger: 30,
            redwingarmor: 5,
            redwingarcherarmor: 5,
            firepotion: 5,
            pearlring: 1

        },
        hp: 2300,
        armor: 1,
        weapon: 1
    },
    miniknight: {
        drops: {
            burger: 30,
            snowfoxarmor: 5,
            snowfoxarcherarmor: 5,
            firepotion: 5,
            pearlring: 1

        },
        hp: 2438,
        armor: 1,
        weapon: 1
    },
    wolf: {
        drops: {
            burger: 30,
            wolfarmor: 5,
            wolfarcherarmor: 5,
            pearlring: 1

        },
        hp: 2584,
        armor: 1,
        weapon: 1
    },
    skyelf: {
        drops: {
            burger: 30,
            skylightsaber: 5,
            skylightbow: 5,
            firepotion: 5,
            pearlring: 1

        },
        hp: 2739,
        armor: 1,
        weapon: 1
    },
    redelf: {
        drops: {
            burger: 30,
            redlightsaber: 5,
            redlightbow: 5,
            firepotion: 5,
            pearlring: 1

        },
        hp: 2903,
        armor: 1,
        weapon: 1
    },
    zombie: {
        drops: {
            burger: 30,
            bluewingarmor: 5,
            bluewingarcherarmor: 5,
            firepotion: 5,
            pearlring: 1

        },
        hp: 3077,
        armor: 1,
        weapon: 1
    },
    piratecaptain: {
        drops: {
            burger: 30,
            bastardsword: 5,
            captainbow: 5,
            firepotion: 5,
            pearlring: 1

        },
        hp: 3201,
        armor: 1,
        weapon: 1
    },
    ironogre: {
        drops: {
            burger: 30,
            fallenarmor: 5,
            fallenarcherarmor: 5,
            royalazalea: 1,
            spiritring: 1

        },
        hp: 3329,
        armor: 1,
        weapon: 1
    },
    ogrelord: {
        drops: {
            burger: 30,
            redmetalsword: 5,
            redmetalbow: 5,
            royalazalea: 1,
            spiritring: 1

        },
        hp: 3462,
        armor: 1,
        weapon: 1
    },
    crystalscolpion: {
        drops: {
            burger: 30,
            crystalarmor: 5,
            crystalarcherarmor: 5,
            royalazalea: 1,
            spiritring: 1

        },
        hp: 3600,
        armor: 1,
        weapon: 1
    },
    eliminator: {
        drops: {
            burger: 30,
            paladinarmor: 2,
            legolasarmor: 2,
            justicehammer: 2,
            justicebow: 2,
            royalazalea: 1,
            spiritring: 1

        },
        hp: 3744,
        armor: 1,
        weapon: 1
    },
    adherer: {
        drops: {
            burger: 30,
            adhererrobe: 5,
            adhererarcherarmor: 5,
            royalazalea: 1,
            spiritring: 1

        },
        hp: 3894,
        armor: 1,
        weapon: 1
    },
    miniiceknight: {
        drops: {
            burger: 30,
            icerose: 5,
            marinebow: 5,
            rosebow: 5,
            royalazalea: 1,
            spiritring: 1

        },
        hp: 4050,
        armor: 1,
        weapon: 1
    },
    iceknight: {
        drops: {
            burger: 30,
            schooluniform: 5,
            archerschooluniform: 5,
            royalazalea: 1,
            spiritring: 1

        },
        hp: 4212,
        armor: 1,
        weapon: 1
    },
    icegolem: {
        drops: {
            burger: 30,
            halberd: 5,
            crystalbow: 5,
            royalazalea: 1,
            spiritring: 1

        },
        hp: 4380,
        armor: 1,
        weapon: 1
    },
    snowwolf: {
        drops: {
            burger: 30,
            taekwondo: 5,
            combatuniform: 5,
            royalazalea: 1,
            spiritring: 1

        },
        hp: 4556,
        armor: 1,
        weapon: 1
    },
    cobra: {
        drops: {
            burger: 30,
            whip: 5,
            gaybow: 5,
            royalazalea: 1,
            spiritring: 1

        },
        hp: 4738,
        armor: 1,
        weapon: 1
    },
    darkogre: {
        drops: {
            burger: 30,
            gayarmor: 5,
            gayarcherarmor: 5,
            royalazalea: 1,
            spiritring: 1

        },
        hp: 4927,
        armor: 1,
        weapon: 1
    },
    snowelf: {
        drops: {
            burger: 30,
            ninjaarmor: 5,
            royalazalea: 1,
            spiritring: 1

        },
        hp: 5124,
        armor: 1,
        weapon: 1
    },
    forestdragon: {
        drops: {
            burger: 30,
            forestguardiansword: 5,
            forestbow: 5,
            royalazalea: 1,
            spiritring: 1

        },
        hp: 5329,
        armor: 1,
        weapon: 1
    },
    pain: {
        drops: {
            burger: 30,
            beautifullife: 5,
            royalazalea: 1,
            spiritring: 1

        },
        hp: 5543,
        armor: 1,
        weapon: 1
    },
    whitebear: {
        drops: {
            burger: 30,
            thiefarmor: 5,
            royalazalea: 1,
            spiritring: 1

        },
        hp: 5764,
        armor: 1,
        weapon: 1
    },
    snowrabbit: {
        drops: {
            burger: 30,
            rabbitarmor: 5,
            royalazalea: 1,
            spiritring: 1

        },
        hp: 5995,
        armor: 1,
        weapon: 1
    },
    icevulture: {
        drops: {
            burger: 30,
            sickle: 5,
            sicklebow: 5,
            royalazalea: 1,
            spiritring: 1

        },
        hp: 6235,
        armor: 1,
        weapon: 1
    },
    darkregionillusion: {
        drops: {
            burger: 30,
            portalarmor: 5,
            royalazalea: 1,
            spiritring: 1

        },
        hp: 6484,
        armor: 1,
        weapon: 1
    },
    regionhenchman: {
        drops: {
            burger: 30,
            ghostrider: 5,
            royalazalea: 1,
            spiritring: 1

        },
        hp: 6744,
        armor: 1,
        weapon: 1
    },
    purplepreta: {
        drops: {
            burger: 30,
            plunger: 5,
            bloodbow: 5,
            royalazalea: 1,
            spiritring: 1

        },
        hp: 6946,
        armor: 1,
        weapon: 1
    },
    flaredeathknight: {
        drops: {
            burger: 30,
            redsickle: 5,
            redsicklebow: 5,
            royalazalea: 1,
            essentialrage: 1
        },
        hp: 7154,
        armor: 1,
        weapon: 1
    },
    snowlady: {
        drops: {
            burger: 30,
            daywalker: 5,
            royalazalea: 1,
            essentialrage: 1
        },
        hp: 7369,
        armor: 1,
        weapon: 1
    },
    frostqueen: {
        drops: {
            burger: 30,
            frostarmor: 5,
            royalazalea: 1,
            essentialrage: 1
        },
        hp: 7590,
        armor: 1,
        weapon: 1
    },
    darkregion: {
        drops: {
            burger: 30,
            regionarmor: 5,
            royalazalea: 1,
            essentialrage: 1
        },
        hp: 7818,
        armor: 1,
        weapon: 1
    },
    nightmareregion: {
        drops: {
            burger: 30,
            purplecloudkallege: 5,
            royalazalea: 1,
            essentialrage: 1
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
            royalazalea: 1,
            essentialrage: 1
        },
        hp: 8294,
        armor: 1,
        weapon: 1
    },
    shadowregion: {
        drops: {
            burger: 30,
            shadowregionarmor: 5,
            royalazalea: 1,
            essentialrage: 1
        },
        hp: 8543,
        armor: 1,
        weapon: 1
    },
    goldgolem: {
        drops: {
            burger: 30,
            pirateking: 5,
            royalazalea: 1,
            essentialrage: 1
        },
        hp: 8799,
        armor: 1,
        weapon: 1
    },
    lightningguardian: {
        drops: {
            burger: 30,
            breaker: 5,
            royalazalea: 1,
            essentialrage: 1
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
            royalazalea: 1,
            essentialrage: 1
        },
        hp: 9426,
        armor: 1,
        weapon: 1
    },
    minidragon: {
        drops: {
            burger: 30,
            dragonarmor: 5,
            royalazalea: 1,
            essentialrage: 1
        },
        hp: 9803,
        armor: 1,
        weapon: 1
    },
    miniseadragon: {
        drops: {
            burger: 30,
            miniseadragonarmor: 5,
            royalazalea: 1,
            essentialrage: 1
        },
        hp: 10195,
        armor: 1,
        weapon: 1
    },
    miniemperor: {
        drops: {
            burger: 30,
            huniarmor: 4,
            royalazalea: 1,
            essentialrage: 1
        },
        hp: 10603,
        armor: 1,
        weapon: 1
    },
    slime: {
        drops: {
            burger: 30,
            rainbowsword: 4,
            royalazalea: 1,
            essentialrage: 1
        },
        hp: 11027,
        armor: 1,
        weapon: 1
    },
    kaonashi: {
        drops: {
            burger: 30,
            damboarmor: 4,
            royalazalea: 1,
            essentialrage: 1
        },
        hp: 11468,
        armor: 1,
        weapon: 1
    },
    windguardian: {
        drops: {
            burger: 30,
            typhoon: 4,
            royalazalea: 1,
            essentialrage: 1
        },
        hp: 11926,
        armor: 1,
        weapon: 1
    },
    squid: {
        drops: {
            burger: 30,
            squidarmor: 4,
            royalazalea: 1,
            essentialrage: 1
        },
        hp: 12404,
        armor: 1,
        weapon: 1
    },
    rhaphidophoridae: {
        drops: {
            burger: 30,
            memme: 4,
            royalazalea: 1,
            essentialrage: 1
        },
        hp: 12900,
        armor: 1,
        weapon: 1
    },
    bee: {
        drops: {
            burger: 30,
            beearmor: 4,
            royalazalea: 1,
            essentialrage: 1
        },
        hp: 13416,
        armor: 1,
        weapon: 1
    },
    ant: {
        drops: {
            burger: 30,
            bluedamboarmor: 4,
            royalazalea: 1,
            essentialrage: 1
        },
        hp: 13952,
        armor: 1,
        weapon: 1
    },
    rudolf: {
        drops: {
            burger: 30,
            rudolfarmor: 4,
            royalazalea: 1,
            essentialrage: 1
        },
        hp: 14510,
        armor: 1,
        weapon: 1
    },
    santaelf: {
        drops: {
            burger: 30,
            candybar: 4,
            royalazalea: 1,
            essentialrage: 1
        },
        hp: 15091,
        armor: 1,
        weapon: 1
    },
    santa: {
        drops: {
            burger: 30,
            christmasarmor: 4,
            royalazalea: 1,
            essentialrage: 1
        },
        hp: 15695,
        armor: 1,
        weapon: 1
    },
    soldierant: {
        drops: {
            burger: 30,
            robocoparmor: 4,
            royalazalea: 1,
            essentialrage: 1
        },
        hp: 16118,
        armor: 1,
        weapon: 1
    },
    redcockroach: {
        drops: {
            burger: 30,
            pinkcockroacharmor: 4,
            royalazalea: 1,
            essentialrage: 1
        },
        hp: 16554,
        armor: 1,
        weapon: 1
    },
    bluecockroach: {
        drops: {
            burger: 30,
            cockroachsuit: 4,
            royalazalea: 1,
            essentialrage: 1
        },
        hp: 17000,
        armor: 1,
        weapon: 1
    },
    soybeanbug: {
        drops: {
            burger: 30,
            butcherknife: 4,
            royalazalea: 1,
            essentialrage: 1
        },
        hp: 17460,
        armor: 1,
        weapon: 1
    },
    earthworm: {
        drops: {
            burger: 30,
            dinosaurarmor: 4,
            royalazalea: 1,
            essentialrage: 1
        },
        hp: 17931,
        armor: 1,
        weapon: 1
    },
    cat: {
        drops: {
            burger: 30,
            catarmor: 4,
            royalazalea: 1,
            essentialrage: 1
        },
        hp: 18415,
        armor: 1,
        weapon: 1
    },
    firespider: {
        drops: {
            burger: 30,
            fireshot: 4,
            royalazalea: 1,
            essentialrage: 1
        },
        hp: 18747,
        armor: 1,
        weapon: 1
    },
    snowman: {
        drops: {
            burger: 30,
            snowmanarmor: 4,
            royalazalea: 1,
            essentialrage: 1
        },
        hp: 19428,
        armor: 1,
        weapon: 1
    },
    queenant: {
        drops: {
            burger: 30,
            comb: 4,
            royalazalea: 1,
            essentialrage: 1
        },
        hp: 20133,
        armor: 1,
        weapon: 1
    },
    beetle: {
        drops: {
            burger: 30,
            beetlearmor: 4,
            royalazalea: 1,
            essentialrage: 1
        },
        hp: 20496,
        armor: 1,
        weapon: 1
    },
    hongcheol: {
        drops: {
            burger: 30,
            hongcheolarmor: 2,
            squeakyhammer: 2,
            royalazalea: 1,
            essentialrage: 1
        },
        hp: 20865,
        armor: 1,
        weapon: 1
    },
    blazespider: {
        drops: {
            burger: 30,
            fireplay: 4,
            royalazalea: 1,
            essentialrage: 1
        },
        hp: 21240,
        armor: 1,
        weapon: 1
    },
    whitetiger: {
        drops: {
            burger: 30,
            tigerarmor: 4,
            royalazalea: 1,
            essentialrage: 1
        },
        hp: 21622,
        armor: 1,
        weapon: 1
    },
    blackwizard: {
        drops: {
            burger: 30,
            weastaff: 2,
            wizardrobe: 2,
            royalazalea: 1
        },
        hp: 22012,
        armor: 1,
        weapon: 1
    },
    smalldevil: {
        drops: {
            burger: 30,
            ironknightarmor: 4,
            royalazalea: 1
        },
        hp: 22408,
        armor: 1,
        weapon: 1

    },
    pierrot: {
        drops: {
            burger: 30,
            evilarmor: 4,
            royalazalea: 1
        },
        hp: 22811,
        armor: 1,
        weapon: 1
    },
    mantis: {
        drops: {
            burger: 30,
            pinksword: 3,
            royalazalea: 1
        },
        hp: 23195,
        armor: 1,
        weapon: 1
    },
    poisonspider: {
        drops: {
            burger: 30,
            greendamboarmor: 3,
            royalazalea: 1
        },
        hp: 23980,
        armor: 1,
        weapon: 1
    },
    babyspider: {
        drops: {
            burger: 30,
            royalazalea: 1
        },
        hp: 7590,
        armor: 1,
        weapon: 1
    },
    queenspider: {
        drops: {
            burger: 30,
            reddamboarmor: 3,
            royalazalea: 1
        },
        hp: 24793,
        armor: 1,
        weapon: 1
    },
    skydinosaur: {
        drops: {
            burger: 30,
            conferencecall: 3,
            royalazalea: 1
        },
        hp: 25633,
        armor: 1,
        weapon: 1
    },
    cactus: {
        drops: {
            burger: 30,
            cactusaxe: 3,
            royalazalea: 1
        },
        hp: 26502,
        armor: 1,
        weapon: 1
    },
    devilkazya: {
        drops: {
            burger: 30,
            devilkazyaarmor: 2,
            devilkazyasword: 2,
            royalazalea: 1
        },
        hp: 27399,
        armor: 1,
        weapon: 1
    },
    cursedjangseung: {
        drops: {
            burger: 30,
            bridalmask: 3,
            royalazalea: 1
        },
        hp: 28328,
        armor: 1,
        weapon: 1
    },
    suicideghost: {
        drops: {
            burger: 30,
            bamboospear: 3,
            royalazalea: 1
        },
        hp: 29288,
        armor: 1,
        weapon: 1
    },
    hellspider: {
        drops: {
            burger: 30,
            blackspiderarmor: 3,
            royalazalea: 1
        },
        hp: 30280,
        armor: 1,
        weapon: 1
    },
    frog: {
        drops: {
            burger: 30,
            frogarmor: 2,
            royalazalea: 1
        },
        hp: 31306,
        armor: 1,
        weapon: 1
    },
    cursedhahoemask: {
        drops: {
            burger: 30,
            paewoldo: 2,
            royalazalea: 1
        },
        hp: 32367,
        armor: 1,
        weapon: 1
    },
    jirisanmoonbear: {
        drops: {
            burger: 30,
            bearseonbiarmor: 2,
            royalazalea: 1
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