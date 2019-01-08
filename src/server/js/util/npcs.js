import Dictionary from './dictionary';

export default class NpcsDictionary extends Dictionary {
  getText(id) {
    if (this.data && this.data[id]) {
      return this.data[id].text;
    }

    return null;
  }

  getType(id) {
    if (this.data && this.data[id]) {
      return this.data[id].type;
    }

    return null;
  }
}
