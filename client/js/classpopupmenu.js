define(['jquery'], function() {
    var ClassPopupMenu = Class.extend({
        init: function(game){
            this.game = game;

            var self = this;
            $('#classSwitcherButton').click(function(event){
                self.game.player.skillHandler.hideShortcuts();
                self.game.characterDialog.frame.pages[1].clear();
                self.game.client.sendClassSwitch($('#selectClassSwitch').val());
                self.close();
                this.show = false;
            });          
        },

        close: function(){
            $('#classSwitcher').css('display', 'none');
        },
        open: function(){
            $('#classSwitcher').css('display', 'block');
        },
    });

    return ClassPopupMenu;
});
