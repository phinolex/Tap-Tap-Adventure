*Source file: [server/js/ws.js](https://github.com/browserquest/BrowserQuest/blob/master/server/js/ws.js)*

Abstract class for server objects

Properties
----------
* `port` -- `[number]` Port the server runs on
* `connection_callback` -- `[function]` Callback to be run when client connects?
* `error_callback` -- `[function]` Callback to be run on error events
* `_connections` -- `[array]` Array of `Connection` objects

Methods
-------
* `init(port)`
* `onConnect(callback)`
* `onError(callback)`
* `broadcast(message)`
* `forEachConnection(callback)`
* `addConnection(connection)`
* `removeConnection(id)`
* `getConnection(id)`

**init(port)**

Assigns `port` to `this.port`.

**onConnect(callback)**

Assigns `callback` to `this.connection_callback`.

**onError(callback)**

Assigns `callback` to `this.error_callback`.

**broadcast(message)**

Throws "not implemented".

**forEachConnection(callback)**

Loops through `this._connections` and runs `callback`, passing the connection object as an argument.

**removeConnection(id)**

Deletes `this._connections[id]`.

**getConnection(id)**

Returns `this._connections[id]`.