(This is a stub)
All the entities present in the "world" are identified, how do these work ?

##What are entities?
Everything that is not part of the map itself is an entity (player, chest, item, npc, mob). They all extend the two Entity classes ([client](https://github.com/browserquest/BrowserQuest/blob/master/client/js/entity.js) / [server](https://github.com/browserquest/BrowserQuest/blob/master/server/js/entity.js)). Even the sprites indicating the damage of a weapon stroke have ids.
`Tiles also have ids but they are probably not to be mistaken with entity ids, they are described [[here|Create a map using Tiled Map Editor]].`

##What about their ids?
There does not seem to be a centralized entity table that would lease entity IDs. There is therefore a different format for different type of IDs. To be more convenient, the ID is passed to the constructor of the entity as a string and is parsed into an integer by the [constructor](https://github.com/browserquest/BrowserQuest/blob/master/server/js/entity.js#L7).

##ID formats list:
We'll sort the items depending whether their ID is set on the server or client side:
###Server side
* The websocket connections have an ID, which is then used for the players. It is assigned in [`server/js/ws.js`](https://github.com/browserquest/BrowserQuest/blob/master/server/js/ws.js#L239) and takes the following value: [`'5' + Utils.random(99) + '' + (this._counter++)`](https://github.com/browserquest/BrowserQuest/blob/master/server/js/ws.js#L277). This ID is then used as the ID of the player who's connected. The [`_counter`](https://github.com/browserquest/BrowserQuest/blob/master/server/js/ws.js#L112) counts the incoming connections.
* Player: the ID of the connection it depends on: [`'5' + Utils.random(99) + '' + (this._counter++)`] (see above) (cf. [`this._super(this.connection.id, "player", Types.Entities.WARRIOR, 0, 0, "");`](https://github.com/browserquest/BrowserQuest/blob/master/server/js/player.js#L20)).
* MobAreas: their ID is pretty muched decided in [tools/maps/processmap.js](https://github.com/browserquest/BrowserQuest/blob/master/tools/maps/processmap.js#L140) depending on the order in which they appear in the [.tmx file](Create a map using Tiled Map Editor).
* Mobs:
    * Mobs from a MobArea: [`'1' + MobArea.id + '' + MobKind + '' + MobCount`](https://github.com/browserquest/BrowserQuest/blob/master/server/js/mobarea.js#L29). The MobArea ID is explained above, the MobKind is the constant from [shared/js/gametypes.js](https://github.com/browserquest/BrowserQuest/blob/master/shared/js/gametypes.js) and the mob count is incremented each time a mob is spawned in the area.
    * "Stand-alone" mobs: [`'7' + kind + count++`](https://github.com/browserquest/BrowserQuest/blob/master/server/js/worldserver.js#L582), the count being the number of static entities already spawned.

###Client side
* DamageInfo: [`time+""+Math.abs(value)+""+x+""+y`](https://github.com/browserquest/BrowserQuest/blob/master/client/js/infomanager.js#L13)
* Player: See server… (The ID is retrieved from the server using `GameClient.welcome_callback`, which is defined in [`game.js`](https://github.com/browserquest/BrowserQuest/blob/master/client/js/game.js#L776)).
