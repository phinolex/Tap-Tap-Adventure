This article only focuses on how to use the communication infrastructure set up to exchange messages between the client and the server. Its aim is not to document the said infrastructures.

The addition of new functionnalities to browser quest will most likely require that the server and the client exchange information. Beyond the websockets in themselves, we'll try to explain here how the server and the client exchange.

They do so by sending each other messages. Each messages is associated to a constant which allows the recipient to expect a certain data structuration, which in terms allows the listener to interpret the data sent to it.

## Preparing communication
### List of message types
The constants associated to the message types are centralized in [shared/js/gametypes.js](https://github.com/browserquest/BrowserQuest/blob/master/shared/js/gametypes.js#L3).

Once a new message type has been added to the constants, it needs to be specified further.

### Messages from the client to the server
#### Server side
The formats of the messages that the server might **receive** are stored in [server/js/format.js](https://github.com/browserquest/BrowserQuest/blob/master/server/js/format.js).

Messages exchanged take the form of an array of data each cell of which can be either a number `'n'` or a string `'s'`. These descriptions are stored in an array (`FormatChecker.formats[Types.Messages.*]`) when they are fixed. When a message can have various number of parameters, the testing is to be hard coded in [check()](https://github.com/browserquest/BrowserQuest/blob/master/server/js/format.js#L23) (cf. the case of `Types.Messages.WHO`).

Then the objects that contain a connection can receive the messages (see `Player::init()`).

#### Client side
The formats are consistent with the **`send*`** functions provided in [client/js/gameclient.js](https://github.com/browserquest/BrowserQuest/blob/master/client/js/gameclient.js#L467). These "send" functions provide an array with the type of message in the first cell and parameters in the next ones. Then, they send it through the `sendMessage` function in [client/js/gameclient.js](https://github.com/browserquest/BrowserQuest/blob/master/client/js/gameclient.js#L110)

### Messages from the server to the client
#### Server side
The messages sent by the server are stored in 
[server/js/message.js](https://github.com/browserquest/BrowserQuest/blob/master/server/js/message.js#L92). They come with an `init` and with a `serialize` method.

The `init` method associates the relevant information to the message (e.g. EquipItem is initialized with a player and an itemKind and stores the id of the player and the itemKind).

The `serialize` method creates an array starting with the constant associated with the type of message and is followed by the relevant data.

#### Client side
The [`GameClient.handlers`](https://github.com/browserquest/BrowserQuest/blob/master/client/js/gameclient.js#L14) array associates to each message ID (cf. [shared/gametypes.js](https://github.com/browserquest/BrowserQuest/blob/master/shared/js/gametypes.js#L3) and above) a receive function.

e.g.:`GameClient.handlers[Types.Messages.EQUIP] = this.receiveEquipItem;`

This function is defined later in [client/js/gameclient.js](https://github.com/browserquest/BrowserQuest/blob/master/client/js/gameclient.js#L164), which will call a callback function (e.g.: [`GameClient.equip_callback`](https://github.com/browserquest/BrowserQuest/blob/master/client/js/gameclient.js#L288) which is to be associated with a function to instantiate the callback : [`onPlayerEquipItem`](https://github.com/browserquest/BrowserQuest/blob/master/client/js/gameclient.js#L419).

## Communicate
### From the server to the client
The `Connection` class is defined in [server/js/ws.js](https://github.com/browserquest/BrowserQuest/blob/master/server/js/ws.js#L54). The `Server` class uses it to store all the connexions made.
There are then two implementations of the `Server` class, which go along with two implementations of the Connection classes ([miksago](https://github.com/miksago/node-websocket-server) and [worlize](https://github.com/Worlize/WebSocket-Node)).

Each of the implementations define a `send` and a `sendUTF8` method.

The `Player` class which is linked to a `connection` (cf. [[IDs]]) defines a `send` method which is linked to the `send` method of its connection. This send method is also used in the [`WorldServer`](https://github.com/browserquest/BrowserQuest/blob/master/server/js/worldserver.js#L315) to process outgoing queues which are arrays associating a message to a connectionID. Basically, any object of the server that needs to communicate with a client needs to have a connection object and use its `send` or `sendUTF8` method.

The listeners defined above should then process these messages.

### From the client to the server
Like for sending messages, the two implementations of connection implement the way they receive messages. Both call the same callback function (`listenCallback`), which is defined at the level of the connection generic class. A "connection" listener is then associated to every server side player.

These listeners process the message sent by the methods created in the GameClient in the first part of this explanation. It is the instance of `GameClient` stored in the `Game` that sends the messages triggered by the actions of the player.



