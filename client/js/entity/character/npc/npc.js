/* global Types */

define(['../character', '../../../handlers/achievemethandler', '../../../data/npcdata'], function(Character, QH, NpcData) {
    var Npc = Character.extend({
        init: function(id, kind, name) {
            this._super(id, kind, 1);
            this.itemKind = ItemTypes.getKindAsString(this.kind);
            this.talkIndex = 0;
            this.title = name;
        },

        talk: function(messages) {
            var self = this;

            var message,
                talkCount = messages.length;

            log.info("Talk Index: " + self.talkIndex);

            if (self.talkIndex > talkCount)
                self.talkIndex = 0;

            if (self.talkIndex < talkCount)
                message = messages[self.talkIndex];

            self.talkIndex++;

            return message;
        },

        getSpriteName: function() {
            return NpcData.Kinds[this.kind].spriteName;
        }

    });
    return Npc;
});