import Equipment from './equipment';
import Items from '../../../../../util/items';

export default class Ring extends Equipment {
  constructor(name, id, count, ability, abilityLevel) {
    super(name, id, count, ability, abilityLevel);
    this.ringLevel = Items.getRingLevel(name);
  }

  getBaseAmplifier() {
    return 1.0 + this.ringLevel / 150;
  }
}
