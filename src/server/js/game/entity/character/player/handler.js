/* global log */

var cls = require("../../../../lib/class"),
  _ = require("underscore"),
  Messages = require("../../../../network/messages"),
  Packets = require("../../../../network/packets"),
  Npcs = require("../../../../util/npcs"),
  Formulas = require("../../../formulas"),
  Modules = require("../../../../util/modules");

module.exports = Handler = cls.Class.extend({
  constructor(player) {
    

    this.player = player;
    this.world = player.world;

    this.load();
  },

  load() {
    

    this.player.onMovement(function(x, y) {
      this.player.checkGroups();

      this.detectAggro();
      this.detectPVP(x, y);
      this.detectMusic(x, y);
    });

    this.player.onDeath(function() {});

    this.player.onHit(function(attacker, damage) {
      /**
       * Handles actions whenever the player
       * instance is hit by 'damage' amount
       */

      if (this.player.combat.isRetaliating())
        this.player.combat.begin(attacker);
    });

    this.player.onKill(function(character) {
      if (this.player.quests.isAchievementMob(character)) {
        var achievement = this.player.quests.getAchievementByMob(character);

        if (achievement && achievement.isStarted())
          this.player.quests.getAchievementByMob(character).step();
      }
    });

    this.player.onGroup(function() {
      this.world.handleEntityGroup(this.player);
      this.world.pushEntities(this.player);
    });

    this.player.connection.onClose(function() {
      this.player.stopHealing();

      this.world.removePlayer(this.player);
    });

    this.player.onTalkToNPC(function(npc) {
      if (this.player.quests.isQuestNPC(npc)) {
        this.player.quests.getQuestByNPC(npc).triggerTalk(npc);

        return;
      }

      if (this.player.quests.isAchievementNPC(npc)) {
        this.player.quests.getAchievementByNPC(npc).converse(npc);

        return;
      }

      switch (Npcs.getType(npc.id)) {
        case "banker":
          this.player.send(new Messages.NPC(Packets.NPCOpcode.Bank, {}));
          return;

        case "echanter":
          this.player.send(new Messages.NPC(Packets.NPCOpcode.Enchant, {}));
          break;
      }

      var text = Npcs.getText(npc.id);

      if (!text) return;

      npc.talk(text);

      this.player.send(
        new Messages.NPC(Packets.NPCOpcode.Talk, {
          id: npc.instance,
          text: text
        })
      );
    });
  },

  detectAggro() {
    var self = this,
      group = this.world.groups[this.player.group];

    if (!group) return;

    _.each(group.entities, function(entity) {
      if (entity && entity.type === "mob") {
        var aggro = entity.canAggro(this.player);

        if (aggro) entity.combat.begin(this.player);
      }
    });
  },

  detectMusic(x, y) {
    var self = this,
      musicArea = _.find(this.world.getMusicAreas(), function(area) {
        return area.contains(x, y);
      }),
      a2;

    if (musicArea && this.player.currentSong !== musicArea.id)
      this.player.updateMusic(musicArea.id);
  },

  detectPVP(x, y) {
    var self = this,
      pvpArea = _.find(this.world.getPVPAreas(), function(area) {
        return area.contains(x, y);
      });

    this.player.updatePVP(!!pvpArea);
  }
});
