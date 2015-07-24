[client/js/npc.js](https://github.com/browserquest/BrowserQuest/blob/master/client/js/npc.js) defines the Npc class, which uses the NpcTalk array that stores for each character the sequence of sentences it is supposed to produce to players.

The Npc class extends class [Character](https://github.com/browserquest/BrowserQuest/blob/master/client/js/character.js)

## Properties
*`NpcTalk`: Each talking npc is associated to a cell in the array, its content is an array with the sentences to produce in the order in which they are to utter them.

## Methods
*`init`: initialises the npc;
*`talk`: displays the next sentence associated to the character in the NpcTalk table.

## Potential improvements
* The class can be modified with a condition for each sequence so that the message of the character changes depending on who asks when (depending on achievements, the worn armor, etc.)

* It could also be modified to provide multilingual support.