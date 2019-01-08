import Items from '../../../../../util/items';

export default class Slot {
  constructor(index) {
    this.index = index;
    this.id = -1;
    this.count = -1;
    this.ability = -1;
    this.abilityLevel = -1;
    this.string = null;
  }

  load(id, count, ability, abilityLevel) {
    this.id = parseInt(id, 10);
    this.count = parseInt(count, 10);
    this.ability = parseInt(ability, 10);
    this.abilityLevel = parseInt(abilityLevel, 10);

    this.string = Items.idToString(this.id);
    this.edible = Items.isEdible(this.id);
    this.equippable = Items.isEquippable(this.string);

    this.verify();
  }

  empty() {
    this.id = -1;
    this.count = -1;
    this.ability = -1;
    this.abilityLevel = -1;
    this.string = null;
  }

  increment(amount) {
    this.count += parseInt(amount, 10);
    this.verify();
  }

  decrement(amount) {
    this.count -= parseInt(amount, 10);
    this.verify();
  }

  verify() {
    if (isNaN(this.count)) {
      this.count = 1;
    }
  }

  getData() {
    return {
      index: this.index,
      string: this.string,
      count: this.count,
      ability: this.ability,
      abilityLevel: this.abilityLevel,
    };
  }
}
