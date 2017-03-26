define(function() {

    var Incoming = Class.extend({
        /**
         * Class responsible for handling player-related callbacks.
         */

        init: function(game, client) {
            var self = this;

            self.game = game;
            self.client = client;
            self.player = game.player;
            self.renderer = game.renderer;
        },
        
        loadCallbacks: function() {
            var self = this;

            self.player.onStartPathing(function(path) {
                var i = path.length - 1,
                    x = path[i][0],
                    y = path[i][1];

                if (self.player.isMovingToLoot())
                    self.player.isLootMoving = false;

                self.game.selectedX = x;
                self.game.selectedY = y;

                self.game.selectedCellVisible = true;

                if (self.renderer.isPortableDevice()) {
                    self.game.drawTarget = true;
                    self.game.clearTarget = true;

                    self.renderer.targetRect = self.renderer.getTargetBoundingRect();
                    self.game.checkOtherDirtyRects(self.renderer.targetRect, null, x, y);
                }
            });
        }
    });

    return Incoming;
});