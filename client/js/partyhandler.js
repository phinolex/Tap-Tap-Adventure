
define(['jquery'], function() {
  var PartyHandler = Class.extend({
    init: function(game){
      this.game = game;
    },
    setMembers: function(members){
      var i=0;
      var htmlStr = '<p>파티원 목록</p>';

      for(i=0; i<members.length; i++){
        htmlStr += '<p>' + members[i] + '</p>';
      }

      this.game.app.hideAllSubwindow();
      this.game.chathandler.show();
      $('#kungLog').css('display', 'none');
      $('#partyWindow').css('display', 'block');
      $('#partyWindow').html(htmlStr);
    },
  });

  return PartyHandler;
});
