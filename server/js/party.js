
var cls = require("./lib/class");
var MobData = require("./mobdata.js");
var Messages = require("./message.js");

module.exports = Party = Class.extend({
  init: function(player1, player2){
    this.players = [player1, player2];
    if(player1.party){ player1.party.removePlayer(player1); }
    if(player2.party){ player2.party.removePlayer(player2); }
    player1.party = this;
    player2.party = this;
    this.leader = player1;
    this.sendMembersName();
  },
  
  addPlayer: function(player){
    if(player){
      this.players.push(player);
      if(player.party){
        player.party.removePlayer(player);
      }
      player.party = this;
    }
    this.sendMembersName();
  },
  
  removePlayer: function(player){
    var i=0;
    if (player == this.leader)
    	    this.leader = this.players[0];
    if(player){
      for(i=0; i<this.players.length; i++){
        if(player === this.players[i]){
          this.players[i].send([Types.Messages.PARTY]);
          this.players[i].party = null;
          this.players.splice(i, 1);
          this.sendMembersName();
          break;
        }
      }
    }   
  },

  sendMembersName: function(){
    var i=0;
    var msg = [Types.Messages.PARTY];
    
    var players = this.players;

    if(players.length > 1){
      msg.push(this.leader.name)
      for(i=0; i<players.length; i++){
        if (players[i] !== this.leader)
            msg.push(players[i].name);
      }
    }
    //log.info("msg="+JSON.stringify(msg));
    for(i=0; i<players.length; i++){
       players[i].server.pushToPlayer(players[i], new Messages.Party(msg));
    }
  },

  sumTotalLevel: function(){
    var i=0;
    var sum=0;
    for(i=0; i<this.players.length; i++){
      sum += this.players[i].level;
    }
    return sum+1;
  },
  incExp: function(mob, logHandler){
    var i=0;
    var totalLevel = this.sumTotalLevel();
    var exp = MobData.Kinds[mob.kind].xp * ((10 + this.players.length) / 10);
    for(i=0; i<this.players.length; i++){
      var player = this.players[i],
          exp1 = Math.ceil(exp * (player.level+1) / totalLevel);

      player.incExp(exp1);
      //logHandler.addExpLog(player, 'kill', mob, exp1);
      //log.info("exp1=" + exp1);
      player.server.pushToPlayer(player, new Messages.Kill(mob, player.level, exp1));
    }
  },
  getHighestLevel: function(){
    var i=0;
    var highestLevel = 0;
    for(i=0; i<this.players.length; i++){
      if(highestLevel < this.players[i].level){
        highestLevel = this.players[i].level;
      }
    }
    return highestLevel;
  },
  getLowestLevel: function(){
    var i=0;
    var lowestLevel = 999;
    for(i=0; i<this.players.length; i++){
      if(lowestLevel > this.players[i].level){
        lowestLevel = this.players[i].level;
      }
    }
    return lowestLevel;
  }
});
