import Entity from '../entity';

export default class Chest extends Entity {
  constructor(id, kind) {
    super(id, kind);

    this.type = 'chest';
  }

  idle() {
    this.setAnimation('idle_down', 150);
  }

  setName(name) {
    this.super(name);
  }

  setAnimation(name, speed, count, onEndCount) {
    this.super(name, speed, count, onEndCount);
  }

  setGridPosition(x, y) {
    this.super(x, y);
  }

  setSprite(sprite) {
    this.super(sprite);
  }
}
