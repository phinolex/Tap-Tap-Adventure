define(['../frameitem'], function(FrameItem) {

    var BankFrame = Class.extend({
        init: function(bankDialog) {
            var self = this;

            self.bankDialog = bankDialog;
            self.selectedItem = null;
            self.items = [];

            self.background = $('#bankDialogBankGoldBackground');
            self.icon = $('#bankDialogBankGoldBody');
            self.number = $('#bankDialogBankGoldNumber');

            self.game = self.bankDialog.game;
            self.scale = self.bankDialog.scale;

            for (var i = 0; i < 24; i++)
                self.items.push(new FrameItem(self, i, 'bankDialogBank'));
        },
        
        load: function() {
            var self = this;

            self.updateScale();

            self.background.css({
                'position': 'absolute',
                'left': '' + (15 * self.scale) + 'px',
                'top': '' + (125 * self.scale) + 'px',
                'width': '' + (16 * self.scale) + 'px',
                'height': '' + (15 * self.scale) + 'px',
                'background-image': 'url("img/' + self.scale + '/storedialogsheet.png")',
                'background-position': '-' + (300 * self.scale) + 'px -' + (172 * self.scale) + 'px'
            });

            self.icon.css({
                'position': 'absolute',
                'width': '' + (16 * self.scale) + 'px',
                'height': '' + (15 * self.scale) + 'px',
                'background-image': 'url("img/' + self.scale + '/item-gold.png")'
            });

            self.number.css({
                'position': 'absolute',
                'margin-top': '' + (15 * self.scale) + 'px',
                'color': '#000',
                'text-align': 'center'
            });

            for (var i = 0; i < self.items.length; i++)
                self.items[i].load();
        },

        open: function() {
            var self = this;

            for (var i = 0; i < self.items.length; i++)
                self.items[i].remove();

            for (var bankIndex = 0; bankIndex < self.game.bankHandler.bankSize; bankIndex++) {
                var item = self.game.bankHandler.items[bankIndex];
                
                if (item && item.kind) {
                    self.items[bankIndex].setData(item.kind, item.count, item.skillKind, item.skillLevel);
                
                    if (ItemTypes.isGold(item.kind))
                        self.number.html(item.count);
                }
            }
        },

        select: function(item) {
            var self = this;

            self.game.client.sendBankRetrieve(item.kind);
            item.clear();
            self.open();
            self.number.html('');
        },

        updateScale: function() {
            this.scale = this.bankDialog.game.getScaleFactor();
        },

        isStoreDialog: function() {
            return false;
        },

        isEnchantDialog: function() {
            return false;
        },

        isBankDialog: function() {
            return true;
        }
    });

    return BankFrame;
});