
define(['jquery'], function() {
  var QuestHandler = Class.extend({
    init: function(game) {
      this.game = game;
      this.quests = {
        SAVE_PRINCESS: {
          id: 1,
          npcKind: Types.Entities.KING,
          name: "공주를 구하라",
          desc: "공주를 구해오세요",
          found: false,
          completed: false,
        },
        KILL_RAT: {
          id: 2,
          npcKind: Types.Entities.VILLAGEGIRL,
          name: "쥐를 잡아라",
          desc: "쥐 10마리를 잡으세요",
          found: false,
          completed: false,
          completeNumber: 10,
        },
        BRING_LEATHERARMOR: {
          id: 3,
          npcKind: Types.Entities.VILLAGER,
          name: "가죽갑옷",
          desc: "Villager에게 가죽갑옷을 구해주세요",
          found: false,
          completed: false,
        },
        KILL_CRAB: {
          id: 4,
          npcKind: Types.Entities.BEACHNPC,
          name: "게를 잡아라",
          desc: "게 5마리를 잡으세요",
          found: false,
          completed: false,
          completeNumber: 5,
        },
        FIND_CAKE: {
          id: 5,
          npcKind: Types.Entities.AGENT,
          name: "케이크를 찾아라",
          desc: "케이크를 찾으세요",
          found: false,
          completed: false,
        },
        FIND_CD: {
          id: 6,
          npcKind: Types.Entities.NYAN,
          name: "시디를 찾아라",
          desc: "시디를 찾으세요",
          found: false,
          completed: false,
        },
        KILL_SKELETON: {
          id: 7,
          npcKind: Types.Entities.PRIEST,
          name: "스켈레톤을 잡아라",
          desc: "스켈레톤을 10마리 잡으세요",
          found: false,
          completed: false,
          completeNumber: 10,
        },
        BRING_AXE: {
          id: 8,
          npcKind: Types.Entities.DESERTNPC,
          name: "도끼",
          desc: "도끼를 가져다 주세요",
          found: false,
          completed: false,
        },
        KILL_SKELETONKING: {
          id: 9,
          npcKind: Types.Entities.LAVANPC,
          name: "스켈레톤 킹",
          desc: "스켈레톤 킹을 잡아라",
          found: false,
          completed: false,
        },
        KILL_ORC: {
          id: 10,
          npcKind: Types.Entities.SCIENTIST,
          name: "오크",
          desc: "오크를 잡아라",
          found: false,
          completed: false,
          completeNumber: 10,
        },
        KILL_GOLEM: {
          id: 11,
          npcKind: Types.Entities.BOXINGMAN,
          name: "골렘",
          desc: "골렘을 잡아라",
          found: false,
          completed: false,
          completeNumber: 10,
        },
        KILL_HOBGOBLIN: {
          id: 12,
          npcKind: Types.Entities.VAMPIRE,
          name: "홉고블린",
          desc: "홉고블린을 잡아라",
          found: false,
          completed: false,
          completeNumber: 13,
        },
        KILL_YELLOWMOUSE: {
          id: 13,
          npcKind: Types.Entities.DOCTOR,
          name: "노랑쥐",
          desc: "노랑쥐를 잡아라",
          found: false,
          completed: false,
          completeNumber: 12,
        },
        BRING_RATARMOR: {
          id: 14,
          npcKind: Types.Entities.ODDEYECAT,
          name: "랫아머",
          desc: "랫아머를 가져다 주세요.",
          found: false,
          completed: false,
        },
        BRING_HAMMER: {
          id: 15,
          npcKind: Types.Entities.OCTOCAT,
          name: "망치",
          desc: "망치를 가져다 주세요.",
          found: false,
          completed: false,
        },
        KILL_MERMAID: {
          id: 16,
          npcKind: Types.Entities.SOLDIER,
          name: "인어",
          desc: "인어를 잡아 주세요.",
          found: false,
          completed: false,
          completeNumber: 15,
        },
        KILL_LIVINGARMOR: {
          id: 17,
          npcKind: Types.Entities.FISHERMAN,
          name: "리빙아머",
          desc: "리빙아머를 잡아 주세요.",
          found: false,
          completed: false,
          completeNumber: 9,
        },
        KILL_PENGUIN: {
          id: 18,
          npcKind: Types.Entities.OCTOPUS,
          name: "펭귄",
          desc: "펭귄을 잡아 주세요.",
          found: false,
          completed: false,
          completeNumber: 12,
        },
        KILL_DARKSKELETON: {
          id: 19,
          npcKind: Types.Entities.MERMAIDNPC,
          name: "다크 스켈레톤",
          desc: "다크 스켈레톤을 잡아 주세요.",
          found: false,
          completed: false,
          completeNumber: 20,
        },
        KILL_MINIKNIGHT: {
          id: 20,
          npcKind: Types.Entities.SPONGE,
          name: "미니나이트",
          desc: "미니나이트를 잡아 주세요.",
          found: false,
          completed: false,
          completeNumber: 30,
        },
        BRING_REDLIGHTSABER: {
          id: 21,
          npcKind: Types.Entities.FAIRYNPC,
          name: "빨강형광등",
          desc: "빨강형광등을 가져다 주세요.",
          found: false,
          completed: false,
          completeNumber: 30,
        },
        KILL_WOLF: {
          id: 22,
          npcKind: Types.Entities.SHEPHERDBOY,
          name: "늑대",
          desc: "늑대를 잡아주세요.",
          found: false,
          completed: false,
          completeNumber: 50,
        },
        BRING_BLUEWINGARMOR: {
          id: 23,
          npcKind: Types.Entities.ZOMBIEGF,
          name: "파랑날개갑옷",
          desc: "파랑날개갑옷을 가져다 주세요.",
          found: false,
          completed: false,
          completeNumber: 50,
        },
        BRING_BASTARDSWORD: {
          id: 24,
          npcKind: Types.Entities.PIRATEGIRLNPC,
          name: "바스타드소드",
          desc: "바스타드소드를 가져다 주세요.",
          found: false,
          completed: false,
          completeNumber: 50,
        },
        BRING_REDMETALSWORD: {
          id: 25,
          npcKind: Types.Entities.IAMVERYCOLDNPC,
          name: "레드메탈소드",
          desc: "레드메탈소드를 가져다 주세요.",
          found: false,
          completed: false,
          completeNumber: 50,
        },
        BRING_ICEROSE: {
          id: 26,
          npcKind: Types.Entities.ICEELFNPC,
          name: "얼음장미",
          desc: "얼음장미를 가져다 주세요.",
          found: false,
          completed: false,
          completeNumber: 50,
        },
        BRING_FORESTGUARDIANSWORD: {
          id: 27,
          npcKind: Types.Entities.ELFNPC,
          name: "포레스트 가디언 소드",
          desc: "포레스트 가디언 소드를 가져다 주세요.",
          found: false,
          completed: false,
          completeNumber: 50,
        },
        KILL_SNOWWOLF: {
          id: 28,
          npcKind: Types.Entities.SNOWSHEPHERDBOY,
          name: "눈늑대",
          desc: "눈늑대를 잡아주세요.",
          found: false,
          completed: false,
          completeNumber: 60,
        },
        KILL_SNOWLADY: {
          id: 29,
          npcKind: Types.Entities.ANGELNPC,
          name: "설녀",
          desc: "설녀를 잡아주세요.",
          found: false,
          completed: false,
          completeNumber: 70,
        },
        BRING_FROSTARMOR: {
          id: 30,
          npcKind: Types.Entities.MOMANGELNPC,
          name: "서리갑옷",
          desc: "서리갑옷을 가져다 주세요.",
          found: false,
          completed: false,
          completeNumber: 70,
        },
        BRING_SHADOWREGIONARMOR: {
          id: 31,
          npcKind: Types.Entities.SUPERIORANGELNPC,
          name: "섀도우 레기온 갑옷",
          desc: "섀도우 레기온 갑옷을 가져다 주세요.",
          found: false,
          completed: false,
          completeNumber: 70,
        },
        BRING_BREAKER: {
          id: 32,
          npcKind: Types.Entities.FIRSTSONANGELNPC,
          name: "브레이커",
          desc: "브레이커를 가져다 주세요.",
          found: false,
          completed: false,
          completeNumber: 70,
        },
        BRING_DAMBOARMOR: {
          id: 33,
          npcKind: Types.Entities.SECONDSONANGELNPC,
          name: "담보갑옷",
          desc: "담보갑옷을 가져다 주세요.",
          found: false,
          completed: false,
          completeNumber: 70,
        },
        BRING_SQUIDANDTYPHOON: {
          id: 34,
          npcKind: Types.Entities.MOJOJOJONPC,
          name: "오징어갑옷 및 타이푼",
          desc: "오징어갑옷과 타이푼을 가져다 주세요.",
          found: false,
          completed: false,
          completeNumber: 70,
        },
        BRING_MEMME: {
          id: 35,
          npcKind: Types.Entities.ANCIENTMANUMENTNPC,
          name: "맴매",
          desc: "맴매를 가져다 주세요.",
          found: false,
          completed: false,
          completeNumber: 70,
        },

        KILL_25: {
          id: 101,
          npcKind: Types.Entities.CODER,
          name: "25마리",
          desc: "몬스터 25마리를 잡으세요.",
          found: false,
          completed: false,
          completeNumber: 25,
        },
        KILL_100: {
          id: 102,
          npcKind: Types.Entities.CODER,
          name: "100마리",
          desc: "몬스터 100마리를 잡으세요.",
          found: false,
          completed: false,
          completeNumber: 100,
        },
        KILL_200: {
          id: 103,
          npcKind: Types.Entities.CODER,
          name: "200마리",
          desc: "몬스터 200마리를 잡으세요.",
          found: false,
          completed: false,
          completeNumber: 200,
        },
        KILL_500: {
          id: 104,
          npcKind: Types.Entities.CODER,
          name: "500마리",
          desc: "몬스터 500마리를 잡으세요.",
          found: false,
          completed: false,
          completeNumber: 500,
        },
      };
    },
    show: function(){
      var htmlStr = '<table><tr><td>퀘스트 이름</td><td>내용</td><td>완료 여부</td></tr>';
      _.each(this.quests, function(quest){
        htmlStr += '<tr>';
        if(quest.found){
          htmlStr += '<td>' + quest.name + '</td>';
          htmlStr += '<td>' + quest.desc + '</td>';
          if(quest.completed){
            htmlStr += '<td>완료!!</td>';
          } else{
            htmlStr += '<td>미완료</td>';
          }
        } else{
          htmlStr += '<td>히든 퀘스트</td>';
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
          } else{
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
    handleQuest: function(data){
      var i=1;
      var type = data[0];
      var questId, quest;
      var htmlStr = '';

      if(type === "show"){
        _.each(this.quests, function(quest){
          quest.found = data[i++];
          if(data[i++] === 999){
            quest.completed = true;
          } else{
            quest.completed = false;
          }
        });
        this.show();
      } else if(type === "found"){
        questId = data[1];
        quest = _.find(this.quests, function(q){ return q.id === questId });
        quest.found = true;
        htmlStr = '<p><h2>' + quest.name + ' 퀘스트 발견</h2></p><p>'
                    + quest.desc + '</p>';
        $('#questalarm').html(htmlStr);
        $('#questalarm').fadeIn();
        setTimeout(function(){
          $('#questalarm').fadeOut();
        }, 5000);
      } else if(type === "complete"){
        questId = data[1];
        quest = _.find(this.quests, function(q){ return q.id === questId });
        quest.completed = true;
        htmlStr = '<p><h2>' + quest.name + ' 퀘스트 완료</h2></p><p>'
                    + quest.desc + '</p>';
        $('#questalarm').html(htmlStr);
        $('#questalarm').fadeIn();
        this.game.audioManager.playSound("achievement");
        setTimeout(function(){
          $('#questalarm').fadeOut();
        }, 5000);
        this.initSkill();
      } else if(type === "progress"){
        questId = data[1];
        quest = _.find(this.quests, function(q){ return q.id === questId });
        htmlStr = '<p><h2>' + quest.name + ' 퀘스트</h2></p><p>'
                    + data[2] + ' / ' + quest.completeNumber + ' 완료' + '</p>';
        $('#questalarm').html(htmlStr);
        $('#questalarm').fadeIn();
        setTimeout(function(){
          $('#questalarm').fadeOut();
        }, 1000);

      }
    },
    talkToNPC: function(npc){
      if(npc.kind === Types.Entities.CODER){
        this.game.client.sendTalkToNPC(npc.kind);
        return npc.talk(this.game.language, false);
      } else{
        for(questSerial in this.quests){
          var quest = this.quests[questSerial];
          if(quest.npcKind === npc.kind){
            if(!quest.found){
              this.game.client.sendQuest(quest.id, "found");
              return npc.talk(this.game.language, false);
            } else if(!quest.completed){
              this.game.client.sendTalkToNPC(npc.kind);
              return null;
            } else{
              return npc.talk(this.game.language, true);
            }
          }
        }
      }
      return npc.talk(this.game.language, false);
    },
  });

  return QuestHandler;
});
