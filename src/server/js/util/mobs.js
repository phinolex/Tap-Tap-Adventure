export default class MobsDictionary {
  constructor() {
    this.properties = {};
    this.mobs = {};
    this.plugins = {};
  }

  idToString(id) {
    if (this.mobs && this.mobs[id]) {
      return this.mobs[id].key;
    }

    return null;
  }

  idToName(id) {
    if (this.mobs && this.mobs[id]) {
      return this.mobs[id].name;
    }

    return null;
  }

  getXp(id) {
    if (this.mobs && this.mobs[id]) {
      return this.mobs[id].xp;
    }

    return -1;
  }

  exists(id) {
    return id in this.mobs;
  }

  hasCombatPlugin(id) {
    return id in this.mobs && this.mobs[id].combatPlugin in this.plugins;
  }

  isNewCombatPlugin(id) {
    if (id in this.mobs && this.mobs[id].combatPlugin in this.plugins) {
      return this.plugins[this.mobs[id].combatPlugin];
    }
    return null;
  }
}
