var fs = require('fs'),
    config = require('../config.json'),
    MySQL = require('./database/mysql'),
    WebSocket = require('./network/websocket'),
    _ = require('underscore'),
    allowConnections = false,
    Parser = require('./util/parser'),
    ShutdownHook = require('shutdown-hook'),
    Log = require('log');

log = new Log(config.worlds > 1 ? 'notice' : config.debugLevel, config.localDebug ? fs.createWriteStream('runtime.log') : null);

function Main() {

    log.notice('Initializing ' + config.name + ' game engine...');

    var shutdownHook = new ShutdownHook(),
        World = require('./game/world'),
        worlds = [],
        webSocket = new WebSocket.Server(config.host, config.port, config.gver),
        database;

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

        allowConnections = true;

        log.notice('Finished creating ' + worlds.length + ' world' + (worlds.length > 1 ? 's' : '') + '!');

        initializeWorlds(worlds);
        loadParser();

    }, 200);

    webSocket.onRequestStatus(function() {
        return JSON.stringify(getPopulations(worlds));
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
        saveAll(worlds);
    });

}

function loadParser() {
    new Parser();
}

function initializeWorlds(worlds) {
    for (var worldId in worlds)
        if (worlds.hasOwnProperty(worldId))
            worlds[worldId].load();
}

function getPopulations(worlds) {
    var counts = [];

    for (var index in worlds)
        if (worlds.hasOwnProperty(index))
            counts.push(worlds[index].playerCount);

    return counts;
}

function saveAll(worlds) {
    _.each(worlds, function(world) {
        world.saveAll();
    });

    log.notice('Saved players for ' + worlds.length + ' world(s).')
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