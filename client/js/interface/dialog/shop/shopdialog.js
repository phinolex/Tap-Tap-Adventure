define(['jquery', '../../dialog', './storeframe', '../inventoryframe'], function($, Dialog, StoreFrame, InventoryFrame) {

    /**
     * Follows the same premise as that of enchantment
     * dialog. Could be merged into similar files in
     * the future. For now it is far better than the
     * hardcoded version.
     */

    var ShopDialog = Dialog.extend({
        init: function(game) {
            var self = this;

            self._super(game, '#storeDialog');
            self.game = game;
            self.dialogType = 'storeDialog';
            self.confirmCallback = null;
            self.scale = self.game.getScaleFactor();

            self.storeFrame = new StoreFrame(self);
            self.inventoryFrame = new InventoryFrame(self);

            self.close = $('#storeDialogCloseButton');
            self.modal = $('#storeDialogModal');
            self.modalNotify = $('#storeDialogModalNotify');
            self.notifyMessage = $('#storeDialogModalNotifyMessage');
            self.notifyButton = $('#storeDialogModalNotifyButton1');
            self.confirmButton = $('#storeDialogModalConfirm');
            self.confirmMessage = $('#storeDialogModalConfirmMessage');
            self.accept = $('#storeDialogModalConfirmButton1');
            self.decline = $('#storeDialogModalConfirmButton2');

            self.updateScale();
            self.loadCSSData();
        },

        loadCSSData: function() {
            var self = this;

            self.close.click(function(event) {
                var active = self.storeFrame.getActivePage();

                if (active)
                    active.setVisible(false);

                self.hide();
            });

            self.notifyButton.click(function(event) {
                self.hideModal();
            });

            self.accept.click(function(event) {
                self.hideModal();

                if (self.confirmCallback)
                    self.confirmCallback(true);

            });

            self.decline.click(function(event) {
                self.hideModal();

                if (self.confirmCallback)
                    self.confirmCallback(false);
            });

            $('#storeDialogStorePotionPage').css('display','none');
        },

        load: function() {
            var self = this;

            self.updateScale();

            self.close.css({
                'position': 'absolute',
                'left': '' + (self.scale * 290) + 'px',
                'top': '' + (self.scale * 15) + 'px',
                'width': '' + (self.scale * 16) + 'px',
                'height': '' + (self.scale * 16) + 'px',
                'background-image': 'url("img/' + self.scale + '/storedialogsheet.png")',
                'background-position': '-' + (32 * self.scale) + 'px' + ' -' + (165 * self.scale) + 'px',
                'cursor': 'pointer'
            });

            self.inventoryFrame.load();
            self.storeFrame.load();

        },

        show: function() {
            var self = this;

            self.load();
            self.inventoryFrame.open();
            self.storeFrame.open();

            $("#storeDialogStorePotionButton").html('<div>Potions</div>');

            $('#auctionDialogSellButton').css("display", "none");
            $('#storeDialogSellButton').css("display", "block");

            self._super();

            $('#storeDialogStorePotionButton').click();
        },

        notify: function(message) {
            var self = this;

            self.notifyMessage.text(message);
            self.showNotifyModal();
        },

        confirm: function(message, callback) {
            var self = this;

            self.confirmCallback = callback;
            self.confirmMessage.text(message);

            self.showModal();
        },

        hideModal: function(hideConfirm) {
            var self = this;

            self.modal.css('display', 'none');

            if (hideConfirm)
                self.confirmButton.css('display', 'none');
            else
                self.modalNotify.css('display', 'none');
        },

        showNotifyModal: function() {
            var self = this;

            self.modalNotify.css('display', 'block');
            self.modal.css('display', 'block');
        },

        showModal: function() {
            var self = this;

            self.modal.css('display', 'block');
            self.confirmButton.css('display', 'block');
        },

        getDialogType: function() {
            return this.dialogType;
        },

        updateScale: function() {
            this.scale = this.game.getScaleFactor();
        }
    });

    return ShopDialog;
});