import Equipment from './equipment';
import Items from '../../../../../util/items';

export default class Pendant extends Equipment {
  constructor(name, id, count, ability, abilityLevel) {
    super(name, id, count, ability, abilityLevel);
    this.pendantLevel = Items.getPendantLevel(name);
  }

  getBaseAmplifier() {
    return 1.0 + this.pendantLevel / 100;
  }
}
