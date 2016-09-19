/* global Types */

define(['character', 'achievemethandler', 'npcdata'], function(Character, QH, NpcData) {
    var Npc = Character.extend({
        init: function(id, kind, name) {
            this._super(id, kind, 1);
            this.itemKind = ItemTypes.getKindAsString(this.kind);
            this.talkIndex = 0;
            this.title = name;
        },

        talk: function(isAchievement, achievement, completedAchievement) {
            var messages;

            if (isAchievement) {
                if (completedAchievement)
                    this.talkIndex = 0;

                messages = completedAchievement ? achievement.afterTalk : achievement.beforeTalk;

                if (messages) {
                    var message,
                        talkCount = messages.length;

                    if (this.talkIndex > talkCount)
                        this.talkIndex = 0;

                    if (this.talkIndex < talkCount)
                        message = messages[this.talkIndex];

                    this.talkIndex++;

                    return message;
                }
            } else {
                if (this.name = "Doctor") {
                    messages = ["Test", "Test2"];

                    var message,
                        talkCount = messages.length;

                    if (this.talkIndex > talkCount)
                        this.talkIndex = 0;

                    if (this.talkIndex < talkCount)
                        message = messages[this.talkIndex];

                    this.talkIndex++;

                    return message;
                }
            }
        },

        getSpriteName: function() {
            return NpcData.Kinds[this.kind].spriteName;
        }

    });
    return Npc;
});