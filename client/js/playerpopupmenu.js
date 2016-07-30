define(['jquery'], function() {
    var PlayerPopupMenu = Class.extend({
        init: function(game){
            this.width = parseInt($('#playerPopupMenuContainer').css('width'));
            this.height = parseInt($('#playerPopupMenuContainer').css('height'));
            this.game = game;
            this.selectedPlayer = null;

            var self = this;
            $('#playerPopupMenuPartyInvite').click(function(event){
                if(self.selectedPlayer){
        	    self.game.client.sendPartyInvite(self.selectedPlayer.id, 0);
                    self.close();
                }
            });
            $('#playerPopupMenuPartyLeader').click(function(event){
                if(self.selectedPlayer){
                    self.game.client.sendPartyLeader(self.selectedPlayer.id);
                    self.close();
                }
            });
            $('#playerPopupMenuPartyKick').click(function(event){
                if(self.selectedPlayer){
                    self.game.client.sendPartyKick(self.selectedPlayer.id);
                    self.close();
                }
            });
            $('#playerPopupMenuAttack').click(function(event){
                if(self.selectedPlayer){
                    self.game.player.engage(self.selectedPlayer);
                    self.game.client.sendAttack(self.selectedPlayer);
                    self.close();
                }
            });            
        },
        click: function(player){
            var x = (player.x - this.game.renderer.camera.x) * 2;
            var y = (player.y - this.game.renderer.camera.y) * 2;
            var ph = this.game.partyHandler;

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
            
            if (ph.isLeader(this.game.player.name) && ph.isMember(this.selectedPlayer.name))
            {
                $('#playerPopupMenuPartyKick').css('display', 'block');
                $('#playerPopupMenuPartyLeader').css('display', 'block');
            }
            else
            {
            	$('#playerPopupMenuPartyKick').css('display', 'none');
            	$('#playerPopupMenuPartyLeader').css('display', 'none');
            }
            
            if (ph.isMember(this.selectedPlayer.name))
            {
            	$('#playerPopupMenuPartyInvite').css('display', 'none');    
            }
            else
            {
            	$('#playerPopupMenuPartyInvite').css('display', 'block');    
            }
            
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
