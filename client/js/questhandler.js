
/* global Types, Class, _, questSerial */

define(['jquery'], function() {
  var QuestHandler = Class.extend({
    init: function(game) {
      this.game = game;
      this.hideDelay = 5000; //How long the notification shows for.
      this.progressHideDelay = 1000;
      this.quests = {
            SAVE_PRINCESS: {
                id: 1,
                npcKind: Types.Entities.KING,
                name: "Save the Princess",
                desc: "The princess has been kidnapped, you must rescue her.",
                found: false,
                completed: false
            },
            KILL_RAT: {
                id: 2,
                npcKind: Types.Entities.VILLAGEGIRL,
                name: "Rat Infestation",
                desc: "Kill 10 Rats",
                found: false,
                completed: false,
                completeNumber: 10
            },
            BRING_LEATHERARMOR: {
                id: 3,
                npcKind: Types.Entities.VILLAGER,
                name: "Armour",
                desc: "Bring leather armour to the villager.",
                found: false,
                completed: false
            },
            KILL_CRAB: {
                id: 4,
                npcKind: Types.Entities.BEACHNPC,
                name: "Crebs",
                desc: "Kill 5 crabs",
                found: false,
                completed: false,
                completeNumber: 5
            },
            FIND_CAKE: {
                id: 5,
                npcKind: Types.Entities.AGENT,
                name: "The cake is a lie",
                desc: "Find the hidden cake and bring it to the agent.",
                found: false,
                completed: false
            },
            FIND_CD: {
                id: 6,
                npcKind: Types.Entities.NYAN,
                name: "Disco Dance",
                desc: "Find the CD and bring it to Nyan Cat",
                found: false,
                completed: false
            },
            KILL_SKELETON: {
                id: 7,
                npcKind: Types.Entities.PRIEST,
                name: "Bony Situation",
                desc: "Kill 10 Skeletons",
                found: false,
                completed: false,
                completeNumber: 10
            },
            BRING_AXE: {
                id: 8,
                npcKind: Types.Entities.DESERTNPC,
                name: "Higher Weaponry",
                desc: "Bring an Axe to the mysterious person.",
                found: false,
                completed: false
            },
            KILL_SKELETONKING: {
                id: 9,
                npcKind: Types.Entities.LAVANPC,
                name: "Skeleton King",
                desc: "Kill the Skeleton King",
                found: false,
                completed: false
            },
            KILL_ORC: {
                id: 10,
                npcKind: Types.Entities.SCIENTIST,
                name: "Orcs",
                desc: "Kill 10 Orcs for the Scientist.",
                found: false,
                completed: false,
                completeNumber: 10
            },
            KILL_GOLEM: {
                id: 11,
                npcKind: Types.Entities.BOXINGMAN,
                name: "Rocky Situation",
                desc: "Kill 10 Golems",
                found: false,
                completed: false,
                completeNumber: 10
            },
            KILL_HOBGOBLIN: {
                id: 12,
                npcKind: Types.Entities.VAMPIRE,
                name: "Thieves!",
                desc: "Kill 13 hobgoblins.",
                found: false,
                completed: false,
                completeNumber: 13
            },
            KILL_YELLOWMOUSE: {
                id: 13,
                npcKind: Types.Entities.DOCTOR,
                name: "But it's so cute!",
                desc: "Kill 12 yellowmouse.",
                found: false,
                completed: false,
                completeNumber: 12
            },
            BRING_RATARMOR: {
                id: 14,
                npcKind: Types.Entities.ODDEYECAT,
                name: "Cats will be cats",
                desc: "Bring Rat Armour to Oddeye Cat.",
                found: false,
                completed: false
            },
            BRING_HAMMER: {
                id: 15,
                npcKind: Types.Entities.OCTOCAT,
                name: "Why do you need this?",
                desc: "Bring a hammer to OctoCat.",
                found: false,
                completed: false
            },
            KILL_MERMAID: {
                id: 16,
                npcKind: Types.Entities.SOLDIER,
                name: "Wet problems..",
                desc: "Kill 15 Mermaids.",
                found: false,
                completed: false,
                completeNumber: 15
            },
            KILL_LIVINGARMOR: {
                id: 17,
                npcKind: Types.Entities.FISHERMAN,
                name: "Livingarmor",
                desc: "Kill 9 living armours",
                found: false,
                completed: false,
                completeNumber: 9
            },
            KILL_PENGUIN: {
                id: 18,
                npcKind: Types.Entities.OCTOPUS,
                name: "Mr. Tuxedo",
                desc: "Kill 12 penguins",
                found: false,
                completed: false,
                completeNumber: 12
            },
            KILL_DARKSKELETON: {
                id: 19,
                npcKind: Types.Entities.MERMAIDNPC,
                name: "The Dark Side",
                desc: "Kill 20 Dark Skeletons",
                found: false,
                completed: false,
                completeNumber: 20
            },
            KILL_MINIKNIGHT: {
                id: 20,
                npcKind: Types.Entities.SPONGE,
                name: "Miniature Experiments",
                desc: "Kill 30 Mini Knights.",
                found: false,
                completed: false,
                completeNumber: 30
            },
            BRING_REDLIGHTSABER: {
                id: 21,
                npcKind: Types.Entities.FAIRYNPC,
                name: "Fairly Simple",
                desc: "Bring Red Light Saber to the Fairy.",
                found: false,
                completed: false,
                completeNumber: 30
            },
            KILL_WOLF: {
                id: 22,
                npcKind: Types.Entities.SHEPHERDBOY,
                name: "Weoulf",
                desc: "Kill 50 Wolves.",
                found: false,
                completed: false,
                completeNumber: 50
            },
            BRING_BLUEWINGARMOR: {
                id: 23,
                npcKind: Types.Entities.ZOMBIEGF,
                name: "Blue Wing Armor",
                desc: "Bring Blue Wing Armor to the Zombie.",
                found: false,
                completed: false,
                completeNumber: 50
            },
            BRING_BASTARDSWORD: {
                id: 24,
                npcKind: Types.Entities.PIRATEGIRLNPC,
                name: "Bastard Sword",
                desc: "Bring a Bastard Sword to the Pirate Girl",
                found: false,
                completed: false,
                completeNumber: 50
            },
            BRING_REDMETALSWORD: {
                id: 25,
                npcKind: Types.Entities.IAMVERYCOLDNPC,
                name: "Red Metal Sword",
                desc: "Bring a Red Metal Sword..",
                found: false,
                completed: false,
                completeNumber: 50
            },
            BRING_ICEROSE: {
                id: 26,
                npcKind: Types.Entities.ICEELFNPC,
                name: "Ice Rose",
                desc: "Get a Ice Rose to the Ice Elf",
                found: false,
                completed: false,
                completeNumber: 50
            },
            BRING_FORESTGUARDIANSWORD: {
                id: 27,
                npcKind: Types.Entities.ELFNPC,
                name: "Forest Guardian Sword",
                desc: "Bring the Forest Guardian Sword Elf.",
                found: false,
                completed: false,
                completeNumber: 50
            },
            KILL_SNOWWOLF: {
                id: 28,
                npcKind: Types.Entities.SNOWSHEPHERDBOY,
                name: "Snow Wolf",
                desc: "Kill Snow Wolves.",
                found: false,
                completed: false,
                completeNumber: 60
            },
            KILL_SNOWLADY: {
                id: 29,
                npcKind: Types.Entities.ANGELNPC,
                name: "Snow Lady",
                desc: "Kill the Snow Lady",
                found: false,
                completed: false,
                completeNumber: 70
            },
            BRING_FROSTARMOR: {
                id: 30,
                npcKind: Types.Entities.MOMANGELNPC,
                name: "Forest Armor",
                desc: "Bring Frost Armour to the Mom Angel",
                found: false,
                completed: false,
                completeNumber: 70
            },
            BRING_SHADOWREGIONARMOR: {
                id: 31,
                npcKind: Types.Entities.SUPERIORANGELNPC,
                name: "BRING_SHADOWREGIONARMOR",
                desc: "BRING_SHADOWREGIONARMOR",
                found: false,
                completed: false,
                completeNumber: 70
            },
            BRING_BREAKER: {
                id: 32,
                npcKind: Types.Entities.FIRSTSONANGELNPC,
                name: "BRING_BREAKER",
                desc: "BRING_BREAKER",
                found: false,
                completed: false,
                completeNumber: 70
            },
            BRING_DAMBOARMOR: {
                id: 33,
                npcKind: Types.Entities.SECONDSONANGELNPC,
                name: "BRING_DAMBOARMOR",
                desc: "BRING_DAMBOARMOR",
                found: false,
                completed: false,
                completeNumber: 70
            },
            BRING_SQUIDANDTYPHOON: {
                id: 34,
                npcKind: Types.Entities.MOJOJOJONPC,
                name: "BRING_SQUIDANDTYPHOON",
                desc: "BRING_SQUIDANDTYPHOON",
                found: false,
                completed: false,
                completeNumber: 70
            },
            BRING_MEMME: {
                id: 35,
                npcKind: Types.Entities.ANCIENTMANUMENTNPC,
                name: "Memme",
                desc: "Bring Memme to the Ancient NPC",
                found: false,
                completed: false,
                completeNumber: 70
            },

            KILL_25: {
                id: 101,
                npcKind: Types.Entities.CODER,
                name: "Kill 25",
                desc: "Slay 25 Monsters",
                found: false,
                completed: false,
                completeNumber: 25
            },
            KILL_100: {
                id: 102,
                npcKind: Types.Entities.CODER,
                name: "Kill 100",
                desc: "Slay 100 Monsters",
                found: false,
                completed: false,
                completeNumber: 100
            },
            KILL_200: {
                id: 103,
                npcKind: Types.Entities.CODER,
                name: "Kill 200",
                desc: "Slay 200 Monsters",
                found: false,
                completed: false,
                completeNumber: 200
            },
            KILL_500: {
                id: 104,
                npcKind: Types.Entities.CODER,
                name: "Kill 500",
                desc: "Slay 500 Monsters",
                found: false,
                completed: false,
                completeNumber: 500
            }
        };
    },
    show: function(){
      var htmlStr = '<table><tr><td>Quest Name</td><td>Contents</td><td>Done?</td></tr>';
      _.each(this.quests, function(quest){
        htmlStr += '<tr>';
        if(quest.found){
          htmlStr += '<td>' + quest.name + '</td>';
          htmlStr += '<td>' + quest.desc + '</td>';
          if(quest.completed){
            htmlStr += '<td>Quest Completed!</td>';
          } else {
            htmlStr += '<td>Quest Progress</td>';
          }
        } else{
          htmlStr += '<td>Quest Hidden</td>';
          htmlStr += '<td></td><td></td>';
        }
        htmlStr += '</tr>';
      });
      htmlStr += '</table>';
      $('#quest').html(htmlStr);
      $('#quest').css('display', 'block');
    },
    initQuest: function(questFound, questProgress){
      var i=0;
      _.each(this.quests, function(quest){
        quest.found = questFound[i];
        if(questProgress[i] === 999){
          quest.completed = true;
        } else{
          quest.completed = false;
        }
        i++;
      });

      this.initSkill();
    },
    initSkill: function(){
        if(this.quests.KILL_ORC.completed){
            if(this.quests.KILL_GOLEM.completed){
                if(this.quests.BRING_RATARMOR.completed){
                    if(this.quests.KILL_PENGUIN.completed){
                        this.game.player.setSkill(4);
                    } else{
                        this.game.player.setSkill(3);
                    }
                } else{
                    this.game.player.setSkill(2);
                }
            } else{
                this.game.player.setSkill(1);
            }
        }
        if(this.quests.KILL_HOBGOBLIN.completed){
            if(this.quests.KILL_YELLOWMOUSE.completed){
                if(this.quests.KILL_LIVINGARMOR.completed){
                    if(this.quests.KILL_MINIKNIGHT.completed){
                        this.game.player.setBloodSuckingSkill(4);
                    } else{
                        this.game.player.setBloodSuckingSkill(3);
                    }
                } else{
                    this.game.player.setBloodSuckingSkill(2);
                }
            } else{
                this.game.player.setBloodSuckingSkill(1);
            }
        }
        if(this.quests.BRING_HAMMER.completed){
            if(this.quests.KILL_MERMAID.completed){
                if(this.quests.BRING_REDLIGHTSABER.completed){
                    if(this.quests.BRING_BASTARDSWORD.completed){
                        this.game.player.setCriticalStrikeSkill(4);
                    } else{
                        this.game.player.setCriticalStrikeSkill(3);
                    }
                } else{
                    this.game.player.setCriticalStrikeSkill(2);
                }
            } else{
                this.game.player.setCriticalStrikeSkill(1);
            }
        }
        if(this.quests.KILL_DARKSKELETON.completed){
            if(this.quests.KILL_WOLF.completed){
                if(this.quests.BRING_REDMETALSWORD.completed){
                    if(this.quests.KILL_SNOWWOLF.completed){
                        this.game.player.setHealSkill(4);
                    } else{
                        this.game.player.setHealSkill(3);
                    }
                } else {
                    this.game.player.setHealSkill(2);
                }
            } else{
                this.game.player.setHealSkill(1);
            }
        }
        if(this.quests.BRING_BLUEWINGARMOR.completed){
            if(this.quests.BRING_ICEROSE.completed){
                if(this.quests.KILL_SNOWLADY.completed){
                    if(this.quests.BRING_BREAKER.completed){
                        this.game.player.setFlareDanceSkill(4);
                    } else{
                        this.game.player.setFlareDanceSkill(3);
                    }
                } else{
                    this.game.player.setFlareDanceSkill(2);
                }
            } else{
                this.game.player.setFlareDanceSkill(1);
            }
        }
        if(this.quests.BRING_FORESTGUARDIANSWORD.completed){
            if(this.quests.BRING_FROSTARMOR.completed){
                if(this.quests.BRING_DAMBOARMOR.completed){
                    this.game.player.setStunSkill(3);
                } else{
                    this.game.player.setStunSkill(2);
                }
            } else{
                this.game.player.setStunSkill(1);
            }
        }
        if(this.quests.BRING_SHADOWREGIONARMOR.completed){
            if(this.quests.BRING_SQUIDANDTYPHOON.completed){
                this.game.player.setSuperCatSkill(2);
            } else{
                this.game.player.setSuperCatSkill(1);
            }
        }
        if(this.quests.BRING_MEMME.completed){
            this.game.player.setProvocationSkill(1);
        }
    },
    handleQuest: function(data) {
        var i=1;
        var type = data[0];
        var questId, quest;
        var htmlStr = '';

        if(type === "show") {
          _.each(this.quests, function(quest) {
              quest.found = data[i++];
                  if(data[i++] === 999){
                      quest.completed = true;
                  } else{
                      quest.completed = false;
                  }
              });
          this.show();
        } else if(type === "found") {
            questId = data[1];
            quest = _.find(this.quests, function(q) { 
                return q.id === questId; 
            });

            quest.found = true;
            htmlStr = '<p><h2>' + quest.name + ' Quest Found</h2></p><p>' + quest.desc + '</p>';
            $('#questalarm').html(htmlStr);
            $('#questalarm').fadeIn();
            setTimeout(function() {
                $('#questalarm').fadeOut();
            }, this.hideDelay);
        } else if(type === "complete") {
            questId = data[1];
            quest = _.find(this.quests, function(q){ return q.id === questId; });
            quest.completed = true;
            htmlStr = '<p><h2>' + quest.name + ' Quest Completed</h2></p><p>' + quest.desc + '</p>';
            $('#questalarm').html(htmlStr);
            $('#questalarm').fadeIn();
            this.game.audioManager.playSound("achievement");
            setTimeout(function() {
                $('#questalarm').fadeOut();
            }, this.hideDelay);
            this.initSkill();
        } else if(type === "progress") {
            questId = data[1];
            quest = _.find(this.quests, function(q){ return q.id === questId; });
            htmlStr = '<p><h2>' + quest.name + ' Quest Progress</h2></p><p>' + data[2] + ' / ' + quest.completeNumber + ' slain' + '</p>';
            $('#questalarm').html(htmlStr);
            $('#questalarm').fadeIn();
            setTimeout(function() {
                $('#questalarm').fadeOut();
            }, this.progressHideDelay);
        }
    },
    talkToNPC: function(npc){
        if(npc.kind === Types.Entities.CODER) {
            this.game.client.sendTalkToNPC(npc.kind);
            return npc.talk(false);
          } else {
            for(var questSerial in this.quests){
                var quest = this.quests[questSerial];
                if(quest.npcKind === npc.kind){
                    if(!quest.found) {
                        this.game.client.sendQuest(quest.id, "found");
                        return npc.talk(false);
                    } else if(!quest.completed) {
                        this.game.client.sendTalkToNPC(npc.kind);
                        return null;
                    } else { 
                        return npc.talk(true);
                    }
                }
            }
          }
        return npc.talk(false);
    }
  });

  return QuestHandler;
});
