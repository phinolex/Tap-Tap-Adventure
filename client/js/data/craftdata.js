/* global Types */
define(['text!../../shared/data/craft.json'], function(CraftJson) {

	var CraftData = {};
	CraftData.Kinds = {};
	CraftData.Properties = {};
	var craftParse = JSON.parse(CraftJson);
	$.each( craftParse, function( key, value ) {
		CraftData.Properties[key.toLowerCase()] = {
			key: key.toLowerCase(),
			type: value.type,
			input: value.input,
			output: value.output,
			name: value.name,
			sprite: value.sprite ? value.sprite : '',
		};
		CraftData.Kinds[value.kind] = CraftData.Properties[key.toLowerCase()];
	});
    return CraftData;
});


