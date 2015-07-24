This page is meant to guide you through the creation of a basic item.

## Draw a sprite
See [[How to create a sprite]].

##Add it to the game
There are several steps in order to include the item in the game.

### Define the entity and the kind of item
[shared/js/gametypes.js](https://github.com/browserquest/BrowserQuest/blob/master/shared/js/gametypes.js) holds the taxonomy of entities in the game.

First of all you need to provide an ID for the type of entity: in variable Types.Entities, you have to define the entity you will use and associate an integer constant to it (see [gametype.js l.61](https://github.com/browserquest/BrowserQuest/blob/1579f13ac8cd0e0486fd09115cbe10ce8d3ae6d8/shared/js/gametypes.js#L61)).

Then, the variable `kinds` will make the link between your sprite and the entity. It also holds the different types of objects (`"player"`, `"mob"`, `"weapon"`, `"armor"`, `"object"`, `"npc"`), add your item to the kinds.
e.g.: `rosettastone: [Types.Entities.ROSETTASTONE, "object"],`

**NB:** This is where you associate the name of the sprite with the code. In this file the method used to enforce the `'item-'+name` pattern is defined (cf. [client/js/item.js](https://github.com/browserquest/BrowserQuest/blob/79431ce7eaf5cbebca1565e41df44cca6ac8f6f2/client/js/item.js#L26)).

You can further describe your object by adding it to the list of expandable items for instance:
`Types.isExpendableItem = function(kind) {`
`    return Types.isHealingItem(kind)`
`        || kind === Types.Entities.FIREPOTION`
`        || kind === Types.Entities.CAKE`
`        || kind === Types.Entities.ROSETTASTONE;`
`};`

### [client/js/entityfactory.js](https://github.com/browserquest/BrowserQuest/blob/master/client/js/entityfactory.js)
This is the file that processes the list of entities of the map and decides associates them to a given kind.

In the items section of the file, add your entity. E.g.:
`    EntityFactory.builders[Types.Entities.ROSETTASTONE] = function(id){
		return new Items.RosettaStone(id);
	}`
This associate to the entity «Types.Entities.ROSETTASTONE» a builder

### Define the item's behavior
This is done in [client/js/items.js](https://github.com/browserquest/BrowserQuest/blob/master/client/js/items.js).

There are different kinds of items:
* `"weapon"` → changes the user's weapon upon loot;
* `"armor"` → changes the user's armor upon loot;
* `"object"` → other (see [shared/js/gametypes.js](https://github.com/browserquest/BrowserQuest/blob/master/shared/js/gametypes.js) for subtypes of other objects).

The init() behavior, containing a constructor and the loot message has to be defined, but the behavior upon loot [can also be specified](https://github.com/browserquest/BrowserQuest/blob/79431ce7eaf5cbebca1565e41df44cca6ac8f6f2/client/js/items.js#L104).

###Effectively add the item to the game
In [client/js/game.js](https://github.com/browserquest/BrowserQuest/blob/master/client/js/game.js), add your sprite to [`this.spriteNames`](https://github.com/browserquest/BrowserQuest/blob/79431ce7eaf5cbebca1565e41df44cca6ac8f6f2/client/js/game.js#L66). In the examples above our spritename is `item-rosettastone`.

In this file, you can also [[associate an achievement|How to add an achievement]] to the item or add a silhouette to it.
