
var Logger = function(level) {
    this.level = level;
};

Logger.prototype.info = function() {};
Logger.prototype.debug = function() {};
Logger.prototype.error = function() {};

//>>excludeStart("prodHost", pragmas.prodHost);
Logger.prototype.info = function(message) {
    console.info(message);
};

Logger.prototype.debug = function(message) {
    console.log(message);
};

Logger.prototype.error = function(message, stacktrace) {
    if(stacktrace !== undefined && stacktrace === true) {
        var trace = printStackTrace();
        console.error(trace.join('\n\n'));
        console.error('-----------------------------');
    }
};
//>>excludeEnd("prodHost");

log = new Logger("debug");