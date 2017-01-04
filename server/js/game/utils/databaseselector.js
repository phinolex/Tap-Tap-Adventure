/* global module, __dirname */

path = require('path');

module.exports = function(config) {
    return require(path.resolve(__dirname, '../databases', config.database));
};
