import Player from '../../server/js/game/entity/character/player/player';
import Creator from '../../server/js/database/creator';

export default class Bot {
  constructor(world, count) {
    this.world = world;
    this.count = count;

    this.creator = new Creator(null);

    this.players = [];

    this.load();
  }

  load() {
    for (let i = 0; i < this.count; i += 1) {
      const connection = {
        id: i,
        listen: {},
        onClose: {},
      };
      const player = new Player(this.world, this.world.database, connection, -1);

      this.world.addPlayer(player);

      player.username = `Bot${i}`;

      player.load(this.creator.getPlayerData(player));

      player.intro();

      player.walkRandomly();

      this.players.push(player);
    }
  }
}
