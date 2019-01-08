import Equipment from './equipment';
import ItemsDictionary from '../../../../../util/items';

export default class Ring extends Equipment {
  constructor(name, id, count, ability, abilityLevel) {
    super(name, id, count, ability, abilityLevel);
    this.itemsDictionary = new ItemsDictionary();
    this.ringLevel = this.itemsDictionary.getRingLevel(name);
  }

  getBaseAmplifier() {
    return 1.0 + this.ringLevel / 150;
  }
}
