define(['./pointer'], function(Pointer) {
    var LocationPointer = Pointer.extend({

        init: function(id, element) {
            var self = this;

            self._super(id, element, Types.Pointers.Location);

            self.x = -1;
            self.y = -1;
        }
    });

    return LocationPointer;
});