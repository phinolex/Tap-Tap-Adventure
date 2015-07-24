## Intro
The designers created the map using [Tiled Map Editor](http://www.mapeditor.org/) v0.5.1. The output of this software is used in the [tools/maps section](https://github.com/browserquest/BrowserQuest/tree/master/tools/maps). At that time (and thus in the export script), the tmx file was "all XML" (or was chosen to be so to facilitate data processing). But now (from v0.8) a json file can be exported from tiled map editor, this file is the one used in the export process thanks to [gatekeeper](https://github.com/browserquest/BrowserQuest/tree/fb1618fee6fa2c29d25b45b65f97d5a2fdbb9624).

### Warning
Copying and pasting items inside Tiled can cause inexplicable errors (even within the same file), you can try it, but if the resulting map is not working properly, consider recreating the pasted items before starting to debug browserquest.

### Ids
Once inside browserquest each tile can be identified either:
* by its (x,y) coordinates ;
* by a unique Id [((x+1) + map_width*y)](https://github.com/browserquest/BrowserQuest/blob/master/client/js/map.js#L174)

## Layer types
In tiled map editor, there are mainly two types of object layers that can be superimposed: areas and tiles.
* ![Areas](https://f.cloud.github.com/assets/3218235/123150/f1e6bf6e-6eb0-11e2-8100-5cd97ceb59d7.png) ← Areas/Objects
Areas can store various information (right-click on a given area to get its properties). The default properties are name, type, position (x,y) and size (height, width). The user then can create _ad hoc_ properties, giving them name and value.
* ![Tiles](https://f.cloud.github.com/assets/3218235/123149/f1c295d0-6eb0-11e2-8bb8-f9812ab43207.png) ← Tiles
The meaning of each layer (and each object in each layer) is dictated by some info added in the file.

## Layer names
A map should have the following layers (see [processmap.js](https://github.com/browserquest/BrowserQuest/blob/master/tools/maps/processmap.js)):
* ![area](https://f.cloud.github.com/assets/3218235/123150/f1e6bf6e-6eb0-11e2-8100-5cd97ceb59d7.png) checkpoints
* ![area](https://f.cloud.github.com/assets/3218235/123150/f1e6bf6e-6eb0-11e2-8100-5cd97ceb59d7.png) music
* ![tile](https://f.cloud.github.com/assets/3218235/123149/f1c295d0-6eb0-11e2-8bb8-f9812ab43207.png) blocking
* ![tile](https://f.cloud.github.com/assets/3218235/123149/f1c295d0-6eb0-11e2-8bb8-f9812ab43207.png) plateau
* ![area](https://f.cloud.github.com/assets/3218235/123150/f1e6bf6e-6eb0-11e2-8100-5cd97ceb59d7.png) roaming
* ![area](https://f.cloud.github.com/assets/3218235/123150/f1e6bf6e-6eb0-11e2-8100-5cd97ceb59d7.png) doors
* ![area](https://f.cloud.github.com/assets/3218235/123150/f1e6bf6e-6eb0-11e2-8100-5cd97ceb59d7.png) chestareas
* ![area](https://f.cloud.github.com/assets/3218235/123150/f1e6bf6e-6eb0-11e2-8100-5cd97ceb59d7.png) chests
* ![tile](https://f.cloud.github.com/assets/3218235/123149/f1c295d0-6eb0-11e2-8bb8-f9812ab43207.png) entities
* ![tile](https://f.cloud.github.com/assets/3218235/123149/f1c295d0-6eb0-11e2-8bb8-f9812ab43207.png) Terrain (a variety of sprites and landscape tiles), only the ticked (✔) layers will be included in the final map
* ![tile](https://f.cloud.github.com/assets/3218235/123149/f1c295d0-6eb0-11e2-8bb8-f9812ab43207.png) don't remove this layer 

The following layers seem to be used for the developer's convenience, but are not exported to the game :
* ![area](https://f.cloud.github.com/assets/3218235/123150/f1e6bf6e-6eb0-11e2-8100-5cd97ceb59d7.png) zones ← used to see screens in the map editor
* ![area](https://f.cloud.github.com/assets/3218235/123150/f1e6bf6e-6eb0-11e2-8100-5cd97ceb59d7.png) mobile zones ← used to see mobiles screen in the map editor (when the player pass a door, the framing can be different)
* ![tile](https://f.cloud.github.com/assets/3218235/123149/f1c295d0-6eb0-11e2-8bb8-f9812ab43207.png) portals ← used to see portal doors in the map editor

## Tilesheets
The map editor uses tilesheets to associate with every tile you select a certain pixel set. The tilesheets are linked to the map by means of a relative path. The original maps will use :
* [tools/maps/tmx/mobset.png](https://github.com/browserquest/BrowserQuest/blob/master/tools/maps/tmx/mobset.png) → relative path: mobset.png
* [client/img/1/tilesheet.png](https://github.com/browserquest/BrowserQuest/blob/master/client/img/1/tilesheet.png) → relative path: ../../../client/img/1/tilesheet.png
Whereas mobset is not necessary (yet see below the use of the 'entities' layer), it is crucial that the tilesheet (called tilesheet) is indeed the same as the one in the above directory.

###Tile properties
Each tile of each tilesheet in Tile Map Editor can be assigned a set of attributes. Depending on the concerned tilesheet, the set of attributes is different. Tiled, does not seem to apply attributes to a set of tiles in a way that is interpretable to BrowserQuest. Some quick and dirty scripts have been created to help with that, see [tools/maps/pre_processmap.js](https://github.com/browserquest/BrowserQuest/blob/master/tools/maps/pre_processmap.js).

**Mobset**: Whether they are NPC or items, every tile in the mobset is assigned a "type" property. The name will be reused afterwards in the code to define the sprite associated and the properties of the object (NPC or item).

**Tilesheet**: terrain tiles can have various properties (valueless attributes)
* none : user can tread on the tile;
* 'c' → collision: for walls and other sprites which block the player;
* 'v' → visible(?): the user can share the tile with the object, but the object will remain visible over the player (typically used to allow the player to walk behind the top of the trees or houses).
* 'length' → animated : animate using the X sprites on the right of the tilesheet (the beach waves for example)

## ![area](https://f.cloud.github.com/assets/3218235/123150/f1e6bf6e-6eb0-11e2-8100-5cd97ceb59d7.png) Roaming
This is used to create zones of "roaming" enemies. They will be placed randomly in the area, and behave according to their class.

The **type** of the area will bear the name of the class of "mob" to place in the zone.

The **nb** property says how many enemies should be added. (NB: there might be limits regarding the density of population in the area, haven't checked that yet…)
## ![area](https://f.cloud.github.com/assets/3218235/123150/f1e6bf6e-6eb0-11e2-8100-5cd97ceb59d7.png) Zones
Each screen is a 30 tiles x 15 tiles portion of the map. The zones layer contains a sum of such rectangle. It does not appear to be used when the map is processed, but just to show the screens to the user and where they overlap. In the game screen change when the user reaches the edge.

## ![area](https://f.cloud.github.com/assets/3218235/123150/f1e6bf6e-6eb0-11e2-8100-5cd97ceb59d7.png) Doors 
This type of zone is pretty self-explanatory. Each door teleports the user to another spot in the map, thanks to its properties :
* cx: camera position → (coordinates)
* cy: camera position → (coordinates)
*  o: orientation → 'u' up, 'd' down, 'l' left, 'r' right
*  x: exit position → (coordinates)
*  y: exitposition → (coordinates)

In the following illustration, a 30x15 screen is displayed. By convention, the camera always is separated by 7x7 tiles from the bottom left corner of the screen.

In the following screen, the door is situated at mid screen and the room is centered. The door is on tile (126,143), hence the origin (bottom left corner) at (112,145) and the camera will be at (112+7,145-7) = (119,138). From the bottom-left corner we move right (x+7) and up (y-7). To sum up, a door pointing to this room will have the following attributes:
* cx: 119
* cy: 138
* o: u ← the character looks up when going in through the door
* x: 126
* y: 143
![room-doc](https://f.cloud.github.com/assets/3218235/111464/9d121456-6af6-11e2-8c35-41ed675836a5.png)

## ![area](https://f.cloud.github.com/assets/3218235/123150/f1e6bf6e-6eb0-11e2-8100-5cd97ceb59d7.png) chestareas
todo
## ![area](https://f.cloud.github.com/assets/3218235/123150/f1e6bf6e-6eb0-11e2-8100-5cd97ceb59d7.png) chests
todo
## ![tile](https://f.cloud.github.com/assets/3218235/123149/f1c295d0-6eb0-11e2-8bb8-f9812ab43207.png) entities
todo
