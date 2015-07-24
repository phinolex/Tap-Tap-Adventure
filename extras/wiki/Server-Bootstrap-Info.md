*Info copied from the ParticleQuest Etherpad [here](http://pad.p2pu.org/p/browserquest).*

### Initialization/World Setup

[server/maps/world_server.json](https://github.com/browserquest/BrowserQuest/blob/master/server/maps/world_server.json) contains list of:
* width, height - of the map (in tiles, not pixels) Every tile is then identified with a number. The width and height is **probably** used to infer the (x,y) coordinates of every tile based on their id.
* collisions - IDs of the tiles where you cannot walk.
* doors - list of hashes of the form {"x":80,"y":211,"p":0,"tcx":148,"tcy":306,"to":"u","tx":155,"ty":311} (cf. [[Create a map using tiled map editor]])
* checkpoints: {"id":1,"x":14,"y":210,"w":9,"h":2,"s":1}
* roaming areas: {"id":0,"x":10,"y":206,"width":13,"height":7,"type":"rat","nb":3} - defined an area with a specific type and number of mob characters present?
* chestAreas: {"x":2,"y":77,"w":6,"h":5,"i":[24,66],"tx":6,"ty":75}
* staticChests: staticChests":[{"x":157,"y":141,"i":[61]}
* staticEntities: {"1305":"spectre", ... "2997":"deathknight","3191":"eye","3251":"skeleton". ...
* tilesize: 16px.

Many of these information can be specified directly in [Tiled Map Editor](http://www.mapeditor.org/) which has been used by designers to create the map. See [[Create a map using Tiled Map Editor]].

[server/js/worldserver.js](https://github.com/browserquest/BrowserQuest/blob/master/server/js/worldserver.js) reads this file and sets up all the entities

### Initial Position
When a new client connects (XXX), it requests a position from the server (XXX).

The [server/js/worldserver.js](https://github.com/browserquest/BrowserQuest/blob/master/server/js/worldserver.js) has a call back this.onPLayerConnect() that sets a random starting position either from within the last checkpoint of the player or, if a new player, chooses a random location from one of several startingAreas in [server/js/map.js](https://github.com/browserquest/BrowserQuest/blob/master/server/js/map.js): getRandomStartingPosition().

Starting areas are those checkpoints (in the world_server.json) that have s == 1 ([server/js/map.js](https://github.com/browserquest/BrowserQuest/blob/master/server/js/map.js): initCheckPoints(). 

Initial static entity positions - eg. you want to place an NPC in one of the starting areas:
- tile id vs. x,y position? in [server/js/worldserver.js](https://github.com/browserquest/BrowserQuest/blob/master/server/js/worldserver.js), spawnStaticEntities() calls map.tileIndexToGridPosition()

##Dependency graph
The following graph was created using [madge](https://npmjs.org/package/madge):
[![server](https://f.cloud.github.com/assets/3218235/123581/028fe5f6-6ecb-11e2-8cd3-3cfe85d13bc7.png)](https://f.cloud.github.com/assets/3218235/123581/028fe5f6-6ecb-11e2-8cd3-3cfe85d13bc7.png)

NB: maybe the lisibility of the graph could be improved by toying with madge parameters.