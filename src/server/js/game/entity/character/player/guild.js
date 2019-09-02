import log from '../../../../util/log';
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
    console.log(Guilds[this.leader.username]);
  }
}
