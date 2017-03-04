define(['./pointer'], function(Pointer) {
    
    var PointerManager = Class.extend({

        init: function(game) {
            var self = this;

            self.game = game;
            self.container = $('#bubbles');
            self.pointers = {};
        },

        create: function(id) {
            var self = this;
            var el = $("<div class=\"thingy\"></div>"); //.attr('id', id);

            self.updateScale();

            el.css({
                'position': 'relative',
                'width': '' + (16 + 16 * self.scale) + 'px',
                'height': '' + (16 + 16 * self.scale) + 'px',
                'margin': 'inherit',
                'margin-top': '-' + (6 * self.scale) + 'px',
                'top': '' + (10 * self.scale) + 'px',
                'background': 'url("img/' + self.scale + '/pointer.png")'
            });

            $(el).appendTo(this.container);

            self.pointers[id] = new Pointer(id, el);
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

        assignTo: function(id, posX,  posY) {
            var self = this,
                pointer = self.getPointerById(id);

            if (pointer) {
                if (!self.scale)
                    self.updateScale();

                if (!self.camera)
                    self.updateCamera();

                var tileSize = 16 * self.scale,
                    x = ((posX - self.camera.x) * self.scale),
                    w = parseInt(pointer.element.css('width') + 24),
                    offset = (w / 2) - (tileSize / 2), y;

                y = ((posY - self.camera.y) * self.scale) - (tileSize * 2);

                pointer.element.css('left', x - offset + 'px');
                pointer.element.css('top', y + 'px');

            }
        },

        removePointer: function(id) {
            var self = this,
                pointer = self.getPointerById(id);
            
            if (pointer) {
                pointer.destroy();
                delete self.pointers[id]
            }
        },

        update: function() {
            var self = this;

            for (var index in self.pointers) {
                if (self.pointers.hasOwnProperty(index)) {
                    var pointer = self.pointers[index],
                        entity = self.game.getEntityById(pointer.id);

                    if (entity)
                        self.assignToEntity(entity);
                }
            }
        },

        clear: function() {
            var self = this;

            for (var pointer in self.pointers)
                pointer.destroy();

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