define(['./pointer'], function(Pointer) {
   
    var EntityPointer = Pointer.extend({

        init: function(id, element) {
            var self = this;

            self._super(id, element, Types.Pointers.Entity);
        }
    });

    return EntityPointer;
});