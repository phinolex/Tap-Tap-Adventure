define(['./entitypointer', './locationpointer', './staticpointer'], function(EntityPointer, LocationPointer, StaticPointer) {
    
    var PointerManager = Class.extend({

        init: function(game) {
            var self = this;

            self.game = game;
            self.container = $('#bubbles');
            self.pointers = {};
        },

        create: function(id, pointerType) {
            var self = this;
            var element = $("<div class=\"thingy\"></div>"); //.attr('id', id);

            self.updateScale();

            element.css({
                'position': 'relative',
                'width': '' + (16 + 16 * self.scale) + 'px',
                'height': '' + (16 + 16 * self.scale) + 'px',
                'margin': 'inherit',
                'margin-top': '-' + (6 * self.scale) + 'px',
                'top': '' + (10 * self.scale) + 'px',
                'background': 'url("img/' + self.scale + '/pointer.png")'
            });

            $(element).appendTo(this.container);

            var pointer;

            switch (pointerType) {
                case Types.Pointers.Location:
                    pointer = new LocationPointer(id, element);
                    break;

                case Types.Pointers.Entity:
                    pointer = new EntityPointer(id, element);
                    break;

                case Types.Pointers.Static:
                    pointer = new StaticPointer(id, element);
                    break;
            }

            self.pointers[id] = pointer;
        },

        assignToEntity: function(character) {
            var self = this,
                pointer = self.getPointerById(character.id);

            if (pointer) {
                self.updateScale();
                self.updateCamera();

                var tileSize = 16 * self.scale,
                    x = ((character.x - self.camera.x) * self.scale),
                    w = parseInt(pointer.element.css('width') + 24),
                    offset = (w / 2) - (tileSize / 2), y;

                y = ((character.y - self.camera.y) * self.scale) - (tileSize * 2);

                pointer.element.css('left', x - offset + 'px');
                pointer.element.css('top', y + 'px');

            }
        },

        assignToPoint: function(id, posX,  posY) {
            var self = this,
                pointer = self.getPointerById(id);

            if (pointer) {
                if (!self.scale)
                    self.updateScale();

                if (!self.camera)
                    self.updateCamera();

                if (pointer.x == -1)
                    pointer.x = posX;

                if (pointer.y == -1)
                    pointer.y = posY;

                var tileSize = 16 * self.scale,
                    x = ((posX - self.camera.x) * self.scale),
                    w = parseInt(pointer.element.css('width') + 24),
                    offset = (w / 2) - (tileSize / 2), y;

                y = ((posY - self.camera.y) * self.scale) - (tileSize * 2);

                pointer.element.css('left', x - offset + 'px');
                pointer.element.css('top', y + 'px');


            }
        },

        assignRelativeToScreen: function(id, x, y) {
            var self = this,
                pointer = self.getPointerById(id);

            if (pointer) {
                pointer.element.css('left', (x * self.scale) + 'px');
                pointer.element.css('top', (y * self.scale) + 'px');
            }
        },

        update: function() {
            var self = this;

            for (var id in self.pointers) {
                if (self.pointers.hasOwnProperty(id)) {
                    var pointer = self.pointers[id];

                    if (pointer) {
                        switch (pointer.getType()) {
                            case Types.Pointers.Entity:

                                var entity = self.game.getEntityById(pointer.id);

                                if (entity)
                                    self.assignToEntity(entity);

                                break;

                            case Types.Pointers.Location:

                                if (pointer.x != -1 && pointer.y != -1)
                                    self.assignToPoint(pointer.id, pointer.x, pointer.y);

                                break;
                        }
                    }
                }
            }
        },

        clear: function() {
            var self = this;

            for (var id in self.pointers)
                if (self.pointers.hasOwnProperty(id))
                    self.pointers[id].destroy();

            self.pointers = {};
        },

        updateScale: function() {
            this.scale = this.game.getScaleFactor();
        },

        updateCamera: function() {
            this.camera = this.game.camera;
        },

        getPointerById: function(id) {
            if (id in this.pointers)
                return this.pointers[id];

            return null;
        }

    });
    
    return PointerManager;
});