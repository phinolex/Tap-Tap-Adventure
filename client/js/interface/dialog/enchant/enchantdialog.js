define(['../../../dialog', '../inventoryframe'], function(Dialog, InventoryFrame) {

    var EnchantDialog = Dialog.extend({
        init: function(game) {
            var self = this;

            self._super(game, '#enchantDialog');

            self.game = game;
            self.scale = -1;
            self.confirmCallback = null;
            self.dialogType = 'enchantDialog';
            self.inventoryFrame = new InventoryFrame(self);

            self.close = $('#enchantDialogCloseButton');
            self.modal = $('#enchantDialogModal');
            self.modalNotify = $('#enchantDialogModalNotify');
            self.modalNotifyMessage = $('#enchantDialogModalNotifyMessage');
            self.modalNotifyButton = $('#enchantDialogModalNotifyButton1');
            self.mConfirm = $('#enchantDialogModalConfirm');
            self.confirmMessage = $('#enchantDialogModalConfirmMessage');
            self.accept = $('#enchantDialogModalConfirmButton1');
            self.decline = $('#enchantDialogModalConfirmButton2');


            self.loadCSSData();
        },
        
        loadCSSData: function() {
            var self = this;

            self.close.click(function(event) {
                self.hide();
            });

            self.modalNotifyButton.click(function(event) {
                self.hideModal(false);
            });

            self.accept.click(function(event) {
                self.hideModal(true);
                
                if (self.confirmCallback)
                    self.confirmCallback(true);
            });

            self.decline.click(function(event) {
                self.hideModal(true);
                
                if (self.confirmCallback)
                    self.confirmCallback(false);
            });
        },

        load: function() {
            var self = this;

            self.updateScale();

            self.close.css({
                'position': 'absolute',
                'left': '' + (self.scale * 120) + 'px',
                'top': '' + (self.scale * 15) + 'px',
                'width': '' + (self.scale * 16) + 'px',
                'height': '' + (self.scale * 16) + 'px',
                'background-image': 'url("img/' + self.scale + '/storedialogsheet.png")',
                'background-position': '-' + (32 * self.scale) + 'px' + ' -' + (165 * self.scale) + 'px',
                'cursor': 'pointer'
            });
            
            self.inventoryFrame.load();
        },

        show: function() {
            var self = this;
            self.load();
            self.inventoryFrame.open();
            
            self._super();
        },

        notify: function(message) {
            var self = this;

            self.modalNotifyMessage.text(message);
            self.modalNotify.css('display', 'block');
            self.modal.css('display', 'block');
        },

        confirm: function(message, callback) {
            var self = this;

            self.confirmCallback = callback;

            self.confirmMessage.text(message);
            self.mConfirm.css('display', 'block');
            self.modal.css('display', 'block');
        },
        
        hideModal: function(hideConfirm) {
            var self = this;

            self.modal.css('display', 'none');
            
            if (hideConfirm)
                self.mConfirm.css('display', 'none');
            else
                self.modalNotify.css('display', 'none');
        },

        updateScale: function() {
            var self = this;

            self.scale = self.game.getScaleFactor();
        },

        getDialogType: function() {
            return this.dialogType;
        }
    });


    return EnchantDialog;
});