import Equipment from './equipment';
import Items from '../../../../../util/items';

export default class Boots extends Equipment {
  constructor(name, id, count, ability, abilityLevel) {
    super(name, id, count, ability, abilityLevel);
    this.bootsLevel = Items.getBootsLevel(name);
  }

  getBaseAmplifier() {
    return 1.0 + this.bootsLevel / 200;
  }
}
