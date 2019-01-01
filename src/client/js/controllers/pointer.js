define(['jquery', '../renderer/pointers/pointer'], function($, Pointer) {
  return Class.extend({

    init(game) {
      var self = this;

      this.game = game;
      this.pointers = {};
      this.scale = this.getScale();
      this.container = $('#bubbles');
    },

    create(id, type) {
      var self = this;

      if (id in this.pointers) {
        return;
      }

      var element = $('<div id="' + id + '" class="pointer"></div>');

      this.setSize(element);

      this.container.append(element);

      this.pointers[id] = new Pointer(id, element, type);
    },

    resize() {
      var self = this;

      _.each(this.pointers, function(pointer) {

        switch (pointer.type) {
          case Modules.Pointers.Relative:
            var scale = this.getScale(),
              x = pointer.x,
              y = pointer.y,
              offsetX = 0,
              offsetY = 0;

            if (scale === 1) {
              offsetX = pointer.element.width() / 2 + 5;
              offsetY = pointer.element.height() / 2 - 4;
            }

            pointer.element.css('left', (x * scale) - offsetX + 'px');
            pointer.element.css('top', (y * scale) - offsetY + 'px');
            break;
        }
      });
    },

    setSize(element) {
      var self = this;
      var width = 8;
      var height = width + (width * .2);
      var image = 'url("img/common/hud-active.png")';

      this.updateScale();

      element.css({
        'width': (width * this.scale) + 'px',
        'height': (height * this.scale) + 'px',
        'margin': 'inherit',
        'margin-top': '-' + ((height / 2) * this.scale) + 'px',
        'margin-left': '1px',
        'top': (height * this.scale) + 'px',
        'background': image,
        'background-size': '100% 100%',
      });
    },

    clean() {
      var self = this;

      _.each(this.pointers, function(pointer) {
        pointer.destroy();
      });

      this.pointers = {};
    },

    destroy(pointer) {
      var self = this;

      delete this.pointers[pointer.id];
      pointer.destroy();
    },

    set(pointer, posX, posY) {
      var self = this;

      this.updateScale();
      this.updateCamera();

      var tileSize = 16 * this.scale,
        x = ((posX - this.camera.x) * this.scale),
        width = parseInt(pointer.element.css('width') + 24),
        offset = (width / 2) - (tileSize / 2),
        y;

      y = ((posY - this.camera.y) * this.scale) - tileSize;

      pointer.element.css('left', (x - offset) + 'px');
      pointer.element.css('top', y + 'px');
    },

    setToEntity(entity) {
      var self = this,
        pointer = this.get(entity.id);

      if (!pointer)
        return;

      console.log('set to entity', entity);

      this.set(pointer, entity.x, entity.y);
    },

    setToPosition(id, x, y) {
      var self = this,
        pointer = this.get(id);

      if (!pointer) {
        return;
      }

      pointer.setPosition(x, y);

      this.set(pointer, x, y);
    },

    setRelative(id, x, y) {
      var self = this,
        pointer = this.get(id);

      if (!pointer) {
        return;
      }

      var scale = this.getScale(),
        offsetX = 0,
        offsetY = 0;

      /**
       * Must be set in accordance to the lowest scale.
       */

      if (scale === 1) {
        offsetX = pointer.element.width() / 2 + 5;
        offsetY = pointer.element.height() / 2 - 4;
      }

      pointer.setPosition(x, y);

      pointer.element.css('left', (x * scale) - offsetX + 'px');
      pointer.element.css('top', (y * scale) - offsetY + 'px');
    },

    update() {
      var self = this;

      _.each(this.pointers, function(pointer) {

        switch (pointer.type) {
          case Modules.Pointers.Entity:

            var entity = this.game.entities.get(pointer.id);

            if (entity) {
              this.setToEntity(entity);
            } else {
              this.destroy(pointer);
            }
            break;

          case Modules.Pointers.Position:
            if (pointer.x !== -1 && pointer.y !== -1) {
              this.set(pointer, pointer.x, pointer.y);
            }
            break;
        }
      });
    },

    get(id) {
      var self = this;

      if (id in this.pointers) {
        return this.pointers[id];
      }

      return null;
    },

    updateScale() {
      this.scale = this.getDrawingScale();
    },

    updateCamera() {
      this.camera = this.game.renderer.camera;
    },

    getScale() {
      return this.game.getScaleFactor();
    },

    getDrawingScale() {
      return this.game.renderer.getDrawingScale();
    }
  });
});
