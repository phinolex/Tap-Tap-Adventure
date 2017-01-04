/*
 * Copyright - Flavius Poenaru (c)
 * April 26 - 2015
 */
 
 /* global Variations */
 var cls = require("./../lib/class");
 
 module.exports = Variations = cls.Class.extend({
    init: function() {    
        this.expMultiplier = 1;
        this.doubleEXP = false;
        this.serverVersion = 1;
    }
 });