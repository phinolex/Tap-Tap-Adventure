/* global Types, Class */

define(['jquery', 'button2', 'item'], function($, Button2, Item) {
    var InventoryHandler = Class.extend({
        init: function(game) {
            this.game = game;

            this.maxInventoryNumber = 24;
            this.inventory = [];
            this.inventoryCount = [];
            this.inventories = [];
            this.inventoryDisplay = [];
            this.scale = this.getScale();
            
            //this.moreInventoryButton = new Button2('#moreinventorybutton', {background: {left: 196 * this.scale, top: 314 * this.scale, width: 17 * this.scale}, kinds: [0, 2], visible: false});
            this.showInventoryButton();

            this.healingCoolTimeCallback = null;
            
            this.isShowAllInventory = false;

            var i=0;
            var self = this;
            for(i=0; i < 30; i++) {
                $('#inventory' + i).click( function(event) {
                    if(self.game.ready){
                        var inventoryNumber = parseInt(this.id.slice(9));
                        var kind = self.game.inventoryHandler.inventory[inventoryNumber];
                        if(kind) {

                            self.game.menu.clickInventory(inventoryNumber);
                        }
                        /*var item = self.inventoryDisplay[inventoryNumber];
                        var p = self.player;
                        self.game.createBubble('bubble'+item.inv, Item.getInfoMsgEx(
                        	item.inv,
                        	item.num,
                        	item.skillKind,
                        	item.skillLevel));
                        var id = $("#bubble"+item.kind);
                        $(id).css("left",self.game.mouse.x-$(id).width()/2+"px");
                        $(id).css("top",self.game.mouse.y-$(id).height()+"px");*/
                    }
                });

                $('#inventory' + i).attr('draggable',true);
                $('#inventory' + i).draggable = true;
		    $('#inventory' + i).bind('dragstart', function(event) {
		    var inventoryNumber = parseInt(this.id.slice(9));
		    event.originalEvent.dataTransfer.setData("invNumber", inventoryNumber);
		    DragDataInv = {};
		    DragDataInv.invNumber = inventoryNumber;
		    
		});
		
		$('#inventory' + i).bind('touchstart', function(event) {
		    var inventoryNumber = parseInt(this.id.slice(9));
		    DragDataInv = {};
		    DragDataInv.invNumber = inventoryNumber;
		});
		    $('#inventory' + i).bind('touchend', function(event) {
			//event.preventDefault();
			var touch = event.originalEvent.changedTouches[0];
			var elem = document.elementFromPoint(touch.clientX, touch.clientY);
									
			if(elem.id=="toptextcanvas" && DragDataInv && DragDataInv.invNumber >= 0) {
			    self.game.dropItem(DragDataInv.invNumber);
			    DragDataInv.invNumber = null;
			}
		    });		
	
			
                $('#inventory' + i).dblclick(function(event) {
                    if(self.game.ready){
                        var inventoryNumber = parseInt(this.id.slice(9));
                        var inventory = self.game.inventoryHandler.inventory[inventoryNumber];
                        if(inventory) {
                            if(ItemTypes.isConsumableItem(inventory)) {
                                self.game.eat(inventoryNumber);
                            }
                            else
                            {
                            	self.game.equip(inventoryNumber);
                            }
                        }
                    }
                });
                
                

            }

            	this.container = $('#inventorycontainer');
            	var self = this;
            	self.isDragging = false;

            	this.container.bind("touchstart", function(ev) {
                    self.isClicked = true;
    		});
		this.container.mousedown(function() {
		    self.isClicked = true;
		});
		
		this.container.mousemove(function() {
		    self.isDragging = true;
		});
		
		$("#container").mousemove(function() {
		    if (self.isUnlocked && self.isDragging && self.isClicked) {
			    self.moveShortcuts();
		    }			    
		 });
            	$("#container").bind("touchmove", function(ev) {
            	    self.isDragging = true;
		    if (self.isUnlocked && self.isDragging && self.isClicked) {
			    self.game.app.setMouseCoordinates(ev.originalEvent.touches[0]);
		    	    self.moveShortcuts();
		    }			    
    		});

		this.container.mouseup(function(event) {
	            self.isDragging = false;
	            self.isClicked = false;
		});
            	this.container.bind("touchend", function(ev) {
	            self.isDragging = false;
	            self.isClicked = false;
    		});
		
		self.isVertical = true;
		$('#inventorycontainermove').click(function (event) {
		    if (self.isVertical)
		    	$('#inventorycontainer').attr("class","vertical");
		    else
		        $('#inventorycontainer').attr("class","horizontal");
		    self.isVertical = !self.isVertical;
		});
		
		self.isUnlocked = false;
		$('#inventorycontainerswitch').click(function (event) {
		    self.isUnlocked = !self.isUnlocked;
		});		
		
        },

        moveShortcuts: function(x,y) {
	    this.container.css({
		"left":this.game.mouse.x + "px",
		"top":this.game.mouse.y + "px"
	    });        	
        },
                
        showInventoryButton: function() {
        	var scale = this.getScale();
        	//this.moreInventoryButton.setBackground({left: 196 * scale, top: 314 * scale, width: 17 * scale});
        },

        getScale: function () {
            if (this.game.renderer) {
                if (this.game.renderer.mobile) {
                    return 1;
                } else {
                    return this.game.renderer.getScaleFactor();
                }
            } else {
                return 2;
            }
        	
        },
        
        inventoryDisplayShow: function () {
            this.scale = this.getScale();
            this.showInventoryButton();

            for(var i=0; i<this.maxInventoryNumber; i++){

                this.setInventory(this.inventoryDisplay[i].inv,
                	i,
                	this.inventoryDisplay[i].num,
                	this.inventoryDisplay[i].skillkind,
                	this.inventoryDisplay[i].skilllevel);
            }       	
        },

        initInventory: function(maxInventoryNumber, inventory, inventoryNumber, inventorySkillKind, inventorySkillLevel) {
            var i=0;
            this.setMaxInventoryNumber(maxInventoryNumber);
            this.inventoryDisplay = [];
            for(i=0; i<this.maxInventoryNumber; i++){
                var setInvObj = {inv: inventory[i], num: inventoryNumber[i], skillkind: inventorySkillKind[i], skilllevel: inventorySkillLevel[i]}
                this.inventoryDisplay.push(setInvObj);
            }
            this.inventoryDisplayShow();  
        },
        setInventory: function(itemKind, inventoryNumber, number, itemSkillKind, itemSkillLevel) {
            this.inventory[inventoryNumber] = itemKind;
            
            if(number){
                  this.inventoryCount[inventoryNumber] = number;
            } else{
                  this.inventoryCount[inventoryNumber] = 0;
            }

            if(itemKind){
                  if(inventoryNumber >= 0 && inventoryNumber < 6) {

                      $('#inventorybackground' + inventoryNumber).attr('class', 'empty');
                  }
                  var spriteName;
                  if (ItemTypes.KindData[itemKind].spriteName !== "")
                  	  spriteName = ItemTypes.KindData[itemKind].spriteName;
                  else
                  	  spriteName = ItemTypes.getKindAsString(itemKind);
                  	  
                  $('#inventory' + inventoryNumber).css('background-image', "url('img/" + this.scale + "/item-" + spriteName + ".png')");
                  $('#inventory' + inventoryNumber).attr('title', Item.getInfoMsgEx(itemKind, number, itemSkillKind, itemSkillLevel));
                  $('#sellInventory' + inventoryNumber).css('background-image', "url('img/" + this.scale + "/item-" + spriteName + ".png')");
                  if (number > 1) {
                  	  if (ItemTypes.isObject(itemKind) || ItemTypes.isCraft(itemKind))
                  	  	  $('#inventorynumber' + inventoryNumber).html(this.inventoryCount[inventoryNumber]);
                  	  else
                  	  	  $('#inventorynumber' + inventoryNumber).html('+' + this.inventoryCount[inventoryNumber]);
                  }
                          
              
            } 

            this.inventories[inventoryNumber] = {}; 
            this.inventories[inventoryNumber].kind = itemKind ? itemKind : 0;
            this.inventories[inventoryNumber].count = number ? number : 0;
            this.inventories[inventoryNumber].skillKind = itemSkillKind ? itemSkillKind : 0;
            this.inventories[inventoryNumber].skillLevel = itemSkillLevel ? itemSkillLevel : 0;

        },


        setMaxInventoryNumber: function(maxInventoryNumber){
            var i = 0;
            this.maxInventoryNumber = maxInventoryNumber;
            /*for(i=0; i<18; i++){
                $('#inventorybackground' + i).css('display', 'none');
                $('#inventorynumber' + i).css('display', 'none');
            }*/
            for(i=0; i<24; i++){
                $('#inventorybackground' + i).css('display', 'block');
                $('#inventorynumber' + i).css('display', 'block');
            }

        },
        
        makeEmptyInventory: function(inventoryNumber){
            if(inventoryNumber < this.maxInventoryNumber){
                this.inventory[inventoryNumber] = null;
                if(inventoryNumber >= 0 && inventoryNumber < 24) {
                    $('#inventorybackground' + inventoryNumber).attr('class', '');
                }
                $('#inventory' + inventoryNumber).css('background-image', 'none');
                $('#inventory' + inventoryNumber).attr('title', '');
                $('#inventorynumber' + inventoryNumber).html('');
                $('#sellInventory' + inventoryNumber).css('background-image', 'none');

                this.inventories[inventoryNumber] = null;
                this.game.storeDialog.inventoryFrame.inventories[inventoryNumber].clear();
            }
        },
        decInventory: function(invNum){
            var self = this;
                        
            if(this.healingCoolTimeCallback === null){ 
            	var cooltimeName = '#inventory'+invNum+'Cooltime';
		var cooltime = $(cooltimeName);

		// Not very classy but will work for now.
            	cooltime.css('display', 'block');
            	
            	cooltime.html(4);
		setTimeout(function(){
		    cooltime.html(3);
		}, 1000);
		setTimeout(function(){
		    cooltime.html(2);
		}, 2000);
		setTimeout(function(){
		    cooltime.html(1);
		}, 3000);
            	this.healingCoolTimeCallback = setTimeout(function(){
                    cooltime.css('display', 'none');
                    self.healingCoolTimeCallback = null;
                }, 4000);
                this.inventoryCount[invNum] -= 1;
                if(this.inventoryCount[invNum] <= 0){
                    this.inventory[invNum] = null;
                }
                this.inventories[invNum].count -= 1;
                if(this.inventories[invNum].count <= 0) {
                    this.inventories[invNum] = null;
                }
                return true;
            }
            return false;
        },
        
        toggleAllInventory: function () {
        	this.isShowAllInventory = !this.isShowAllInventory;
        	if (this.isShowAllInventory)
        		this.showAllInventory();
        	else
        		this.hideAllInventory();
        },
        
        showAllInventory: function(){
            $('#allinventorywindow').css('display', 'block');
            //this.isShowAllInventory = false;
        },
        hideAllInventory: function(){
            $('#allinventorywindow').css('display', 'none');
            //this.isShowAllInventory = true;
        },
        getItemInventorSlotByKind: function (kind) {
            for(i=0; i<this.maxInventoryNumber; i++){
            	    if (this.inventories[i] && kind == this.inventories[i].kind)
            	    	    return i;
            }
        },

        isInventoryEquipmentFull: function() {
        	for (var i=6; i < this.maxInventoryNumber; ++i)
        	{
        		if (this.inventories[i] == null || this.inventories[i].kind == 0) {
        			return false;
        		}
        	}
        	return true;
        }       
    });
    
    return InventoryHandler;
});
