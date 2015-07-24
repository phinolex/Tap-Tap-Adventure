First, a rough outline of how battles are initiated:

* `this.makePlayerAttack(entity)` called in `game.click()`.
* `this.createAttackLink(this.player, mob)` called in `this.makePlayerAttack(mob)`.
* `attacker.engage(target)` called in `this.createAttackLink(attacker, target)`.
* TODO: finish

Networking
----------

* Client sends a message `Types.Messages.ATTACK` passing `mob.id`
* The player's [[Player]] instance on the server listens on the websocket connection and handles the `Types.Messages.ATTACK` message on line 117.


# From the [ParticleQuest Etherpad](http://pad.p2pu.org/p/browserquest):

Attacking
---------

In [client/js/game.js](https://github.com/browserquest/BrowserQuest/blob/master/client/js/game.js), the click() function, as it says, "Processes game logic when the user triggers a click/touch event during the game."

This includes calling makePlayerAttack() if the target location of the click contains an entity of type Mob.

makePlayerAttack() notifies the server by sending an ATTACK message and then calling createAttackLink() which calls engage().

engage (defined in [client/js/character.js](https://github.com/browserquest/BrowserQuest/blob/master/client/js/character.js)) sets attackingMode to be true, sets the target in the player object, and assigns the attacking player to follow the target if it moves.  That's about it on the client side.

On the server side, the ATTACK message invokes a callback onEntityAttack (in [server/js/worldserver.js](https://github.com/browserquest/BrowserQuest/blob/master/server/js/worldserver.js)) 
... (more server)
* attack animation
* attack computing when dead
* despawn
* object rewards