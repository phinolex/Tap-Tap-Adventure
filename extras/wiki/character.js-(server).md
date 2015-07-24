*Source file: [server/js/character.js](https://github.com/browserquest/BrowserQuest/blob/master/server/js/character.js)*

Extends `entity`.  `character` is extended by both the player and mob class. 

Properties
----------
*`orientation` -- `[Orientations]` Uses LEFT, RIGHT, UP, DOWN as defined by gametypes.js in the shared folder

*`attackers` -- `[array]` Stores `entity` objects of the current attackers at an index of the attacker `entity.id` number

*`target` -- `[number]` Is set to `entity.id` of the target to attack

*`basestate` -- `[array]` The initial id, kind, and x/y coordinates for the object; comes from `entity.js`

*`state` -- `[array]` Tracks name, armor, weapon (these three come form `player.js`), orientation, target (orientation/target both from both `player.js` and `character.js`), kind, id, type, x coordinate, and y coordinate (final five come from `entity.js`)

*`maxHitPoints` -- `[number]` The highest value that `hitPoints` can have; updated by `updateHitPoints` in `player.js`

*`hitPoints` -- `[number]` Tracks damage available to character before death



Methods
-------
* `init(id, type, kind, x, y)`

* `getState()`

* `resetHitPoints(maxHitPoints)`

* `regenHealthBy(value)`

* `hasFullHealth()`

* `setTarget(entity)`

* `clearTarget()`

* `hasTarget()`

* `attack()`

* `health()`

* `regen()`

* `addAttacker(entity)`

* `removeAttacker(entity)`

* `forEachAttacker(callback)`

**init(id, type, kind, x, y)**

Calls to `entity` superclass, sets `orientation` to a random direction, creates an empty list of attackers, and sets target to null. 

**getState()**

Pulls the result from `_getBaseState` in `entity.js` and adds in the current orientation, the current target (if there is one), and returns it. 

**resetHitPoints(maxHitPoints)**

Resets `hitPoints` to be equal to `maxHitPoints`

**regenHealthBy(value)**

If `hitPoints` is less than `maxHitPoints`, add the passed value to `hitPoints`. Will not increase past `maxHitPoints`

**hasFullHealth()**

Returns whether character has full health with boolean

**setTarget(entity)**

Sets `target `to passed `entity`

**clearTarget()**

Resets `target` to `null`

**hasTarget()**

Returns whether character has a target with boolean

**attack()**

Sends message showing attack of current target (not 100% sure this is correct)

**health()**

Sends message showing current health (not 100% sure this is correct)

**regen()**

Not sure, needs to be filled in

**addAttacker(entity)**

Adds attacker to `attackers` array

**removeAttacker(entity)**

Removes attacker from `attackers` array

**forEachAttacker(callback)**

Not sure, needs to be filled in