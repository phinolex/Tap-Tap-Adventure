define(["jquery"], function($) {
  return Class.extend({
    init(game, intrface) {
      var self = this;

      this.game = game;
      this.interface = intrface;

      this.body = $("#enchant");
      this.container = $("#enchantContainer");
      this.enchantSlots = $("#enchantInventorySlots");

      this.selectedItem = $("#enchantSelectedItem");
      this.selectedShards = $("#enchantShards");
      this.confirm = $("#confirmEnchant");
      this.shardsCount = $("#shardsCount");

      this.confirm.css({
        left: "70%",
        top: "80%"
      });

      $("#closeEnchant").click(function() {
        this.hide();
      });

      this.confirm.click(function() {
        this.enchant();
      });
    },

    add(type, index) {
      var self = this,
        image = this.getSlot(index).find("#inventoryImage" + index);

      switch (type) {
        case "item":
          this.selectedItem.css(
            "background-image",
            image.css("background-image")
          );

          break;

        case "shards":
          this.selectedShards.css(
            "background-image",
            image.css("background-image")
          );

          var count = this.getItemSlot(index).count;

          if (count > 1) this.shardsCount.text(count);

          break;
      }

      image.css("background-image", "");

      self
        .getSlot(index)
        .find("#inventoryItemCount" + index)
        .text("");
    },

    moveBack(type, index) {
      var self = this,
        image = this.getSlot(index).find("#inventoryImage" + index),
        itemCount = this.getSlot(index).find("#inventoryItemCount" + index),
        count = this.getItemSlot(index).count;

      switch (type) {
        case "item":
          image.css(
            "background-image",
            this.selectedItem.css("background-image")
          );

          if (count > 1) itemCount.text(count);

          this.selectedItem.css("background-image", "");

          break;

        case "shards":
          image.css(
            "background-image",
            this.selectedShards.css("background-image")
          );

          if (count > 1) itemCount.text(count);

          this.selectedShards.css("background-image", "");

          this.shardsCount.text("");

          break;
      }
    },

    load() {
      var self = this,
        list = this.getSlots(),
        inventoryList = this.interface.bank.getInventoryList();

      list.empty();

      for (var i = 0; i < this.getInventorySize(); i++) {
        var item = $(inventoryList[i]).clone(),
          slot = item.find("#bankInventorySlot" + i);

        slot.click(function(event) {
          this.select(event);
        });

        list.append(item);
      }

      this.selectedItem.click(function() {
        this.remove("item");
      });

      this.selectedShards.click(function() {
        this.remove("shards");
      });
    },

    enchant() {
      this.game.socket.send(Packets.Enchant, [Packets.EnchantOpcode.Enchant]);
    },

    select(event) {
      this.game.socket.send(Packets.Enchant, [
        Packets.EnchantOpcode.Select,
        event.currentTarget.id.substring(17)
      ]);
    },

    remove(type) {
      this.game.socket.send(Packets.Enchant, [
        Packets.EnchantOpcode.Remove,
        type
      ]);
    },

    getInventorySize() {
      return this.interface.inventory.getSize();
    },

    getItemSlot(index) {
      return this.interface.inventory.container.slots[index];
    },

    display() {
      var self = this;

      this.body.fadeIn("fast");
      this.load();
    },

    hide() {
      var self = this;

      this.selectedItem.css("background-image", "");
      this.selectedShards.css("background-image", "");

      this.body.fadeOut("fast");
    },

    hasImage(image) {
      return image.css("background-image") !== "none";
    },

    getSlot(index) {
      return $(this.getSlots().find("li")[index]);
    },

    getSlots() {
      return this.enchantSlots.find("ul");
    },

    isVisible() {
      return this.body.css("display") === "block";
    }
  });
});
