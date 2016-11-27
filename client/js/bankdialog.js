define(['dialog', 'tabbook', 'tabpage', 'item'], function(Dialog, TabBook, TabPage, Item) {
    function fixed(value, length) {
        var buffer = '00000000' + value;
        return buffer.substring(buffer.length - length);
    }

    function getGame(object) {
        return object ? (object.game ? object.game : getGame(object.parent)) : null;
    }

    var Inventory = Class.extend({
        init: function(parent, index) {
            this.parent = parent;
            this.index = index;
            this.itemKind = null;
            this.itemName = null;
            this.itemCount = 0;
            this.enchantLevel = 0;
            this.skillKind = 0;
            this.skillLevel = 0;
            var name = '#bankDialogInventory' + fixed(this.index, 2);
            this.background = $(name + 'Background');
            this.body = $(name + 'Body');
            this.number = $(name + 'Number');

            this.rescale();
            var self = this;
                        	    
	    this.body.click(function(event) {
		self.parent.select(self);
	    });
        },
        
        rescale: function() {
            this.scale = this.parent.parent.scale;
            if (this.scale == 1)
            {
		    this.background.css({
			'position': 'absolute',
			'left': '' + (15 + Math.floor(this.index % 6) * 17) + 'px',
			'top': '' + (22 + Math.floor(this.index / 6) * 23) + 'px',
			'width': '16px',
			'height': '15px',
			'background-image': 'url("img/1/storedialogsheet.png")',
			'background-position': '-300px -172px'
		    });
		    this.body.css({
			'position': 'absolute',
			'width': '16px',
			'height': '15px',
			'bottom': '1px'
		    });
		    this.number.css({
		    	'margin-top': '15px',
			'color': '#fff',
			'text-size': '6px',
			'text-align': 'center'
		    });
            }
            else if (this.scale == 2)
            {
		    this.background.css({
			'position': 'absolute',
			'left': '' + (30 + Math.floor(this.index % 6) * 33) + 'px',
			'top': '' + (44 + Math.floor(this.index / 6) * 45) + 'px',
			'width': '32px',
			'height': '30px',
			'background-image': 'url("img/2/storedialogsheet.png")',
			'background-position': '-600px -344px'
		    });
		    this.body.css({
			'position': 'absolute',
			'width': '32px',
			'height': '30px',
			'bottom': '2px'
		    });
		    this.number.css({
		    	'margin-top': '30px',
			'color': '#fff',
			'text-size': '9px',
			'text-align': 'center'
		    });
            }
            else if (this.scale == 3)
            {
		    this.background.css({
			'position': 'absolute',
			'left': '' + (45 + Math.floor(this.index % 6) * 50) + 'px',
			'top': '' + (66 + Math.floor(this.index / 6) * 68) + 'px',
			'width': '48px',
			'height': '45px',
			'background-image': 'url("img/3/storedialogsheet.png")',
			'background-position': '-900px -516px'
		    });
		    this.body.css({
			'position': 'absolute',
			'width': '48px',
			'height': '45px',
			'bottom': '3px'
		    });
		    this.number.css({
		    	'margin-top': '45px',
			'color': '#fff',
			'text-size': '12px',
			'text-align': 'center'
		    });		
            }
            if (this.itemKind) {
                this.restore();
            }
        },
        
        getIndex: function() {
            return this.index;
        },
        getItemKind: function() {
            return this.itemKind;
        },
        setItemKind: function(value) {
            this.itemKind = value;
            this.itemName = ItemTypes.getKindAsString(value);
        },
        getItemName: function() {
            return this.itemName;
        },
        getComment: function() {
            var game = getGame(this);
            return Item.getInfoMsgEx(this.itemKind, this.enchantLevel, this.skillKind, this.skillLevel);
        },

        assign: function(itemKind, itemCount, skillKind, skillLevel) {
            this.setItemKind(itemKind);
            this.enchantLevel = itemCount;
            this.skillKind = skillKind;
            this.skillLevel = skillLevel;
            this.itemName = ItemTypes.KindData[itemKind].key;
            this.spriteName = ItemTypes.KindData[itemKind].spriteName=="" ? this.itemName : ItemTypes.KindData[itemKind].spriteName;
            this.itemCount = itemCount;
            this.restore();
        },
        clear: function() {
            this.setItemKind(null);
            this.itemCount = 0;
            this.skillKind = 0;
            this.skillLevel = 0;
            this.release();
        },
        release: function() {
            this.body.css('background-image', '');
            this.body.attr('title', '');
            this.number.html("");
        },
        restore: function() {
            this.scale = this.parent.parent.scale;
            this.body.css('background-image', this.spriteName ? 'url("img/'+this.scale+'/item-' + this.spriteName + '.png")' : '');
            this.body.attr('title', this.getComment());
            if (this.itemCount > 1) {
            	if (ItemTypes.isObject(this.itemKind) || ItemTypes.isCraft(this.itemKind))
            		this.number.html(this.itemCount);
            	else
            		this.number.html("+"+this.itemCount);
            } else {
            	    this.number.html("");
            }
            
        }
    });

    var Bank = Class.extend({
        init: function(parent, index) {
            this.parent = parent;
            this.index = index;
            this.itemKind = null;
            this.itemName = null;
            this.itemCount = 0;
            this.enchantLevel = 0;
            this.skillKind = 0;
            this.skillLevel = 0;
            var name = '#bankDialogBank' + fixed(this.index, 2);
            this.background = $(name + 'Background');
            this.body = $(name + 'Body');
            this.number = $(name + 'Number');

            this.rescale();
            var self = this;
                        	    
	    this.body.click(function(event) {
		self.parent.select(self);
	    });
        },
        
        rescale: function() {
            this.scale = this.parent.parent.scale;
            if (this.scale == 1)
            {
		    this.background.css({
			'position': 'absolute',
			'left': '' + (15 + Math.floor(this.index % 6) * 17) + 'px',
			'top': '' + (22 + Math.floor(this.index / 6) * 23) + 'px',
			'width': '16px',
			'height': '15px',
			'background-image': 'url("img/1/storedialogsheet.png")',
			'background-position': '-300px -172px'
		    });
		    this.body.css({
			'position': 'absolute',
			'width': '16px',
			'height': '15px',
			'bottom': '1px'
		    });
		    this.number.css({
		    	'margin-top': '15px',
			'color': '#fff',
			'text-size': '6px',
			'text-align': 'center'
		    });
            }
            else if (this.scale == 2)
            {
		    this.background.css({
			'position': 'absolute',
			'left': '' + (30 + Math.floor(this.index % 6) * 33) + 'px',
			'top': '' + (44 + Math.floor(this.index / 6) * 45) + 'px',
			'width': '32px',
			'height': '30px',
			'background-image': 'url("img/2/storedialogsheet.png")',
			'background-position': '-600px -344px'
		    });
		    this.body.css({
			'position': 'absolute',
			'width': '32px',
			'height': '30px',
			'bottom': '2px'
		    });
		    this.number.css({
		    	'margin-top': '30px',
			'color': '#fff',
			'text-size': '9px',
			'text-align': 'center'
		    });
            }
            else if (this.scale == 3)
            {
		    this.background.css({
			'position': 'absolute',
			'left': '' + (45 + Math.floor(this.index % 6) * 50) + 'px',
			'top': '' + (66 + Math.floor(this.index / 6) * 68) + 'px',
			'width': '48px',
			'height': '45px',
			'background-image': 'url("img/3/storedialogsheet.png")',
			'background-position': '-900px -516px'
		    });
		    this.body.css({
			'position': 'absolute',
			'width': '48px',
			'height': '45px',
			'bottom': '3px'
		    });
		    this.number.css({
		    	'margin-top': '45px',
			'color': '#fff',
			'text-size': '12px',
			'text-align': 'center'
		    });		
            }
            if (this.itemKind) {
                this.restore();
            }
        },
        
        getIndex: function() {
            return this.index;
        },
        getItemKind: function() {
            return this.itemKind;
        },
        setItemKind: function(value) {
            this.itemKind = value;
            this.itemName = ItemTypes.getKindAsString(value);
        },
        getItemName: function() {
            return this.itemName;
        },
        getComment: function() {
            var game = getGame(this);
            return Item.getInfoMsgEx(this.itemKind, this.enchantLevel, this.skillKind, this.skillLevel);
        },

        assign: function(itemKind, itemCount, skillKind, skillLevel) {
            this.setItemKind(itemKind);
            this.enchantLevel = itemCount;
            this.skillKind = skillKind;
            this.skillLevel = skillLevel;
            this.itemName = ItemTypes.KindData[itemKind].key;
            this.spriteName = ItemTypes.KindData[itemKind].spriteName=="" ? this.itemName : ItemTypes.KindData[itemKind].spriteName;
            this.itemCount = itemCount;
            this.restore();
        },
        clear: function() {
            this.setItemKind(null);
            this.itemCount = 0;
            this.skillKind = 0;
            this.skillLevel = 0;
            this.release();
        },
        release: function() {
            this.body.css('background-image', '');
            this.body.attr('title', '');
            this.number.html("");
        },
        restore: function() {
            this.scale = this.parent.parent.scale;
            this.body.css('background-image', this.spriteName ? 'url("img/'+this.scale+'/item-' + this.spriteName + '.png")' : '');
            this.body.attr('title', this.getComment());
            if (this.itemCount > 1) {
            	if (ItemTypes.isObject(this.itemKind) || ItemTypes.isCraft(this.itemKind))
            		this.number.html(this.itemCount);
            	else
            		this.number.html("+"+this.itemCount);
            } else {
            	    this.number.html("");
            }
            
        }
    });

    var InventoryFrame = Class.extend({
        init: function(parent) {
            this.parent = parent;
            this.inventories = [];
            
            for(var index = 0; index < 18; index++) {
                this.inventories.push(new Inventory(this, index));
            }

            this.goldBackground = $('#bankDialogInventoryGoldBackground');
            this.goldIcon = $('#bankDialogInventoryGoldBody');
            this.goldNumber = $('#bankDialogInventoryGoldNumber');
            
            this.selectedInventory = null;
        },

        rescale: function(scale) {
	    if (scale == 1)
	    {
		    this.goldBackground.css({
			'position': 'absolute',
			'left': '15px',
			'top': '125px',
			'width': '16px',
			'height': '15px',
			'background-image': 'url("img/1/storedialogsheet.png")',
			'background-position': '-300px -172px'
		    });
		    this.goldIcon.css({
			'position': 'absolute',
			'width': '16px',
			'height': '15px',
			'background-image': 'url("img/1/item-gold.png")'
		    });
		    this.goldNumber.css({
			'position': 'absolute',
			'margin-top': '15px',
			'color': '#000',
			'text-align': 'center'
		    });			    
	    }
	    else if (scale == 2)
	    {
		    this.goldBackground.css({
			'position': 'absolute',
			'left': '30px',
			'top': '246px',
			'width': '32px',
			'height': '30px',
			'background-image': 'url("img/2/storedialogsheet.png")',
			'background-position': '-600px -344px'
		    });
		    this.goldIcon.css({
			'position': 'absolute',
			'width': '32px',
			'height': '30px',
			'background-image': 'url("img/2/item-gold.png")'
		    });
		    this.goldNumber.css({
			'position': 'absolute',
			'margin-top': '30px',
			'color': '#000',
			'text-align': 'center'
		    });			    
		    		    	    
	    }
	    else if (scale == 3)
	    {
		    this.goldBackground.css({
			'position': 'absolute',
			'left': '45px',
			'top': '375px',
			'width': '48px',
			'height': '45px',
			'background-image': 'url("img/3/storedialogsheet.png")',
			'background-position': '-900px -516px'
		    });
		    this.goldIcon.css({
			'position': 'absolute',
			'width': '48px',
			'height': '45px',
			'background-position': '0px 0px',
			'background-image': 'url("img/3/item-gold.png")'
		    });
		    this.goldNumber.css({
			'position': 'absolute',
			'margin-top': '45px',
			'color': '#000',
			'text-align': 'center'
		    });		    
	    }
	    
            for(var index = 0; index < 18; index++) {
                this.inventories[index].rescale();
            }
                    
        },

        getInventory: function(index) {
            return this.inventories[index];
        },

        open: function() {
            for(var index = 0; index < this.inventories.length; index++) {
                this.inventories[index].release();
            }

            this.goldNumber.html('0');
            var game = getGame(this);
            if(game && game.ready) {
                for(var inventoryNumber = 6; inventoryNumber < game.inventoryHandler.maxInventoryNumber; inventoryNumber++) {
                    var item = game.inventoryHandler.inventories[inventoryNumber];
                    if(item && item.kind) {
                        if(ItemTypes.isWeapon(item.kind) || ItemTypes.isArcherWeapon(item.kind) || ItemTypes.isPendant(item.kind) || ItemTypes.isRing(item.kind))
                            this.inventories[inventoryNumber-6].assign(item.kind, item.count, item.skillKind, item.skillLevel);
                        else if (ItemTypes.isArmor(item.kind) || ItemTypes.isArcherArmor(item.kind))
                            this.inventories[inventoryNumber-6].assign(item.kind, item.count, 0, 0);
                        else if (ItemTypes.isCraft(item.kind))
                            this.inventories[inventoryNumber-6].assign(item.kind, item.count, 0, 0);

			    else if (ItemTypes.isGold(item.kind)) {
			    	    this.goldNumber.html(item.count);
	                            this.inventories[inventoryNumber-6].assign(item.kind, item.count, 0, 0);
			    }                           
                    }
                }
            }   
                   
        },
        select: function(inventory) {
            var game = getGame(this);
            if (!game.bankHandler.isBankFull())
            {
                this.parent.game.client.sendBankStore(inventory.getIndex()+6);
            	inventory.release();
            }
        },
    });


    var BankFrame = Class.extend({
        init: function(parent) {
            this.parent = parent;
            this.banks = [];
            
            for(var index = 0; index < 24; index++) {
                this.banks.push(new Bank(this, index));
            }
            
            this.goldBackground = $('#bankDialogBankGoldBackground');
            this.goldIcon = $('#bankDialogBankGoldBody');
            this.goldNumber = $('#bankDialogBankGoldNumber');
            
            this.selectedBank = null;

        },

        rescale: function(scale) {
	    if (scale == 1)
	    {
		    this.goldBackground.css({
			'position': 'absolute',
			'left': '15px',
			'top': '125px',
			'width': '16px',
			'height': '15px',
			'background-image': 'url("img/1/storedialogsheet.png")',
			'background-position': '-300px -172px'
		    });
		    this.goldIcon.css({
			'position': 'absolute',
			'width': '16px',
			'height': '15px',
			'background-image': 'url("img/1/item-gold.png")'
		    });
		    this.goldNumber.css({
			'position': 'absolute',
			'margin-top': '15px',
			'color': '#000',
			'text-align': 'center'
		    });			    
	    }
	    else if (scale == 2)
	    {
		    this.goldBackground.css({
			'position': 'absolute',
			'left': '30px',
			'top': '246px',
			'width': '32px',
			'height': '30px',
			'background-image': 'url("img/2/storedialogsheet.png")',
			'background-position': '-600px -344px'
		    });
		    this.goldIcon.css({
			'position': 'absolute',
			'width': '32px',
			'height': '30px',
			'background-image': 'url("img/2/item-gold.png")'
		    });
		    this.goldNumber.css({
			'position': 'absolute',
			'margin-top': '30px',
			'color': '#000',
			'text-align': 'center'
		    });			    
		    		    	    
	    }
	    else if (scale == 3)
	    {
		    this.goldBackground.css({
			'position': 'absolute',
			'left': '45px',
			'top': '375px',
			'width': '48px',
			'height': '45px',
			'background-image': 'url("img/3/storedialogsheet.png")',
			'background-position': '-900px -516px'
		    });
		    this.goldIcon.css({
			'position': 'absolute',
			'width': '48px',
			'height': '45px',
			'background-position': '0px 0px',
			'background-image': 'url("img/3/item-gold.png")'
		    });
		    this.goldNumber.css({
			'position': 'absolute',
			'margin-top': '45px',
			'color': '#000',
			'text-align': 'center'
		    });		    
	    }
	    
            for(var index = 0; index < this.banks.length; index++) {
                this.banks[index].rescale();
            }            
        },

        getInventory: function(index) {
            return this.bank[index];
        },

        open: function() {
            for(var index = 0; index < this.banks.length; index++) {
                this.banks[index].release();
            }

            this.goldNumber.html('0');
            var game = getGame(this);
            if(game && game.ready) {
                for(var bankNumber = 0; bankNumber < game.bankHandler.maxBankNumber; bankNumber++) {
                    var item = game.bankHandler.banks[bankNumber];
                    if(item && item.kind) {
                        if(ItemTypes.isWeapon(item.kind) || ItemTypes.isArcherWeapon(item.kind) || ItemTypes.isPendant(item.kind) || ItemTypes.isRing(item.kind)) {
                            this.banks[bankNumber].assign(item.kind, item.count, item.skillKind, item.skillLevel);
                        } else if (ItemTypes.isArmor(item.kind) || ItemTypes.isArcherArmor(item.kind)) {
                            this.banks[bankNumber].assign(item.kind, item.count, 0, 0);
                        } else if (ItemTypes.isCraft(item.kind)) {
                            this.banks[bankNumber].assign(item.kind, item.count, 0, 0);
                        }
			    else if (ItemTypes.isGold(item.kind)) {
			    	    this.goldNumber.html(item.count);
	                            this.banks[bankNumber].assign(item.kind, item.count, 0, 0);
			    } 
                    }
                }
            }
        },
        select: function(bank) {
            var game = getGame(this);
            if (!game.inventoryHandler.isInventoryEquipmentFull())
            {
                this.parent.game.client.sendBankRetrieve(bank.getIndex());
                bank.release();
            }
        },
    });


    var BankDialog = Dialog.extend({
        init: function(game) {
            this._super(game, '#bankDialog');
            this.scale=0;
            this.setScale();

            this.inventoryFrame = new InventoryFrame(this);
            this.bankFrame = new BankFrame(this);
            
            this.closeButton = $('#bankDialogCloseButton');

            var self = this;

            this.closeButton.click(function(event) {
                self.hide();
            });
        },
        setScale: function() {
	    if (this.game.renderer) {
		if (this.game.renderer.mobile) {
		    this.scale = 1;
		} else {
		    this.scale = this.game.renderer.getScaleFactor();
		}
	    } else {
		this.scale = 2;
	    }
        	
        },        
        rescale: function() {
        	this.setScale();
		if (this.scale == 1)
		{
		    this.closeButton.css({
			'position': 'absolute',
			'left': '247px',
			'top': '15px',
			'width': '16px',
			'height': '16px',
			'background-image': 'url("img/1/storedialogsheet.png")',
			'background-position': '-32px -165px',
			'cursor': 'pointer'
		    });
				
		}
		else if (this.scale == 2)
		{
		    this.closeButton.css({
			'position': 'absolute',
			'left': '493px',
			'top': '31px',
			'width': '32px',
			'height': '32px',
			'background-image': 'url("img/2/storedialogsheet.png")',
			'background-position': '-64px -330px',
			'cursor': 'pointer'
		    });
			
		}    
		else if (this.scale == 3)
		{	
		    this.closeButton.css({
			'position': 'absolute',
			'left': '745px',
			'top': '52px',
			'width': '48px',
			'height': '48px',
			'background-image': 'url("img/3/storedialogsheet.png")',
			'background-position': '-97px -496px',
			'cursor': 'pointer'
		    });
		}
		this.inventoryFrame.rescale(this.scale);
		this.bankFrame.rescale(this.scale);
        },

        show: function() {
            this.rescale();
            this.inventoryFrame.open();
            this.bankFrame.open();
            this._super();
        }
    });

    return BankDialog;
});
