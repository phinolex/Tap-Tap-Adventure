/* global Types */
define(['text!../../shared/data/gather.json'], function(GatherJson) {

	var GatherData = {};
	GatherData.Kinds = {};
	GatherData.Properties = {};
	var gatherParse = JSON.parse(GatherJson);
	$.each( gatherParse, function( key, value ) {
		GatherData.Properties[key.toLowerCase()] = {
			key: key.toLowerCase(),
			kind: value.kind,
			name: value.name ? value.name : key,
			sprite: value.sprite ? value.sprite : key.toLowerCase(),
			xp: value.xp ? value.xp : 0,
			level: value.level ? value.level : 0
		};
		GatherData.Kinds[value.kind] = GatherData.Properties[key.toLowerCase()];
	});
    return GatherData;
});

