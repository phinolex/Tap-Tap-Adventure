var Combat from "../../js/game/entity/character/combat/combat"),
  Modules from "../../js/util/modules");

export default class GreatSquid = Combat.extend({
  constructor(character) {
    

    character.spawnDistance = 15;

    this.super(character);

    this.character = character;

    this.lastTerror = new Date().getTime();
  },

  hit(character, target, hitInfo) {
    

    if (this.canUseTerror()) {
      hitInfo.type = Modules.Hits.Stun;

      this.lastTerror = new Date().getTime();
    }

    this.super(character, target, hitInfo);
  },

  canUseTerror() {
    return new Date().getTime() - this.lastTerror > 15000;
  }
});
