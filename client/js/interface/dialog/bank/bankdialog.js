define(['../../../dialog', '../inventoryframe', './bankframe'], function(Dialog, InventoryFrame, BankFrame) {

    var BankDialog = Dialog.extend({
        init: function(game) {
            var self = this;
            
            self._super(game, '#bankDialog');
            self.game = game;
            self.scale = self.game.getScaleFactor();

            self.inventoryFrame = new InventoryFrame(self);
            self.bankFrame = new BankFrame(self);

            self.close = $('#bankDialogCloseButton');

            self.close.click(function(event) {
                self.hide();
            });
        },

        load: function() {
            var self = this;

            self.updateScale();

            self.close.css({
                'position': 'absolute',
                'left': '' + (247 * self.scale) + 'px',
                'top': '' + (15 * self.scale) + 'px',
                'width': '' + (16 * self.scale) + 'px',
                'height': '' + (16 * self.scale) + 'px',
                'background-image': 'img("img/' + self.scale + '/storedialogsheet.png")',
                'background-position': '-' + (32 * self.scale) + 'px -' + (165 * self.scale) + 'px',
                'cursor': 'pointer'
            });

            self.inventoryFrame.load();
            self.bankFrame.load();
        },

        show: function() {
            var self = this;
            
            self.load();
            self.inventoryFrame.open();
            self.bankFrame.open();
            self._super();
        },

        updateScale: function() {
            this.scale = this.game.getScaleFactor();
        },

        getDialogType: function() {
            return 'bankDialog';
        }
    });

    return BankDialog;
});