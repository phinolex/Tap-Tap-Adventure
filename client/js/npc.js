/* global Types */

define(['character', 'achievemethandler', 'npcdata'], function(Character, QH, NpcData) {
    var Npc = Character.extend({
        init: function(id, kind, name) {
            this._super(id, kind, 1);
            this.itemKind = ItemTypes.getKindAsString(this.kind);
            this.talkIndex = 0;
            this.title = name;
        },

        talk: function(achievement, completedAchievement) {
            var self = this,
                messages;

            var finishedAchievement = achievement.completed;

            messages = finishedAchievement ? achievement.afterTalk : achievement.beforeTalk;

            log.info("Talk Index: " + this.talkIndex);

            if (messages) {
                var message, talkCount = messages.length;

                if (this.talkIndex > talkCount)
                    this.talkIndex = 0;

                if (this.talkIndex < talkCount)
                    message = messages[this.talkIndex];

                this.talkIndex++;

                return message;
            }
        },

        nonAchievementTalk: function(isMobile) {
            var self = this,
                messages;

            if (self.kind == 55)

                messages = isMobile ? [
                    "Welcome young adventurer!",
                    "Call me 'The coder'",
                    "I'm the very man that runs your existence.",
                    "Nonetheless, welcome!",
                    "Welcome to Tap Tap Adventure",
                    "Or as some citizens here call it...",
                    "Maearth."
                ] : [
                    "Welcome young adventurer!",
                "Call my 'The coder'",
                "I'm the very man that runs your existence.",
                "Nonetheless, welcome!",
                "Welcome to Tap Tap Adventure",
                "Or as some citizens here call it...",
                "Maearth.",
                    "Please ensure you report any bugs you may find",
                    "On the forums. You may use the forums with your",
                    "Ingame account without having to register!"
                ];

            if (messages) {
                var message, talkCount = messages.length;

                if (this.talkIndex > talkCount)
                    this.talkIndex = 0;

                if (this.talkIndex < talkCount)
                    message = messages[this.talkIndex];

                this.talkIndex++;

                return message;
            }
        },

        getSpriteName: function() {
            return NpcData.Kinds[this.kind].spriteName;
        }

    });
    return Npc;
});