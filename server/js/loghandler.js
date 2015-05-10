/* global log, module */

var cls = require("./lib/class"),
    Player = require("./player"),
    mysql = require("mysql");

module.exports = LogHandler = cls.Class.extend({
  init: function(){
    var mysqlConfig = {
      host: "localhost",
      user: "root",
      password: "",
      database: "bbo",
      charset: "utf8",
    };

    this.client = mysql.createConnection(mysqlConfig);
  },
  getLog: function(name, kind, action, time, callback){
    this.client.query('select * from log where user="' + name + '" and '
                    + ' kind="' + kind + '" and '
                    + ' action="' + action + '" and '
                    + ' date(time) = date("' + time + '") and '
                    + ' time(time) <= time(addtime("' + time + '", "0:10:00")) and '
                    + ' time(time) >= time("' + time + '");', function(err, results){
      if(err){
        log.debug(err);
        return;
      }
      callback(results);
    });
  },
  addItemLog: function(player, action, item){
    this.client.query('insert into log (user, kind, action, content) values('
                    + '"' + player.name + '",'
                    + '"item",'
                    + '"' + action + '",'
                    + '"' + (item ? item.toString() + '/': '') + player.inventory.toString() + '");');
  },
  addExpLog: function(player, action, mob, incExp){
    this.client.query('insert into log (user, kind, action, content) values('
                    + '"' + player.name + '",'
                    + '"exp",'
                    + '"' + action + '",'
                    + '"+' + incExp + " " + player.experience + " " + (mob ? mob.toString() : '')+ '");');
  },
  addChatLog: function(player, action, msg){
    this.client.query('insert into log (user, kind, action, content) values('
                    + '"' + player.name + '",'
                    + '"chat",'
                    + '"' + action + '",'
                    + '"' + msg + '");');
  },
  addLoginLog: function(player){
    this.client.query('insert into log (user, kind, action, content) values('
                    + '"' + player.name + '",'
                    + '"login",'
                    + '"login",'
                    + '"' + Types.getKindAsString(player.weapon) + "+" + player.weaponEnchantedPoint + " " + Types.getItemSkillNameByKind(player.weaponSkillKind) + "+" + player.weaponSkillLevel + "/"
                    + Types.getKindAsString(player.ring) + " " + Types.getItemSkillNameByKind(player.ringSkillKind) + "+" + player.ringSkillLevel + "/"
                    + Types.getKindAsString(player.pendant) + " " + Types.getItemSkillNameByKind(player.pendantSkillKind) + "+" + player.pendantSkillLevel + "/"
                    + Types.getKindAsString(player.armor)
                    + "/" + player.inventory.toString() + '");');
  },
  getAdLog: function(name, callback){
    this.client.query('select * from log where user="' + name + '" and '
                    + ' kind="ad";', function(err, results){
      if(err){
        log.debug(err);
        return;
      }
      callback(results);
    });

  },
  addAdLog: function(name, ref, action, children){
    this.client.query('insert into log (user, kind, action, content) values('
                    + '"' + name + '",'
                    + '"ad",'
                    + '"' + action + '",'
                    + '"' + ref + " / " + children.toString() + '");');
  },
});
