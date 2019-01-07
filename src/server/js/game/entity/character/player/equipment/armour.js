import Equipment from './equipment';
import Items from '../../../../../util/items';

export default class Armour extends Equipment {
  constructor(name, id, count, ability, abilityLevel) {
    super(name, id, count, ability, abilityLevel);
    this.defense = Items.getArmourLevel(name);
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
