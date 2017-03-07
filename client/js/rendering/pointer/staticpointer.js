define(['./pointer'], function(Pointer) {

    var StaticPointer = Pointer.extend({

        init: function(id, element) {
            var self = this;
            self._super(id, element, Types.Pointers.Static);

            self.x = -1;
            self.y = -1;
        }
    });

    return StaticPointer;
});