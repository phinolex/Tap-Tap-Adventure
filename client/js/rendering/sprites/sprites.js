define(['text!../../../sprites/main.json'], function(MainJson) {

    var sprites = {};
    var sprite = JSON.parse(MainJson);
    _.each(sprite, function(spriteJson) {
        sprites[spriteJson.id] = spriteJson;
    });

    return sprites;
});
