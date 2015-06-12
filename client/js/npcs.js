/* global Types */

define(['npc'], function(Npc) {
    var NPCs = {
        King: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.KING, 1);
                this.beforeQuestCompleteTalk = [
                    "Cthulhu kinapped our Meyl princess.",
                    "Please save her"
                ];
            }
        }),
        VillageGirl: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.VILLAGEGIRL, 1);
                this.beforeQuestCompleteTalk = [
                    "Help me please! These mice have been eating all our food!",     
                    "Kill 10 for me and I will reward you."
                ];
                this.afterQuestCompleteTalk = [
                    "Potatoes are guud."
                ];
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
                this.beforeQuestCompleteTalk = [
                    "Hey there warrior! I can't have fun in the beach due to the crabs.",
                    "Could you please kill five crabs for me?"
                ];
                this.afterQuestCompleteTalk = [
                    "Thank you."
                ];
            }
        }),
        Agent: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.AGENT, 1);
                this.beforeQuestCompleteTalk = [
                    "Buddy, just lost my cake for my girlfriend, dude.",
                    "Today is her birthday bro..."
                ];
                this.afterQuestCompleteTalk = [
                    "Thank you."
                ];
            }
        }),
        Nyan: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.NYAN, 1);
                this.idleSpeed = 50;
                this.beforeQuestCompleteTalk = [
                    "Meow Meow. Please find my Nyan song CD."
                ];
                this.afterQuestCompleteTalk = [
                    "Meow Meow. Thank you."
                ];
            }
        }),
        Rick: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.RICK, 1);
                this.beforeQuestCompleteTalk = [
                    "Shake that body! Shake that body!"
                ];
            }
        }),
        Priest: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.PRIEST, 1);
                this.beforeQuestCompleteTalk = [
                    "Damn those skeletons! Can't focus on my meditation!",
                    "Please slaughter 10 skeletons."
                ];
                this.afterQuestCompleteTalk = [
                    "Thank you."
                ];
            }
        }),
        Guard: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.GUARD, 1);
                this.beforeQuestCompleteTalk = [
                    "Test 1", "Test 2", "Test 3",
                    "Test 4", "Test 5", "Test 6",
                    "Test 7"
                    
                ];
            }
        }),
        Scientist: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.SCIENTIST, 1);
                this.beforeQuestCompleteTalk = [
                    "This door will lead you to the mouse dungeon.",
                    "Slaugher 10 orcs for me.",
                    "I want to do it by myself.",
                    "This is a shame but i got Claustrophobia.",
                    "If you suceed, I will provide you 5 perc of avoidability passive skill to you."
                ];
                this.afterQuestCompleteTalk = [
                    "Thank you."
                ];
            }
        }),
        DesertNpc: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.DESERTNPC, 1);
                this.beforeQuestCompleteTalk = [
                    "I've lost my axe today...",
                    "I want my axe back..."
                ];
                this.afterQuestCompleteTalk = [
                    "Thank you."
                ];
            }
        }),
        LavaNpc: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.LAVANPC, 1);
                this.beforeQuestCompleteTalk = [
                    "Hey my comrade, there is a skeleton blocking its way to the princess.",
                    "Crash it, crash it twice!",
                    "one for you,.. and one for me."
                ];
                this.afterQuestCompleteTalk = [
                    "Thank you, my comrade..."
                ];
            }
        }),
        Boxingman: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.BOXINGMAN, 1);
                this.beforeQuestCompleteTalk = [
                    "Shu! Shu! I'm just practicing to avoid attacks.",
                    "If you can kill 10 golems, 5 perc of avoidability passive skill for ya."
                ];
                this.afterQuestCompleteTalk = [
                    "Thank you."
                ];
            }
        }),
        Vampire: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.VAMPIRE, 1);
                this.beforeQuestCompleteTalk = [
                    "There are lots of Hob goblins around nowadays and it has been bothering me for days.",
                    "If you kill 13 Hob goblins,",
                    "5 perc of bloodsucking will be part of your passive skill."
                ];
                this.afterQuestCompleteTalk = [
                    "Thank you."
                ];
            }
        }),
        Doctor: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.DOCTOR, 1);
                this.beforeQuestCompleteTalk = [
                    "I need to find more mice to proceed my investigation.",
                    "Could you kill 12 yellow mice.",
                    "Then I will teach you 5 perc of bloodsucking as your passive."
                ];
                this.afterQuestCompleteTalk = [
                    "Thank you."
                ];
            }
        }),
        Oddeyecat: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.ODDEYECAT, 1);
                this.beforeQuestCompleteTalk = [
                    "Can you give me a rat armor, meow?",
                    "It... It's not for my wearing.. meow.",
                    "Can I teach you avoidability skill 5 percentile more, meow?"
                ];
                this.afterQuestCompleteTalk = [
                    "Thank you, meow."
                ];
            }
        }),
        Sorcerer: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.SORCERER, 1);
                this.idleSpeed = 150;
                this.beforeQuestCompleteTalk = [
                    "I am The Great Wizard Wu Ek Ang!",
                    "120 years have passed...",
                    "Do you wanna become a wizard.",
                    "You are already a wizard..."
                ];
            }
        }),
        Coder: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.CODER, 1);
                this.beforeQuestCompleteTalk = [
                    "If you kill 25, 100, 200, 500 monsters for me, I'll give you 100 potions, 100 burgers, 50 royal azalea and 1 snow potion.",
                    "But it counts only when the monster's level is more than half of yours."
                ];
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
                this.beforeQuestCompleteTalk = [
                    "If you give me a hammer, I'll teach you critical strike skill, meow"
                ];
                this.afterQuestCompleteTalk = [
                    "Thank you, meow."
                ];
            }
        }),
        Soldier: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.SOLDIER, 1);
                this.beforeQuestCompleteTalk = [
                    "Mermaid monsters killed all my comrades....",
                    "If you kill 15 mermaid monsters,",
                    "I will teach you more strong critical strike skill."
                ];
                this.afterQuestCompleteTalk = [
                    "Thank you..."
                ];
            }
        }),
        Fisherman: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.FISHERMAN, 1);
                this.beforeQuestCompleteTalk = [
                    "In these days, I can't fish because of living armors...",
                    "If you kill 9 living armors,",
                    "I will teach you more strong bloodsucking skill."
                ];
                this.afterQuestCompleteTalk = [
                    "Thank you."
                ];
            }
        }),
        Octopus: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.OCTOPUS, 1);
                this.beforeQuestCompleteTalk = [
                    "Welcome~ First time under the sea?",
                    "If you skill 12 ferocious penguins,",
                    "I will teach you more slithery avoidability skill."
                ];
                this.afterQuestCompleteTalk = [
                    "Thank you~"
                ];
            }
        }),
        Mermaidnpc: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.MERMAIDNPC, 1);
                this.beforeQuestCompleteTalk = [
                    "Dark skeletons are killing mermaids...",
                    "Can you skill 20 dark skeletons?",
                    "Then I will teach you healing skill."
                ];
                this.afterQuestCompleteTalk = [
                    "Thank you."
                ];
            }
        }),
        Sponge: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.SPONGE, 1);
                this.beforeQuestCompleteTalk = [
                    "Can you skill 30 mini knights?",
                    "Then I will teach you more strong bloodsucking skill."
                ];
                this.afterQuestCompleteTalk = [
                    "Thank you."
                ];
            }
        }),
        Fairynpc: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.FAIRYNPC, 1);
                this.beforeQuestCompleteTalk = [
                    "Can you give me red light saber?",
                    "Then I will upgrade your critical strike skill."
                ];
                this.afterQuestCompleteTalk = [
                    "Thank you."
                ];
            }
        }),
        Shepherdboy: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.SHEPHERDBOY, 1);
                this.beforeQuestCompleteTalk = [
                    "Wolves! Wolves!",
                    "Please kill 50 wolves."
                ];
                this.afterQuestCompleteTalk = [
                    "Thank you."
                ];
            }
        }),
        Zombiegf: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.ZOMBIEGF, 1);
                this.beforeQuestCompleteTalk = [
                    "My boyfriend became a zombie...",
                    "Does he remember our blue pair T-shirt?"
                ];
                this.afterQuestCompleteTalk = [
                    "Thank you."
                ];
            }
        }),
        Pirategirlnpc: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.PIRATEGIRLNPC, 1);
                this.beforeQuestCompleteTalk = [
                    "Honey, buy me a bastard sword.",
                    "It's cheap."
                ];
                this.afterQuestCompleteTalk = [
                    "We need to break up.",
                    "Don't you know why?"
                ];
            }
        }),
        Bluebikinigirlnpc: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.BLUEBIKINIGIRLNPC, 1);
                this.beforeQuestCompleteTalk = [
                    "My boyfriend is lost!",
                    "I need to ask where he is by global chatting",
                    "To chat globally: /1 text"
                ];
            }
        }),
        Redbikinigirlnpc: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.REDBIKINIGIRLNPC, 1);
                this.beforeQuestCompleteTalk = [
                    "Hey~",
                    "What a beautiful day today~",
                    "To see the order of items, press the ? mark on the right bottom side of the screen.",
                    "Have a nice day~"
                ];
            }
        }),
        Iamverycoldnpc: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.IAMVERYCOLDNPC, 1);
                this.beforeQuestCompleteTalk = [
                    "Cold... I am cold...",
                    "Hug... Hug me...",
                    "Make me warm by the flare of red metal sword.."
                ];
                this.afterQuestCompleteTalk = [
                    "Thank you."
                ];
            }
        }),
        Iceelfnpc: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.ICEELFNPC, 1);
                this.beforeQuestCompleteTalk = [
                    "I heard there is a flower that does not wilt forever in the ice castle...",
                    "Can you bring me a ice rose?"
                ];
                this.afterQuestCompleteTalk = [
                    "Thank you."
                ];
            }
        }),
        Elfnpc: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.ELFNPC, 1);
                this.beforeQuestCompleteTalk = [
                    "The princess is real.",
                    "Cthulhu, who has aimed a forest guardian sword the hidden valuable of elves, brought the princess to the purple forest.",
                    "A forest dragon ate it..",
                    "How can I get it?"
                ];
                this.afterQuestCompleteTalk = [
                    "Thank you."
                ];
            }
        }),
        Snowshepherdboy: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.SNOWSHEPHERDBOY, 1);
                this.beforeQuestCompleteTalk = [
                    "Hello Newcomer",
                    "I'm here to welcome you to Tap Tap Adventure.",
                    "Before continuing on to the main land, you must",
                    "be introduced around firstly.",
                    "Starting off, kill 5 snow wolves and bring me some",
                    "leather armour.",
                    "Head over into the cabin there and let the magic",
                    "occur."
                ];
                this.afterQuestCompleteTalk = [
                    "Great Job, you can now head down the ladder.."
                ];
            }
        }),
        Angelnpc: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.ANGELNPC, 1);
                this.beforeQuestCompleteTalk = [
                    "Snowladies are oppressing souls who want to revive.",
                    "If they continues, my achievement will falls",
                    "And My salary will be reduced!!",
                    "I must stop it.",
                    "Can you kill 70 snowladies?"
                ];
                this.afterQuestCompleteTalk = [
                    "Thank you."
                ];
            }
        }),
        Momangelnpc: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.MOMANGELNPC, 1);
                this.beforeQuestCompleteTalk = [
                    "I heard that my hushand skipped out",
                    "and he is hiding himself here.",
                    "If he see me, he'll run away...",
                    "I'd better to wear a frostarmor as a disguise. ",
                    "Because I have to watch here",
                    "Can you bring me a frostarmor?",
                    "If you do that, I'll give 2 level stun skill",
                    "and a hint for you."
                ];
                this.afterQuestCompleteTalk = [
                    "The hint is to keep talking to the mischievous boy."
                ];
            }
        }),
        Superiorangelnpc: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.SUPERIORANGELNPC, 1);
                this.beforeQuestCompleteTalk = [
                    "I heard that my subordinate skipped out.",
                    "I think he is in this cave.",
                    "I'll be here",
                    "to catch him if he run away.",
                    "Enter the cave and look for him.",
                    "And bring shadow region armor",
                    "as the evidence that you look for carefully.",
                    "Then I'll make you speedy."
                ];
                this.afterQuestCompleteTalk = [
                    "Thanks."
                ];
            }
        }),
        Firstsonangelnpc: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.FIRSTSONANGELNPC, 1);
                this.beforeQuestCompleteTalk = [
                    "Bring me a breaker.",
                    "Then, I'll upgrade your flare dance skill to level 4."
                ];
                this.afterQuestCompleteTalk = [
                    "Thanks."
                ];
            }
        }),
        Secondsonangelnpc: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.SECONDSONANGELNPC, 1);
                this.beforeQuestCompleteTalk = [
                    "I wanna go to an internet cafe",
                    "while mom looks for dad.",
                    "I'm afraid that meet with mom on the way to the internet cafe.",
                    "Can you bring me a dambo armor?",
                    "in order that mom can't recognize me.."
                ];
                this.afterQuestCompleteTalk = [
                    "Thanks."
                ];
            }
        }),
        Mojojojonpc: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.MOJOJOJONPC, 1);
                this.beforeQuestCompleteTalk = [
                    "Mind deposing of some Wind Ladies for me?",
                    "As well as bring me a typhoon and squid armour?.",
                    "One of each is enough.",
                    "I will reward you by upgrading your Supercat skill to level 2."
                ];
                this.afterQuestCompleteTalk = [
                    "Thanks."
                ];
            }
        }),
        Ancientmanumentnpc: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.ANCIENTMANUMENTNPC, 1);
                this.beforeQuestCompleteTalk = [
                    "Memme will OO you...",
                    "..."
                ];
                this.afterQuestCompleteTalk = [
                    "Memme will bless you..."
                ];
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