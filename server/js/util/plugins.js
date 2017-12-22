var fs = require('fs'),
    Filter = /^([^\.].*)\.js$/;

function identity(val) {
    return val;
}

module.exports = function requireItems(directory) {
    var files = fs.readdirSync(directory),
        modules = {},
        resolve = identity;

    files.forEach(function(file) {
        var match = file.match(Filter);

        if (match)
            modules[match[1]] = resolve(require(directory + file));

    });

    return modules;
};