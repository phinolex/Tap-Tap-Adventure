
/* global Types, Class, _, achievementSerial */

define(['text!../shared/data/achievements_english.json', 'jquery'], function(AchievementsJson) {


    var achievementdata = JSON.parse(AchievementsJson);

    var AchievementHandler = Class.extend({
        init: function(game) {
            this.game = game;
            this.hideDelay = 5000; //How long the notification shows for.
            this.progressHideDelay = 1000;
            this.achievements = achievementdata;
            this.showlog = false;

            var i=0;
            _.each(this.achievements, function(achievement){
                achievement.found = false;
                achievement.completed = false;
                achievement.id = i++;
                achievement.progCount = 0;
            });
        },
        show: function(){
        },

        npcHasAchievement: function(npcId) {
            for(var achievementSerial in this.achievements){
                var achievement = this.achievements[achievementSerial];
                if(achievement.npcId === npcId && (!achievement.found || !achievement.completed))
                    return true;
            }
            return false;
        },

        getNPCAchievement: function(achievementId) {
            return _.find(this.achievements, function(q) {
                return q.id === achievementId;
            });
        },

        initAchievement: function(achievementFound, achievementProgress){
            var i=0;
            _.each(this.achievements, function(achievement){
                achievement.found = achievementFound[i];
                if(achievementProgress[i] === 999){
                    achievement.completed = true;
                } else{
                    achievement.completed = false;
                }
                i++;
            });
        },

        achievementAlarmShow: function (achievement, delay) {
            var $notification = $('#achievement-notification'),
                $name = $notification.find('.name');

            $notification.removeClass().addClass('active achievement' + 1);
            $name.text(achievement.name);

            setTimeout(function() {
                $notification.removeClass('active');
            }, 10000)
        },

        toggleShowLog: function () {
            this.showlog = !this.showlog;
            if (this.showlog)
            {
                this.achievementShowLog();
            }
            else
            {
                this.achievementHideLog();
            }
        },

        achievementShowLog: function() {
            //alert("called");
            $('#achievementlog').css('display', 'block');
            $('#achievementlog').html("<table id='achievementLogInfo'><tr><th>Name</th><th>Description</th><th>Progress</th></tr></table>");
            _.each(this.achievements, function(achievement){
                var progress  = (achievement.type==2) ? (achievement.progCount+" / "+achievement.mobCount) : ' ';
                if(achievement.found && !achievement.completed){
                    $('#achievementLogInfo tbody').append(
                        '<tr><td>'+achievement.name+'</td>' +
                        '<td>'+achievement.desc+'</td>' +
                        '<td>'+progress+'</td></tr>');
                }
            });
        },

        achievementHideLog: function() {
            $('#achievementlog').css('display', 'none');
        },

        handleAchievement: function(data) {
            var i=1;
            var type = data[0];
            var achievementId, achievement;
            var htmlStr = '';

            if(type === "show") {
                _.each(this.achievements, function(achievement) {
                    achievement.found = data[i++];
                    if(data[i++] === 999){
                        achievement.completed = true;
                    } else{
                        achievement.completed = false;
                    }
                });
            } else if(type === "found") {
                achievementId = data[1];
                achievement = this.getNPCAchievement(achievementId);
                achievement.found = true;
                this.achievementAlarmShow(achievement, this.hideDelay);
            } else if(type === "complete") {
                achievementId = data[1];
                achievement = this.getNPCAchievement(achievementId);
                achievement.completed = true;
                this.achievementAlarmShow(achievement, this.hideDelay);
            } else if(type === "progress") {
                achievementId = data[1];
                achievement = this.getNPCAchievement(achievementId);
                if (achievement.type == 2)
                {
                    this.achievementAlarmShow(achievement, this.progressHideDelay);
                    this.achievements[achievementId].progCount = data[2];
                }
            }

            if (this.showlog)
            {
                this.achievementShowLog();
            }
        },
        talkToNPC: function(npc){
            for(var achievementSerial in this.achievements){
                var achievement = this.achievements[achievementSerial];
                //alert(JSON.stringify(achievement));
                if(achievement.npcId === npc.kind && !achievement.completed){
                    //if(!achievement.found) {
                    //this.game.client.sendAchievement(achievement.id, "found");
                    this.game.client.sendTalkToNPC(npc.kind, achievement.id);
                    //this.achievements[achievementSerial].found = true;
                    //if (achievement.completed)
                    //	return null;

                    return npc.talk(achievement, false);
                    //} /*else if(achievement.found && achievement.completed) {
                    //return npc.talk(achievement.id, true);

                } /*else if (achievement.npcId === npc.kind && achievement.completed)
                 {
                 //this.game.client.sendTalkToNPC(npc.kind, achievement.id);
                 return npc.talk(achievement, true);
                 }*/
            }
        }
    });
    return AchievementHandler;
});
