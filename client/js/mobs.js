
define(['mob', 'timer'], function(Mob, Timer) {

    var Mobs = {
        Rat: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.RAT);
                this.moveSpeed = 350;
                this.idleSpeed = 700;
                this.shadowOffsetY = -2;
                this.isAggressive = false;
            }
        }),

        Skeleton: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.SKELETON);
                this.moveSpeed = 350;
                this.atkSpeed = 100;
                this.idleSpeed = 800;
                this.shadowOffsetY = 1;
                this.setAttackRate(1300);
            }
        }),

        Skeleton2: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.SKELETON2);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 800;
                this.walkSpeed = 200;
                this.shadowOffsetY = 1;
                this.setAttackRate(1300);
            }
        }),

        Spectre: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.SPECTRE);
                this.moveSpeed = 150;
                this.atkSpeed = 50;
                this.idleSpeed = 200;
                this.walkSpeed = 200;
                this.shadowOffsetY = 1;
                this.setAttackRate(900);
            }
        }),
        
        Deathknight: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.DEATHKNIGHT);
                this.atkSpeed = 50;
        		this.moveSpeed = 220;
        		this.walkSpeed = 100;
        		this.idleSpeed = 450;
        		this.setAttackRate(800);
        		this.aggroRange = 3;
            },
            
            idle: function(orientation) {
                if(!this.hasTarget()) {
                    this._super(Types.Orientations.DOWN);
                } else {
                    this._super(orientation);
                }
            }
        }),

        Goblin: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.GOBLIN);
                this.moveSpeed = 150;
                this.atkSpeed = 60;
                this.idleSpeed = 600;
                this.setAttackRate(700);
            }
        }),

        Ogre: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.OGRE);
                this.moveSpeed = 300;
                this.atkSpeed = 100;
                this.idleSpeed = 600;
            }
        }),

        Crab: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.CRAB);
                this.moveSpeed = 200;
                this.atkSpeed = 40;
                this.idleSpeed = 500;
                this.isAggressive = false;
            }
        }),

        Snek: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.SNEK);
                this.moveSpeed = 200;
                this.atkSpeed = 40;
                this.idleSpeed = 250;
                this.walkSpeed = 100;
                this.shadowOffsetY = -4;
            }
        }),

        Eye: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.EYE);
                this.moveSpeed = 200;
                this.atkSpeed = 40;
                this.idleSpeed = 50;
            }
        }),

        Bat: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.BAT);
                this.moveSpeed = 120;
                this.atkSpeed = 90;
                this.idleSpeed = 90;
                this.walkSpeed = 85;
                this.isAggressive = false;
            }
        }),

        Wizard: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.WIZARD);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
            }
        }),

        Skeletonking: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.SKELETONKING);
                this.moveSpeed = 300;
                this.atkSpeed = 50;
                this.idleSpeed = 400;
                this.atkRate = 2000;
                this.attackCooldown = new Timer(this.atkRate);
        		this.aggroRange = 3;
            },
            
            idle: function(orientation) {
                if(!this.hasTarget()) {
                    this._super(Types.Orientations.DOWN);
                } else {
                    this._super(orientation);
                }
            }
        }),
        Orc: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.ORC);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
            }
        }),
        Golem: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.GOLEM);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
            }
        }),
        Oldogre: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.OLDOGRE);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
            }
        }),
        Mimic: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.MIMIC);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
            }
        }),
        Hobgoblin: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.HOBGOBLIN);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
            }
        }),
        Yellowmouse: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.YELLOWMOUSE);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
            }
        }),
        Whitemouse: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.WHITEMOUSE);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
            }
        }),
        Brownmouse: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.BROWNMOUSE);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
            }
        }),
        Redmouse: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.REDMOUSE);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
            }
        }),
        Redguard: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.REDGUARD);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
            }
        }),
        Infectedguard: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.INFECTEDGUARD);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
            }
        }),
        Livingarmor: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.LIVINGARMOR);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
            }
        }),
        Mermaid: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.MERMAID);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
            }
        }),
        Yellowfish: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.YELLOWFISH);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
            }
        }),
        Greenfish: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.GREENFISH);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
            }
        }),
        Redfish: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.REDFISH);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
            }
        }),
        Clam: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.CLAM);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
            }
        }),
        Preta: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.PRETA);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
            }
        }),
        Pirateskeleton: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.PIRATESKELETON);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 250;
            }
        }),
        Vulture: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.VULTURE);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
            }
        }),
        Penguin: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.PENGUIN);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
            }
        }),
        Moleking: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.MOLEKING);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
            }
        }),
        Darkskeleton: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.DARKSKELETON);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 250;
            }
        }),
        Darkscolpion: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.DARKSCOLPION);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
            }
        }),
        Greenpirateskeleton: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.GREENPIRATESKELETON);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 250;
                this.aggroRange = 3;
            }
        }),
        Blackpirateskeleton: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.BLACKPIRATESKELETON);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 250;
                this.aggroRange = 3;
            }
        }),
        Redpirateskeleton: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.REDPIRATESKELETON);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 250;
                this.aggroRange = 3;
            }
        }),
        Yellowpreta: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.YELLOWPRETA);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
            }
        }),
        Bluepreta: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.BLUEPRETA);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
            }
        }),
        Miniknight: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.MINIKNIGHT);
                this.moveSpeed = 120;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 2;
            }
        }),
        Wolf: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.WOLF);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 2;
            }
        }),
        Pinkelf: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.PINKELF);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 2;
            }
        }),
        Skyelf: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.SKYELF);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 2;
            }
        }),
        Redelf: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.REDELF);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 2;
            }
        }),
        Hermitcrab: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.HERMITCRAB);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
            }
        }),
        Zombie: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.ZOMBIE);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 2;
            }
        }),
        Piratecaptain: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.PIRATECAPTAIN);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 2;
            }
        }),
        Ironogre: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.IRONOGRE);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 2;
            }
        }),
        Ogrelord: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.OGRELORD);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 2;
            }
        }),
        Adherer: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.ADHERER);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 2;
            }
        }),
        Icegolem: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.ICEGOLEM);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 2;
            }
        }),
        Desertscolpion: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.DESERTSCOLPION);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
            }
        }),
        Forestdragon: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.FORESTDRAGON);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 250;
                this.aggroRange = 2;
            }
        }),
        Crystalscolpion: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.CRYSTALSCOLPION);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 2;
            }
        }),
        Eliminator: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.ELIMINATOR);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 2;
            }
        }),
        Frostqueen: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.FROSTQUEEN);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 3;
            }
        }),
        Snowrabbit: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.SNOWRABBIT);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 2;
            }
        }),
        Snowwolf: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.SNOWWOLF);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 2;
            }
        }),
        Iceknight: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.ICEKNIGHT);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 2;
            }
        }),
        Miniiceknight: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.MINIICEKNIGHT);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 2;
            }
        }),
        Snowelf: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.SNOWELF);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 2;
            }
        }),
        Whitebear: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.WHITEBEAR);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 2;
            }
        }),
        Cobra: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.COBRA);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 2;
            }
        }),
        Goldgolem: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.GOLDGOLEM);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 2;
            }
        }),
        Darkregion: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.DARKREGION);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 3;
            }
        }),
        Darkregionillusion: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.DARKREGIONILLUSION);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 2;
            }
        }),
        Nightmareregion: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.NIGHTMAREREGION);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 3;
            }
        }),
        Darkogre: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.DARKOGRE);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 2;
            }
        }),
        Pain: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.PAIN);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 2;
            }
        }),
        Icevulture: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.ICEVULTURE);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 2;
            }
        }),
        Regionhenchman: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.REGIONHENCHMAN);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 2;
            }
        }),
        Purplepreta: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.PURPLEPRETA);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 2;
            }
        }),
        Flaredeathknight: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.FLAREDEATHKNIGHT);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 2;
            }
        }),
        Snowlady: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.SNOWLADY);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 3;
            }
        }),
        Seadragon: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.SEADRAGON);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 3;
            }
        }),
        Shadowregion: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.SHADOWREGION);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 3;
            }
        }),
        Lightningguardian: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.LIGHTNINGGUARDIAN);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 3;
            }
        }),
        Enel: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.ENEL);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 3;
            }
        }),
        Minidragon: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.MINIDRAGON);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 3;
            }
        }),
        Miniseadragon: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.MINISEADRAGON);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 3;
            }
        }),
        Miniemperor: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.MINIEMPEROR);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 3;
            }
        }),
        Slime: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.SLIME);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 3;
            }
        }),
        Kaonashi: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.KAONASHI);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 3;
            }
        }),
        Windguardian: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.WINDGUARDIAN);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 3;
            }
        }),
        Squid: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.SQUID);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 3;
            }
        }),
        Rhaphidophoridae: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.RHAPHIDOPHORIDAE);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 3;
            }
        }),
        Bee: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.BEE);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 3;
            }
        }),
        Ant: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.ANT);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 3;
            }
        }),
        Rudolf: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.RUDOLF);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 3;
            }
        }),
        Santaelf: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.SANTAELF);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 3;
            }
        }),
        Santa: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.SANTA);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 3;
            }
        }),
        Soldierant: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.SOLDIERANT);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 3;
            }
        }),
        Redcockroach: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.REDCOCKROACH);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 3;
            }
        }),
        Bluecockroach: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.BLUECOCKROACH);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 3;
            }
        }),
        Soybeanbug: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.SOYBEANBUG);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 3;
            }
        }),
        Earthworm: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.EARTHWORM);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 3;
            }
        }),
        Cat: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.CAT);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 3;
            }
        }),
        Firespider: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.FIRESPIDER);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 3;
            }
        }),
        Snowman: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.SNOWMAN);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 3;
                this.setAttackRate(750);
            }
        }),
        Queenant: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.QUEENANT);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 3;
                this.setAttackRate(700);
            }
        }),
        Beetle: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.BEETLE);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 3;
                this.setAttackRate(665);
            }
        }),
        Hongcheol: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.HONGCHEOL);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 3;
                this.setAttackRate(632);
            }
        }),
        Blazespider: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.BLAZESPIDER);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 3;
                this.setAttackRate(600);
            }
        }),
        Whitetiger: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.WHITETIGER);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 3;
                this.setAttackRate(594);
            }
        }),
        Blackwizard: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.BLACKWIZARD);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 3;
                this.setAttackRate(589);
            }
        }),
        Smalldevil: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.SMALLDEVIL);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 3;
                this.setAttackRate(584);
            }
        }),
        Pierrot: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.PIERROT);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 3;
                this.setAttackRate(579);
            }
        }),
        Mantis: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.MANTIS);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 3;
                this.setAttackRate(574);
            }
        }),
        Poisonspider: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.POISONSPIDER);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 3;
                this.setAttackRate(569);
            }
        }),
        Babyspider: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.BABYSPIDER);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 3;
                this.setAttackRate(800);
            }
        }),
        Queenspider: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.QUEENSPIDER);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 3;
                this.setAttackRate(565);
            }
        }),
        Skydinosaur: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.SKYDINOSAUR);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 3;
                this.setAttackRate(800);
            }
        }),
        Cactus: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.CACTUS);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 3;
                this.setAttackRate(565);
            }
        }),
        Devilkazya: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.DEVILKAZYA);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 3;
                this.setAttackRate(560);
            }
        }),
        Cursedjangseung: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.CURSEDJANGSEUNG);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
                this.aggroRange = 3;
                this.setAttackRate(555);
            }
        }),
        Suicideghost: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.SUICIDEGHOST);
                this.moveSpeed = 200;
                this.atkSpeed = 70;
                this.idleSpeed = 150;
                this.aggroRange = 3;
                this.setAttackRate(550);
            }
        }),
        Hellspider: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.HELLSPIDER);
                this.moveSpeed = 200;
                this.atkSpeed = 70;
                this.idleSpeed = 150;
                this.aggroRange = 3;
                this.setAttackRate(550);
            }
        }),
        Frog: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.FROG);
                this.moveSpeed = 200;
                this.atkSpeed = 70;
                this.idleSpeed = 150;
                this.aggroRange = 3;
                this.setAttackRate(550);
            }
        }),
        Cursedhahoemask: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.CURSEDHAHOEMASK);
                this.moveSpeed = 200;
                this.atkSpeed = 70;
                this.idleSpeed = 150;
                this.aggroRange = 3;
                this.setAttackRate(550);
            }
        }),
        Jirisanmoonbear: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.JIRISANMOONBEAR);
                this.moveSpeed = 200;
                this.atkSpeed = 70;
                this.idleSpeed = 150;
                this.aggroRange = 3;
                this.setAttackRate(550);
            }
        }),
    };


    return Mobs;
});