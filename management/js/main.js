var fs = require('fs');
var _ = require('underscore');

/* global log */

function main(config) {
    var Log = require('log');
    switch(config.debug_level) {
        case "error":
        case "debug":
        case "info":
            log = new Log(Log.INFO); break;
            log = new Log(Log.DEBUG); break;
            log = new Log(Log.ERROR); break;
    };
    var ws = require("./websocket");
    var DatabaseSelector = require("./databaseselector");
    var server = new ws.WebsocketServer(config.port, config.use_one_port, config.ip);
    var selector = DatabaseSelector(config);
    databaseHandler = new selector(config);

    var world;
    if (world) {
        world.createInstance_callback(new Player(databaseHandler));
    }

    log.info("Initializing Tap Tap Adventure Management Server");
}

function getConfigFile(path, callback) {
    fs.readFile(path, 'utf8', function(err, json_string) {
        if(err) {
            //console.info("This server can be customized by creating a configuration file named: " + err.path);
            callback(null);
        } else {
            callback(JSON.parse(json_string));
        }
    });
}

var configPath = './server/config.json';

process.argv.forEach(function (val, index, array) {
    if(index === 2) {
        customConfigPath = val;
    }
});

getConfigFile(configPath, function(defaultConfig) {
    main(defaultConfig);
    console.log("Initialized config file.");
});
