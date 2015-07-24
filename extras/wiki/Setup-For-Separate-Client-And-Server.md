The BrowserQuest client files can be served independently of the Node.js backend server.

To do this, change the 'use_one_port' value in server/config.json to 'false' before starting the Node.js server.


Node.js backend setup
---------------------

Getting the backend server up and running is pretty easy. You need to have the following installed:

* Node.js ← Versions 0.8.x-0.10.x work. Do not use 0.6.x, it does not work.
* gcc-c++ ← optional. Not needed on windows.
* GNU make ← optional. Not needed on windows.
* Memcached ← optional. This is needed to enable metrics.
* zlib-devel ← this is the Fedora/RHEL package name, others may be sightly different. Not needed on windows.
* [Redis server](http://redis.io/topics/quickstart) ← this is needed for the game to connect to the backend database.

Clone the git repo:

    $ git clone git://github.com/browserquest/BrowserQuest.git
    $ cd BrowserQuest

Then install the Node.js dependencies by running:

    $ npm install -d

Then start the server by running:

    $ node server/js/main.js

The BrowserQuest server should start up, showing output like this:

    $ node server/js/main.js
    This server can be customized by creating a configuration file named: ./server/config_local.json
    [Thu Sep 13 2012 17:16:27 GMT-0400 (EDT)] INFO Starting BrowserQuest game server...
    [Thu Sep 13 2012 17:16:27 GMT-0400 (EDT)] INFO world1 created (capacity: 200 players).
    [Thu Sep 13 2012 17:16:27 GMT-0400 (EDT)] INFO world2 created (capacity: 200 players).
    [Thu Sep 13 2012 17:16:27 GMT-0400 (EDT)] INFO world3 created (capacity: 200 players).
    [Thu Sep 13 2012 17:16:27 GMT-0400 (EDT)] INFO world4 created (capacity: 200 players).
    [Thu Sep 13 2012 17:16:27 GMT-0400 (EDT)] INFO world5 created (capacity: 200 players).
    [Thu Sep 13 2012 17:16:27 GMT-0400 (EDT)] INFO Server is listening on port 8000

That means its working.  There should not be any warnings or errors.


Client side setup
-----------------

First, set the "host" value in client/config/config_build.json-dist, then copy it to/client/config/config_build.json:

    $ vi client/config/config_build.json-dist
    $ cp client/config/config_build.json-dist client/config/config_build.json

The updated host value must be the IP address of the BrowserQuest Node.js server.  For example:

    {
        "host": "100.200.300.400",
        "port": 8000
    }

Then do the same thing for client/config/config_local.json-dist, editing the host value, then copying it to client/config/config_local.json:

    $ vi client/config/config_local.json-dist
    $ cp client/config/config_local.json-dist client/config/config_local.json

Next, copy the "shared" directory from the root of the git repo, into the "client" directory:

    $ cp -r shared client/

You can now serve the client/ subdirectory using your choice of server software (ie NginX, Apache, lighttpd).  A simpler approach (though not rugged) is to use the included start_dev_client.js script, running it from the root of your BrowserQuest repo:

    $ node bin/start_dev_client.js
    BrowserQuest client server started on port 8080

No warning messages should be displayed.

Using a browser, connect to port 8080 of the IP address you entered above.  The BrowserQuest start page should appear.

If you have the BrowserQuest Node.js server running when you do this, you should then be able to launch and play the game.