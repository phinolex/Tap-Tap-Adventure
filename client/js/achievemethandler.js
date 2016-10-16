
/* global Types, Class, _, achievementSerial */

define(['text!../shared/data/achievements_english.json', 'jquery'], function(AchievementsJson) {

    var achievementdata = JSON.parse(AchievementsJson);

    var AchievementHandler = Class.extend({
        init: function(game) {
            this.game = game;
            this.hideDelay = 1000; //How long the notification shows for.
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
                achievement.completed = achievementProgress[i] === 999;
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
            var self = this,
                i = 0,
                type = data[0],
                achievementId = data[1],
                achievement,
                htmlStr = '';

            switch (type) {
                case "show":
                    _.each(self.achievements, function(achievement) {
                        achievement.found = data[i++];
                        achievement.completed = data[i++] === 999;
                    });
                    break;

                case "found":
                    achievement = self.getNPCAchievement(achievementId);
                    achievement.found = true;
                    self.achievementAlarmShow(achievement, self.hideDelay);
                    self.game.app.relistAchievement(achievement);
                    break;

                case "complete":
                    achievement = self.getNPCAchievement(achievementId);
                    achievement.completed = true;
                    self.achievementAlarmShow(achievement, self.hideDelay);
                    self.game.app.unlockAchievement(achievementId);
                    break;

                case "progress":
                    achievement = self.getNPCAchievement(achievementId);
                    if (achievement.type == 2) {
                        self.achievementAlarmShow(achievement, self.progressHideDelay);
                        self.achievements[achievementId].progCount = data[2];
                    }
                    break;
            }

            if (this.showlog)
                this.achievementShowLog();
        },
        talkToNPC: function(npc){
            for(var achievementSerial in this.achievements){
                var achievement = this.achievements[achievementSerial];
                if(achievement.npcId === npc.kind && !achievement.completed){
                    this.game.client.sendTalkToNPC(npc.kind, achievement.id);
                    return npc.talk(true, achievement, false);
                }
            }
        }
    });
    return AchievementHandler;
});
