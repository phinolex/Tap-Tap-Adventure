import Equipment from './equipment';
import ItemsDictionary from '../../../../../util/items';

export default class Pendant extends Equipment {
  constructor(name, id, count, ability, abilityLevel) {
    super(name, id, count, ability, abilityLevel);
    this.itemsDictionary = new ItemsDictionary();
    this.pendantLevel = this.itemsDictionary.getPendantLevel(name);
  }

  getBaseAmplifier() {
    return 1.0 + this.pendantLevel / 100;
  }
}
