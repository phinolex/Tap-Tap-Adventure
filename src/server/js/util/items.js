import Dictionary from './dictionary';

export default class ItemsDictionary extends Dictionary {
  constructor() {
    super();
    this.onCreate = {};
  }

  getData(name) {
    if (name in this.data) {
      return this.data[name];
    }

    return 'null';
  }

  hasPlugin(id) {
    if (id in this.data && this.data[id].plugin in this.plugins) {
      return true;
    }

    return false;
  }

  isNewPlugin(id) {
    if (id in this.data && this.data[id].plugin in this.plugins) {
      return this.plugins[this.data[id].plugin];
    }

    return false;
  }

  getLevelRequirement(name) {
    let level = 1;
    const item = this.data[name];

    if (item && item.requirement) {
      return item.requirement;
    }

    if (this.isWeapon(name)) {
      level = this.data[name].attack;
    } else if (this.isArmour(name)) {
      level = this.data[name].defense;
    } else if (this.isPendant(name)) {
      level = this.data[name].pendantLevel;
    } else if (this.isRing(name)) {
      level = this.data[name].ringLevel;
    } else if (this.isBoots(name)) {
      level = this.data[name].bootsLevel;
    }

    return level * 2;
  }

  getWeaponLevel(weaponName) {
    if (this.isWeapon(weaponName)) {
      return this.data[weaponName].attack;
    }

    return -1;
  }

  getArmourLevel(armourName) {
    if (this.isArmour(armourName)) {
      return this.data[armourName].defense;
    }

    return -1;
  }

  getPendantLevel(pendantName) {
    if (this.isPendant(pendantName)) {
      return this.data[pendantName].pendantLevel;
    }

    return -1;
  }

  getRingLevel(ringName) {
    if (this.isRing(ringName)) {
      return this.data[ringName].ringLevel;
    }

    return -1;
  }

  getBootsLevel(bootsName) {
    if (this.isBoots(bootsName)) {
      return this.data[bootsName].bootsLevel;
    }

    return -1;
  }

  isArcherWeapon(string) {
    if (string in this.data) {
      return this.data[string].type === 'weaponarcher';
    }

    return false;
  }

  isWeapon(string) {
    if (string in this.data) {
      return (
        this.data[string].type === 'weapon'
        || this.data[string].type === 'weaponarcher'
      );
    }

    return false;
  }

  isArmour(string) {
    if (string in this.data) {
      return (
        this.data[string].type === 'armor'
        || this.data[string].type === 'armorarcher'
      );
    }

    return false;
  }

  isPendant(string) {
    if (string in this.data) {
      return this.data[string].type === 'pendant';
    }

    return false;
  }

  isRing(string) {
    if (string in this.data) {
      return this.data[string].type === 'ring';
    }

    return false;
  }

  isBoots(string) {
    if (string in this.data) {
      return this.data[string].type === 'boots';
    }

    return false;
  }

  getType(id) {
    if (id in this.data) {
      return this.data[id].type;
    }

    return null;
  }

  isStackable(id) {
    if (id in this.data) {
      return this.data[id].stackable;
    }

    return false;
  }

  isEdible(id) {
    if (id in this.data) {
      return this.data[id].edible;
    }

    return false;
  }

  getCustomData(id) {
    if (id in this.data) {
      return this.data[id].customData;
    }

    return null;
  }

  maxStackSize(id) {
    if (id in this.data) {
      return this.data[id].maxStackSize;
    }

    return false;
  }

  isShard(id) {
    return id === 253 || id === 254 || id === 255 || id === 256 || id === 257;
  }

  isEnchantable(id) {
    return this.getType(id) !== 'object' && this.getType(id) !== 'craft';
  }

  getShardTier(id) {
    switch (id) {
      case 253:
        return 1;
      case 254:
        return 2;
      case 255:
        return 3;
      case 256:
        return 4;
      case 257:
        return 5;
      default:
        return -1;
    }
  }

  isEquippable(string) {
    return (
      this.isArmour(string)
      || this.isWeapon(string)
      || this.isPendant(string)
      || this.isRing(string)
      || this.isBoots(string)
    );
  }

  healsHealth(id) {
    if (id in this.data) {
      return this.data[id].healsHealth > 0;
    }

    return false;
  }

  healsMana(id) {
    if (id in this.data) {
      return this.data[id].healsMana > 0;
    }

    return false;
  }

  getHealingFactor(id) {
    if (id in this.data) {
      return this.data[id].healsHealth;
    }

    return 0;
  }

  getManaFactor(id) {
    if (id in this.data) {
      return this.data[id].healsMana;
    }
    return 0;
  }
}
