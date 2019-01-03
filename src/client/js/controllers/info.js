import _ from 'underscore';
import Queue from '../utils/queue';
import Splat from '../renderer/infos/splat';
import Modules from '../utils/modules';
import {
  isInt,
} from '../utils/util';

export default class Info {
  constructor(game) {
    this.game = game;

    this.infos = {};
    this.destroyQueue = new Queue();
  }

  create(type, data, x, y) {
    switch (type) {
      default:
        break;
      case Modules.Hits.Damage:
      case Modules.Hits.Stun:
      case Modules.Hits.Critical:
        let damage = data.shift(); // eslint-disable-line
        const isTarget = data.shift(); // eslint-disable-line
        const dId = this.generateId(damage, x, y); // eslint-disable-line

        if (damage < 1 || !isInt(damage)) {
          damage = 'MISS';
        }

        const hitSplat = new Splat(dId, type, damage, x, y, false); // eslint-disable-line

        const dColour = isTarget // eslint-disable-line
          ? Modules.DamageColours.received
          : Modules.DamageColours.inflicted;

        hitSplat.setColours(dColour.fill, dColour.stroke);

        this.addInfo(hitSplat);

        break;

      case Modules.Hits.Heal:
      case Modules.Hits.Mana:
      case Modules.Hits.Experience:
        const amount = data.shift(); // eslint-disable-line
        const id = this.generateId(amount, x, y); // eslint-disable-line
        let text = '+'; // eslint-disable-line
        let colour = null; // eslint-disable-line

        if (amount < 1 || !isInt(amount)) {
          return;
        }

        if (type !== Modules.Hits.Experience) {
          text = '++';
        }

        const splat = new Splat(id, type, text + amount, x, y, false); // eslint-disable-line

        if (type === Modules.Hits.Heal) {
          colour = Modules.DamageColours.healed;
        } else if (type === Modules.Hits.Mana) {
          colour = Modules.DamageColours.mana;
        } else if (type === Modules.Hits.Experience) {
          colour = Modules.DamageColours.exp;
        }

        splat.setColours(colour.fill, colour.stroke);
        this.addInfo(splat);
        break;

      case Modules.Hits.LevelUp:
        const lId = this.generateId('-1', x, y); // eslint-disable-line
        const levelSplat = new Splat(lId, type, 'Level Up!', x, y, false); // eslint-disable-line
        const lColour = Modules.DamageColours.exp; // eslint-disable-line

        levelSplat.setColours(lColour.fill, lColour.stroke);
        this.addInfo(levelSplat);
        break;
    }
  }

  getCount() {
    return Object.keys(this.infos).length;
  }

  addInfo(info) {
    this.infos[info.id] = info;

    info.onDestroy((id) => {
      this.destroyQueue.add(id);
    });
  }

  update(time) {
    this.forEachInfo((info) => {
      info.update(time);
    });

    this.destroyQueue.forEachQueue((id) => {
      delete this.infos[id];
    });

    this.destroyQueue.reset();
  }

  forEachInfo(callback) {
    _.each(this.infos, (info) => {
      callback(info);
    });
  }

  generateId(info, x, y) {
    return `${this.game.time}${Math.abs(info)}${x}${y}`;
  }
}
