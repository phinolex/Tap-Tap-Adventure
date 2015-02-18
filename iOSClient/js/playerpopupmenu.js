define(['jquery'], function() {
  var PlayerPopupMenu = Class.extend({
    init: function(game){
      this.width = parseInt($('#playerPopupMenuContainer').css('width'));
      this.height = parseInt($('#playerPopupMenuContainer').css('height'));
      this.game = game;
      this.selectedPlayer = null;

      var self = this;
      $('#playerPopupMenuMove').click(function(event){
        if(self.selectedPlayer){
          self.game.makePlayerGoTo(self.selectedPlayer.gridX, self.selectedPlayer.gridY);
          self.close();
        }
      });
      $('#playerPopupMenuPartyInvite').click(function(event){
        if(self.selectedPlayer){
          self.game.client.sendChat("/3 " + self.selectedPlayer.name);
          self.close();
        }
      });
      $('#playerPopupMenuPartyOut').click(function(event){
        if(self.selectedPlayer){
          self.game.client.sendChat("/4 " + self.selectedPlayer.name);
          self.close();
        }
      });
    },
    click: function(player){
      var x = (player.x - this.game.renderer.camera.x + 16) * 2;
      var y = (player.y - this.game.renderer.camera.y) * 2;

      if(x < 0){
        x = 0;
      } else if(x + this.width > this.game.renderer.getWidth()){
        x = this.game.renderer.getWidth() - this.width;
      }

      if(y < 0){
        y = 0;
      } else if(y + this.height > this.game.renderer.getHeight()){
        y = this.game.renderer.getHeight() - this.height;
      }

      this.selectedPlayer = player;

      $('#playerPopupMenuContainer').css('display', 'block');
      $('#playerPopupMenuContainer').css('top', '' + y + 'px');
      $('#playerPopupMenuContainer').css('left', '' + x + 'px');
      $('#playerPopupMenuName').html(player.name);
    },
    close: function(){
      this.selectedPlayer = null;
      $('#playerPopupMenuContainer').css('display', 'none');
    },
  });

  return PlayerPopupMenu;
});
