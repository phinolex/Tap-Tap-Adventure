/* global log, _ */

define(["jquery"], function($) {
  return Class.extend({
    constructor(game) {
      

      this.game = game;
      this.renderer = this.game.renderer;
      this.supportsWorker = this.game.app.hasWorker();

      this.data = [];
      this.tilesets = [];
      this.grid = null;

      this.tilesetsLoaded = false;
      this.mapLoaded = false;

      this.load();
      this.loadTilesets();

      this.ready();
    },

    ready() {
      var self = this,
        rC = function() {
          if (this.readyCallback) this.readyCallback();
        };

      if (this.mapLoaded && this.tilesetsLoaded) rC();
      else
        setTimeout(function() {
          this.ready();
        }, 50);
    },

    load() {
      

      if (this.supportsWorker) {
        log.info("Parsing map with Web Workers...");

        var worker = new Worker("./js/map/mapworker.js");
        worker.postMessage(1);

        worker.onmessage = function(event) {
          var map = event.data;

          this.parseMap(map);
          this.grid = map.grid;
          this.mapLoaded = true;
        };
      } else {
        log.info("Parsing map with Ajax...");

        $.get(
          "data/maps/world_client.json",
          function(data) {
            this.parseMap(data);
            this.loadCollisions();
            this.mapLoaded = true;
          },
          "json"
        );
      }
    },

    loadTilesets() {
      var self = this,
        scale = this.renderer.getScale(),
        isBigScale = scale === 3;

      /**
       * The tile-sheet of scale one is never used because
       * of its wrong proportions. Interesting enough, this would mean
       * that neither the entities would be necessary.
       */

      this.tilesets.push(this.loadTileset("img/2/tilesheet.png"));

      if (isBigScale)
        this.tilesets.push(this.loadTileset("img/3/tilesheet.png"));

      this.renderer.setTileset(this.tilesets[isBigScale ? 1 : 0]);

      this.tilesetsLoaded = true;
    },

    updateTileset() {
      var self = this,
        scale = this.renderer.getDrawingScale();

      if (scale > 2 && !this.tilesets[1])
        this.tilesets.push(this.loadTileset("img/3/tilesheet.png"));

      this.renderer.setTileset(this.tilesets[scale - 2]);
    },

    loadTileset(path) {
      var self = this,
        tileset = new Image();

      tileset.crossOrigin = "Anonymous";
      tileset.src = path;
      tileset.loaded = true;
      tileset.scale = this.renderer.getDrawingScale();

      tileset.onload = function() {
        if (tileset.width % this.tileSize > 0)
          throw Error("The tile size is malformed in the tile set: " + path);
      };

      return tileset;
    },

    parseMap(map) {
      

      this.width = map.width;
      this.height = map.height;
      this.tileSize = map.tilesize;
      this.data = map.data;
      this.blocking = map.blocking || [];
      this.collisions = map.collisions;
      this.high = map.high;
      this.animated = map.animated;
    },

    loadCollisions() {
      

      this.grid = [];

      for (var i = 0; i < this.height; i++) {
        this.grid[i] = [];
        for (var j = 0; j < this.width; j++) this.grid[i][j] = 0;
      }

      _.each(this.collisions, function(index) {
        var position = this.indexToGridPosition(index + 1);
        this.grid[position.y][position.x] = 1;
      });

      _.each(this.blocking, function(index) {
        var position = this.indexToGridPosition(index + 1);

        if (this.grid[position.y]) this.grid[position.y][position.x] = 1;
      });
    },

    indexToGridPosition(index) {
      

      index -= 1;

      var x = this.getX(index + 1, this.width),
        y = Math.floor(index / this.width);

      return {
        x: x,
        y: y
      };
    },

    gridPositionToIndex(x, y) {
      return y * this.width + x + 1;
    },

    isColliding(x, y) {
      

      if (this.isOutOfBounds(x, y) || !this.grid) return false;

      return this.grid[y][x] === 1;
    },

    isHighTile(id) {
      return this.high.indexOf(id + 1) >= 0;
    },

    isAnimatedTile(id) {
      return id + 1 in this.animated;
    },

    isOutOfBounds(x, y) {
      return (
        isInt(x) &&
        isInt(y) &&
        (x < 0 || x >= this.width || y < 0 || y >= this.height)
      );
    },

    getX(index, width) {
      if (index === 0) return 0;

      return index % width === 0 ? width - 1 : (index % width) - 1;
    },

    getTileAnimationLength(id) {
      return this.animated[id + 1].l;
    },

    getTileAnimationDelay(id) {
      var properties = this.animated[id + 1];

      return properties.d ? properties.d : 150;
    },

    onReady(callback) {
      this.readyCallback = callback;
    }
  });
});
