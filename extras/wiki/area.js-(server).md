*Source file: [server/js/area.js](https://github.com/browserquest/BrowserQuest/blob/master/server/js/area.js)*

Extends `class` in the /lib subdirectory. 

Properties
----------
*`id` -- `[integer]` 

*`x` -- `[number]` 

*`y` -- `[number]`

*`width` -- `[number]` 

*`height` -- `[number]`

*`world` -- `[world]`

*`entities` -- `[array]`

*`hasCompletelyRespawned` -- `[boolean]`

Methods
-------
* `init(id, x, y, width, height, world)`

* `_getRandomPositionInsideArea()`

* `removeFromArea(entity)`

* `addToArea(entity)`

* `setNumberOfEntities(nb)`

* `isEmpty()`

* `isFull`

* `onEmpty(callback)`

**init(id, x, y, width, height, world)**

Sets the class properties to passed values, creates an empty entities array, and sets `hasCompletelyRespawned` to true

**_getRandomPositionInsideArea()**

Returns a randomly selected position within the area

**removeFromArea(entity)**

Removes entity from entities array, sets `hasCompletelyRespawned` to false if needed and calls `empty_callback()` if needed  

**addToArea(entity)**

Adds entity to the entities array and sets `hasCompletelyRespawned` to true if the area is full

**setNumberOfEntities(nb)**

Sets the object property `nbEntities` to the value of the passed `nb`

**isEmpty()**

Returns whether there exist any entities in the area

**isFull**

Returns whether the area is fully spawned (whether number of entities == `nbEntities`)

**onEmpty(callback)**

Sets the `empty_callback` object property to the passed callback function