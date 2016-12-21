
define(function() {

    var Camera = Class.extend({
        init: function(game, renderer) {
            this.game = game;
            this.renderer = renderer;
            this.offset = 0.5;
            this.x = 0;
            this.y = 0;
            this.gridX = 0;
            this.gridY = 0;

            this.rescale();
        },

        rescale: function() {
            var factor = this.renderer.mobile ? 1 : 2;

            this.gridW = 15 * factor;
            this.gridH = ~~(7.5 * factor);
            this.gridW2 = Math.floor(this.gridW / 2);
            this.gridH2 = Math.floor(this.gridH / 2);

            this.isattached = false;

            log.debug("---------");
            log.debug("Factor:"+factor);
            log.debug("W:"+this.gridW + " H:" + this.gridH);
        },

        setPosition: function(x, y) {
            this.x = x;
            this.y = y;

            this.gridX = Math.floor( x / 16 );
            this.gridY = Math.floor( y / 16 );
        },

        setGridPosition: function(x, y) {
            this.gridX = x;
            this.gridY = y;

            this.x = this.gridX * 16;
            this.y = this.gridY * 16;
        },

        setRealCoords: function() {
            if (!this.game.player)
                return;

            this.x = this.game.player.x - (this.gridW2 * this.renderer.tilesize);
            this.y = this.game.player.y - (this.gridH2 * this.renderer.tilesize);

            this.gridX = Math.round(this.game.player.x / 16) - this.gridW2;
            this.gridY = Math.round(this.game.player.y / 16) - this.gridH2;

            this.isattached = true;
        },

        forEachVisibleValidPosition: function(callback, extra, map) {
            var extra = 1;

            var w = this.gridW;
            var h = this.gridH;

            var minX = Math.max(0, this.gridX - extra);
            var minY = Math.max(0, this.gridY - extra);

            var maxX = Math.min(map.height - 1, this.gridX + w + extra);
            var maxY = Math.min(map.width - 1, this.gridY + h + extra);

            for (var y = minY; y < maxY; ++y) {
                for (var x = minX; x < maxX; ++x)
                    callback(x, y);
            }
        },

        forEachNewTile: function(callback, extra, map) {
            var c = this.game.player;
            var w = this.gridW;
            var h = this.gridH;
            var minX = Math.max(0,this.gridX-1);
            var minY = Math.max(0,this.gridY-1);

            var maxX = Math.min(map.height-1, this.gridX+w);
            var maxY = Math.min(map.width-1, this.gridY+h);

            for (var y = minY; y < maxY; ++y) {
                if (c.orientation === Types.Orientations.LEFT || c.prevOrientation === Types.Orientations.LEFT) {
                    callback(minX, y);
                    callback(minX + 1, y);
                }

                if (c.orientation === Types.Orientations.RIGHT || c.prevOrientation === Types.Orientations.RIGHT) {
                    callback(maxX, y);
                    callback(maxX - 1, y);
                }
            }

            for (var x = minX; x < maxX; ++x) {
                if (c.orientation === Types.Orientations.UP || c.prevOrientation === Types.Orientations.UP) {
                    callback(x, minY);
                    callback(x, minY + 1);
                }

                if (c.orientation === Types.Orientations.DOWN || c.prevOrientation === Types.Orientations.DOWN) {
                    callback(x, maxY);
                    callback(x, maxY - 1);
                }
            }
        },

        isVisible: function(entity) {
            return this.isVisiblePosition(entity.gridX, entity.gridY);
        },

        forEachVisiblePosition: function(callback, extra) {
            var extra = extra || 0;
            for(var y = this.gridY - extra, maxY = this.gridY + this.gridH + (extra * 2); y < maxY; y += 1) {
                for(var x = this.gridX - extra, maxX = this.gridX + this.gridW + (extra * 2); x < maxX; x += 1)
                    callback(x, y);
            }
        },

        isVisiblePosition: function(x, y) {
            var gridX = x;
            var gridY = y;
            var w = this.gridW;
            var h = this.gridH;

            if(y >= gridY && y < gridY+h &&
                x >= gridX && x < gridX+w)
            {
                return true;
            } else {
                return false;
            }
        },

        isPositionVisible: function(x, y) {
            if(y >= this.gridY && y < this.gridY + this.gridH
                && x >= this.gridX && x < this.gridX + this.gridW) {
                return true;
            } else {
                return false;
            }
        },

        focusEntity: function(entity) {
            var w = this.gridW - 2,
                h = this.gridH - 2,
                x = Math.floor((entity.gridX - 1) / w) * w,
                y = Math.floor((entity.gridY - 1) / h) * h;

            this.setGridPosition(x, y);
        }

    });

    return Camera;
});