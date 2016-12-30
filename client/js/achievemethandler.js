
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
            this.sent = false;

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

        isAchievementNPC: function(npcKind) {
            for (var aS in this.achievements) {
                if (this.achievements[aS].npcId === npcKind)
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

        achievementAlarmShow: function (achievement, delay, type) {
            var $notification = $('#achievement-notification'),
                $name = $notification.find('.name'),
                $title = $notification.find('.title'),
                $button = $('#helpbutton');

            $notification.removeClass().addClass('active achievement' + 1);

            switch (type) {
                case "found":
                    $title.text("Achievement Found!");
                    $name.text(achievement.name);
                    this.blinkInterval = setInterval(function() {
                        $button.toggleClass('blink');
                    }, 500);
                    break;

                case "completed":
                    $title.text("Achievement completed!");
                    this.blinkInterval = setInterval(function() {
                        $button.toggleClass('blink');
                    }, 500);
                    break;

                case "progress":
                    $title.text("Achievement progress: " + achievement.progCount + "/" + achievement.mobCount + "!");
                    break;
            }

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
                    achievement.progCount = 0;
                    self.achievementAlarmShow(achievement, self.hideDelay, type);
                    self.game.app.relistAchievement(achievement);
                    break;

                case "complete":
                    achievement = self.getNPCAchievement(achievementId);
                    achievement.completed = true;
                    self.game.app.unlockAchievement(achievementId);
                    self.game.app.addUnlockedCount();
                    self.achievementAlarmShow(achievement, self.hideDelay, type);
                    break;

                case "progress":
                    achievement = self.getNPCAchievement(achievementId);
                    if (achievement.type == 2) {
                        self.achievements[achievementId].progCount = data[2];
                        self.achievementAlarmShow(achievement, self.progressHideDelay, type);
                    }
                    break;
            }

            if (this.showlog)
                this.achievementShowLog();
        },

        talkToNPC: function(npc) {
            var a;

            for (var achievementSerial in this.achievements) {
                if (this.achievements.hasOwnProperty(achievementSerial)) {
                    var achievement = this.achievements[achievementSerial];

                    if (achievement.npcId == npc.kind) {
                        a = achievement;
                        if (!achievement.completed) {
                            this.game.client.sendTalkToNPC(npc.kind, achievement.id);
                            return npc.talk(achievement, false);
                        }
                    }
                }
            }

            return npc.talk(a, true);
        }
    });
    return AchievementHandler;
});
