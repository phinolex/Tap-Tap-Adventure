define(['jquery'], function() {
  var RankingHandler = Class.extend({
    init: function(game) {
      this.game = game;
    },
    show: function(){
      $('#ranking').css('display', 'block');
    },
    handleRanking: function(message){
      var i = 1;
      var rank = message[0];
      var htmlStr = "<table><tr><th>Rank</th><th>Name</th><th>Experience</th></tr>";
      for(i=1; i<message.length; i += 2){
        if(message[i]){
          htmlStr += "<tr><td>" + (rank + ((i-1)/2)) + "</td>";
          htmlStr += "<td>" + message[i] + "</td>";
          htmlStr += "<td>" + message[i+1] + "</td></tr>";
        }
      }

      htmlStr += "</table>";
      $('#ranking').html(htmlStr);
    }
  });

  return RankingHandler;
});
