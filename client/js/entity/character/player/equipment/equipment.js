/**
 * Created by flavius on 2017-03-02.
 */
define(function() {
    var Equipment = Class.extend({
        init: function(kind, skill, skillLevel) {
            var self = this;

            self.kind = kind;
            self.skill = skill;
            self.skillLevel = skillLevel;
        }
    });
});