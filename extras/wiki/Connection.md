*Source file: [server/js/ws.js](https://github.com/browserquest/BrowserQuest/blob/master/server/js/ws.js)*

Abstract connection class

Properties
----------
* id -- `[number]`
* _connection
* _server -- `[object of Class]` Instace of `Server` to which this connection belongs
* close_callback
* listen_callback

Methods
-------
* `init(id, connection, server)`
* `onClose(callback)`
* `listen(callback)`
* `broadcast(message)`
* `send(message)`
* `sendUTF8(message)`
* `close()`