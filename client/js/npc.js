/* global Types */

define(['character', 'questhandler', 'npcdata'], function(Character, QH, NpcData) {
  var Npc = Character.extend({
    init: function(id, kind, name) {
      this._super(id, kind, 1);
      this.itemKind = ItemTypes.getKindAsString(this.kind);
      this.talkIndex = 0;
      this.title = name;
    },
    talk: function(quest, isQuestCompleted) {
    	if (isQuestCompleted) this.talkIndex = 0;
    	var msgs = isQuestCompleted ? quest.afterTalk : quest.beforeTalk;
        if(msgs){
            var msg = null;
            var talkCount = msgs.length;

            if(this.talkIndex > talkCount) {
                this.talkIndex = 0;
            }
            if(this.talkIndex < talkCount) {
                msg = msgs[this.talkIndex];
            }
            this.talkIndex += 1;

            return msg;
        } else  {
            return "Well, hello there!";
        }
      },
        getSpriteName: function() {
            return NpcData.Kinds[this.kind].spriteName;
        },  
      
    });
  return Npc;
});