var fs = require('fs'),
    config = require('../config.json'),
    MySQL = require('./database/mysql'),
    WebSocket = require('./network/websocket'),
    _ = require('underscore'),
    allowConnections = false,
    Parser = require('./util/parser'),
    ShutdownHook = require('shutdown-hook'),
    Log = require('log'),
    worlds = [], database,
    Bot = require('../../tools/bot/bot');

var worldsCreated = 0;

log = new Log(config.worlds > 1 ? 'notice' : config.debugLevel, config.localDebug ? fs.createWriteStream('runtime.log') : null);

function Main() {

    log.notice('Initializing ' + config.name + ' game engine...');

    var shutdownHook = new ShutdownHook(),
        stdin = process.openStdin(),
        World = require('./game/world'),
        webSocket = new WebSocket.Server(config.host, config.port, config.gver);

    if (!config.offlineMode)
        database = new MySQL(config.mysqlHost, config.mysqlPort, config.mysqlUser, config.mysqlPassword, config.mysqlDatabase);

    webSocket.onConnect(function(connection) {
        if (!allowConnections) {
            connection.sendUTF8('disallowed');
            connection.close();
        }

        var world;

        for (var i = 0; i < worlds.length; i++) {
            if (worlds[i].playerCount < worlds[i].maxPlayers) {
                world = worlds[i];
                break;
            }
        }

        if (world)
            world.playerConnectCallback(connection);
        else {
            log.info('Worlds are currently full, closing...');

            connection.sendUTF8('full');
            connection.close();
        }

    });

    setTimeout(function() {
        for (var i = 0; i < config.worlds; i++)
            worlds.push(new World(i + 1, webSocket, database));

        loadParser();
        initializeWorlds();

    }, 200);

    webSocket.onRequestStatus(function() {
        return JSON.stringify(getPopulations());
    });

    webSocket.onError(function() {
        log.notice('Web Socket has encountered an error.');
    });

    /**
     * We want to generate worlds after the socket
     * has finished initializing.
     */

    process.on('SIGINT', function() {
        shutdownHook.register();
    });

    process.on('SIGQUIT', function() {
        shutdownHook.register();
    });

    shutdownHook.on('ShutdownStarted', function(e) {
        saveAll();
    });

    stdin.addListener('data', function(data) {
        /**
         * We have to cleanse the raw message because of the \n
         */

        var message = data.toString().replace(/(\r\n|\n|\r)/gm, ''),
            type = message.charAt(0);

        if (type !== '/')
            return;

        var blocks = message.substring(1).split(' '),
            command = blocks.shift();

        if (!command)
            return;

        switch (command) {

            case 'stop':

                log.info('Safely shutting down the server...');

                saveAll();

                process.exit();

                break;

            case 'saveall':

                saveAll();

                break;

            case 'alter':

                if (blocks.length !== 3) {
                    log.error('Invalid command format. /alter [database] [table] [type]');
                    return;
                }

                if (!database) {
                    log.error('The database server is not available for this instance of ' + config.name + '.');
                    log.error('Ensure that the database is enabled in the server configuration.');
                    return;
                }

                var db = blocks.shift(),
                    table = blocks.shift(),
                    dType = blocks.shift();

                database.alter(db, table, dType);

                break;

            case 'bot':

                var count = parseInt(blocks.shift());

                if (!count)
                    count = 1;

                new Bot(worlds[0], count);

                break;
        }

    });

}


function onWorldLoad() {
    worldsCreated++;
    if (worldsCreated == worlds.length)
        allWorldsCreated();
}

function allWorldsCreated() {
    log.notice('Finished creating ' + worlds.length + ' world' + (worlds.length > 1 ? 's' : '') + '!');
    allowConnections = true;

    var host = config.host == '0.0.0.0' ? 'localhost' : config.host;
    log.notice('Connect locally via http://' + host + ":" + config.port);
}

function loadParser() {
    new Parser();
}

function initializeWorlds() {
    for (var worldId in worlds)
        if (worlds.hasOwnProperty(worldId))
            worlds[worldId].load(onWorldLoad);
}

function getPopulations() {
    var counts = [];

    for (var index in worlds)
        if (worlds.hasOwnProperty(index))
            counts.push(worlds[index].getPopulation());

    return counts;
}

function saveAll() {
    _.each(worlds, function(world) {
        world.saveAll();
    });

    var plural = worlds.length > 1;

    log.notice('Saved players for ' + worlds.length + ' world' + (plural ? 's' : '') + '.');
}

if ( typeof String.prototype.startsWith !== 'function' ) {
    String.prototype.startsWith = function( str ) {
        return str.length > 0 && this.substring( 0, str.length ) === str;
    };
}

if ( typeof String.prototype.endsWith !== 'function' ) {
    String.prototype.endsWith = function( str ) {
        return str.length > 0 && this.substring( this.length - str.length, this.length ) === str;
    };
}

new Main();