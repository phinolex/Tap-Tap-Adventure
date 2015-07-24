Welcome to the BrowserQuest wiki!

For Users and SysAdmins
=======================

* [[Quick-Start-using-Amazon-EC2]] - Quick start installation guide using Amazon EC2.
* [[Setup-For-Separate-Client-And-Server]] - How to configure BrowerQuest for separate client and Node.js backend servers.

### BrowserQuest Maps
* [Scale 1: Mobile (2752x5024)](http://justinclift.fedorapeople.org/browserquest/browserquest_fullmap_scale1.png) ~12.2 MB. ([mirror](http://mirror.salasaga.org/browserquest/maps/browserquest_fullmap_scale1.png))
* [Scale 2: Desktop (5504x10048)](http://justinclift.fedorapeople.org/browserquest/browserquest_fullmap_scale2.png) ~34.47 MB. ([mirror](http://mirror.salasaga.org/browserquest/maps/browserquest_fullmap_scale2.png))


For Developers
==============

## General info
* [[Backlog]] - Our ToDo list (new ideas welcome, discussion via the mailing list).
* [[Coding Conventions]] - The coding standards we intend to use.  Open to (sane) discussion. :)
* [[Useful links]] - Possibly helpful external links.

## How-Tos
A series of short descriptions of how to extend the game. They cannot replace the rest of the documentation, but might get you going a bit faster…
These guides are probably not exhaustive and should probably be extended
* [[Create a map using Tiled Map Editor]] - some infos about maps and Tiled Map Editor;
* [[Create a sprite|How to create a sprite]] - the part that is common to all sprites;
* [[Add an item|How to add an item]] - add an item to the game;
* [[Add a new mob|How to add a mob]] - add a new mob to the game;
* [[Add a Non Playing Character|How to add a Non Playing Character]] - add a (non roaming) NPC;
* [[Add a persona|How to add a persona]] - add a persona to the game (under the form of an armor);
* [[Add an achievement|How to add an achievement]] - add an [[achievement|Achievements]] to the game.
* [Add a unit test](https://github.com/browserquest/BrowserQuest/wiki/Unit-Tests) - add a unit test to the game;

## Overview
* [[The Client Bootstrap Process]] - Info about what happens when the browser loads the game client.
* [[Server Bootstrap Info]] - Mostly a stub, with info copied from the ParticleQuest Etherpad.
* [[Achievements]] - Has achievement related property list, the list of achievements, and info on how the methods are used.
* [[Battle System]] - Mostly a stub, needs work.
* [Layout and Image Editing for the BrowserQuest Client](https://github.com/browserquest/BrowserQuest/wiki/Layout-and-Image-Editing-for-the-BrowserQuest-Client) - Want to change the way the BrowserQuest client looks?
* [[IDs]] - All the entities present in the "world" are identified, how do these work ?
* [[Messages]] - How the client and the server exchange
* [[Guilds]] - Add-on, how the guild system works

## Classes
### Client
* [[App]] - Property and method list done, with some good initial method descriptions.
* [[Bubble]] - Property and method list done, with good method descriptions.
* [[BubbleManager]] - Property and method list done, with good method descriptions.
* [[Game]] - Stub only, needs work.
* [[Storage]] - Initial property and method list done, some methods have descriptions.
* [[Npc]] ([npc.js](https://github.com/browserquest/BrowserQuest/blob/master/client/js/npc.js)) - Handles both what NPC say and how they say it.

### Server
* [[Server]] - Initial property and method list done, needs more in-depth method info added.
* [[Connection]] - Basic property and method list, needs work.
* [[Player]] - Stub only, needs work.
* [[area.js-(server)]] - Complete
* [[character.js-(server)]] - Complete except for two methods. `forEachAttacker()` and `regen()` need to be filled in and two others (`attack` and `health`) need to be checked for accuracy. 
* [[entity.js-(server)]] - Complete, `spawn()` and `despawn()` could probably use more clarification.

Note - Communication between the client and server happens via gameclient.js (client side) which talks to gameserver.js (server side) using the messages and entity types defined in shared/gametypes.js. See [[Messages]].

## Undocumented source code files
*(turning any of these into class docs, like those above, is encouraged)*

### Client (Javascript)

* [client/js/animation.js](https://github.com/browserquest/BrowserQuest/blob/master/client/js/animation.js)
* [client/js/area.js](https://github.com/browserquest/BrowserQuest/blob/master/client/js/area.js)
* [client/js/audio.js](https://github.com/browserquest/BrowserQuest/blob/master/client/js/audio.js)
* [client/js/build.js](https://github.com/browserquest/BrowserQuest/blob/master/client/js/build.js)
* [client/js/camera.js](https://github.com/browserquest/BrowserQuest/blob/master/client/js/camera.js)
* [client/js/character.js](https://github.com/browserquest/BrowserQuest/blob/master/client/js/character.js)
* [client/js/chest.js](https://github.com/browserquest/BrowserQuest/blob/master/client/js/chest.js)
* [client/js/config.js](https://github.com/browserquest/BrowserQuest/blob/master/client/js/config.js)
* [client/js/detect.js](https://github.com/browserquest/BrowserQuest/blob/master/client/js/detect.js)
* [client/js/entity.js](https://github.com/browserquest/BrowserQuest/blob/master/client/js/entity.js)
* [client/js/entityfactory.js](https://github.com/browserquest/BrowserQuest/blob/master/client/js/entityfactory.js)
* [client/js/exceptions.js](https://github.com/browserquest/BrowserQuest/blob/master/client/js/exceptions.js)
* [client/js/gameclient.js](https://github.com/browserquest/BrowserQuest/blob/master/client/js/gameclient.js)
* [client/js/infomanager.js](https://github.com/browserquest/BrowserQuest/blob/master/client/js/infomanager.js)
* [client/js/item.js](https://github.com/browserquest/BrowserQuest/blob/master/client/js/item.js)
* [client/js/items.js](https://github.com/browserquest/BrowserQuest/blob/master/client/js/items.js)
* [client/js/map.js](https://github.com/browserquest/BrowserQuest/blob/master/client/js/map.js)
* [client/js/mapworker.js](https://github.com/browserquest/BrowserQuest/blob/master/client/js/mapworker.js)
* [client/js/mob.js](https://github.com/browserquest/BrowserQuest/blob/master/client/js/mob.js)
* [client/js/mobs.js](https://github.com/browserquest/BrowserQuest/blob/master/client/js/mobs.js)
* [client/js/npcs.js](https://github.com/browserquest/BrowserQuest/blob/master/client/js/npcs.js)
* [client/js/pathfinder.js](https://github.com/browserquest/BrowserQuest/blob/master/client/js/pathfinder.js)
* [client/js/player.js](https://github.com/browserquest/BrowserQuest/blob/master/client/js/player.js)
* [client/js/renderer.js](https://github.com/browserquest/BrowserQuest/blob/master/client/js/renderer.js)
* [client/js/sprite.js](https://github.com/browserquest/BrowserQuest/blob/master/client/js/sprite.js)
* [client/js/sprites.js](https://github.com/browserquest/BrowserQuest/blob/master/client/js/sprites.js)
* [client/js/text.js](https://github.com/browserquest/BrowserQuest/blob/master/client/js/text.js)
* [client/js/tile.js](https://github.com/browserquest/BrowserQuest/blob/master/client/js/tile.js)
* [client/js/timer.js](https://github.com/browserquest/BrowserQuest/blob/master/client/js/timer.js)
* [client/js/transition.js](https://github.com/browserquest/BrowserQuest/blob/master/client/js/transition.js)
* [client/js/updater.js](https://github.com/browserquest/BrowserQuest/blob/master/client/js/updater.js)
* [client/js/util.js](https://github.com/browserquest/BrowserQuest/blob/master/client/js/util.js)
* [client/js/warrior.js](https://github.com/browserquest/BrowserQuest/blob/master/client/js/warrior.js)

### Server (Node.js)

* [server/js/checkpoint.js](https://github.com/browserquest/BrowserQuest/blob/master/server/js/checkpoint.js)
* [server/js/chest.js](https://github.com/browserquest/BrowserQuest/blob/master/server/js/chest.js)
* [server/js/chestarea.js](https://github.com/browserquest/BrowserQuest/blob/master/server/js/chestarea.js)
* [server/js/format.js](https://github.com/browserquest/BrowserQuest/blob/master/server/js/format.js)
* [server/js/formulas.js](https://github.com/browserquest/BrowserQuest/blob/master/server/js/formulas.js)
* [server/js/item.js](https://github.com/browserquest/BrowserQuest/blob/master/server/js/item.js)
* [server/js/main.js](https://github.com/browserquest/BrowserQuest/blob/master/server/js/main.js)
* [server/js/map.js](https://github.com/browserquest/BrowserQuest/blob/master/server/js/map.js)
* [server/js/message.js](https://github.com/browserquest/BrowserQuest/blob/master/server/js/message.js)
* [server/js/metrics.js](https://github.com/browserquest/BrowserQuest/blob/master/server/js/metrics.js)
* [server/js/mob.js](https://github.com/browserquest/BrowserQuest/blob/master/server/js/mob.js)
* [server/js/mobarea.js](https://github.com/browserquest/BrowserQuest/blob/master/server/js/mobarea.js)
* [server/js/npc.js](https://github.com/browserquest/BrowserQuest/blob/master/server/js/npc.js)
* [server/js/properties.js](https://github.com/browserquest/BrowserQuest/blob/master/server/js/properties.js)
* [server/js/utils.js](https://github.com/browserquest/BrowserQuest/blob/master/server/js/utils.js)
* [server/js/worldserver.js](https://github.com/browserquest/BrowserQuest/blob/master/server/js/worldserver.js)