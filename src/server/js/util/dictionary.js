import log from './log';
import PluginLoader from './plugins';

export default class Dictionary {
  constructor() {
    this.properties = {};
    this.plugins = {};
    this.data = {};
  }

  getProperty(key) {
    return this.properties[key];
  }

  setProperty(key, value) {
    this.properties[key] = value;
  }

  getData(key) {
    return this.data[key];
  }

  setData(key, value) {
    this.data[key] = value;
  }

  idToString(id) {
    if (id in this.data) {
      return this.data[id].key;
    }

    return null;
  }

  idToName(id) {
    if (id in this.data) {
      return this.data[id].name;
    }

    return null;
  }

  stringToId(name) {
    if (name in this.data) {
      return this.data[name].id;
    }

    log.error(`${name} not found in the dictionary.`);
    return 'null';
  }

  exists(id) {
    return id in this.data;
  }

  setPlugins(directory) {
    this.plugins = PluginLoader(directory);
  }
}
