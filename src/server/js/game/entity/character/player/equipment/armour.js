import Equipment from './equipment';
import ItemsDictionary from '../../../../../util/items';

export default class Armour extends Equipment {
  constructor(name, id, count, ability, abilityLevel) {
    super(name, id, count, ability, abilityLevel);
    this.itemsDictionary = new ItemsDictionary();
    this.defense = this.itemsDictionary.getArmourLevel(name);
  }

  hasAntiStun() {
    return this.ability === 6;
  }

  setDefense(defense) {
    this.defense = defense;
  }

  getDefense() {
    return this.defense;
  }
}
