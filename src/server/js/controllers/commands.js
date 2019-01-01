/* global log */

var cls = require("../lib/class"),
  Messages = require("../network/messages"),
  Packets = require("../network/packets"),
  _ = require("underscore");

module.exports = Commands = cls.Class.extend({
  constructor(player) {
    

    this.world = player.world;
    this.player = player;
  },

  parse(rawText) {
    var self = this,
      blocks = rawText.substring(1).split(" ");

    if (blocks.length < 1) return;

    var command = blocks.shift();

    this.handlePlayerCommands(command, blocks);

    if (this.player.rights > 0) this.handleModeratorCommands(command, blocks);

    if (this.player.rights > 1) this.handleAdminCommands(command, blocks);
  },

  handlePlayerCommands(command, blocks) {
    

    switch (command) {
      case "players":
        this.player.send(
          new Messages.Notification(
            Packets.NotificationOpcode.Text,
            "There are currently " + this.world.getPopulation() + " online."
          )
        );

        break;

      case "tutstage":
        console.log("tutorial stage", this.player.getTutorial());
        log.info(this.player.getTutorial().stage);
        break;

      case "coords":
        this.player.send(
          new Messages.Notification(
            Packets.NotificationOpcode.Text,
            "x: " + this.player.x + " y: " + this.player.y
          )
        );

        break;

      case "progress":
        var tutorialQuest = this.player.getTutorial();

        this.player.send(
          new Messages.Quest(Packets.QuestOpcode.Progress, {
            id: tutorialQuest.id,
            stage: tutorialQuest.stage
          })
        );

        break;

      case "global":
        this.world.pushBroadcast(
          new Messages.Chat({
            name: this.player.username,
            text: blocks.join(" "),
            isGlobal: true,
            withBubble: false,
            colour: "rgba(191, 191, 63, 1.0)"
          })
        );

        break;
    }
  },

  handleModeratorCommands(command, blocks) {
    

    switch (command) {
      case "mute":
      case "ban":
        var duration = blocks.shift(),
          targetName = blocks.join(" "),
          user = this.world.getPlayerByName(targetName);

        if (!user) return;

        if (!duration) duration = 24;

        var timeFrame = new Date().getTime() + duration * 60 * 60;

        if (command === "mute") user.mute = timeFrame;
        else if (command === "ban") {
          user.ban = timeFrame;
          user.save();

          user.sendUTF8("ban");
          user.connection.close("banned");
        }

        user.save();

        break;

      case "unmute":
        var uTargetName = blocks.join(" "),
          uUser = this.world.getPlayerByName(uTargetName);

        if (!uTargetName) return;

        uUser.mute = new Date().getTime() - 3600;

        uUser.save();

        break;
    }
  },

  handleAdminCommands(command, blocks) {
    

    switch (command) {
      case "spawn":
        var spawnId = parseInt(blocks.shift()),
          count = parseInt(blocks.shift()),
          ability = parseInt(blocks.shift()),
          abilityLevel = parseInt(blocks.shift());

        if (!spawnId || !count) return;

        this.player.inventory.add({
          id: spawnId,
          count: count,
          ability: ability ? ability : -1,
          abilityLevel: abilityLevel ? abilityLevel : -1
        });

        return;

      case "maxhealth":
        this.player.notify(
          "Max health is " + this.player.hitPoints.getMaxHitPoints()
        );

        break;

      case "ipban":
        return;

      case "drop":
        var id = parseInt(blocks.shift()),
          dCount = parseInt(blocks.shift());

        if (!id) return;

        if (!dCount) dCount = 1;

        this.world.dropItem(id, dCount, this.player.x, this.player.y);

        return;

      case "ghost":
        this.player.equip("ghost", 1, -1, -1);

        return;

      case "notify":
        this.player.notify("Hello!!!");

        break;

      case "teleport":
        var x = parseInt(blocks.shift()),
          y = parseInt(blocks.shift());

        if (x && y) this.player.teleport(x, y);

        break;

      case "teletome":
        var username = blocks.join(" "),
          player = this.world.getPlayerByName(username);

        if (player) player.teleport(this.player.x, this.player.y);

        break;

      case "nohit":
        log.info("invincinil");

        this.player.invincible = !this.player.invincible;

        break;

      case "mob":
        var npcId = parseInt(blocks.shift());

        this.world.spawnMob(npcId, this.player.x, this.player.y);

        break;

      case "pointer":
        var posX = parseInt(blocks.shift()),
          posY = parseInt(blocks.shift());

        if (!posX || !posY) return;

        this.player.send(
          new Messages.Pointer(Packets.PointerOpcode.Location, {
            id: this.player.instance,
            x: posX,
            y: posY
          })
        );

        break;

      case "teleall":
        _.each(this.world.players, function(player) {
          player.teleport(this.player.x, this.player.y);
        });

        break;

      case "attackaoe":
        var radius = parseInt(blocks.shift());

        if (!radius) radius = 1;

        this.player.combat.dealAoE(radius);

        break;

      case "addexp":
        var exp = parseInt(blocks.shift());

        if (!exp) return;

        this.player.addExperience(exp);

        break;
    }
  }
});
