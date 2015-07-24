Like for [[adding an item|How to add an item]] start by [[drawing your sprite|How to create a sprite]]. As an example, we'll add a character called librarian.

##Create the corresponding entity
The link between the entity and the sprite is to be defined in [shared/js/gametypes.js](https://github.com/browserquest/BrowserQuest/blob/master/shared/js/gametypes.js).
Assign a constant to the entity (in variable `Types.Entities` — attribute `Entities` of the variable `Types` —: `LIBRARIAN: 58`) and then _make the link_, by creating a kind (in variable `kinds`, add `epigraphist: [Types.Entities.LIBRARIAN, "npc"]`).

##Make the character talk
Edit [[Npc]] with the sentences your character is supposed to say to the user.

##Create a class for your npc
In [client/js/npcs.js](https://github.com/browserquest/BrowserQuest/blob/master/client/js/npcs.js), create a class for your npc.
E.g.:`Librarian: Npc.extend({
			init: function(id) {
				this._super(id,Types.Entities.LIBRARIAN,1);
			}
		}),`

##Add a builder to the EntityFactory
Associate the constructor of the class that was just created, to the entity ID it corresponds to:
`EntityFactory.builders[Types.Entities.LIBRARIAN] = function(id){
		return new NPCs.Librarian(id);
	};`

##Add the NPC to the game
Add it to the [spriteNames array](https://github.com/browserquest/BrowserQuest/blob/79431ce7eaf5cbebca1565e41df44cca6ac8f6f2/client/js/game.js#L66).