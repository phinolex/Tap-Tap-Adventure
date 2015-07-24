To add guilds to browser quest, the following modifications were made…

##Functionnalities
Now, first things first here is how it works from the player's perspective. Every action of the guild is performed using the chat as a command line interface. Here is the list of commands (the dedicated piece of code is /client/game.js and tagged with `//#cli guilds`) :
* **create** guildName → the user creates a new guild and joins it (if they have already a guild, they automatically leave it to join the created one);
* **invite** playerName → the user invites player "playerName" to his/her guild (the user needs to see player playerName for them to receive the invite), the latter needs to answer the invite within 10 minutes using :
* **guildjoin** yes / **guildjoin** no → accept or decline an invitation;
* **guild:** message → send a message to everyone in your guild at the same time;
* **leaveguild** → leave your guild. 
The guilds come with a set of notifications about other member of your guild's actions.

##Implementation and notes

### Population
The guild population is stored and indicated in the population zone (an extra div has been added to index.html) 2 informations :
* guild population come independently from the computation of other aspects of the population, from my experience, it is more up to date than the other indicators.
* to add an item to the population menu, I changed the way the css uses barsheet.png. The part of the population zone that is below the main bar should be "cropable off". It could save a bit of bandwidth and memory…

### Gametypes
I regrouped all the constants related to the guilds in two sets `Types.Messages.GUILDERRORTYPE` and `Types.Messages.GUILDACTION`. Which one to look into is decided by whether the message received or sent uses the constant `Types.Messages.GUILDERROR` or `Types.Messages.GUILD`.

### Client side
#### guild.js
On the client side the Guild as a class stores virtually nothing, but its id and its name. But it could be more than that see the #updateguild tags in the "debug commit".
#### player.js
A guild parameter has been added to the constructor, and it takes a Guild object.
The following method have been added:
* `setGuild`;
* `hasGuild`;
* `getGuild`;
* `unsetGuild`;
* `addInvite`: stores the moment of the invite and the guild it is for, to leave 10 minutes to the user to answer;
* `deleteInvite`;
* `checkInvite`: is the invite still available? (only condition being time, but we could imagine other mechanisms).

#### main.js
Mostly how to display the guild to the user (see Population above). Instantiates `Game.onGuildPopulationChange()`.

#### gameclient.js
Two handlers (for the reception of messages from the server have been created) :
* `receiveGuildError`: handles the errors;
* `receiveGuild`: dispatches the messages received to the appropriate function, depending on what the "GUILDACTION" is.
* For each message a callback function and the "event" to instantiate it is created.
* send methods are also created for the outgoing messages, they are located at the end of the source file.

#### game.js
* `say` method contains the cli based on a regular expression. Therefore, if you want to change the command names, that's here, if you want to add some as well and finally if you want to change interface (click actions for instance) you can find the methodcalls there.
* Instantiation of some callback functions

#### storage.js
Edited the `savePlayer` method so that it also saves the guild. The guild can then be retrieved from the local storage.

### Server side
#### format.js
Added tests for the format of all the guild messages, grouped under the `Types.Messages.GUILD` case. The server can receive:
* `Types.Messages.GUILDACTION.CREATE`: create a guild;
* `Types.Messages.GUILDACTION.INVITE`: invite a player;
* `Types.Messages.GUILDACTION.JOIN`: an invited player answer;
* `Types.Messages.GUILDACTION.LEAVE`: leave a guild;
* `Types.Messages.GUILDACTION.TALK`: broadcast text to the guild.

#### player.js
The player includes a guildId attribute, that contains the guilds Id in the server's list of guilds. It sends the following messages:
* `Types.Messages.GUILDERRORTYPE.IDWARNING`: the guild has changed id since the last time the player was online (did not handle it on the client side, more developper oriented, could just be a log on the server);
* `Types.Messages.GUILDERRORTYPE.BADNAME`: The name for the guild has a bad format;
* `Types.Messages.GUILDACTION.CREATE`: sends back to the user the guild Id;
* `Types.Messages.GUILDACTION.TALK`: forwards the message to the guild members;
* `Types.Messages.GUILDACTION.LEAVE`: someone left/the user left;
* `Types.Messages.GUILDERRORTYPE.NOLEAVE`: somehow manged to send a leave message without having a guild (should not happen).

The player object receives and handles the following guild messages:
* `Types.Messages.GUILDACTION.CREATE`;
* `Types.Messages.GUILDACTION.INVITE`;
* `Types.Messages.GUILDACTION.JOIN`;
* `Types.Messages.GUILDACTION.LEAVE`;
* `Types.Messages.GUILDACTION.TALK`.

#### worldserver.js
edited to take guilds into account and send appropriate messages.
`this.guilds` now contains a associative array storing `guildId:guild` pairs.
New methods have been created:
* `pushToGuild(guild, message, except)`: sends the message `message` to all members of the guild `guild` except to player `except` (when provided, otherwise sends to all);
* `reloadGuild(guildId, guildName)`: checks if the guild of the player is still on the server, creates it if necessary and returns its Id (to be sent to the client later).
* `addGuild(guildName)`: creates a new Guild and returns its id if the name is not taken, returns false otherwise
* `getStrigGuilds()`: function that is erased in the last commit, that allows to display the content of the list of guilds…
These methods send the following messages to the client:
* `Types.Messages.GUILDERRORTYPE.DOESNOTEXIST`: tries to join a guild that does not exist (should not happen, client response not implemented);
* `Types.Messages.GUILDERRORTYPE.GUILDRULES`: not implemented yet, if we make rules about how to create guilds…
Some methods have been altered to send the following messages :
* `Types.Messages.GUILDACTION.CONNECT`: to the other members of the guild, a player connected;
* `Types.Messages.GUILDACTION.ONLINE`: to the player connecting, which members of the guild are already online;
* `Types.Messages.GUILDACTION.DISCONNECT`: to the members of the guild, a player disconnected.

####guild.js
On the server side the guilds are more detailed, they contain:
* a unique id;
* a name;
* the server that handles it;
* a list of members `{player.id:player.name}`;
* a list of sent invites `{invitedplayer.id:timeOfInvite}`.
It allows to add/remove a member, add/delete an invite, check its validity (issued less than 10 minutes ago), list the user names and it sends the following messages to the client:
* `Types.Messages.GUILDACTION.JOIN`: a user joined or refused to join the guild (or failed to join in time);
* `Types.Messages.GUILDACTION.POPULATION`: how many members are connected;
* `Types.Messages.GUILDERRORTYPE.BADINVITE`: trying to invite a member of the guild;
* `Types.Messages.GUILDACTION.INVITE`: sends the invite to the client.
