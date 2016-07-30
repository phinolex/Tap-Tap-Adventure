
/* global Types, Class, _, questSerial */

define(['text!../shared/data/newquests_english.json', 'jquery'], function(QuestsJson) {
  
		
  var questdata = JSON.parse(QuestsJson);
  
  var QuestHandler = Class.extend({
    init: function(game) {
      this.game = game;
      this.hideDelay = 5000; //How long the notification shows for.
      this.progressHideDelay = 1000;
      this.quests = questdata;
      this.showlog = false;
      
      var i=0;
      _.each(this.quests, function(quest){
      		quest.found = false;
      		quest.completed = false;
      		quest.id = i++;
      		quest.progCount = 0;
      });
    },
    show: function(){
    },
    
    npcHasQuest: function(npcId) {
	    for(var questSerial in this.quests){
		var quest = this.quests[questSerial];
		if(quest.npcId === npcId && (!quest.found || !quest.completed))
			return true;
	    }
	    return false;
    },
    
    getNPCQuest: function(questId) {
	    return _.find(this.quests, function(q) { 
		return q.id === questId; 
	    });
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
    },

    questAlarmShow: function (str, delay) {
            $('#questalarm').html(str);
            $('#questalarm').fadeIn();
            setTimeout(function() {
                $('#questalarm').fadeOut();
            }, delay);    	    
    },
    
    toggleShowLog: function () {
    	    this.showlog = !this.showlog;
	if (this.showlog)
	{
            this.questShowLog();	
	}
	else
	{
	    this.questHideLog();
	}
    },
    
    questShowLog: function() {
    	    //alert("called");
    	 $('#questlog').css('display', 'block');
         $('#questlog').html("<table id='questLogInfo'><tr><th>Name</th><th>Description</th><th>Progress</th></tr></table>");
	_.each(this.quests, function(quest){
	     var progress  = (quest.type==2) ? (quest.progCount+" / "+quest.mobCount) : ' ';
	     if(quest.found && !quest.completed){
	         $('#questLogInfo tbody').append(
	         	 '<tr><td>'+quest.name+'</td>' +
	         	 '<td>'+quest.desc+'</td>' +
	         	 '<td>'+progress+'</td></tr>');
	     }
	});
    },
    
    questHideLog: function() {
    	 $('#questlog').css('display', 'none');   
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
        } else if(type === "found") {
            questId = data[1];
            quest = this.getNPCQuest(questId);
            quest.found = true;
            htmlStr = '<p><h2>' + quest.name + ' Quest Found</h2></p><p>' + quest.desc + '</p>';
            this.questAlarmShow(htmlStr, this.hideDelay);
       } else if(type === "complete") {
            questId = data[1];
            quest = this.getNPCQuest(questId);
            quest.completed = true;
            htmlStr = '<p><h2>' + quest.name + ' Quest Completed</h2></p><p>' + quest.desc + '</p>';
            this.questAlarmShow(htmlStr, this.hideDelay);
        } else if(type === "progress") {
            questId = data[1];
            quest = this.getNPCQuest(questId);
            if (quest.type == 2)
            {
            	    htmlStr = '<p><h2>' + quest.name + ' Quest Progress</h2></p><p>' + data[2] + ' / ' + quest.mobCount + ' slain' + '</p>';
            	    this.questAlarmShow(htmlStr, this.progressHideDelay);
            	    this.quests[questId].progCount = data[2];
	    }
        }
        
	if (this.showlog)
	{
            this.questShowLog();	
	}        
    },
    talkToNPC: function(npc){
	    for(var questSerial in this.quests){
		var quest = this.quests[questSerial];
		//alert(JSON.stringify(quest));
		if(quest.npcId === npc.kind && !quest.completed){
		    //if(!quest.found) {
			//this.game.client.sendQuest(quest.id, "found");
			this.game.client.sendTalkToNPC(npc.kind, quest.id);
			//this.quests[questSerial].found = true;
			//if (quest.completed)
			//	return null;
			
			return npc.talk(quest, false);
		    //} /*else if(quest.found && quest.completed) {
			//return npc.talk(quest.id, true);
		   
		} /*else if (quest.npcId === npc.kind && quest.completed)
		{
			//this.game.client.sendTalkToNPC(npc.kind, quest.id);
			return npc.talk(quest, true);			
		}*/
	    }
    }
  });
  return QuestHandler;
});
