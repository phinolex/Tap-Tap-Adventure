/**
 * The children of these classes are responsible for
 * clear and concise ways of organizing stats of weapons
 * in the client side. This does not dictate the damage,
 * defense or bonus stats, it's just for looks.
 */

export default class Equipment {
  constructor(name, count, ability, abilityLevel) {
    this.name = name;
    this.count = count;
    this.ability = ability;
    this.abilityLevel = abilityLevel;
  }

  exists() {
    return this.name !== null && this.name !== 'null';
  }

  getName() {
    return this.name;
  }

  getCount() {
    return this.count;
  }

  getAbility() {
    return this.ability;
  }

  getAbilityLevel() {
    return this.abilityLevel;
  }

  update(name, count, ability, abilityLevel) {
    this.name = name;
    this.count = count;
    this.ability = ability;
    this.abilityLevel = abilityLevel;
  }
}
