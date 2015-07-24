Examples in this page are meant to prepare to [[add an item to the game|How to add an item]], but the procedure is very similar for all sprites (npc or player).

## General info
Every sprite in the game is present in three sizes conveniently put into the following folders:
* [client/img/1](https://github.com/browserquest/BrowserQuest/tree/master/client/img/1): smallest sprites, meant for a map with 16x16 pixels tiles;
* [client/img/2](https://github.com/browserquest/BrowserQuest/tree/master/client/img/2): medium sprites, meant for a map with 32x32 pixels tiles;
* [client/img/3](https://github.com/browserquest/BrowserQuest/tree/master/client/img/3): bigest sprites, meant for a map with 48x48 pixels tiles;
To keep inline with the visual style of the game, instead of drawing big sprites and then reducing them (which would be the way to go otherwise), one should create the sprites for the smallest map and enlarge them (with no extrapolation whatsoever).

## Create the image for your sprite
This should be a png file with transparent background containing all the "states" for your object's animations in a line (item, player or npc). Each animation (action) is a line. The name of the png file should be explicit — for items **it must start with _item_** (see [client/js/item.js](https://github.com/browserquest/BrowserQuest/blob/79431ce7eaf5cbebca1565e41df44cca6ac8f6f2/client/js/item.js#L26)).
e.g.: item-rosettastone.png, epigraphist.png, librarian.png, etc.

## Define the rendering of the sprite
This should be done by creating a .json file with the same name as the sprite in the folder [client/sprites](https://github.com/browserquest/BrowserQuest/tree/master/client/sprites). In our example, our sprite was called « item-rosettastone.png » we will thus call it « item-rosettastone.json ».
The content of this file is as follows…

![The example of the cake](https://f.cloud.github.com/assets/3218235/1164886/cf8ed9ca-2061-11e3-8ad4-6bdf95d77a18.png)
The content of the file is pretty straightforward, except the offset. The image produced will be put on a tile [[on the map|Create a map using Tiled Map Editor]]. The "row" will indicate the row (0: first, 1: second) whose top left corner will be put on the top left corner of the tile it is associated with. For sprites bigger than a tile, it is therefore necessary to specify an offset to know where is situated the tile supporting the item. The offset will tell how many pixels and in which direction the whole row should be moved. This tile will be the one the user will have to loot in order to collect the object (active tile in the above figure).

## Add it to the list of sprites
To do so, a link to the .json file you just created must be added to [client/js/sprites.js](https://github.com/browserquest/BrowserQuest/blob/master/client/js/sprites.js).
e.g.: add line `'text!../sprites/item-rosettastone.json',` or `'text!../sprites/librarian.json',` (the first is an item, the second an NPC)

## Add it to the map
To add the item or non playing character to the map it should be added under the form of a 16x16 tile to the [mobset.png](https://github.com/browserquest/BrowserQuest/blob/master/tools/maps/tmx/mobset.png) used to edit the map and a [[type property|Create a map using Tiled Map Editor]] should be added to this tile, containing the name of the sprite (without “item” for items).

e.g.: type → rosettastone in our example. You then can add it like any other item.

### [client/js/renderer.js](https://github.com/browserquest/BrowserQuest/blob/master/client/js/renderer.js)
In this file you can add extra rendering info. For instance, on [line 381](https://github.com/browserquest/BrowserQuest/blob/79431ce7eaf5cbebca1565e41df44cca6ac8f6f2/client/js/renderer.js#L381), all entities but the cake are added sparks : `if(entity instanceof Item && entity.kind !== Types.Entities.CAKE) {[…]}`
See below for explanation of `Types.Entities.CAKE.`

##Non-item sprite
This section uses the example of the [[How to add a persona]] article.
The logic behind the creation of the sprite is exactly the same as for an [[item|How to add an item]], except for a few details:
* of course the name of the file should not start with “item”.
* the player/NPC can perform various actions, each action will be associated to an animation, the png file should contain one line of sprites per action;
* as a consequence the .json file should define every action.

Therefore, in our example, we will create a series of ”epigraphist.png” spritesheets (in [client/img/1](https://github.com/browserquest/BrowserQuest/tree/master/client/img/1), [2](https://github.com/browserquest/BrowserQuest/tree/master/client/img/2) and [3](https://github.com/browserquest/BrowserQuest/tree/master/client/img/3)), growing in size and associate an [client/sprites/](https://github.com/browserquest/BrowserQuest/tree/master/client/sprites)epigraphist.json with all its actions.

To create a new action, it can reuse an animation line in the spritesheet or create a new one, but needs to be described in the .json file.

e.g.: For our epigraphist, we will create a scrutinize action : `"scrutinize": {"length": 4,"row": 9}`

Finally, do not forget to add your json file to the list of sprites in [client/js/sprites.js](https://github.com/browserquest/BrowserQuest/blob/master/client/js/sprites.js):
e.g.: add line `'text!../sprites/epigraphist.json',`

