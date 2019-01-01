import Equipment from './equipment';

export default class Armour extends Equipment {
  constructor(name, string, count, ability, abilityLevel) {
    super(name, string, count, ability, abilityLevel);

    this.defence = -1;
  }

  setDefence(defence) {
    this.defence = defence;
  }

  getDefence() {
    return this.defence;
  }

  update(name, string, count, ability, abilityLevel) {
    this.super(name, string, count, ability, abilityLevel);
  }
}
