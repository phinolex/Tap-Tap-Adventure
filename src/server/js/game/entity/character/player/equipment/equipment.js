import Items from '../../../../../util/items';

/**
 * Count represents the enchantment level of
 * the equipment child
 */
export default class Equipment {
  constructor(name, id, count, ability, abilityLevel) {
    this.name = name;
    this.id = id;
    this.count = count || 0;
    this.ability = ability || 0;
    this.abilityLevel = abilityLevel || 0;
  }

  getName() {
    return this.name;
  }

  getId() {
    return this.id;
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

  getBaseAmplifier() {
    return 1.0;
  }

  getData() {
    return [
      Items.idToName(this.id),
      Items.idToString(this.id),
      this.count,
      this.ability,
      this.abilityLevel,
    ];
  }

  getString() {
    return Items.idToString(this.id);
  }

  getItem() {
    return {
      name: this.name,
      string: Items.idToString(this.id),
      id: this.id,
      count: this.count,
      ability: this.ability,
      abilityLevel: this.abilityLevel,
    };
  }
}
