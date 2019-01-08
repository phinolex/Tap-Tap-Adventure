import Character from '../character';

export default class Mob extends Character {
  constructor(id, kind) {
    super(id, kind);

    this.name = null;

    this.hitPoints = -1;
    this.maxHitPoints = -1;

    this.type = 'mob';
  }

  setName(name) {
    this.name = name;
  }
}
