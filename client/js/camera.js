
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
            //var factor = 2;
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

        setRealCoords: function() {
            if (!this.game.player)
                return;
            this.x = this.game.player.x - (this.gridW2 * this.renderer.tilesize);
            this.y = this.game.player.y - (this.gridH2 * this.renderer.tilesize);

            this.gridX = Math.round(this.game.player.x / 16) - this.gridW2;
            this.gridY = Math.round(this.game.player.y / 16) - this.gridH2;

            this.isattached = true;

            //log.info("x:"+this.x+",y:"+this.y+",gridX:"+this.gridX+",gridY:"+this.gridY);
        },

        forEachVisibleValidPosition: function(callback, extra, map) {
            var extra = extra || 0;

            //Invalid: isInt(x) && isInt(y) && (x < 0 || x >= this.width || y < 0 || y >= this.height);

            var w = this.gridW;
            var h = this.gridH;

            var minX = Math.max(0,this.gridX-extra);
            var minY = Math.max(0,this.gridY-extra);

            var maxX = Math.min(map.height-1, this.gridX+w+(2*extra));
            var maxY = Math.min(map.width-1, this.gridY+h+(2*extra));

            for(var y=minY; y < maxY; ++y) {
                for(var x=minX; x < maxX; ++x) {
                    callback(x, y);
                }
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

            if (c.orientation === Types.Orientations.LEFT ||
                c.prevOrientation === Types.Orientations.LEFT)
            {
                for(var y=minY; y < maxY; ++y) {
                    callback(minX, y);
                    callback(minX+1, y);
                }

            }
            if (c.orientation === Types.Orientations.RIGHT ||
                c.prevOrientation === Types.Orientations.RIGHT)
            {
                for(var y=minY; y < maxY; ++y) {
                    callback(maxX, y);
                    callback(maxX-1, y);
                }

            }
            if (c.orientation === Types.Orientations.UP ||
                c.prevOrientation === Types.Orientations.UP)
            {
                for(var x=minX; x < maxX; ++x) {
                    callback(x, minY);
                    callback(x, minY+1);
                }

            }

            if (c.orientation === Types.Orientations.DOWN ||
                c.prevOrientation === Types.Orientations.DOWN)
            {
                for(var x=minX; x < maxX; ++x) {
                    callback(x, maxY);
                    callback(x, maxY-1);
                    //if (this.game.renderer.mobile)
                    //	callback(x, maxY-2);
                }
            }
        },

        isVisible: function(entity) {
            return this.isVisiblePosition(entity.gridX, entity.gridY);
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

    });

    return Camera;
});