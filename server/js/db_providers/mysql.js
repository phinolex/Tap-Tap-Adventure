var cls = require("./lib/class"),
    Player = require("./player"),
    mysql = require("mysql"),
    Messages = require("../message"),
    bcrypt = require("bcrypt"),
    inventory = require("../inventory");
    
  module.exports = Mysql = cls.Class.extend({
      init() {
        var mysqlConfigurations = {
            host: "127.0.0.1",
            user: "root",
            password: "PASSHERE",
            database: "tta_database",
            charset: "utf8"
        };
        this.client = mysql.createConfiguartion(mysqlConfigurations);
      }
  });
