import Equipment from './equipment';
import Items from '../../../../../util/items';

export default class Weapon extends Equipment {
  constructor(name, id, count, ability, abilityLevel) {
    super(name, id, count, ability, abilityLevel);
    this.level = Items.getWeaponLevel(name);
    this.ranged = Items.isArcherWeapon(name);
    this.breakable = false;
  }

  hasCritical() {
    return this.ability === 1;
  }

  hasExplosive() {
    return this.ability === 4;
  }

  hasStun() {
    return this.ability === 5;
  }

  isRanged() {
    return this.ranged;
  }

  setLevel(level) {
    this.level = level;
  }

  getLevel() {
    return this.level;
  }
}
