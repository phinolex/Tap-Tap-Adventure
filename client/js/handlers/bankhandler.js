/* global Types, Class */

define([], function() {
    var BankHandler = Class.extend({
        
        init: function(game) {
            var self = this;
            
            self.game = game;
            self.bankSize = 18;
            self.items = [];
        },
        
        loadBank: function(bankSize, kind, number, skillKind, skillLevel) {
            var self = this;
            
            for (var i = 0; i < self.bankSize; i++) {
                var item = self.items[i];
                
                item = {};
                item.kind = kind[i] ? kind[i] : 0;
                item.count = number[i] ? number[i] : 0;
                item.skillKind = skillKind[i] ? skillKind[i] : 0;
                item.skillLevel = skillLevel[i] ? skillLevel[i] : 0;
            }
        },
        
        setBank: function(index, kind, number, skillKind, skillLevel) {
            var self = this,
                item = self.items[index];
            
            item.kind = kind ? kind : 0;
            item.count = number ? number : 0;
            item.skillKind = skillKind ? skillKind : 0;
            item.skillLevel = skillLevel ? skillLevel : 0;
        },
        
        isBankFull: function() {
            var self = this;
            
            for (var i = 0; i < self.bankSize; i++)
                if (self.items[i].kind == 0)
                    return false;
            
            return true;
        }
        
        /*
       

        isBankFull: function() {
        	for (var i=0; i < this.maxBankNumber; i++)
        	{
        		if (this.banks[i].kind == 0)
        			return false;
        	}
        	return true;
        },
        */
    });
    
    return BankHandler;
});

