import log from './log';
import PluginLoader from './plugins';

const AbilityDictionary = {
  data: {},
  properties: {},
  plugins: {},
  getProperty: key => AbilityDictionary.properties[key],
  setProperty: (key, value) => {
    AbilityDictionary.properties[key] = value;
  },
  getData: key => AbilityDictionary.data[key],
  setData: (key, value) => {
    AbilityDictionary.data[key] = value;
  },
  idToString: (id) => {
    if (id in AbilityDictionary.data) {
      return AbilityDictionary.data[id].key;
    }

    return null;
  },
  idToName: (id) => {
    if (id in AbilityDictionary.data) {
      return AbilityDictionary.data[id].name;
    }

    return null;
  },
  stringToId: (name) => {
    if (name in AbilityDictionary.data) {
      return AbilityDictionary.data[name].id;
    }

    log.error(`${name} not found in the dictionary.`);
    return 'null';
  },
  exists: id => id in AbilityDictionary.data,
  setPlugins: (directory) => {
    AbilityDictionary.plugins = PluginLoader(directory);
  },
};

export default AbilityDictionary;
