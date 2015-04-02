/* global bootKind */

Types = {
    Quest: {
            TOTAL_QUEST_NUMBER: 35
    },
    Messages: {

        CREATE: 0,
        LOGIN: 1,
        WELCOME: 2,
        SPAWN: 3,
        DESPAWN: 4,
        MOVE: 5,
        LOOTMOVE: 6,
        AGGRO: 7,
        ATTACK: 8,
        HIT: 9,
        HURT: 10,
        HEALTH: 11,
        CHAT: 12,
        LOOT: 13,
        EQUIP: 14,
        DROP: 15,
        TELEPORT: 16,
        DAMAGE: 17,
        POPULATION: 18,
        KILL: 19,
        LIST: 20,
        WHO: 21,
        ZONE: 22,
        DESTROY: 23,
        HP: 24,
        BLINK: 25,
        OPEN: 26,
        CHECK: 27,
        PVP: 28,
        BOARD: 29,
        BOARDWRITE: 30,
        NOTIFY: 31,
        KUNG: 32,
	QUEST: 33,
	TALKTONPC: 34,
        MAGIC: 36,
        MANA: 37,
        RANKING: 38,
        INVENTORY: 39
    },

    Entities: {
        WARRIOR: 1,
        ARCHER: 222,

        // Archer Armors
        ARCHERARMOR: 223,
        LEATHERARCHERARMOR: 252,
        MAILARCHERARMOR: 258,
        PLATEARCHERARMOR: 260,
        REDARCHERARMOR: 264,
        GOLDENARCHERARMOR: 277,
        GREENARCHERARMOR: 290,
        GREENWINGARCHERARMOR: 291,
        GUARDARCHERARMOR: 294,
        REDGUARDARCHERARMOR: 307,
        WHITEARCHERARMOR: 314,
        RATARCHERARMOR: 319,
        PIRATEARCHERARMOR: 321,
        CHEOLIARCHERARMOR: 324,
        DOVAKINARCHERARMOR: 328,
        GBWINGARCHERARMOR: 331,
        REDWINGARCHERARMOR: 336,
        SNOWFOXARCHERARMOR: 339,
        WOLFARCHERARMOR: 343,
        BLUEWINGARCHERARMOR: 349,
        FALLENARCHERARMOR: 351,
        CRYSTALARCHERARMOR: 357,
        LEGOLASARMOR: 362,
        ADHERERARCHERARMOR: 368,
        ARCHERSCHOOLUNIFORM: 373,
        COMBATUNIFORM: 379,
        GAYARCHERARMOR: 384,

        // Archer Weapons
        WOODENBOW: 224,
        PLASTICBOW: 259,
        IRONBOW: 261,
        REDBOW: 265,
        VIOLETBOW: 271,
        DEATHBOW: 272,
        GOLDENBOW: 284,
        WATERMELONBOW: 289,
        GREENBOW: 295,
        REDENELBOW: 302,
        MERMAIDBOW: 308,
        SEAHORSEBOW: 315,
        HUNTERBOW: 320,
        GREENLIGHTBOW: 322,
        SKYLIGHTBOW: 325,
        REDLIGHTBOW: 329,
        CAPTAINBOW: 332,
        REDMETALBOW: 337,
        MARINEBOW: 340,
        JUSTICEBOW: 344,
        ROSEBOW: 350,
        CRYSTALBOW: 358,
        GAYBOW: 363,
        FORESTBOW: 369,
        SICKLEBOW: 374,
        BLOODBOW: 380,
        REDSICKLEBOW: 385,
        
        // Mobs
        RAT: 2,
        SKELETON: 3,
        GOBLIN: 4,
        OGRE: 5,
        SPECTRE: 6,
        CRAB: 7,
        BAT: 8,
        WIZARD: 9,
        EYE: 10,
        SNEK: 11,
        SKELETON2: 12,
        SKELETONKING: 13,
        DEATHKNIGHT: 14,
        ORC: 67,
        OLDOGRE: 68,
        GOLEM: 69,
        MIMIC: 70,
        HOBGOBLIN: 71,
        YELLOWMOUSE: 75,
        WHITEMOUSE: 76,
        BROWNMOUSE: 77,
        REDMOUSE: 80,
        REDGUARD: 81,
        INFECTEDGUARD: 85,
        LIVINGARMOR: 86,
        MERMAID: 87,
        YELLOWFISH: 90,
        GREENFISH: 91,
        REDFISH: 92,
        CLAM: 93,
        PRETA: 94,
        PIRATESKELETON: 95,
        PENGUIN: 98,
        MOLEKING: 99,
        DARKSKELETON: 102,
        GREENPIRATESKELETON: 103,
        BLACKPIRATESKELETON: 104,
        REDPIRATESKELETON: 105,
        YELLOWPRETA: 106,
        BLUEPRETA: 107,
        MINIKNIGHT: 108,
        WOLF: 109,
        PINKELF: 115,
        SKYELF: 117,
        REDELF: 119,
        HERMITCRAB: 141, 
        ZOMBIE: 121,
        PIRATECAPTAIN: 122,
        IRONOGRE: 123,
        OGRELORD: 124,
        ADHERER: 125,
        ICEGOLEM: 126,
        DESERTSCOLPION: 142, 
        DARKSCOLPION: 143,
        VULTURE: 144, 
        FORESTDRAGON: 145,
        CRYSTALSCOLPION: 146,
        ELIMINATOR: 147,
        FROSTQUEEN: 148,
        SNOWRABBIT: 149,
        SNOWWOLF: 150,
        ICEKNIGHT: 151,
        MINIICEKNIGHT: 152,
        SNOWELF: 153,
        WHITEBEAR: 154,
        COBRA: 155,
        GOLDGOLEM: 156,
        DARKREGION: 157,
        DARKREGIONILLUSION: 158,
        NIGHTMAREREGION: 159,
        DARKOGRE: 171,
        PAIN: 174,
        ICEVULTURE: 177,
        REGIONHENCHMAN: 180,
        PURPLEPRETA: 181,
        FLAREDEATHKNIGHT: 183,
        SNOWLADY: 185,
        SEADRAGON: 189,
        SHADOWREGION: 192,
        LIGHTNINGGUARDIAN: 195,
        ENEL: 197,
        MINIDRAGON: 201,
        MINISEADRAGON: 202,
        MINIEMPEROR: 204,
        SLIME: 206,
        KAONASHI: 208,
        WINDGUARDIAN: 210,
        SQUID: 214,
        RHAPHIDOPHORIDAE: 216,
        BEE: 218,
        ANT: 220,
        RUDOLF: 225,
        SANTAELF: 228,
        SANTA: 231,
        SOLDIERANT: 234,
        REDCOCKROACH: 237,
        BLUECOCKROACH: 240,
        SOYBEANBUG: 242,
        EARTHWORM: 247,
        CAT: 250,
        FIRESPIDER: 253,
        SNOWMAN: 255,
        QUEENANT: 262,
        BEETLE: 266,
        HONGCHEOL: 268,
        BLAZESPIDER: 273,
        WHITETIGER: 275,
        BLACKWIZARD: 278,
        SMALLDEVIL: 281,
        PIERROT: 285,
        MANTIS: 292,
        POISONSPIDER: 296,
        BABYSPIDER: 301,
        QUEENSPIDER: 309,
        SKYDINOSAUR: 311,
        CACTUS: 326,
        DEVILKAZYA: 333,
        CURSEDJANGSEUNG: 341,
        SUICIDEGHOST: 346,
        HELLSPIDER: 354,
        FROG: 364,
        CURSEDHAHOEMASK: 375,
        JIRISANMOONBEAR: 386,
        
        // Armors
        CLOTHARMOR: 21,
        LEATHERARMOR: 22,
        MAILARMOR: 23,
        PLATEARMOR: 24,
        REDARMOR: 25,
        GOLDENARMOR: 26,
        GREENARMOR: 72,
        GREENWINGARMOR: 73,
        GUARDARMOR: 78,
        REDGUARDARMOR: 82,
        WHITEARMOR: 83,
        RATARMOR: 88,
        BLUEPIRATEARMOR: 96,
        CHEOLIARMOR: 100,
        DOVAKINARMOR: 110,
        GBWINGARMOR: 111,
        REDWINGARMOR: 112,
        SNOWFOXARMOR: 113,
        WOLFARMOR: 114,
        BLUEWINGARMOR: 127,
        THIEFARMOR: 128,
        NINJAARMOR: 129,
        DRAGONARMOR: 130,
        FALLENARMOR: 131,
        PALADINARMOR: 132,
        CRYSTALARMOR: 133,
        ADHERERROBE: 134,
        FROSTARMOR: 135,
        GAYARMOR: 160,
        SCHOOLUNIFORM: 161,
        BEAUTIFULLIFE: 162,
        REGIONARMOR: 163,
        GHOSTRIDER: 164,
        TAEKWONDO: 170,
        ADMINARMOR: 175,
        RABBITARMOR: 176,
        PORTALARMOR: 179,
        PIRATEKING: 187,
        SEADRAGONARMOR: 190,
        SHADOWREGIONARMOR: 193,
        ENELARMOR: 198,
        MINISEADRAGONARMOR: 203,
        HUNIARMOR: 205,
        DAMBOARMOR: 209,
        SQUIDARMOR: 215,
        BEEARMOR: 219,
        BLUEDAMBOARMOR: 221,
        RUDOLFARMOR: 226,
        CHRISTMASARMOR: 232,
        ROBOCOPARMOR: 233,
        PINKCOCKROACHARMOR: 238,
        COCKROACHSUIT: 241,
        DINOSAURARMOR: 248,
        CATARMOR: 251,
        SNOWMANARMOR: 256,
        BEETLEARMOR: 267,
        HONGCHEOLARMOR: 269,
        TIGERARMOR: 276,
        WIZARDROBE: 279,
        IRONKNIGHTARMOR: 282,
        EVILARMOR: 286,
        GREENDAMBOARMOR: 297,
        REDDAMBOARMOR: 310,
        DEVILKAZYAARMOR: 334,
        BRIDALMASK: 342,
        BLACKSPIDERARMOR: 355,
        FROGARMOR: 365,
        BEARSEONBIARMOR: 387,

        RAINBOWAPRO: 356,
        COKEARMOR: 359,
        FRIEDPOTATOARMOR: 366,
        BURGERARMOR: 370,
        RADISHARMOR: 378,
        HALLOWEENJKARMOR: 381,
        FRANKENSTEINARMOR: 388,
        
        // Objects
        FLASK: 35,
        BURGER: 36,
        CHEST: 37,
        FIREPOTION: 38,
        CAKE: 39,
        BOOK: 172,
        CD: 173,
        SNOWPOTION: 200,
        ROYALAZALEA: 212,
        BLACKPOTION: 306,
        
        // NPCs
        GUARD: 40,
        KING: 41,
        OCTOCAT: 42,
        VILLAGEGIRL: 43,
        VILLAGER: 44,
        PRIEST: 45,
        SCIENTIST: 46,
        AGENT: 47,
        RICK: 48,
        NYAN: 49,
        SORCERER: 50,
        BEACHNPC: 51,
        FORESTNPC: 52,
        DESERTNPC: 53,
        LAVANPC: 54,
        CODER: 55,
        BOXINGMAN: 227,
        VAMPIRE: 230,
        DOCTOR: 235,
        ODDEYECAT: 236,
        VENDINGMACHINE: 239,
        SOLDIER: 244,
        FISHERMAN: 245,
        OCTOPUS: 246,
        MERMAIDNPC: 249,
        SPONGE: 257,
        FAIRYNPC: 283,
        SHEPHERDBOY: 287,
        ZOMBIEGF: 288,
        PIRATEGIRLNPC: 298,
        BLUEBIKINIGIRLNPC: 299,
        REDBIKINIGIRLNPC: 300,
        IAMVERYCOLDNPC: 303,
        ICEELFNPC: 316,
        REDSTOREMANNPC: 317,
        BLUESTOREMANNPC: 318,
        ELFNPC: 335,
        SNOWSHEPHERDBOY: 347,
        ANGELNPC: 352,
        MOMANGELNPC: 361,
        SUPERIORANGELNPC: 367,
        FIRSTSONANGELNPC: 371,
        SECONDSONANGELNPC: 376,
        MOJOJOJONPC: 382,
        ANCIENTMANUMENTNPC: 389, // Last
        
        // Weapons
        SWORD1: 60,
        SWORD2: 61,
        REDSWORD: 62,
        GOLDENSWORD: 63,
        MORNINGSTAR: 64,
        AXE: 65,
        BLUESWORD: 66,
        SIDESWORD: 74,
        SPEAR: 79,
        SCIMITAR: 84,
        TRIDENT: 89,
        BLUESCIMITAR: 97,
        HAMMER: 101,
        GREENLIGHTSABER: 116,
        SKYLIGHTSABER: 118,
        REDLIGHTSABER: 120,
        REDMETALSWORD: 136,
        BASTARDSWORD: 137,
        HALBERD: 138,
        ROSE: 139,
        ICEROSE: 140,
        JUSTICEHAMMER: 165,
        FIRESWORD: 166,
        WHIP: 167,
        FORESTGUARDIANSWORD: 168,
        SICKLE: 178,
        PLUNGER: 182,
        REDSICKLE: 184,
        DAYWALKER: 186,
        PURPLECLOUDKALLEGE: 188,
        SEARAGE: 191,
        MAGICSPEAR: 194,
        BREAKER: 196,
        ENELTRIDENT: 199,
        RAINBOWSWORD: 207,
        TYPHOON: 211,
        MEMME: 217,
        CANDYBAR: 229,
        BUTCHERKNIFE: 243,
        FIRESHOT: 254,
        COMB: 263,
        SQUEAKYHAMMER: 270,
        FIREPLAY: 274,
        WEASTAFF: 280,
        PINKSWORD: 293,
        CONFERENCECALL: 313,
        CACTUSAXE: 327,
        DEVILKAZYASWORD: 338,
        BAMBOOSPEAR: 348,
        PAEWOLDO: 377,

        // Pendants
        PENDANT1: 304,
        GREENPENDANT: 330,
        PEARLPENDANT: 353,
        MARBLEPENDANT: 372,

        // Rings
        RING1: 305,
        SPROUTRING: 323,
        PEARLRING: 345,
        SPIRITRING: 360,
        ESSENTIALRAGE: 383,

        // Benef
        DEBENEF: 20,
        FIREBENEF: 169,
        ROYALAZALEABENEF: 213
    },

    Orientations: {
        UP: 1,
        DOWN: 2,
        LEFT: 3,
        RIGHT: 4
    },

    Keys: {
        ENTER: 13,
        UP: 38,
        DOWN: 40,
        LEFT: 37,
        RIGHT: 39,
        W: 87,
        A: 65,
        S: 83,
        D: 68,
        SPACE: 32,
        I: 73,
        H: 72,
        M: 77,
        P: 80,
        KEYPAD_4: 100,
        KEYPAD_6: 102,
        KEYPAD_8: 104,
        KEYPAD_2: 98
    },
    
    Skills: {
      BLOODSUCKING: 1,
      RECOVERHEALTH: 2,
      HEALANDHEAL: 3,
      AVOIDATTACK: 4,
      ADDEXPERIENCE: 5,
      ATTACKWITHBLOOD: 6,
      CRITICALATTACK: 7,
      CRITICALRATIO: 8,
    }
    
};

var kinds = {
    warrior: [Types.Entities.WARRIOR, "player"],
    archer: [Types.Entities.ARCHER, "player"],
    
    wizard:             [Types.Entities.WIZARD,              "mob", 7, 1],
    crab:               [Types.Entities.CRAB,                "mob", 1, 1],
    rat:                [Types.Entities.RAT,                 "mob", 5, 2],
    bat:                [Types.Entities.BAT,                 "mob", 6, 3],
    goblin:             [Types.Entities.GOBLIN,              "mob", 8, 5],
    yellowfish:         [Types.Entities.YELLOWFISH,          "mob", 8, 5],
    skeleton:           [Types.Entities.SKELETON ,           "mob", 15, 8],
    greenfish:          [Types.Entities.GREENFISH,           "mob", 15, 8],
    snek:              [Types.Entities.SNEK,               "mob", 25, 10],
    redfish:            [Types.Entities.REDFISH,             "mob", 25, 10],
    ogre:               [Types.Entities.OGRE,                "mob", 27, 12],
    clam:               [Types.Entities.CLAM,                "mob", 27, 12],
    skeleton2:          [Types.Entities.SKELETON2,           "mob", 38, 15],
    hermitcrab:         [Types.Entities.HERMITCRAB,          "mob", 38, 15],
    eye:                [Types.Entities.EYE,                 "mob", 45, 18],
    spectre:            [Types.Entities.SPECTRE,             "mob", 55, 21],
    deathknight:        [Types.Entities.DEATHKNIGHT,         "mob", 70, 24],
    skeletonking:       [Types.Entities.SKELETONKING,        "mob", 180, 15],
    mimic:              [Types.Entities.MIMIC,               "mob", 100, 27],
    orc:                [Types.Entities.ORC,                 "mob", 100, 27],
    oldogre:            [Types.Entities.OLDOGRE,             "mob", 119, 27],
    golem:              [Types.Entities.GOLEM,               "mob", 119, 27],
    hobgoblin:          [Types.Entities.HOBGOBLIN,           "mob", 123, 33],
    yellowmouse:        [Types.Entities.YELLOWMOUSE,         "mob", 143, 33],
    brownmouse:         [Types.Entities.BROWNMOUSE,          "mob", 152, 36],
    redguard:           [Types.Entities.REDGUARD,            "mob", 155, 36],
    redmouse:           [Types.Entities.REDMOUSE,            "mob", 159, 39],
    infectedguard:      [Types.Entities.INFECTEDGUARD,       "mob", 169, 39],
    livingarmor:        [Types.Entities.LIVINGARMOR,         "mob", 169, 39],
    whitemouse:         [Types.Entities.WHITEMOUSE,          "mob", 171, 39],
    mermaid:            [Types.Entities.MERMAID,             "mob", 177, 39],
    preta:              [Types.Entities.PRETA,               "mob", 197, 42],
    pirateskeleton:     [Types.Entities.PIRATESKELETON,      "mob", 218, 45],
    vulture:            [Types.Entities.VULTURE,             "mob", 243, 48],
    penguin:            [Types.Entities.PENGUIN,             "mob", 270, 51],
    desertscolpion:     [Types.Entities.DESERTSCOLPION,      "mob", 300, 54],
    moleking:           [Types.Entities.MOLEKING,            "mob", 360, 57],
    darkskeleton:       [Types.Entities.DARKSKELETON,        "mob", 395, 60],
    darkscolpion:       [Types.Entities.DARKSCOLPION,        "mob", 471, 66],
    greenpirateskeleton:[Types.Entities.GREENPIRATESKELETON, "mob", 504, 69],
    blackpirateskeleton:[Types.Entities.BLACKPIRATESKELETON, "mob", 545, 72],
    pinkelf:            [Types.Entities.PINKELF,             "mob", 600, 75],
    redpirateskeleton:  [Types.Entities.REDPIRATESKELETON,   "mob", 664, 78],
    yellowpreta:        [Types.Entities.YELLOWPRETA,         "mob", 720, 81],
    bluepreta:          [Types.Entities.BLUEPRETA,           "mob", 794, 84],
    miniknight:         [Types.Entities.MINIKNIGHT,          "mob", 1036, 90],
    wolf:               [Types.Entities.WOLF,                "mob", 1244, 96],
    skyelf:             [Types.Entities.SKYELF,              "mob", 1492, 102],
    redelf:             [Types.Entities.REDELF,              "mob", 1791, 108],
    zombie:             [Types.Entities.ZOMBIE,              "mob", 2149, 114],
    piratecaptain:      [Types.Entities.PIRATECAPTAIN,       "mob", 2579, 120],
    ironogre:           [Types.Entities.IRONOGRE,            "mob", 3095, 124],
    ogrelord:           [Types.Entities.OGRELORD,            "mob", 3684, 128],
    crystalscolpion:    [Types.Entities.CRYSTALSCOLPION,     "mob", 4384, 132],
    eliminator:         [Types.Entities.ELIMINATOR,          "mob", 5217, 136],
    adherer:            [Types.Entities.ADHERER,             "mob", 6208, 140],
    miniiceknight:      [Types.Entities.MINIICEKNIGHT,       "mob", 7387, 144],
    iceknight:          [Types.Entities.ICEKNIGHT,           "mob", 8791, 148],
    icegolem:           [Types.Entities.ICEGOLEM,            "mob", 10461, 152],
    snowwolf:           [Types.Entities.SNOWWOLF,            "mob", 12449, 156],
    cobra:              [Types.Entities.COBRA,               "mob", 14815, 160],
    darkogre:           [Types.Entities.DARKOGRE,            "mob", 17629, 164],
    snowelf:            [Types.Entities.SNOWELF,             "mob", 20979, 168],
    forestdragon:       [Types.Entities.FORESTDRAGON,        "mob", 24965, 113],
    pain:               [Types.Entities.PAIN,                "mob", 29459, 176],
    whitebear:          [Types.Entities.WHITEBEAR,           "mob", 33878, 180],
    snowrabbit:         [Types.Entities.SNOWRABBIT,          "mob", 38960, 184],
    icevulture:         [Types.Entities.ICEVULTURE,          "mob", 40129, 188],
    darkregionillusion: [Types.Entities.DARKREGIONILLUSION,  "mob", 41333, 192],
    regionhenchman:     [Types.Entities.REGIONHENCHMAN,      "mob", 42573, 196],
    purplepreta:        [Types.Entities.PURPLEPRETA,         "mob", 43850, 200],
    flaredeathknight:   [Types.Entities.FLAREDEATHKNIGHT,    "mob", 45165, 204],
    snowlady:           [Types.Entities.SNOWLADY,            "mob", 46520, 208],
    frostqueen:         [Types.Entities.FROSTQUEEN,          "mob", 47916, 212],
    darkregion:         [Types.Entities.DARKREGION,          "mob", 49353, 216],
    nightmareregion:    [Types.Entities.NIGHTMAREREGION,     "mob", 50834, 220],
    seadragon:          [Types.Entities.SEADRAGON,           "mob", 52359, 146],
    shadowregion:       [Types.Entities.SHADOWREGION,        "mob", 53930, 228],
    goldgolem:          [Types.Entities.GOLDGOLEM,           "mob", 55548, 232],
    lightningguardian:  [Types.Entities.LIGHTNINGGUARDIAN,   "mob", 57214, 236],
    enel:               [Types.Entities.ENEL,                "mob", 58702, 240],
    minidragon:         [Types.Entities.MINIDRAGON,          "mob", 60228, 242],
    miniseadragon:      [Types.Entities.MINISEADRAGON,       "mob", 61794, 245],
    miniemperor:        [Types.Entities.MINIEMPEROR,         "mob", 63401, 247],
    slime:              [Types.Entities.SLIME,               "mob", 65049, 250],
    kaonashi:           [Types.Entities.KAONASHI,            "mob", 66740, 252],
    windguardian:       [Types.Entities.WINDGUARDIAN,        "mob", 68476, 255],
    squid:              [Types.Entities.SQUID,               "mob", 70256, 257],
    rhaphidophoridae:   [Types.Entities.RHAPHIDOPHORIDAE,    "mob", 72083, 260],
    bee:                [Types.Entities.BEE,                 "mob", 73957, 262],
    ant:                [Types.Entities.ANT,                 "mob", 75880, 265],
    rudolf:             [Types.Entities.RUDOLF,              "mob", 77853, 267],
    santaelf:           [Types.Entities.SANTAELF,            "mob", 79877, 270],
    santa:              [Types.Entities.SANTA,               "mob", 81954, 272],
    soldierant:         [Types.Entities.SOLDIERANT,          "mob", 84084, 275],
    redcockroach:       [Types.Entities.REDCOCKROACH,        "mob", 86271, 277],
    bluecockroach:      [Types.Entities.BLUECOCKROACH,       "mob", 87823, 280],
    soybeanbug:         [Types.Entities.SOYBEANBUG,          "mob", 89404, 282],
    earthworm:          [Types.Entities.EARTHWORM,           "mob", 91014, 285],
    cat:                [Types.Entities.CAT,                 "mob", 92652, 287],
    firespider:         [Types.Entities.FIRESPIDER,          "mob", 94320, 290],
    snowman:            [Types.Entities.SNOWMAN,             "mob", 97746, 295],
    queenant:           [Types.Entities.QUEENANT,            "mob", 101296,300],
    beetle:             [Types.Entities.BEETLE,              "mob", 103120,302],
    hongcheol:          [Types.Entities.HONGCHEOL,           "mob", 104976,305],
    blazespider:        [Types.Entities.BLAZESPIDER,         "mob", 106865,307],
    whitetiger:         [Types.Entities.WHITETIGER,          "mob", 108789,310],
    blackwizard:        [Types.Entities.BLACKWIZARD,         "mob", 110747,312],
    smalldevil:         [Types.Entities.SMALLDEVIL,          "mob", 112741,315],
    pierrot:            [Types.Entities.PIERROT,             "mob", 114770,317],
    mantis:             [Types.Entities.MANTIS,              "mob", 116113,320],
    poisonspider:       [Types.Entities.POISONSPIDER,        "mob", 118846,324],
    babyspider:         [Types.Entities.BABYSPIDER,          "mob", 49353, 216],
    queenspider:        [Types.Entities.QUEENSPIDER,         "mob", 121643,328],
    skydinosaur:        [Types.Entities.SKYDINOSAUR,         "mob", 124506,233],
    cactus:             [Types.Entities.CACTUS,              "mob", 127437,336],
    devilkazya:         [Types.Entities.DEVILKAZYA,          "mob", 130436,340],
    cursedjangseung:    [Types.Entities.CURSEDJANGSEUNG,     "mob", 133506,344],
    suicideghost:       [Types.Entities.SUICIDEGHOST,        "mob", 136648,348],
    hellspider:         [Types.Entities.HELLSPIDER,          "mob", 139865,270],
    frog:               [Types.Entities.FROG,                "mob", 143157,356],
    cursedhahoemask:    [Types.Entities.CURSEDHAHOEMASK,     "mob", 146526,360],
    jirisanmoonbear:    [Types.Entities.JIRISANMOONBEAR,     "mob", 150730,364],

    woodenbow: [Types.Entities.WOODENBOW, "weapon", 0, 0],
    plasticbow: [Types.Entities.PLASTICBOW, "weapon", 0, 0],
    ironbow: [Types.Entities.IRONBOW, "weapon", 0, 0],
    redbow: [Types.Entities.REDBOW, "weapon", 0, 0],
    violetbow: [Types.Entities.VIOLETBOW, "weapon", 0, 0],
    deathbow: [Types.Entities.DEATHBOW, "weapon", 0, 0],
    goldenbow: [Types.Entities.GOLDENBOW, "weapon", 0, 0],
    watermelonbow: [Types.Entities.WATERMELONBOW, "weapon", 0, 0],
    greenbow: [Types.Entities.GREENBOW, "weapon", 0, 0],
    redenelbow: [Types.Entities.REDENELBOW, "weapon", 0, 0],
    mermaidbow: [Types.Entities.MERMAIDBOW, "weapon", 0, 0],
    seahorsebow: [Types.Entities.SEAHORSEBOW, "weapon", 0, 0],
    hunterbow: [Types.Entities.HUNTERBOW, "weapon", 0, 0],
    greenlightbow: [Types.Entities.GREENLIGHTBOW, "weapon", 0, 0],
    skylightbow: [Types.Entities.SKYLIGHTBOW, "weapon", 0, 0],
    redlightbow: [Types.Entities.REDLIGHTBOW, "weapon", 0, 0],
    captainbow: [Types.Entities.CAPTAINBOW, "weapon", 0, 0],
    redmetalbow: [Types.Entities.REDMETALBOW, "weapon", 0, 0],
    marinebow: [Types.Entities.MARINEBOW, "weapon", 0, 0],
    justicebow: [Types.Entities.JUSTICEBOW, "weapon", 0, 0],
    rosebow: [Types.Entities.ROSEBOW, "weapon", 0, 0],
    crystalbow: [Types.Entities.CRYSTALBOW, "weapon", 0, 0],
    gaybow: [Types.Entities.GAYBOW, "weapon", 0, 0],
    forestbow: [Types.Entities.FORESTBOW, "weapon", 0, 0],
    sicklebow: [Types.Entities.SICKLEBOW, "weapon", 0, 0],
    bloodbow: [Types.Entities.BLOODBOW, "weapon", 0, 0],
    redsicklebow: [Types.Entities.REDSICKLEBOW, "weapon", 0, 0],



    archerarmor: [Types.Entities.ARCHERARMOR, "armor", 0, 0],
    leatherarcherarmor: [Types.Entities.LEATHERARCHERARMOR, "armor", 0, 0],
    mailarcherarmor: [Types.Entities.MAILARCHERARMOR, "armor", 0, 0],
    platearcherarmor: [Types.Entities.PLATEARCHERARMOR, "armor", 0, 0],
    redarcherarmor: [Types.Entities.REDARCHERARMOR, "armor", 0, 0],
    goldenarcherarmor: [Types.Entities.GOLDENARCHERARMOR, "armor", 0, 0],
    greenarcherarmor: [Types.Entities.GREENARCHERARMOR, "armor", 0, 0],
    greenwingarcherarmor: [Types.Entities.GREENWINGARCHERARMOR, "armor", 0, 0],
    guardarcherarmor: [Types.Entities.GUARDARCHERARMOR, "armor", 0, 0],
    redguardarcherarmor: [Types.Entities.REDGUARDARCHERARMOR, "armor", 0, 0],
    whitearcherarmor: [Types.Entities.WHITEARCHERARMOR, "armor", 0, 0],
    ratarcherarmor: [Types.Entities.RATARCHERARMOR, "armor", 0, 0],
    piratearcherarmor: [Types.Entities.PIRATEARCHERARMOR, "armor", 0, 0],
    cheoliarcherarmor: [Types.Entities.CHEOLIARCHERARMOR, "armor", 0, 0],
    dovakinarcherarmor: [Types.Entities.DOVAKINARCHERARMOR, "armor", 0, 0],
    gbwingarcherarmor: [Types.Entities.GBWINGARCHERARMOR, "armor", 0, 0],
    redwingarcherarmor: [Types.Entities.REDWINGARCHERARMOR, "armor", 0, 0],
    snowfoxarcherarmor: [Types.Entities.SNOWFOXARCHERARMOR, "armor", 0, 0],
    wolfarcherarmor: [Types.Entities.WOLFARCHERARMOR, "armor", 0, 0],
    bluewingarcherarmor: [Types.Entities.BLUEWINGARCHERARMOR, "armor", 0, 0],
    fallenarcherarmor: [Types.Entities.FALLENARCHERARMOR, "armor", 0, 0],
    crystalarcherarmor: [Types.Entities.CRYSTALARCHERARMOR, "armor", 0, 0],
    legolasarmor: [Types.Entities.LEGOLASARMOR, "armor", 0, 0],
    adhererarcherarmor: [Types.Entities.ADHERERARCHERARMOR, "armor", 0, 0],
    archerschooluniform: [Types.Entities.ARCHERSCHOOLUNIFORM, "armor", 0, 0],
    combatuniform: [Types.Entities.COMBATUNIFORM, "armor", 0, 0],
    gayarcherarmor: [Types.Entities.GAYARCHERARMOR, "armor", 0, 0],

    sword1: [Types.Entities.SWORD1, "weapon", 0, 0],
    sword2: [Types.Entities.SWORD2, "weapon", 0, 0],
    axe: [Types.Entities.AXE, "weapon", 0, 0],
    redsword: [Types.Entities.REDSWORD, "weapon", 0, 0],
    bluesword: [Types.Entities.BLUESWORD, "weapon", 0, 0],
    goldensword: [Types.Entities.GOLDENSWORD, "weapon", 0, 0],
    morningstar: [Types.Entities.MORNINGSTAR, "weapon", 0, 0],
    sidesword: [Types.Entities.SIDESWORD, "weapon", 0, 0],
    spear: [Types.Entities.SPEAR, "weapon", 0, 0],
    scimitar: [Types.Entities.SCIMITAR, "weapon", 0, 0],
    trident: [Types.Entities.TRIDENT, "weapon", 0, 0],
    bluescimitar: [Types.Entities.BLUESCIMITAR, "weapon", 0, 0],
    hammer: [Types.Entities.HAMMER, "weapon", 0, 0],
    greenlightsaber: [Types.Entities.GREENLIGHTSABER, "weapon", 0, 0],
    skylightsaber: [Types.Entities.SKYLIGHTSABER, "weapon", 0, 0],
    redlightsaber: [Types.Entities.REDLIGHTSABER, "weapon", 0, 0],
    redmetalsword: [Types.Entities.REDMETALSWORD, "fweapon", 0, 0],
    bastardsword: [Types.Entities.BASTARDSWORD, "weapon", 0, 0],
    halberd: [Types.Entities.HALBERD, "weapon", 0, 0],
    rose: [Types.Entities.ROSE, "weapon", 0, 0],
    icerose: [Types.Entities.ICEROSE, "weapon", 0, 0],
    justicehammer: [Types.Entities.JUSTICEHAMMER, "weapon", 0, 0],
    firesword: [Types.Entities.FIRESWORD, "weapon", 0, 0],
    whip: [Types.Entities.WHIP, "weapon", 0, 0],
    forestguardiansword: [Types.Entities.FORESTGUARDIANSWORD, "weapon", 0, 0],
    sickle: [Types.Entities.SICKLE, "weapon", 0, 0],
    plunger: [Types.Entities.PLUNGER, "weapon", 0, 0],
    redsickle: [Types.Entities.REDSICKLE, "weapon", 0, 0],
    daywalker: [Types.Entities.DAYWALKER, "weapon", 0, 0],
    purplecloudkallege: [Types.Entities.PURPLECLOUDKALLEGE, "weapon", 0, 0],
    searage: [Types.Entities.SEARAGE, "weapon", 0, 0],
    magicspear: [Types.Entities.MAGICSPEAR, "weapon", 0, 0],
    breaker: [Types.Entities.BREAKER, "weapon", 0, 0],
    eneltrident: [Types.Entities.ENELTRIDENT, "weapon", 0, 0],
    rainbowsword: [Types.Entities.RAINBOWSWORD, "weapon", 0, 0],
    typhoon: [Types.Entities.TYPHOON, "weapon", 0, 0],
    memme: [Types.Entities.MEMME, "weapon", 0, 0],
    candybar: [Types.Entities.CANDYBAR, "weapon", 0, 0],
    butcherknife: [Types.Entities.BUTCHERKNIFE, "weapon", 0, 0],
    fireshot: [Types.Entities.FIRESHOT, "weapon", 0, 0],
    comb: [Types.Entities.COMB, "weapon", 0, 0],
    squeakyhammer: [Types.Entities.SQUEAKYHAMMER, "weapon", 0, 0],
    fireplay: [Types.Entities.FIREPLAY, "weapon", 0, 0],
    weastaff: [Types.Entities.WEASTAFF, "weapon", 0, 0],
    pinksword: [Types.Entities.PINKSWORD, "weapon", 0, 0],
    conferencecall: [Types.Entities.CONFERENCECALL, "weapon", 0, 0],
    cactusaxe: [Types.Entities.CACTUSAXE, "weapon", 0, 0],
    devilkazyasword: [Types.Entities.DEVILKAZYASWORD, "weapon", 0, 0],
    bamboospear: [Types.Entities.BAMBOOSPEAR, "weapon", 0, 0],
    paewoldo: [Types.Entities.PAEWOLDO, "weapon", 0, 0],
    
    clotharmor: [Types.Entities.CLOTHARMOR, "armor", 0, 0],
    leatherarmor: [Types.Entities.LEATHERARMOR, "armor", 0, 0],
    mailarmor: [Types.Entities.MAILARMOR, "armor", 0, 0],
    platearmor: [Types.Entities.PLATEARMOR, "armor", 0, 0],
    redarmor: [Types.Entities.REDARMOR, "armor", 0, 0],
    goldenarmor: [Types.Entities.GOLDENARMOR, "armor", 0, 0],
    greenarmor: [Types.Entities.GREENARMOR, "armor", 0, 0],
    greenwingarmor: [Types.Entities.GREENWINGARMOR, "armor", 0, 0],
    guardarmor: [Types.Entities.GUARDARMOR, "armor", 0, 0],
    redguardarmor: [Types.Entities.REDGUARDARMOR, "armor", 0, 0],
    whitearmor: [Types.Entities.WHITEARMOR, "armor", 0, 0],
    ratarmor: [Types.Entities.RATARMOR, "armor", 0, 0],
    bluepiratearmor: [Types.Entities.BLUEPIRATEARMOR, "armor", 0, 0],
    cheoliarmor: [Types.Entities.CHEOLIARMOR, "armor", 0, 0],
    dovakinarmor: [Types.Entities.DOVAKINARMOR, "armor", 0, 0],
    gbwingarmor: [Types.Entities.GBWINGARMOR, "armor", 0, 0],
    redwingarmor: [Types.Entities.REDWINGARMOR, "armor", 0, 0],
    snowfoxarmor: [Types.Entities.SNOWFOXARMOR, "armor", 0, 0],
    wolfarmor: [Types.Entities.WOLFARMOR, "armor", 0, 0],
    bluewingarmor: [Types.Entities.BLUEWINGARMOR, "armor", 0, 0],
    thiefarmor: [Types.Entities.THIEFARMOR, "armor", 0, 0],
    ninjaarmor: [Types.Entities.NINJAARMOR, "armor", 0, 0],
    dragonarmor: [Types.Entities.DRAGONARMOR, "armor", 0, 0],
    fallenarmor: [Types.Entities.FALLENARMOR, "armor", 0, 0],
    paladinarmor: [Types.Entities.PALADINARMOR, "armor", 0, 0],
    crystalarmor: [Types.Entities.CRYSTALARMOR, "armor", 0, 0],
    adhererrobe: [Types.Entities.ADHERERROBE, "armor", 0, 0],
    frostarmor: [Types.Entities.FROSTARMOR, "armor", 0, 0],
    gayarmor: [Types.Entities.GAYARMOR, "armor", 0, 0],
    schooluniform: [Types.Entities.SCHOOLUNIFORM, "armor", 0, 0],
    beautifullife: [Types.Entities.BEAUTIFULLIFE, "armor", 0, 0],
    regionarmor: [Types.Entities.REGIONARMOR, "armor", 0, 0],
    ghostrider: [Types.Entities.GHOSTRIDER, "armor", 0, 0],
    taekwondo: [Types.Entities.TAEKWONDO, "armor", 0, 0],
    adminarmor: [Types.Entities.ADMINARMOR, "armor", 0, 0],
    rabbitarmor: [Types.Entities.RABBITARMOR, "armor", 0, 0],
    portalarmor: [Types.Entities.PORTALARMOR, "armor", 0, 0],
    seadragonarmor: [Types.Entities.SEADRAGONARMOR, "armor", 0, 0],
    pirateking: [Types.Entities.PIRATEKING, "armor", 0, 0],
    shadowregionarmor: [Types.Entities.SHADOWREGIONARMOR, "armor", 0, 0],
    enelarmor: [Types.Entities.ENELARMOR, "armor", 0, 0],
    miniseadragonarmor: [Types.Entities.MINISEADRAGONARMOR, "armor", 0, 0],
    huniarmor: [Types.Entities.HUNIARMOR, "armor", 0, 0],
    damboarmor: [Types.Entities.DAMBOARMOR, "armor", 0, 0],
    squidarmor: [Types.Entities.SQUIDARMOR, "armor", 0, 0],
    beearmor: [Types.Entities.BEEARMOR, "armor", 0, 0],
    bluedamboarmor: [Types.Entities.BLUEDAMBOARMOR, "armor", 0, 0],
    rudolfarmor: [Types.Entities.RUDOLFARMOR, "armor", 0, 0],
    christmasarmor: [Types.Entities.CHRISTMASARMOR, "armor", 0, 0],
    robocoparmor: [Types.Entities.ROBOCOPARMOR, "armor", 0, 0],
    pinkcockroacharmor: [Types.Entities.PINKCOCKROACHARMOR, "armor", 0, 0],
    cockroachsuit: [Types.Entities.COCKROACHSUIT, "armor", 0, 0],
    dinosaurarmor: [Types.Entities.DINOSAURARMOR, "armor", 0, 0],
    catarmor: [Types.Entities.CATARMOR, "armor", 0, 0],
    snowmanarmor: [Types.Entities.SNOWMANARMOR, "armor", 0, 0],
    beetlearmor: [Types.Entities.BEETLEARMOR, "armor", 0, 0],
    hongcheolarmor: [Types.Entities.HONGCHEOLARMOR, "armor", 0, 0],
    tigerarmor: [Types.Entities.TIGERARMOR, "armor", 0, 0],
    wizardrobe: [Types.Entities.WIZARDROBE, "armor", 0, 0],
    ironknightarmor: [Types.Entities.IRONKNIGHTARMOR, "armor", 0, 0],
    evilarmor: [Types.Entities.EVILARMOR, "armor", 0, 0],
    greendamboarmor: [Types.Entities.GREENDAMBOARMOR, "armor", 0, 0],
    reddamboarmor: [Types.Entities.REDDAMBOARMOR, "armor", 0, 0],
    devilkazyaarmor: [Types.Entities.DEVILKAZYAARMOR, "armor", 0, 0],
    bridalmask: [Types.Entities.BRIDALMASK, "armor", 0, 0],
    blackspiderarmor: [Types.Entities.BLACKSPIDERARMOR, "armor", 0, 0],
    frogarmor: [Types.Entities.FROGARMOR, "armor", 0, 0],
    bearseonbiarmor: [Types.Entities.BEARSEONBIARMOR, "armor", 0, 0],

    rainbowapro: [Types.Entities.RAINBOWAPRO, "armor", 0, 0],
    cokearmor: [Types.Entities.COKEARMOR, "armor", 0, 0],
    friedpotatoarmor: [Types.Entities.FRIEDPOTATOARMOR, "armor", 0, 0],
    burgerarmor: [Types.Entities.BURGERARMOR, "armor", 0, 0],
    radisharmor: [Types.Entities.RADISHARMOR, "armor", 0, 0],
    halloweenjkarmor: [Types.Entities.HALLOWEENJKARMOR, "armor", 0, 0],
    frankensteinarmor: [Types.Entities.FRANKENSTEINARMOR, "armor", 0, 0],
    
    
    pendant1: [Types.Entities.PENDANT1, "object", 0, 0],
    greenpendant: [Types.Entities.GREENPENDANT, "object", 0, 0],
    pearlpendant: [Types.Entities.PEARLPENDANT, "object", 0, 0],
    marblependant: [Types.Entities.MARBLEPENDANT, "object", 0, 0],
    
    ring1: [Types.Entities.RING1, "object", 0, 0],
    sproutring: [Types.Entities.SPROUTRING, "object", 0, 0],
    pearlring: [Types.Entities.PEARLRING, "object", 0, 0],
    spiritring: [Types.Entities.SPIRITRING, "object", 0, 0],
    essentialrage: [Types.Entities.ESSENTIALRAGE, "object", 0, 0],

    flask: [Types.Entities.FLASK, "object", 0, 0],
    cake: [Types.Entities.CAKE, "object", 0, 0],
    burger: [Types.Entities.BURGER, "object", 0, 0],
    chest: [Types.Entities.CHEST, "object", 0, 0],
    firepotion: [Types.Entities.FIREPOTION, "object", 0, 0],
    book: [Types.Entities.BOOK, "object", 0, 0],
    cd: [Types.Entities.CD, "object", 0, 0],
    snowpotion: [Types.Entities.SNOWPOTION, "object", 0, 0],
    royalazalea: [Types.Entities.ROYALAZALEA, "object", 0, 0],
    blackpotion: [Types.Entities.BLACKPOTION, "object", 0, 0],

    guard: [Types.Entities.GUARD, "npc"],
    villagegirl: [Types.Entities.VILLAGEGIRL, "npc"],
    villager: [Types.Entities.VILLAGER, "npc"],
    coder: [Types.Entities.CODER, "npc"],
    scientist: [Types.Entities.SCIENTIST, "npc"],
    priest: [Types.Entities.PRIEST, "npc"],
    king: [Types.Entities.KING, "npc"],
    rick: [Types.Entities.RICK, "npc"],
    nyan: [Types.Entities.NYAN, "npc"],
    sorcerer: [Types.Entities.SORCERER, "npc"],
    agent: [Types.Entities.AGENT, "npc"],
    octocat: [Types.Entities.OCTOCAT, "npc"],
    beachnpc: [Types.Entities.BEACHNPC, "npc"],
    forestnpc: [Types.Entities.FORESTNPC, "npc"],
    desertnpc: [Types.Entities.DESERTNPC, "npc"],
    lavanpc: [Types.Entities.LAVANPC, "npc"],
    boxingman: [Types.Entities.BOXINGMAN, "npc"],
    vampire: [Types.Entities.VAMPIRE, "npc"],
    doctor: [Types.Entities.DOCTOR, "npc"],
    oddeyecat: [Types.Entities.ODDEYECAT, "npc"],
    vendingmachine: [Types.Entities.VENDINGMACHINE, "npc"],
    soldier: [Types.Entities.SOLDIER, "npc"],
    fisherman: [Types.Entities.FISHERMAN, "npc"],
    octopus: [Types.Entities.OCTOPUS, "npc"],
    mermaidnpc: [Types.Entities.MERMAIDNPC, "npc"],
    sponge: [Types.Entities.SPONGE, "npc"],
    fairynpc: [Types.Entities.FAIRYNPC, "npc"],
    shepherdboy: [Types.Entities.SHEPHERDBOY, "npc"],
    zombiegf: [Types.Entities.ZOMBIEGF, "npc"],
    pirategirlnpc: [Types.Entities.PIRATEGIRLNPC, "npc"],
    bluebikinigirlnpc: [Types.Entities.BLUEBIKINIGIRLNPC, "npc"],
    redbikinigirlnpc: [Types.Entities.REDBIKINIGIRLNPC, "npc"],
    iamverycoldnpc: [Types.Entities.IAMVERYCOLDNPC, "npc"],
    iceelfnpc: [Types.Entities.ICEELFNPC, "npc"],
    redstoremannpc: [Types.Entities.REDSTOREMANNPC, "npc"],
    bluestoremannpc: [Types.Entities.BLUESTOREMANNPC, "npc"],
    elfnpc: [Types.Entities.ELFNPC, "npc"],
    snowshepherdboy: [Types.Entities.SNOWSHEPHERDBOY, "npc"],
    angelnpc: [Types.Entities.ANGELNPC, "npc"],
    momangelnpc: [Types.Entities.MOMANGELNPC, "npc"],
    superiorangelnpc: [Types.Entities.SUPERIORANGELNPC, "npc"],
    firstsonangelnpc: [Types.Entities.FIRSTSONANGELNPC, "npc"],
    secondsonangelnpc: [Types.Entities.SECONDSONANGELNPC, "npc"],
    mojojojonpc: [Types.Entities.MOJOJOJONPC, "npc"],
    ancientmanumentnpc: [Types.Entities.ANCIENTMANUMENTNPC, "npc"],

    debenef: [Types.Entities.DEBENEF, "object"],
    firebenef: [Types.Entities.FIREBENEF, "object"],
    royalazaleabenef: [Types.Entities.ROYALAZALEABENEF, "object"],

    getType: function(kind) {
        return kinds[Types.getKindAsString(kind)][1];
    },
    getMobExp: function(kind){
        return kinds[Types.getKindAsString(kind)][2];
    },
    getMobLevel: function(kind){
        return kinds[Types.getKindAsString(kind)][3];
    }

};

Types.rankedWeapons = [
    Types.Entities.SWORD1,
    Types.Entities.SWORD2,
    Types.Entities.AXE,
    Types.Entities.MORNINGSTAR,
    Types.Entities.BLUESWORD,
    Types.Entities.REDSWORD,
    Types.Entities.GOLDENSWORD,
    Types.Entities.SIDESWORD,
    Types.Entities.SPEAR,
    Types.Entities.SCIMITAR,
    Types.Entities.TRIDENT,
    Types.Entities.BLUESCIMITAR,
    Types.Entities.HAMMER,
    Types.Entities.GREENLIGHTSABER,
    Types.Entities.SKYLIGHTSABER,
    Types.Entities.REDLIGHTSABER,
    Types.Entities.BASTARDSWORD,
    Types.Entities.REDMETALSWORD,
    Types.Entities.JUSTICEHAMMER,
    Types.Entities.ROSE,
    Types.Entities.ICEROSE,
    Types.Entities.HALBERD,
    Types.Entities.WHIP,
    Types.Entities.FORESTGUARDIANSWORD,
    Types.Entities.SICKLE,
    Types.Entities.PLUNGER,
    Types.Entities.REDSICKLE,
    Types.Entities.DAYWALKER,
    Types.Entities.PURPLECLOUDKALLEGE,
    Types.Entities.SEARAGE,
    Types.Entities.BREAKER,
    Types.Entities.ENELTRIDENT,
    Types.Entities.RAINBOWSWORD,
    Types.Entities.TYPHOON,
    Types.Entities.MEMME,
    Types.Entities.CANDYBAR,
    Types.Entities.BUTCHERKNIFE,
    Types.Entities.FIRESHOT,
    Types.Entities.COMB,
    Types.Entities.SQUEAKYHAMMER,
    Types.Entities.FIREPLAY,
    Types.Entities.WEASTAFF,
    Types.Entities.PINKSWORD,
    Types.Entities.CONFERENCECALL,
    Types.Entities.CACTUSAXE,
    Types.Entities.DEVILKAZYASWORD,
    Types.Entities.BAMBOOSPEAR,
    Types.Entities.PAEWOLDO,

//    Types.Entities.MAGICSPEAR,
//    Types.Entities.FIRESWORD,
];

Types.rankedArmors = [
//    Types.Entities.ADMINARMOR,
//    Types.Entities.RAINBOWAPRO,
//    Types.Entities.COKEARMOR,
//    Types.Entities.FRIEDPOTATOARMOR,
//    Types.Entities.BURGERARMOR,
//    Types.Entities.RADISHARMOR,
//    Types.Entities.HALLOWEENJKARMOR,
    Types.Entities.CLOTHARMOR,
    Types.Entities.LEATHERARMOR,
    Types.Entities.MAILARMOR,
    Types.Entities.PLATEARMOR,
    Types.Entities.REDARMOR,
    Types.Entities.GOLDENARMOR,
    
    Types.Entities.GREENARMOR,
    Types.Entities.GREENWINGARMOR,
    Types.Entities.GUARDARMOR,
    Types.Entities.REDGUARDARMOR,
    Types.Entities.WHITEARMOR,
    Types.Entities.RATARMOR,
    Types.Entities.BLUEPIRATEARMOR,
    Types.Entities.CHEOLIARMOR,
    Types.Entities.DOVAKINARMOR,
    Types.Entities.GBWINGARMOR,
    Types.Entities.REDWINGARMOR,
    Types.Entities.SNOWFOXARMOR,
    Types.Entities.WOLFARMOR,
    Types.Entities.BLUEWINGARMOR,
    Types.Entities.FALLENARMOR,
    Types.Entities.CRYSTALARMOR,
    Types.Entities.PALADINARMOR,
    Types.Entities.ADHERERROBE,
    Types.Entities.SCHOOLUNIFORM,
    Types.Entities.TAEKWONDO,
    Types.Entities.GAYARMOR,
    Types.Entities.NINJAARMOR,
    Types.Entities.BEAUTIFULLIFE,
    Types.Entities.THIEFARMOR,
    Types.Entities.RABBITARMOR,
    Types.Entities.PORTALARMOR,
    Types.Entities.GHOSTRIDER,
    Types.Entities.FROSTARMOR,
    Types.Entities.REGIONARMOR,
    Types.Entities.SEADRAGONARMOR,
    Types.Entities.SHADOWREGIONARMOR,
    Types.Entities.PIRATEKING,
    Types.Entities.ENELARMOR,
    Types.Entities.DRAGONARMOR,
    Types.Entities.MINISEADRAGONARMOR,
    Types.Entities.HUNIARMOR,
    Types.Entities.DAMBOARMOR,
    Types.Entities.SQUIDARMOR,
    Types.Entities.BEEARMOR,
    Types.Entities.BLUEDAMBOARMOR,
    Types.Entities.RUDOLFARMOR,
    Types.Entities.CHRISTMASARMOR,
    Types.Entities.ROBOCOPARMOR,
    Types.Entities.PINKCOCKROACHARMOR,
    Types.Entities.COCKROACHSUIT,
    Types.Entities.DINOSAURARMOR,
    Types.Entities.CATARMOR,
    Types.Entities.SNOWMANARMOR,
    Types.Entities.BEETLEARMOR,
    Types.Entities.HONGCHEOLARMOR,
    Types.Entities.TIGERARMOR,
    Types.Entities.WIZARDROBE,
    Types.Entities.IRONKNIGHTARMOR,
    Types.Entities.EVILARMOR,
    Types.Entities.GREENDAMBOARMOR,
    Types.Entities.REDDAMBOARMOR,
    Types.Entities.DEVILKAZYAARMOR,
    Types.Entities.BRIDALMASK,
    Types.Entities.BLACKSPIDERARMOR,
    Types.Entities.FROGARMOR,
    Types.Entities.BEARSEONBIARMOR
];
Types.rankedArcherWeapons = [
    Types.Entities.WOODENBOW,
    Types.Entities.PLASTICBOW,
    Types.Entities.IRONBOW,
    Types.Entities.REDBOW,
    Types.Entities.VIOLETBOW,
    Types.Entities.DEATHBOW,
    Types.Entities.GOLDENBOW,
    Types.Entities.WATERMELONBOW,
    Types.Entities.GREENBOW,
    Types.Entities.REDENELBOW,
    Types.Entities.MERMAIDBOW,
    Types.Entities.SEAHORSEBOW,
    Types.Entities.HUNTERBOW,
    Types.Entities.GREENLIGHTBOW,
    Types.Entities.SKYLIGHTBOW,
    Types.Entities.REDLIGHTBOW,
    Types.Entities.CAPTAINBOW,
    Types.Entities.REDMETALBOW,
    Types.Entities.JUSTICEBOW,
    Types.Entities.ROSEBOW,
    Types.Entities.MARINEBOW,
    Types.Entities.CRYSTALBOW,
    Types.Entities.GAYBOW,
    Types.Entities.FORESTBOW,
    Types.Entities.SICKLEBOW,
    Types.Entities.BLOODBOW,
    Types.Entities.REDSICKLEBOW,
];
Types.rankedArcherArmors = [
    Types.Entities.ARCHERARMOR,
    Types.Entities.LEATHERARCHERARMOR,
    Types.Entities.MAILARCHERARMOR,
    Types.Entities.PLATEARCHERARMOR,
    Types.Entities.REDARCHERARMOR,
    Types.Entities.GOLDENARCHERARMOR,
    Types.Entities.GREENARCHERARMOR,
    Types.Entities.GREENWINGARCHERARMOR,
    Types.Entities.GUARDARCHERARMOR,
    Types.Entities.REDGUARDARCHERARMOR,
    Types.Entities.WHITEARCHERARMOR,
    Types.Entities.RATARCHERARMOR,
    Types.Entities.PIRATEARCHERARMOR,
    Types.Entities.CHEOLIARCHERARMOR,
    Types.Entities.DOVAKINARCHERARMOR,
    Types.Entities.GBWINGARCHERARMOR,
    Types.Entities.REDWINGARCHERARMOR,
    Types.Entities.SNOWFOXARCHERARMOR,
    Types.Entities.WOLFARCHERARMOR,
    Types.Entities.BLUEWINGARCHERARMOR,
    Types.Entities.FALLENARCHERARMOR,
    Types.Entities.CRYSTALARCHERARMOR,
    Types.Entities.LEGOLASARMOR,
    Types.Entities.ADHERERARCHERARMOR,
    Types.Entities.ARCHERSCHOOLUNIFORM,
    Types.Entities.COMBATUNIFORM,
    Types.Entities.GAYARCHERARMOR,
];


Types.rankedPendants = [
    Types.Entities.PENDANT1,
    Types.Entities.GREENPENDANT,
    Types.Entities.PEARLPENDANT,
    Types.Entities.MARBLEPENDANT,
];

Types.rankedRings = [
    Types.Entities.RING1,
    Types.Entities.SPROUTRING,
    Types.Entities.PEARLRING,
    Types.Entities.SPIRITRING,
    Types.Entities.ESSENTIALRAGE,
];

Types.rankedBoots = [
];

Types.expForLevel = [
    1, 2, 5, 16, 39,
    81, 150, 256, 410, 625, // 10

    915, 1296, 1785, 2401, 3164,
    4096, 5220, 6561, 8145, 10000, // 20

    12155, 14641, 17490, 20736, 24414,
    28561, 33215, 38416, 44205, 50625, // 30

    57720, 65536, 74120, 83521, 93789,
    104976, 117135, 130321, 144590, 160000, // 40

    176610, 194481, 213675, 234256, 256289,
    279841, 304980, 331776, 360300, 390625 //50
];

Types.getLevel = function(exp){
    var i=1;
    for(i=1; i<50; i++){
        if(exp < Types.expForLevel[i]){
            return i;
        }
    }
    return 50;
};
Types.getWeaponRank = function(weaponKind) {
    return _.indexOf(Types.rankedWeapons, weaponKind);
};

Types.getArmorRank = function(armorKind) {
    return _.indexOf(Types.rankedArmors, armorKind);
};

Types.getPendantRank = function(pendantKind) {
    return Types.isPendant(pendantKind) ? _.indexOf(Types.rankedPendants, pendantKind): 0;
};

Types.getRingRank = function(ringKind) {
    return Types.isRing(ringKind) ? _.indexOf(Types.rankedRings, ringKind) : 0;
};

Types.getBootsRank = function(bootsKind) {
    return Types.isBoots(bootKind) ? _.indexOf(Types.rankedBoots, bootsKind) : -1;
};
Types.getMobExp = function(mobKind){
    return kinds.getMobExp(mobKind);
};
Types.getMobLevel = function(mobKind){
    return kinds.getMobLevel(mobKind);
};

Types.isPlayer = function(kind) {
    return kinds.getType(kind) === "player";
};

Types.isMob = function(kind) {
    return kinds.getType(kind) === "mob";
};

Types.isNpc = function(kind) {
    return kinds.getType(kind) === "npc";
};

Types.isBenef = function(kind) {
    return kinds.getType(kind) === "benef";
};


Types.isCharacter = function(kind) {
    return Types.isMob(kind) || Types.isNpc(kind) || Types.isPlayer(kind);
};

Types.isArmor = function(kind) {
    return kinds.getType(kind) === "armor";
};

Types.isArcherArmor = function(kind) {
    return kinds.getType(kind) === "archerarmor";
};

Types.isWeapon = function(kind) {
    return kinds.getType(kind) === "weapon";
};
Types.isArcherWeapon = function(kind) {
    return kinds.getType(kind) === "archerweapon";
};

Types.isPendant = function(kind) {
    return kinds.getType(kind) === "pendant";
};
Types.isRing = function(kind) {
    return kinds.getType(kind) === "ring";
};

Types.isBoots = function(kind) {
    return kinds.getType(kind) === "boots";
};

Types.isObject = function(kind) {
    return kinds.getType(kind) === "object";
};

Types.isChest = function(kind) {
    return kind === Types.Entities.CHEST;
};

Types.isItem = function(kind) {
    return Types.isWeapon(kind) 
        || Types.isArmor(kind) 
        || Types.isArcherWeapon(kind) 
        || Types.isArcherArmor(kind) 
        || Types.isPendant(kind)
        || Types.isRing(kind)
        || (Types.isObject(kind) && !Types.isChest(kind));
};

Types.isHealingItem = function(kind) {
    return kind === Types.Entities.FLASK 
        || kind === Types.Entities.BURGER
        || kind === Types.Entities.ROYALAZALEA;
};

Types.isExpendableItem = function(kind) {
    return Types.isHealingItem(kind)
        || kind === Types.Entities.FIREPOTION
        || kind === Types.Entities.CAKE;
};

Types.getKindFromString = function(kind) {
    if(kind in kinds) {
        return kinds[kind][0];
    }
};

Types.getKindAsString = function(kind) {
    for(var k in kinds) {
        if(kinds[k][0] === kind) {
            return k;
        }
    }
};

Types.forEachKind = function(callback) {
    for(var k in kinds) {
        callback(kinds[k][0], k);
    }
};

Types.forEachArmor = function(callback) {
    Types.forEachKind(function(kind, kindName) {
        if(Types.isArmor(kind)) {
            callback(kind, kindName);
        }
    });
};

Types.forEachMobOrNpcKind = function(callback) {
    Types.forEachKind(function(kind, kindName) {
        if(Types.isMob(kind) || Types.isNpc(kind)) {
            callback(kind, kindName);
        }
    });
};

Types.forEachArmorKind = function(callback) {
    Types.forEachKind(function(kind, kindName) {
        if(Types.isArmor(kind)) {
            callback(kind, kindName);
        }
    });
};
Types.forEachWeaponKind = function(callback) {
    Types.forEachKind(function(kind, kindName) {
        if(Types.isWeapon(kind)) {
            callback(kind, kindName);
        }
    });
};


Types.forEachArcherArmorKind = function(callback) {
    Types.forEachKind(function(kind, kindName) {
        if(Types.isArcherArmor(kind)) {
            callback(kind, kindName);
        }
    });
};
Types.forEachArcherWeaponKind = function(callback) {
    Types.forEachKind(function(kind, kindName) {
        if(Types.isArcherWeapon(kind)) {
            callback(kind, kindName);
        }
    });
};


Types.getOrientationAsString = function(orientation) {
    switch(orientation) {
        case Types.Orientations.LEFT: return "left"; break;
        case Types.Orientations.RIGHT: return "right"; break;
        case Types.Orientations.UP: return "up"; break;
        case Types.Orientations.DOWN: return "down"; break;
    }
};

Types.getRandomItemKind = function(item) {
    var all = _.union(this.rankedWeapons, this.rankedArmors),
        forbidden = [Types.Entities.SWORD1, Types.Entities.CLOTHARMOR],
        itemKinds = _.difference(all, forbidden),
        i = Math.floor(Math.random() * _.size(itemKinds));

    return itemKinds[i];
};

Types.getMessageTypeAsString = function(type) {
    var typeName;
    _.each(Types.Messages, function(value, name) {
        if(value === type) {
            typeName = name;
        }
    });
    if(!typeName) {
        typeName = "UNKNOWN";
    }
    return typeName;
};

Types.Store = {
    ItemTypes: {
        POTION: 1,
        ARMOR: 2,
        WEAPON: 3
    },
  // [Count, Price, Options(1: Buy, 2: Sell, 10: Multiple)]
    Potions: {
        flask: [5, 1, 11],
        royalazalea: [1, 25, 0],
        snowpotion: [0, 1000, 0],
        blackpotion: [0, 1000, 0]
    },
    Armors: {
        clotharmor: [0, 0, 3],
        leatherarmor: [0, 0, 2],
        mailarmor: [0, 0, 3],
        platearmor: [0, 0, 3],
        redarmor: [0, 0, 3],
        goldenarmor: [0, 0, 3],
        greenarmor: [0, 0, 3],
        greenwingarmor: [0, 0, 3],
        guardarmor: [0, 0, 3],
        redguardarmor: [0, 0, 3],
        whitearmor: [0, 0, 3],
        ratarmor: [0, 0, 2],
        bluepiratearmor: [0, 0, 3],
        cheoliarmor: [0, 0, 3],
        dovakinarmor: [0, 0, 3],
        gbwingarmor: [0, 0, 3],
        redwingarmor: [0, 0, 3],
        snowfoxarmor: [0, 0, 3],
        wolfarmor: [0, 0, 3],
        bluewingarmor: [0, 0, 2],
        thiefarmor: [0, 0, 0],
        ninjaarmor: [0, 0, 0],
        dragonarmor: [0, 0, 0],
        fallenarmor: [0, 0, 0],
        paladinarmor: [0, 0, 0],
        crystalarmor: [0, 0, 0],
        adhererrobe: [0, 0, 0],
        frostarmor: [0, 0, 0],
        gayarmor: [0, 0, 0],
        schooluniform: [0, 0, 0],
        beautifullife: [0, 0, 0],
        regionarmor: [0, 0, 0],
        ghostrider: [0, 0, 0],
        taekwondo: [0, 0, 0],
        rabbitarmor: [0, 0, 0],
        portalarmor: [0, 0, 0],
        seadragonarmor: [0, 0, 0],
        pirateking: [0, 0, 0],
        shadowregionarmor: [0, 0, 0],
        enelarmor: [0, 0, 0],
        miniseadragonarmor: [0, 0, 0],
        huniarmor: [0, 0, 0],
        damboarmor: [0, 0, 0],
        squidarmor: [0, 0, 0],
        beearmor: [0, 0, 0],
        bluedamboarmor: [0, 0, 0],
        rudolfarmor: [0, 0, 0],
        christmasarmor: [0, 0, 0],
        robocoparmor: [0, 0, 0],
        pinkcockroacharmor: [0, 0, 0],
        cockroachsuit: [0, 0, 0],
        dinosaurarmor: [0, 0, 0],
        catarmor: [0, 0, 0],
        snowmanarmor: [0, 0, 0],
        beetlearmor: [0, 0, 0],
        hongcheolarmor: [0, 0, 0],
        tigerarmor: [0, 0, 0],
        wizardrobe: [0, 0, 0],
        ironknightarmor: [0, 0, 0],
        evilarmor: [0, 0, 0],
        greendamboarmor: [0, 0, 0],
        reddamboarmor: [0, 0, 0]
    },
    Weapons: {
        sword1: [0, 0, 3],
        sword2: [0, 0, 3],
        axe: [0, 0, 2],
        morningstar: [0, 0, 3],
        bluesword: [0, 0, 3],
        redsword: [0, 0, 3],
        goldensword: [0, 0, 3],
        sidesword: [0, 0, 3],
        spear: [0, 0, 3],
        scimitar: [0, 0, 3],
        trident: [0, 0, 3],
        bluescimitar: [0, 0, 3],
        hammer: [0, 0, 2],
        greenlightsaber: [0, 0, 3],
        skylightsaber: [0, 0, 3],
        redlightsaber: [0, 0, 2],
        bastardsword: [0, 0, 2],
        redmetalsword: [0, 0, 2],
        justicehammer: [0, 0, 3],
        rose: [0, 0, 3],
        halberd: [0, 0, 0],
        icerose: [0, 0, 0],
        firesword: [0, 0, 0],
        whip: [0, 0, 0],
        forestguardiansword: [0, 0, 0],
        sickle: [0, 0, 0],
        plunger: [0, 0, 0],
        redsickle: [0, 0, 0],
        daywalker: [0, 0, 0],
        purplecloudkallege: [0, 0, 0],
        searage: [0, 0, 0],
        magicspear: [0, 0, 0],
        breaker: [0, 0, 0],
        eneltrident: [0, 0, 0],
        rainbowsword: [0, 0, 0],
        typhoon: [0, 0, 0],
        memme: [0, 0, 0],
        candybar: [0, 0, 0],
        butcherknife: [0, 0, 0],
        fireshot: [0, 0, 0],
        comb: [0, 0, 0],
        squeakyhammer: [0, 0, 0],
        fireplay: [0, 0, 0],
        weastaff: [0, 0, 0],
        pinksword: [0, 0, 0]
    },

    isBuyByItem: function(item) {
        
        return ((item[2] % 10) & 1) == 1;
    },
    isBuy: function(itemName) {
        if(Types.Store.Potions[itemName]) {
            return Types.Store.isBuyByItem(Types.Store.Potions[itemName]);
        }
        if(Types.Store.Armors[itemName]) {
            return Types.Store.isBuyByItem(Types.Store.Armors[itemName]);
        }
        if(Types.Store.Weapons[itemName]) {
            return Types.Store.isBuyByItem(Types.Store.Weapons[itemName]);
        }
    },
    isBuyMultipleByItem: function(item) {
        
        return item[2] > 10;
    },
    isBuyMultiple: function(itemName) {
        if(Types.Store.Potions[itemName]) {
            return Types.Store.isBuyMultipleByItem(Types.Store.Potions[itemName]);
        }
        if(Types.Store.Armors[itemName]) {
            return Types.Store.isBuyMultipleByItem(Types.Store.Armors[itemName]);
        }
        if(Types.Store.Weapons[itemName]) {
            return Types.Store.isBuyMultipleByItem(Types.Store.Weapons[itemName]);
        }
    },
    isSellByItem: function(item) {
        
        return ((item[2] % 10) & 2) == 2;
    },
    isSell: function(itemName) {
        if(Types.Store.Potions[itemName]) {
            return Types.Store.isSellByItem(Types.Store.Potions[itemName]);
        }
        if(Types.Store.Armors[itemName]) {
            return Types.Store.isSellByItem(Types.Store.Armors[itemName]);
        }
        if(Types.Store.Weapons[itemName]) {
            return Types.Store.isSellByItem(Types.Store.Weapons[itemName]);
        }
    },
    getBuyCountByItem: function(item) {
        return item[0];
    },
    getBuyCount: function(itemName) {
        if(Types.Store.Potions[itemName]) {
            return Types.Store.getBuyCountByItem(Types.Store.Potions[itemName]);
        }
        if(Types.Store.Armors[itemName]) {
            return Types.Store.getBuyCountByItem(Types.Store.Armors[itemName]);
        }
        if(Types.Store.Weapons[itemName]) {
            return Types.Store.getBuyCountByItem(Types.Store.Weapons[itemName]);
        }
        return 0;
    },
    getBuyPriceByItem: function(item) {
        return item[1];
    },
    getBuyPrice: function(itemName) {
        if(Types.Store.Potions[itemName]) {
            if(Types.Store.isBuyByItem(Types.Store.Potions[itemName])) {
                return Types.Store.getBuyPriceByItem(Types.Store.Potions[itemName]);
            }
        }
        if(Types.Store.Armors[itemName]) {
            if(Types.Store.isBuyByItem(Types.Store.Armors[itemName])) {
                var result = Types.Store.getBuyPriceByItem(Types.Store.Armors[itemName]);
                if(result > 0) {
                    return result;
                } else {
                    var itemKind = Types.getKindFromString(itemName),
                        itemLevel = Types.getArmorRank(itemKind) + 1;
                    return Math.ceil((itemLevel * itemLevel) / 1.5);
                }
            }
        }
        if(Types.Store.Weapons[itemName]) {
            if(Types.Store.isBuyByItem(Types.Store.Weapons[itemName])) {
                var result = Types.Store.getBuyPriceByItem(Types.Store.Weapons[itemName]);
                if(result > 0) {
                    return result;
                } else {
                    var itemKind = Types.getKindFromString(itemName),
                        itemLevel = Types.getWeaponRank(itemKind) + 1;
                    return Math.ceil((itemLevel * itemLevel) / 1.5);
                }
            }
        }
        return 0;
    },
    getSellPrice: function(itemName) {
        var itemKind = Types.getKindFromString(itemName),
            itemLevel = 0;
        if(Types.isArmor(itemKind) || Types.isArcherArmor(itemKind)) {
            itemLevel = Types.getArmorRank(itemKind) + 1;
            if(itemLevel < 20) {
                itemLevel = 0;
            }
        } else if(Types.isWeapon(itemKind) || Types.isArcherWeapon(itemKind)) {
            itemLevel = Types.getWeaponRank(itemKind) + 1;
            if(itemLevel < 20) {
                itemLevel = 0;
            }
        } else if(Types.isPendant(itemKind)) {
            itemLevel = Types.getPendantRank(itemKind) + 1;
        } else if(Types.isRing(itemKind)) {
            itemLevel = Types.getRingRank(itemKind) + 1;
        } else if(Types.isBoots(itemKind)) {
            itemLevel = Types.getBootsRank(itemKind) + 1;
        }

        return Math.ceil(itemLevel / 2);
    }
},

Types.Player = {};
Types.Player.Skills = {
    evasion: [1, '회피', 'Evasion'],
    bloodSucking: [1, '흡혈', 'Bloodsucking'],
    criticalStrike: [1, '크리티컬 스트라이크', 'Critical Strike'],
    heal: [2, '힐링', 'Heal'],
    flareDance: [2, '불꽃의 춤', 'Flare Dance'],
    stun: [2, '스턴', 'Stun'],
    superCat: [2, '슈퍼캣', 'Super Cat'],
    provocation: [2, '도발', 'Provocation'],

    isExists: function(name) {
        
        return name in Types.Player.Skills;
    },
    getKind: function(name) {
        
        return Types.Player.Skills.isExists(name) ? Types.Player.Skills[name][0] : 0;
    },
    getComment: function(name, language) {
        if(Types.Player.Skills.isExists(name)){
            if(language === Types.Language.Type.ENGLISH){
                return Types.Player.Skills[name][2];
            } else{
                return Types.Player.Skills[name][1];
            }
        } else{
            
            return '';
        }
    }
};

var itemSkillName = {
    bloodsucking: [Types.Skills.BLOODSUCKING, "Bloodsucking", "흡혈"],
    recoverhealth: [Types.Skills.RECOVERHEALTH, "RecoverHealth", "회복"],
    healandheal: [Types.Skills.HEALANDHEAL, "HealAndHeal", "봉사"],
    avoidattack: [Types.Skills.AVOIDATTACK, "AvoidAttack", "회피"],
    addexperience: [Types.Skills.ADDEXPERIENCE, "AddExperience", "능숙"],
    attackwithblood: [Types.Skills.ATTACKWITHBLOOD, "AttackWithBlood", "혈투"],
    criticalattack: [Types.Skills.CRITICALATTACK, "CriticalAttack", "한방"],
    criticalratio: [Types.Skills.CRITICALRATIO, "CriticalRatio", "크리티컬"],
};

Types.getItemSkillNameByKind = function(kind, language){
    for(var k in itemSkillName) {
        if(itemSkillName[k][0] === kind) {
            if(language === Types.Language.Type.ENGLISH){
                return itemSkillName[k][1];
            } else{
                return itemSkillName[k][2];
            }
        }
    }
    return 'NoSkill';
};



if(!(typeof exports === 'undefined')) {
    module.exports = Types;
}