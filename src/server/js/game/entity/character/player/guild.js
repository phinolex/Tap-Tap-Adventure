import log from 'log';
import Guilds from '../../../../../data/guilds.json';

export default class Guild {
  constructor(name, leader) {
    this.name = name;
    this.leader = leader;
    this.members = [];
    this.connected = false;
  }

  add(player) {
    this.members.push(player);
    this.save();
  }

  save() {
    log.info(Guilds[this.leader.username]);
  }
}
