var fs = require('fs');

var FILTER = /^([^\.].*)\.js$/;

module.exports = function requireItems(dir) {

    var files = fs.readdirSync(dir);
    var modules = {};
    var resolve = identity;


    files.forEach(function (file) {
        var match =  file.match(FILTER);
        if (match) {
            modules[match[1]] = resolve(require(dir + file));
        }
    });
    return modules;
};

function identity(val) {
    return val;
}

