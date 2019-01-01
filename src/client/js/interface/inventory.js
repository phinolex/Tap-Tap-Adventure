/* global log, Detect, Packets */

define(["jquery", "./container/container"], function($, Container) {
  return Class.extend({
    init(game, size) {
      var self = this;

      this.game = game;
      this.actions = game.interface.actions;

      this.body = $("#inventory");
      this.button = $("#hud-inventory");
      this.action = $("#actionContainer");

      this.container = new Container(size);

      this.activeClass = "inventory";

      this.selectedSlot = null;
      this.selectedItem = null;
    },

    load(data) {
      var self = this,
        list = $("#inventory").find("ul");

      for (var i = 0; i < data.length; i++) {
        var item = data[i];

        this.container.setSlot(i, item);

        var itemSlot = $('<div id="slot' + i + '" class="itemSlot"></div>');

        if (item.string !== "null")
          itemSlot.css(
            "background-image",
            this.container.getImageFormat(this.getScale(), item.string)
          );

        if (this.game.app.isMobile()) itemSlot.css("background-size", "600%");

        itemSlot.dblclick(function(event) {
          this.clickDouble(event);
        });

        itemSlot.click(function(event) {
          this.click(event);
        });

        var itemSlotList = $("<li></li>");

        itemSlotList.append(itemSlot);
        itemSlotList.append(
          '<div id="itemCount' +
            i +
            '" class="itemCount">' +
            (item.count > 1 ? item.count : "") +
            "</div>"
        );

        list.append(itemSlotList);
      }

      this.button.click(function(event) {
        this.game.interface.hideAll();

        if (this.isVisible()) this.hide();
        else this.display();
      });
    },

    click(event) {
      var self = this,
        index = event.currentTarget.id.substring(4),
        slot = this.container.slots[index],
        item = $(this.getList()[index]);

      this.clearSelection();

      if (slot.string === null || slot.count === -1) return;

      this.actions.reset();
      this.actions.loadDefaults("inventory");

      if (slot.edible)
        this.actions.add($('<div id="eat" class="actionButton">Eat</div>'));
      else if (slot.equippable)
        this.actions.add($('<div id="wield" class="actionButton">Wield</div>'));

      if (!this.actions.isVisible()) this.actions.show();

      var sSlot = item.find("#slot" + index);

      sSlot.addClass("select");

      this.selectedSlot = sSlot;
      this.selectedItem = slot;

      this.actions.hideDrop();
    },

    clickDouble(event) {
      var self = this,
        index = event.currentTarget.id.substring(4),
        slot = this.container.slots[index];

      if (!slot.edible && !slot.equippable) return;

      var item = $(this.getList()[index]),
        sSlot = item.find("#slot" + index);

      this.clearSelection();

      this.selectedSlot = sSlot;
      this.selectedItem = slot;

      this.clickAction(slot.edible ? "eat" : "wield");

      this.actions.hideDrop();
    },

    clickAction(event, dAction) {
      var self = this,
        action = event.currentTarget ? event.currentTarget.id : event;

      if (!this.selectedSlot || !this.selectedItem) return;

      switch (action) {
        case "eat":
        case "wield":
          this.game.socket.send(Packets.Inventory, [
            Packets.InventoryOpcode.Select,
            this.selectedItem.index
          ]);
          this.clearSelection();

          break;

        case "drop":
          var item = this.selectedItem;

          if (item.count > 1) this.actions.displayDrop("inventory");
          else {
            this.game.socket.send(Packets.Inventory, [
              Packets.InventoryOpcode.Remove,
              item
            ]);
            this.clearSelection();
          }

          break;

        case "dropAccept":
          var count = $("#dropCount").val();

          if (isNaN(count) || count < 1) return;

          this.game.socket.send(Packets.Inventory, [
            Packets.InventoryOpcode.Remove,
            this.selectedItem,
            count
          ]);
          this.actions.hideDrop();
          this.clearSelection();

          break;

        case "dropCancel":
          this.actions.hideDrop();
          this.clearSelection();

          break;
      }

      this.actions.hide();
    },

    add(info) {
      var self = this,
        item = $(this.getList()[info.index]),
        slot = this.container.slots[info.index];

      if (!item || !slot) return;

      if (slot.isEmpty())
        slot.load(
          info.string,
          info.count,
          info.ability,
          info.abilityLevel,
          info.edible,
          info.equippable
        );

      slot.setCount(info.count);

      var cssSlot = item.find("#slot" + info.index);

      cssSlot.css(
        "background-image",
        this.container.getImageFormat(this.getScale(), slot.string)
      );

      if (this.game.app.isMobile()) cssSlot.css("background-size", "600%");

      item
        .find("#itemCount" + info.index)
        .text(slot.count > 1 ? slot.count : "");
    },

    remove(info) {
      var self = this,
        item = $(this.getList()[info.index]),
        slot = this.container.slots[info.index];

      if (!item || !slot) return;

      slot.count -= info.count;

      item.find("#itemCount" + info.index).text(slot.count);

      if (slot.count < 1) {
        item.find("#slot" + info.index).css("background-image", "");
        item.find("#itemCount" + info.index).text("");
        slot.empty();
      }
    },

    resize() {
      var self = this,
        list = this.getList();

      for (var i = 0; i < list.length; i++) {
        var item = $(list[i]).find("#slot" + i),
          slot = this.container.slots[i];

        if (!slot) continue;

        if (this.game.app.isMobile()) item.css("background-size", "600%");
        else
          item.css(
            "background-image",
            this.container.getImageFormat(this.getScale(), slot.string)
          );
      }
    },

    clearSelection() {
      var self = this;

      if (!this.selectedSlot) return;

      this.selectedSlot.removeClass("select");
      this.selectedSlot = null;
      this.selectedItem = null;
    },

    display() {
      var self = this;

      this.body.fadeIn("fast");
      this.button.addClass("active");
    },

    hide() {
      var self = this;

      this.button.removeClass("active");

      this.body.fadeOut("slow");
      this.button.removeClass("active");
      this.clearSelection();
    },

    getScale() {
      return this.game.renderer.getDrawingScale();
    },

    getSize() {
      return this.container.size;
    },

    getList() {
      return $("#inventory")
        .find("ul")
        .find("li");
    },

    isVisible() {
      return this.body.css("display") === "block";
    }
  });
});
