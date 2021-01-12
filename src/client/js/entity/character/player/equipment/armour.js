import Equipment from './equipment';

export default class Armour extends Equipment {
  constructor(name, count, ability, abilityLevel) {
    super(name, count, ability, abilityLevel);

    this.defence = -1;
    this.name = 'clotharmor';
  }

  setDefence(defence) {
    this.defence = defence;
  }

  getDefence() {
    return this.defence;
  }
}
