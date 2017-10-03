/* global Modules, log */

define(function() {

    return Class.extend({

        init: function(renderer) {
            var self = this;

            self.renderer = renderer;

            self.offset = 0.5;
            self.x = 0;
            self.y = 0;

            self.dX = 0;
            self.dY = 0;

            self.gridX = 0;
            self.gridY = 0;

            self.prevGridX = 0;
            self.prevGridY = 0;

            self.speed = 1;
            self.panning = false;
            self.centered = true;
            self.player = null;

            self.update();
        },

        update: function() {
            var self = this,
                factor = self.renderer.getUpscale();

            self.gridWidth = 15 * factor;
            self.gridHeight = 8 * factor;
        },

        setPosition: function(x, y) {
            var self = this;

            self.x = x;
            self.y = y;

            self.prevGridX = self.gridX;
            self.prevGridY = self.gridY;

            self.gridX = Math.floor(x / 16);
            self.gridY = Math.floor(y / 16);
        },

        clip: function() {
            this.setGridPosition(Math.round(this.x / 16), Math.round(this.y / 16));
        },

        center: function() {
            var self = this;

            if (self.centered)
                return;

            self.centered = true;
            self.centreOn(self.player);
        },

        decenter: function() {
            var self = this;

            if (!self.centered)
                return;

            self.clip();
            self.centered = false;
        },

        setGridPosition: function(x, y) {
            var self = this;

            self.prevGridX = self.gridX;
            self.prevGridY = self.gridY;

            self.gridX = x;
            self.gridY = y;

            self.x = self.gridX * 16;
            self.y = self.gridY * 16;
        },

        setPlayer: function(player) {
            var self = this;

            self.player = player;

            self.centreOn(self.player);
        },

        handlePanning: function(direction) {
            var self = this;

            if (!self.panning)
                return;

            switch (direction) {
                case Modules.Keys.Up:
                    self.setPosition(self.x, self.y - 1);
                    break;

                case Modules.Keys.Down:
                    self.setPosition(self.x, self.y + 1);
                    break;

                case Modules.Keys.Left:
                    self.setPosition(self.x - 1, self.y);
                    break;

                case Modules.Keys.Right:
                    self.setPosition(self.x + 1, self.y);
                    break;
            }
        },

        centreOn: function(entity) {
            var self = this;

            if (!entity)
                return;

            var width = Math.floor(self.gridWidth / 2),
                height = Math.floor(self.gridHeight / 2);

            self.x = entity.x - (width * self.renderer.tileSize);
            self.y = entity.y - (height * self.renderer.tileSize);

            self.gridX = Math.round(entity.x / 16) - width;
            self.gridY = Math.round(entity.y / 16) - height;
        },

        zone: function(direction) {
            var self = this;

            switch (direction) {
                case Modules.Orientation.Up:

                    self.setGridPosition(self.gridX, self.gridY - self.gridHeight + 2);

                    break;

                case Modules.Orientation.Down:

                    self.setGridPosition(self.gridX, self.gridY + self.gridHeight - 2);

                    break;

                case Modules.Orientation.Right:

                    self.setGridPosition(self.gridX + self.gridWidth - 2, self.gridY);

                    break;

                case Modules.Orientation.Left:

                    self.setGridPosition(self.gridX - self.gridWidth + 2, self.gridY);

                    break;
            }
        },

        forEachVisiblePosition: function(callback, offset) {
            var self = this;

            if (!offset)
                offset = 1;

            for(var y = self.gridY - offset, maxY = y + self.gridHeight + (offset * 2); y < maxY; y++) {
                for(var x = self.gridX - offset, maxX = x + self.gridWidth + (offset * 2); x < maxX; x++)
                    callback(x, y);
            }
        }

    });

});