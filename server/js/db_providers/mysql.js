/* global module, log */

var cls = require("./lib/class"),
    Player = require("./player"),
    mysql = require("mysql"),
    Messages = require("../message"),
    bcrypt = require("bcrypt"),
    inventory = require("../inventory"),
    Utils = require('../utils');
    
    
  module.exports = Mysql = cls.Class.extend({
        init: function() {
            var mysqlConfigurations = {
                host: "127.0.0.1",
                user: "root",
                password: "PASSHERE",
                database: "tta_database",
                charset: "utf8"
            };
            this.client = mysql.createConfiguartion(mysqlConfigurations);
        },
        
        loadPlayer: function(player) {
            var self = this;
            var curTime = new Date().getTime();
            this.client.query('select * from log where user="' + player.name + '";', function(err, results){
            if(err){
                log.debug(err);
                return;
            }
            callback(results);
          });
        }
      
  });
