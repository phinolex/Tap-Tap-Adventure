var fs = require('fs');

var FILTER = /^([^\.].*)\.js$/;

module.exports = function requireItems() {

    var dirname = __dirname + '/../../../../data/items/';
    var files = fs.readdirSync(dirname);
    var modules = {};
    var resolve = identity;


    files.forEach(function (file) {
        var match =  file.match(FILTER);
        if (match) {
            log.info("Loading Item: " + match[1]);
            modules[match[1]] = resolve(require(dirname + file));
        }
    });
    return modules;
};

function identity(val) {
    return val;
}

