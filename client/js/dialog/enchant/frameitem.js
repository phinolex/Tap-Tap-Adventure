/**
 * Created by flavius on 2017-02-25.
 */
define(['../../item'], function(Item) {

    var FrameItem = Class.extend({
        init: function(frame, index) {
            var self = this;

            self.frame = frame;
            self.index = index;
            
            self.kind = null;
            self.name = null;
            self.enchantLevel = 0;
            self.skillKind = 0;
            self.skillLevel = 0;
            self.name = '#enchantDialogInventory' + self.value(self.index, 2);
            self.background = $(self.name + 'Background');
            self.body = $(self.name + 'Body');
            self.number = $(self.name + 'Number');
            self.scale = self.frame.scale;

            self.load();

            self.body.click(function(event) {
                self.frame.select(self);
            });
        },

        load: function() {
            var self = this;

            self.background.css({
                'position': 'absolute',
                'left': '' + ((self.scale * 15) + Math.floor(this.index % 6) * (17 * self.scale)) + 'px',
                'top': '' + ((self.scale * 22) + Math.floor(this.index / 6) * (23 * self.scale)) + 'px',
                'width': '' + (16 * self.scale) + 'px',
                'height': '' + (self.scale * 15) + 'px',
                'background-image': 'url("img/' + self.scale + '/storedialogsheet.png")',
                'background-position': (-300 * self.scale) + 'px ' + (self.scale * -172) + 'px'
            });

            self.body.css({
                'position': 'absolute',
                'width': '' + (self.scale * 16) + 'px',
                'height': '' + (self.scale * 15) + 'px',
                'bottom': '' + self.scale + 'px'
            });

            self.number.css({
                'margin-top': '' + (15 * self.scale) + 'px',
                'color': '#fff',
                'text-size': '' + (6 * self.scale) + 'px',
                'text-align': 'center'
            });

            if (self.kind)
                self.revert();
        },

        setData: function(kind, enchantLevel, skillKind, skillLevel) {
            var self = this;

            self.setKind(kind);

            self.enchantLevel = enchantLevel;
            self.skillKind = kind;
            self.skillLevel = skillLevel;
            self.name = ItemTypes.getKindAsString(kind);

            self.revert();
        },

        revert: function() {
            var self = this;

            self.body.css('background-image', self.name ? 'url("img/' + self.scale + '/item-' + self.name + '.png")' : '');
            self.body.attr('title', self.getDetails());
            self.number.html(self.enchantLevel > 1 ? (ItemTypes.isObject(self.kind) ? '+' : '' + self.enchantLevel) : '')
        },

        remove: function() {
            var self = this;

            self.body.css('background-image', '');
            self.body.attr('title', '');
            self.number.html('');
        },

        clear: function() {
            var self = this;

            self.setKind(null);
            self.enchantLevel = 0;
            self.skillKind = 0;
            self.skillLevel = 0;
            self.remove();
        },

        getName: function() {
            return this.name;
        },

        getIndex: function() {
            return this.index;
        },

        getEnchantLevel: function() {
            return this.enchantLevel;
        },

        getDetails: function() {
            var self = this;
            
            if (ItemTypes.isGold(self.kind))
                return '';
            
            var price = ItemTypes.getEnchantPrice(self.name, self.enchantLevel);

            return Item.getInfoMsgEx(self.kind, self.enchantLevel, self.skillKind, self.skillLevel) + '\r\nEnchant Price: ' + price + ' Gold';
        },

        setKind: function(kind) {
            this.kind = kind;
            this.name = ItemTypes.getKindAsString(kind);
        },

        setName: function(name) {
            this.name = name;
        },
        
        value: function(value, length) {
            var buffer = '00000000' + value;
            
            return buffer.substring(buffer.length - length);
        }
    });

    return FrameItem;
});