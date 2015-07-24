Here we are going to see which files to edit to add a new persona. To exemplify, we will follow up on the “[[How to add an item]]” article in which we created a “rosetta stone” item, to create an [epigraphist](http://en.wikipedia.org/wiki/Epigraphist) (nothing to do with the actual game…)

## Create your sprite
See the [[How to create a sprite]] article.

### Display it as a status
[client/js/app.js](https://github.com/browserquest/BrowserQuest/blob/master/client/js/app.js) defines a getIconPath method, which returns a path to an image will be added to the interface as armor status.
This method adds 'item-' to the sprite name (which is the name of the armor).

This item- can both be used to be an item that the player loots to get the armor and as a status element. Refer to [[How to add an item]] to make it a full scale item. This png sprite can be used just to indicate the status. Due to css constraints, the smaller scale of this version must be 96x16 px (the icon will be the 3rd image from the left in the sprite → 32px< x ≤ 48px).

In [client/js/app.js](https://github.com/browserquest/BrowserQuest/blob/master/client/js/app.js), it is [possible](https://github.com/browserquest/BrowserQuest/blob/79431ce7eaf5cbebca1565e41df44cca6ac8f6f2/client/js/app.js#L247) to decide that an armor is just temporary and should not be added to the status… 

## Create the related entity
The link between the entity and the sprite is to be defined in [shared/js/gametypes.js](https://github.com/browserquest/BrowserQuest/blob/master/shared/js/gametypes.js).
Assign a constant to the entity (in variable `Types.Entities` — attribute `Entities` of the variable `Types` —: `EPIGRAPHIST: 57`) and then _make the link_, by creating a kind (in variable `kinds`, add `epigraphist: [Types.Entities.EPIGRAPHIST, "armor"]`).

**NB:** When building a real armor, it should maybe be added to the array `Types.rankedArmor`, in order to estimate its capabilities.

## Integrate in the game
### in [client/js/game.js](https://github.com/browserquest/BrowserQuest/blob/master/client/js/game.js)
* add to the list of [spriteNames](https://github.com/browserquest/BrowserQuest/blob/79431ce7eaf5cbebca1565e41df44cca6ac8f6f2/client/js/game.js#L66)
* the method to call to have the player use the armor that was defined is [switchArmor](https://github.com/browserquest/BrowserQuest/blob/79431ce7eaf5cbebca1565e41df44cca6ac8f6f2/client/js/player.js#L136). Depending on the condition in which the user should use this new armor a function call of the type [`self.player.switchArmor(self.sprites["epigraphist"]);`](https://github.com/browserquest/BrowserQuest/blob/79431ce7eaf5cbebca1565e41df44cca6ac8f6f2/client/js/game.js#L1068) should be integrated in a callback loop (TODO verify/explain the following). It can be launched on any event.
* If the armor is created like any other armor — which is not exactly the case here —, it will be called upon [looting](https://github.com/browserquest/BrowserQuest/blob/79431ce7eaf5cbebca1565e41df44cca6ac8f6f2/client/js/game.js#L1057).
* then the armor worn can condition any action and can be obtained through the call of [Player.getSpriteName()](https://github.com/browserquest/BrowserQuest/blob/79431ce7eaf5cbebca1565e41df44cca6ac8f6f2/client/js/player.js#L67), which, in the case of our example, returns "epigraphist".

###The callback loop… :-S
* In [client/js/player.js](https://github.com/browserquest/BrowserQuest/blob/master/client/js/player.js):
create a new event in Player. It will define a variable containing a callback function
`onEpigraphist: function(callback) {
            this.epigraphist_callback = callback;
        }`
* In [client/js/game.js](https://github.com/browserquest/BrowserQuest/blob/master/client/js/game.js):
In the [Game.connect()](https://github.com/browserquest/BrowserQuest/blob/79431ce7eaf5cbebca1565e41df44cca6ac8f6f2/client/js/game.js#L715) method, call the previously defined method in which the switchArmor method is called
` self.player.onEpigraphist(function() {
					self.player.switchArmor(self.sprites["epigraphist"]);
				});`
This will assign the method call to the epigraphist_callback variable previously defined.
* Wherever you need to (where you will launch the event that will change the armor), call the variable containing the method: `onLoot: function(player){
				player.epigraphist_callback();
			}` ← for the case in which an onLoot method is added to an item (for instance, the rosetta stone we defined [[here|How to add an item]]).