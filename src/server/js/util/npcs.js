export default class NpcsDictionary {
  constructor() {
    this.properties = {};
    this.npcs = {};
  }

  idToString(id) {
    if (id in this.npcs) {
      return this.npcs[id].key;
    }

    return null;
  }

  idToName(id) {
    if (id in this.npcs) {
      return this.npcs[id].name;
    }

    return null;
  }

  getText(id) {
    if (this.npcs && this.npcs[id]) {
      return this.npcs[id].text;
    }

    return null;
  }

  getType(id) {
    if (this.npcs && this.npcs[id]) {
      return this.npcs[id].type;
    }

    return null;
  }
}
