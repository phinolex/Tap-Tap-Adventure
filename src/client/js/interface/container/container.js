define(["./slot"], function(Slot) {
  return Class.extend({
    constructor(size) {
      

      this.size = size;

      this.slots = [];

      for (var i = 0; i < this.size; i++) this.slots.push(new Slot(i));
    },

    setSlot(index, info) {
      

      /**
       * We receive information from the server here,
       * so we mustn't do any calculations. Instead,
       * we just modify the container directly.
       */

      this.slots[index].load(
        info.string,
        info.count,
        info.ability,
        info.abilityLevel,
        info.edible,
        info.equippable
      );
    },

    getEmptySlot() {
      

      for (var i = 0; i < this.slots; i++) if (!this.slots[i].string) return i;

      return -1;
    },

    getImageFormat(scale, name) {
      return 'url("img/' + scale + "/item-" + name + '.png")';
    }
  });
});
