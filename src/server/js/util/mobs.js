import Dictionary from './dictionary';

export default class MobsDictionary extends Dictionary {
  constructor() {
    super();
    this.data = {};
  }

  getXp(id) {
    if (this.data && this.data[id]) {
      return this.data[id].xp;
    }

    return -1;
  }

  hasCombatPlugin(id) {
    return id in this.data && this.data[id].combatPlugin in this.plugins;
  }

  isNewCombatPlugin(id) {
    if (id in this.data && this.data[id].combatPlugin in this.plugins) {
      return this.plugins[this.data[id].combatPlugin];
    }

    return null;
  }
}
