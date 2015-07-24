This page is meant to guide you through the creation of a new mob/monster

## Draw a sprite
See [[How to create a sprite]].

##Add it to the game
There are several steps in order to include the item in the game.

### Define the entity and the kind of item
[shared/js/gametypes.js](https://github.com/browserquest/BrowserQuest/blob/master/shared/js/gametypes.js) holds the taxonomy of entities in the game.

### Add the sprite/json

### Define the behavior of the mob

Add your mob in client/js/mobs.js

>         Spider: Mob.extend({
>             init: function(id) {
>                 this._super(id, Types.Entities.SPIDER);
>                 this.moveSpeed = 300;
>                 this.idleSpeed = 100;
>                 this.walkSpeed = 100;
>                 this.shadowOffsetY = -2;
>                 this.isAggressive = true;
>             }
>         }),

* moveSpeed: The effectivement movement speed of the mob
* idleSpeed: Animation speed while idke
* walkSpeed: Animation speed while walking
* isAggressive: Attack a player if he's too close (just on the tile next to the mob)

note on isAffressive:
It's does'nt work while the mob is moving, only when idle.

### Add to client/entityfactory

### Add to server/properties


### Add it to the map
There are two ways to add mobs to the map :
* Create a new mob area, set:
    * type to your mob name;
    * a new property "nb" to the number of mob in your area;
* Create a new mob in the mobset.png file and use that to add mobs, one mob at a time on a precise tile (cf. [[How to create a sprite]])