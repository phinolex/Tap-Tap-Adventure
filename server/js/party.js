
var cls = require("./lib/class");

module.exports = Party = Class.extend({
  init: function(player1, player2){
    this.players = [player1, player2];
    if(player1.party){ player1.party.removePlayer(player1); }
    if(player2.party){ player2.party.removePlayer(player2); }
    player1.party = this;
    player2.party = this;
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

    if(this.players.length > 1){
      for(i=0; i<this.players.length; i++){
        msg.push(this.players[i].name);
      }
    }
    for(i=0; i<this.players.length; i++){
      this.players[i].send(msg);
    }
  },
  sumTotalLevel: function(){
    var i=0;
    var sum=0;
    for(i=0; i<this.players.length; i++){
      sum += this.players[i].level;
    }
    return sum;
  },
  incExp: function(mob, logHandler){
    var i=0;
    var totalLevel = this.sumTotalLevel();
    var exp = Types.getMobExp(mob.kind) * 1.1;
    for(i=0; i<this.players.length; i++){
      var player = this.players[i],
          exp1 = exp * player.level / totalLevel;

      if(player.pendantSkillKind == Types.Skills.ADDEXPERIENCE) {
        exp1 = Math.floor(exp1 + (exp1 * (player.pendantSkillLevel * 0.005)));
      } else{
        exp1 = Math.floor(exp1);
      }
      player.incExp(exp1);
      logHandler.addExpLog(player, 'kill', mob, exp1);
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
