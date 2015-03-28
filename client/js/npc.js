/* global Types */

define(['character'], function(Character) {
  var Npc = Character.extend({
    init: function(id, kind) {
      this._super(id, kind, 1);
      this.itemKind = Types.getKindAsString(this.kind);
      this.talkIndex = 0;
    },
    talk: function(isQuestCompleted) {
        var msgs = isQuestCompleted ? this.afterQuestCompleteTalk : this.beforeQuestCompleteTalk;
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
            return "안생겨요";
        }
      }
    });
    
  return Npc;
});