define(['jquery'], function() {
    var Menu = Class.extend({
   
        init: function(){

            this.selectedInventory = null;
            this.selectedEquipped = null;
        },
        clickInventory: function(number){

            this.selectedInventory = number;
        },
        
        clickEquipped: function(number){

            this.selectedEquipped = number;
        },
        
        isClickedInventoryMenu: function(pos, camera){
            if(pos.x === camera.gridX + 11 || pos.x === camera.gridX + 12 || pos.x === camera.gridX + 13){
                if(pos.y === camera.gridY + camera.gridH - 3){

                    return 1;
                } else if(pos.y === camera.gridY + camera.gridH - 4){

                    return 2;
                } else if(pos.y === camera.gridY + camera.gridH - 5){

                    return 3;
                } else if(pos.y === camera.gridY + camera.gridH - 6){

                    return 4;
                    
                } else {

                    return 0;
                }
            } else {

                return 0;
            }
        },
        close: function() {
            this.selectedInventory = null;
            this.selectedEquipped = null;
        }
    });
    return Menu;
});