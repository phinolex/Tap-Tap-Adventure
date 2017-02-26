define(['jquery'], function($) {
    var PlayerPopupMenu = Class.extend({

        /**
         * This handles the text box that appears
         * when a player clicks on another player
         * entity.
         */
        
        init: function(game) {
            var self = this;

            self.game = game;
            self.selectedPlayer = null;
            self.container = $('#playerPopupMenuContainer');
            self.invite = $('#playerPopupMenuPartyInvite');
            self.leader = $('#playerPopupMenuPartyLeader');
            self.kick = $('#playerPopupMenuPartyKick');
            self.attack = $('#playerPopupMenuAttack');
            self.name = $('#playerPopupMenuName')
            
            self.width = self.container.css('width');
            self.height = self.container.css('height');

            self.partyHandler = null;
            
            self.loadCSSData();
        },
        
        loadCSSData: function() {
            var self = this;
            
            self.invite.click(function(event) {
                if (self.selectedPlayer) {
                    self.game.client.sendPartyInvite(self.selectedPlayer.id, 0);
                    self.close();
                }
            });
            
            self.leader.click(function(event) {
                if (self.selectedPlayer) {
                    self.game.client.sendPartyLeader(self.selectedPlayer.id);
                    self.close();
                } 
            });

            self.kick.click(function(event) {
                if (self.selectedPlayer) {
                    self.game.client.sendPartyKick(self.selectedPlayer.id);
                    self.close();
                }
            });

            self.attack.click(function(event) {
                if (self.selectedPlayer) {
                    self.game.player.engage(self.selectedPlayer);
                    self.game.client.sendAttacK(self.selectedPlayer);
                    self.close();
                }
            });
        },

        click: function(player) {
            var self = this,
                x = (player.x - self.game.renderer.camera.x) * 2,
                y = (player.y - self.game.renderer.camera.y) * 2;

            
            self.selectedPlayer = player;
            
            /**
             * Set bounds to ensure the popup menu does not
             * exceed the game container. x >= 0 && x <= container.width
             */

            if (x < 0)
                x = 0;
            else if (x + self.width > self.game.renderer.getWidth())
                x = self.game.renderer.getWidth() - self.width;

            if (y < 0)
                y = 0;
            else if (y + self.height > self.game.renderer.getHeight())
                y = self.game.renderer.getHeight() - self.height;
            

            self.partyHandler = self.game.partyHandler;

            //Plz us ternry opuraturs 4 meximum legibililility

            var isLeader = self.partyHandler.isLeader(self.game.player.name),
                isMember = self.partyHandler.isMember(self.selectedPlayer.name);


            self.kick.css('display', (isLeader && isMember) ? 'block' : 'none');
            self.leader.css('display', (isLeader && isMember) ? 'block' : none);

            self.invite.css('display', isMember ? 'none' : 'block');

            container.css({
                'display': 'block',
                'top': y + 'px',
                'left': x + 'px'
            });

            self.name.html(self.selectedPlayer.name);
        },

        close: function() {
            var self = this;

            self.selectedPlayer = null;
            self.container.css('display', 'none')
        }
    });

    return PlayerPopupMenu;
});
