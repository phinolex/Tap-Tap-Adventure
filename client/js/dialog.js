define(function() {
    var Dialog = Class.extend({
        init: function(game, id) {
            this.game = game;
            this.id = id;
            this.body = $(id);
            this.visible = false;
        },
        show: function() {
            if(this.showHandler){
                this.showHandler(this);
            }

            this.visible = true;
            $(this.id).css('display', 'block');
        },
        hide: function() {
            this.visible = false;
            $(this.id).css('display', 'none');

            if(this.hideHandler){
                this.hideHandler(this);
            }
        },
        onShow: function(handler) {
            this.showHandler = handler;
        },
        onHide: function(handler) {
            this.hideHandler = handler;
        }
    });

    return Dialog;
});