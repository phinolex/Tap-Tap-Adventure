*Source file: [server/js/entity.js](https://github.com/browserquest/BrowserQuest/blob/master/server/js/entity.js)*

Extends `class` in the /lib subdirectory.  `entity` is extended by both the character and npc class. 

Properties
----------
*`id` -- `[integer]` Unique ID generated for this specific entity

*`type` -- `[Entities]` Uses one of the listed `Entities` types as defined by gametypes.js in the shared folder

*`kind` -- Can either be a player, mob, weapon, armor, object, or npc, as defined by gametypes.js in the shared folder

*`x` -- `[number]` The x-axis location of the entity on the map grid

*`y` -- `[number]` The y-axis location of the entity on the map grid


Methods
-------
* `init(id, type, kind, x, y)`

* `destroy()`

* `_getBaseState()`

* `getState()`

* `spawn()`

* `despawn`

* `setPosition(x, y)`

* `getPositionNextTo(entity)`

**init(id,type,kind,x,y)**

Sets the id, type, kind, and x/y values of the entity

**destroy()**

Not implemented 

**_getBaseState()**

Returns the id, kind, and x/y values of the entity

**getState()**

Calls _getBaseState() and returns same value as _getBaseState()

**spawn()**

Spawns the entity

**despawn**

Despawns the entity

**setPosition(x,y)**

Sets entity's x/y coordinates to the passed values

**getPositionNextTo(entity)**

Moves the entity to a random tile immediately next to the passed entity's position