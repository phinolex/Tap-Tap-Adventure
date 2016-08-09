
var _ = require("underscore"),
    SpawnJson = require("../../shared/data/entity_spawn.json"),
    fs = require('fs');


var EntitySpawnData = [];

var i=0;
_.each( SpawnJson, function( value, key ) {
	EntitySpawnData[i++] = value;
});

var addSpawn = function (id, x, y) {
    //log.info("addSpawn");
    EntitySpawnData.push({"id": id, "x": x, "y": y});
};

var saveSpawns = function() {
	log.info(JSON.stringify(EntitySpawnData));
	fs.writeFile("./shared/data/entity_spawn.json", JSON.stringify(EntitySpawnData), function (err,data) {
		if (err) {
			return log.info(err);	
		}
		//log.info(data);
	});
};


module.exports.EntitySpawnData = EntitySpawnData;
module.exports.addSpawn = addSpawn;
module.exports.saveSpawns = saveSpawns;

