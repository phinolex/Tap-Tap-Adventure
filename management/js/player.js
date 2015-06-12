module.exports = Player = cls.Class.extend({
    init: function(databaseHandler) {

        if (databaseHandler) {
            databaseHandler.initializeProcesses();
        }
    }
});