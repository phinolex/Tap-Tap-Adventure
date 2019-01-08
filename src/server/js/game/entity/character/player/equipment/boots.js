import Equipment from './equipment';
import ItemsDictionary from '../../../../../util/items';

export default class Boots extends Equipment {
  constructor(name, id, count, ability, abilityLevel) {
    super(name, id, count, ability, abilityLevel);
    this.itemsDictionary = new ItemsDictionary();
    this.bootsLevel = this.itemsDictionary.getBootsLevel(name);
  }

  getBaseAmplifier() {
    return 1.0 + this.bootsLevel / 200;
  }
}
