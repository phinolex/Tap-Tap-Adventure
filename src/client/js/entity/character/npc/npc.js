import Character from '../character';

export default class Npc extends Character {
  constructor(id, kind) {
    super(id, kind);

    this.index = 0;
    this.type = 'npc';
  }

  talk(messages) {
    const count = messages.length;
    let message;

    if (this.index > count) {
      this.index = 0;
    }

    if (this.index < count) {
      message = messages[this.index];
    }

    this.index += 1;

    return message;
  }
}
