
define(['npc'], function(Npc) {
    var NPCs = {
        King: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.KING, 1);
            }
        }),
        VillageGirl: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.VILLAGEGIRL, 1);
                
            }
        }),
        Villager: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.VILLAGER, 1);
                
            }
        }),
        BeachNpc: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.BEACHNPC, 1);
                
            }
        }),
        Agent: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.AGENT, 1);
                
            }
        }),
        Nyan: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.NYAN, 1);
                this.idleSpeed = 50;                
            }
        }),
        Rick: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.RICK, 1);
                
            }
        }),
        Priest: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.PRIEST, 1);
                
            }
        }),
        Guard: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.GUARD, 1);
                
            }
        }),
        Scientist: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.SCIENTIST, 1);
            }
        }),
        DesertNpc: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.DESERTNPC, 1);

            }
        }),
        LavaNpc: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.LAVANPC, 1);

            }
        }),
        Boxingman: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.BOXINGMAN, 1);
            }
        }),
        Vampire: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.VAMPIRE, 1);
            }
        }),
        Doctor: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.DOCTOR, 1);
            }
        }),
        Oddeyecat: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.ODDEYECAT, 1);
            }
        }),
        Sorcerer: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.SORCERER, 1);
                this.idleSpeed = 150;
            }
        }),
        Coder: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.CODER, 1);
            }
        }),
        ForestNpc: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.FORESTNPC, 1);
            }
        }),
        Octocat: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.OCTOCAT, 1);
            }
        }),
        Soldier: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.SOLDIER, 1);
            }
        }),
        Fisherman: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.FISHERMAN, 1);
                
            }
        }),
        Octopus: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.OCTOPUS, 1);
                
            }
        }),
        Mermaidnpc: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.MERMAIDNPC, 1);
                
            }
        }),
        Sponge: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.SPONGE, 1);
                
            }
        }),
        Fairynpc: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.FAIRYNPC, 1);
                
            }
        }),
        Shepherdboy: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.SHEPHERDBOY, 1);
                
            }
        }),
        Zombiegf: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.ZOMBIEGF, 1);
                
            }
        }),
        Pirategirlnpc: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.PIRATEGIRLNPC, 1);
                
            }
        }),
        Bluebikinigirlnpc: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.BLUEBIKINIGIRLNPC, 1);
                
            }
        }),
        Redbikinigirlnpc: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.REDBIKINIGIRLNPC, 1);
                
            }
        }),
        Iamverycoldnpc: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.IAMVERYCOLDNPC, 1);
                
            }
        }),
        Iceelfnpc: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.ICEELFNPC, 1);
                
            }
        }),
        Elfnpc: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.ELFNPC, 1);
                
            }
        }),
        Snowshepherdboy: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.SNOWSHEPHERDBOY, 1);
                
            }
        }),
        Angelnpc: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.ANGELNPC, 1);
                
            }
        }),
        Momangelnpc: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.MOMANGELNPC, 1);
                
            }
        }),
        Superiorangelnpc: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.SUPERIORANGELNPC, 1);
                
            }
        }),
        Firstsonangelnpc: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.FIRSTSONANGELNPC, 1);
                
            }
        }),
        Secondsonangelnpc: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.SECONDSONANGELNPC, 1);
                
            }
        }),
        Mojojojonpc: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.MOJOJOJONPC, 1);
                
            }
        }),
        Ancientmanumentnpc: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.ANCIENTMANUMENTNPC, 1);
                
            }
        }),


        Vendingmachine: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.VENDINGMACHINE, 1);
            }
        }),
        Redstoremannpc: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.REDSTOREMANNPC, 1);
            }
        }),
        Bluestoremannpc: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.BLUESTOREMANNPC, 1);
            }
        })
    };


    return NPCs;
});