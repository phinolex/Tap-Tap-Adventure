import Entity from '../entity';

export default class Item extends Entity {
  constructor(id, kind, count, ability, abilityLevel) {
    super(id, kind);

    this.count = count;
    this.ability = ability;
    this.abilityLevel = abilityLevel;

    this.dropped = false;
    this.stackable = false;

    this.type = 'item';
    this.shadow = true;
  }

  idle() {
    this.setAnimation('idle', 150);
  }

  setName(name) {
    this.super(name);
  }

  setAnimation(name, speed, count) {
    this.super(name, speed, count);
  }

  setGridPosition(x, y) {
    this.super(x, y);
  }

  setSprite(sprite) {
    this.super(sprite);
  }

  hasShadow() {
    return this.shadow;
  }
}
