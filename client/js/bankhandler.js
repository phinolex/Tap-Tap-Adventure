/* global Types, Class */

define([], function() {
    var BankHandler = Class.extend({
        init: function(game) {
            this.game = game;
            this.maxBankNumber = 18;
            this.banks = [];
        },
        
        initBank: function(maxBankNumber, bankKind, bankNumber, bankSkillKind, bankSkillLevel) {
            this.maxBankNumber = maxBankNumber;
            for(var i=0; i < this.maxBankNumber; i++){                
		    this.banks[i] = {}; 
		    this.banks[i].kind = bankKind[i] ? bankKind[i] : 0;
		    this.banks[i].count = bankNumber[i] ? bankNumber[i] : 0;
		    this.banks[i].skillKind = bankSkillKind[i] ? bankSkillKind[i] : 0;
		    this.banks[i].skillLevel = bankSkillLevel[i] ? bankSkillLevel[i] : 0;                
            }
            //log.info("bank="+JSON.stringify(this.banks));
        },
        
        setBank: function(index, bankKind, bankNumber, bankSkillKind, bankSkillLevel) {                
	    this.banks[index].kind = bankKind ? bankKind : 0 ;
	    this.banks[index].count = bankNumber ? bankNumber : 0;
	    this.banks[index].skillKind = bankSkillKind ? bankSkillKind : 0;
	    this.banks[index].skillLevel = bankSkillLevel ? bankSkillLevel : 0;  
        },


        isBankFull: function() {
        	for (var i=0; i < this.maxBankNumber; i++)
        	{
        		if (this.banks[i].kind == 0)
        			return false;
        	}
        	return true;
        },
        
    });
    
    return BankHandler;
});

