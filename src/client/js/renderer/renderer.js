import _ from 'underscore';
import $ from 'jquery';
import log from '../lib/log';
import Camera from './camera';
import Tile from './tile';
import Character from '../entity/character/character';
import Item from '../entity/objects/item';
import Detect from '../utils/detect';
import {
  isIntersecting,
} from '../utils/util';

const getX = (index, width) => {
  if (index === 0) {
    return 0;
  }

  return index % width === 0
    ? width - 1
    : (index % width) - 1;
};

export default class Renderer {
  constructor(background, entities, foreground, textCanvas, cursor, game) {
    const self = this;

    self.background = background;
    self.entities = entities;
    self.foreground = foreground;
    self.textCanvas = textCanvas;
    self.cursor = cursor;

    self.context = entities.getContext('2d');
    self.backContext = background.getContext('2d');
    self.foreContext = foreground.getContext('2d');
    self.textContext = textCanvas.getContext('2d');
    self.cursorContext = cursor.getContext('2d');

    self.context.imageSmoothingEnabled = false;
    self.backContext.imageSmoothingEnabled = false;
    self.foreContext.imageSmoothingEnabled = false;
    self.textContext.imageSmoothingEnabled = true;
    self.cursorContext.imageSmoothingEnabled = false;

    self.contexts = [self.backContext, self.foreContext, self.context];
    self.canvases = [
      self.background,
      self.entities,
      self.foreground,
      self.textCanvas,
      self.cursor,
    ];

    self.game = game;
    self.camera = null;
    self.entities = null;
    self.input = null;

    self.checkDevice();

    self.scale = 1;
    self.tileSize = 16;
    self.fontSize = 10;

    self.screenWidth = 0;
    self.screenHeight = 0;

    self.time = new Date();

    self.fps = 0;
    self.frameCount = 0;
    self.renderedFrame = [0, 0];
    self.lastTarget = [0, 0];

    self.animatedTiles = [];

    self.resizeTimeout = null;
    self.autoCentre = false;

    self.drawTarget = false;
    self.selectedCellVisible = false;

    self.stopRendering = false;
    self.animateTiles = true;
    self.debugging = false;
    self.brightness = 100;
    self.drawNames = true;
    self.drawLevels = true;
    self.forceRendering = false;
    this.textCanvas = $('#textCanvas');

    self.load();
  }

  stop() {
    const self = this;

    self.camera = null;
    self.input = null;
    self.stopRendering = true;

    self.forEachContext((context) => {
      context.fillStyle = '#12100D'; // eslint-disable-line
      context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    });
  }

  load() {
    const self = this;

    self.scale = self.getScale();
    self.drawingScale = self.getDrawingScale();

    self.forEachContext((context) => {
      context.imageSmoothingEnabled = false; // eslint-disable-line
      context.webkitImageSmoothingEnabled = false; // eslint-disable-line
      context.mozImageSmoothingEnabled = false; // eslint-disable-line
      context.msImageSmoothingEnabled = false; // eslint-disable-line
      context.oImageSmoothingEnabled = false; // eslint-disable-line
    });
  }

  loadSizes() {
    const self = this;

    if (!self.camera) return;

    self.screenWidth = self.camera.gridWidth * self.tileSize;
    self.screenHeight = self.camera.gridHeight * self.tileSize;

    const width = self.screenWidth * self.drawingScale;


    const height = self.screenHeight * self.drawingScale;

    self.forEachCanvas((canvas) => {
      canvas.width = width; // eslint-disable-line
      canvas.height = height; // eslint-disable-line
    });
  }

  loadCamera() {
    const self = this;
    const {
      storage,
    } = self.game;

    self.camera = new Camera(this);

    self.loadSizes();

    if (
      storage.data.new
      && (self.firefox
        || parseFloat(Detect.androidVersion()) < 6.0
        || parseFloat(Detect.iOSVersion() < 9.0)
        || Detect.isIpad())
    ) {
      self.camera.centered = false;

      storage.data.settings.centerCamera = false;
      storage.save();
    }
  }

  resize() {
    const self = this;

    self.stopRendering = true;

    self.clearAll();

    self.checkDevice();

    if (!self.resizeTimeout) {
      self.resizeTimeout = setTimeout(() => {
        self.scale = self.getScale();
        self.drawingScale = self.getDrawingScale();

        if (self.camera) self.camera.update();

        self.updateAnimatedTiles();

        self.loadSizes();

        if (self.entities) self.entities.update();

        if (self.map) self.map.updateTileset();

        if (self.camera) self.camera.centreOn(self.game.player);

        if (self.game.interface) self.game.interface.resize();

        self.renderedFrame[0] = -1;

        self.stopRendering = false;
        self.resizeTimeout = null;
      }, 500);
    }
  }

  render() {
    const self = this;

    if (self.stopRendering) return;

    self.clearScreen(self.context);
    self.clearText();

    self.saveAll();

    /**
     * Rendering related draws
     */

    self.draw();

    self.drawAnimatedTiles();

    // the annoying square under the cursor
    // self.drawTargetCell();

    self.drawSelectedCell();

    self.drawEntities();

    self.drawInfos();

    self.drawDebugging();

    self.restoreAll();

    self.drawCursor();
  }

  /**
   * Context Drawing
   */

  draw() {
    const self = this;

    if (self.hasRenderedFrame()) return;

    self.clearDrawing();
    self.updateDrawingView();

    self.forEachVisibleTile((id, index) => {
      const isHighTile = self.map.isHighTile(id);


      const context = isHighTile ? self.foreContext : self.backContext;

      if (!self.map.isAnimatedTile(id) || !self.animateTiles) {
        self.drawTile(
          context,
          id,
          self.tileset,
          self.tileset.width / self.tileSize,
          self.map.width,
          index,
        );
      }
    });

    self.saveFrame();
  }

  drawAnimatedTiles() {
    const self = this;

    self.setCameraView(self.context);

    if (!self.animateTiles) return;

    self.forEachAnimatedTile((tile) => {
      self.drawTile(
        self.context,
        tile.id,
        self.tileset,
        self.tileset.width / self.tileSize,
        self.map.width,
        tile.index,
      );
      tile.loaded = true; // eslint-disable-line
    });
  }

  drawInfos() {
    const self = this;

    if (self.game.info.getCount() === 0) return;

    self.game.info.forEachInfo((info) => {
      const factor = self.mobile ? 2 : 1;

      self.textContext.save();
      self.textContext.font = '24px sans serif';
      self.setCameraView(self.textContext);
      self.textContext.globalAlpha = info.opacity;
      self.drawText(
        `${info.text}`,
        Math.floor((info.x + 8) * factor),
        Math.floor(info.y * factor),
        true,
        info.fill,
        info.stroke,
      );
      self.textContext.restore();
    });
  }

  drawDebugging() {
    const self = this;

    if (!self.debugging) return;

    self.drawFPS();

    if (!self.mobile) {
      self.drawPosition();
      self.drawPathing();
    }
  }

  drawEntities() {
    const self = this;

    self.forEachVisibleEntity((entity) => {
      if (entity.spriteLoaded) self.drawEntity(entity);
    });
  }

  drawEntity(entity) {
    const self = this;
    const {
      sprite,
    } = entity;
    const animation = entity.currentAnimation;
    const data = entity.renderingData;

    if (!sprite || !animation || !entity.isVisible()) return;

    const frame = animation.currentFrame;


    const x = frame.x * self.drawingScale;


    const y = frame.y * self.drawingScale;


    const dx = entity.x * self.drawingScale;


    const dy = entity.y * self.drawingScale;


    const flipX = dx + self.tileSize * self.drawingScale;


    const flipY = dy + data.height;

    self.context.save();

    if (data.scale !== self.scale || data.sprite !== sprite) {
      data.scale = self.scale;

      data.sprite = sprite;

      data.width = sprite.width * self.drawingScale;
      data.height = sprite.height * self.drawingScale;
      data.ox = sprite.offsetX * self.drawingScale;
      data.oy = sprite.offsetY * self.drawingScale;

      if (entity.angled) data.angle = (entity.angle * Math.PI) / 180;

      if (entity.hasShadow()) {
        data.shadowWidth = self.shadowSprite.width * self.drawingScale;
        data.shadowHeight = self.shadowSprite.height * self.drawingScale;

        data.shadowOffsetY = entity.shadowOffsetY * self.drawingScale;
      }
    }

    if (entity.fading) self.context.globalAlpha = entity.fadingAlpha;

    if (entity.spriteFlipX) {
      self.context.translate(flipX, dy);
      self.context.scale(-1, 1);
    } else if (entity.spriteFlipY) {
      self.context.translate(dx, flipY);
      self.context.scale(1, -1);
    } else self.context.translate(dx, dy);

    if (entity.angled) self.context.rotate(data.angle);

    if (entity.hasShadow()) {
      self.context.drawImage(
        self.shadowSprite.image,
        0,
        0,
        data.shadowWidth,
        data.shadowHeight,
        0,
        data.shadowOffsetY,
        data.shadowWidth,
        data.shadowHeight,
      );
    }

    self.drawEntityBack(entity);

    self.context.drawImage(
      sprite.image,
      x,
      y,
      data.width,
      data.height,
      data.ox,
      data.oy,
      data.width,
      data.height,
    );

    if (
      entity instanceof Character
      && !entity.dead
      && !entity.teleporting
      && entity.hasWeapon()
    ) {
      const weapon = self.entities.getSprite(entity.weapon.getString());

      if (weapon) {
        if (!weapon.loaded) weapon.load();

        const weaponAnimationData = weapon.animationData[animation.name];


        const index = frame.index < weaponAnimationData.length
          ? frame.index
          : frame.index % weaponAnimationData.length;


        const weaponX = weapon.width * index * self.drawingScale;


        const weaponY = weapon.height * animation.row * self.drawingScale;


        const weaponWidth = weapon.width * self.drawingScale;


        const weaponHeight = weapon.height * self.drawingScale;

        self.context.drawImage(
          weapon.image,
          weaponX,
          weaponY,
          weaponWidth,
          weaponHeight,
          weapon.offsetX * self.drawingScale,
          weapon.offsetY * self.drawingScale,
          weaponWidth,
          weaponHeight,
        );
      }
    }

    if (entity instanceof Item) {
      const {
        sparksAnimation,
      } = self.entities.sprites;
      const sparksFrame = sparksAnimation.currentFrame;

      if (data.scale !== self.scale) {
        data.sparksX = self.sparksSprite.width * sparksFrame.index * self.drawingScale;
        data.sparksY = self.sparksSprite.height * sparksAnimation.row * self.drawingScale;

        data.sparksWidth = self.sparksSprite.width * self.drawingScale;
        data.sparksHeight = self.sparksSprite.height * self.drawingScale;
      }

      self.context.drawImage(
        self.sparksSprite.image,
        data.sparksX,
        data.sparksY,
        data.sparksWidth,
        data.sparksHeight,
        0,
        0,
        data.sparksWidth,
        data.sparksHeight,
      );
    }

    self.drawEntityFore(entity);

    self.context.restore();

    self.drawHealth(entity);
    self.drawName(entity);
  }

  drawEntityFore(entity) {
    const self = this;

    /**
     * Function used to draw special effects after
     * having rendererd the entity
     */

    if (
      entity.terror
      || entity.stunned
      || entity.critical
      || entity.explosion
    ) {
      const sprite = self.entities.getSprite(entity.getActiveEffect());

      if (!sprite.loaded) sprite.load();

      if (sprite) {
        const animation = entity.getEffectAnimation();
        const {
          index,
        } = animation.currentFrame;
        const x = sprite.width * index * self.drawingScale;
        const y = sprite.height * animation.row * self.drawingScale;
        const width = sprite.width * self.drawingScale;
        const height = sprite.height * self.drawingScale;
        const offsetX = sprite.offsetX * self.drawingScale;
        const offsetY = sprite.offsetY * self.drawingScale;

        self.context.drawImage(
          sprite.image,
          x,
          y,
          width,
          height,
          offsetX,
          offsetY,
          width,
          height,
        );
      }
    }
  }

  drawHealth(entity) {
    const self = this;

    if (!entity.hitPoints || entity.hitPoints < 0 || !entity.healthBarVisible) return;

    const barLength = 16;


    const healthX = entity.x * self.drawingScale - barLength / 2 + 8;


    const healthY = (entity.y - 9) * self.drawingScale;


    const healthWidth = Math.round(
      (entity.hitPoints / entity.maxHitPoints)
      * barLength
      * self.drawingScale,
    );


    const healthHeight = 2 * self.drawingScale;

    self.context.save();
    self.context.strokeStyle = '#00000';
    self.context.lineWidth = 1;
    self.context.strokeRect(
      healthX,
      healthY,
      barLength * self.drawingScale,
      healthHeight,
    );
    self.context.fillStyle = '#FD0000';
    self.context.fillRect(healthX, healthY, healthWidth, healthHeight);
    self.context.restore();
  }

  drawName(entity) {
    const self = this;

    if (entity.hidden || (!self.drawNames && !self.drawLevels)) return;

    let colour = entity.wanted ? 'red' : 'white';


    const factor = self.mobile ? 2 : 1;

    if (entity.rights > 1) colour = '#ba1414';
    else if (entity.rights > 0) colour = '#a59a9a';

    if (entity.id === self.game.player.id) colour = '#fcda5c';

    self.textContext.save();
    self.setCameraView(self.textContext);
    self.textContext.font = '14px sans serif';

    if (!entity.hasCounter) {
      if (self.drawNames && entity !== 'player') {
        self.drawText(
          entity.username,
          (entity.x + 8) * factor,
          (entity.y - (self.drawLevels ? 20 : 10)) * factor,
          true,
          colour,
        );
      }

      if (
        self.drawLevels
        && (entity.type === 'mob' || entity.type === 'player')
      ) {
        self.drawText(
          `Level ${entity.level}`,
          (entity.x + 8) * factor,
          (entity.y - 10) * factor,
          true,
          colour,
        );
      }

      if (entity.type === 'item' && entity.count > 1) {
        self.drawText(
          entity.count,
          (entity.x + 8) * factor,
          (entity.y - 10) * factor,
          true,
          colour,
        );
      }
    } else {
      if (self.game.time - entity.countdownTime > 1000) {
        entity.countdownTime = self.game.time; // eslint-disable-line
        entity.counter -= 1; // eslint-disable-line
      }

      if (entity.counter <= 0) {
        entity.hasCounter = false; // eslint-disable-line
      }

      self.drawText(
        entity.counter,
        (entity.x + 8) * factor,
        (entity.y - 10) * factor,
        true,
        colour,
      );
    }

    self.textContext.restore();
  }

  drawCursor() {
    const self = this;

    if (self.tablet || self.mobile) {
      return;
    }

    const {
      cursor,
    } = self.input;

    self.clearScreen(self.cursorContext);
    self.cursorContext.save();

    if (cursor && self.scale > 1) {
      if (!cursor.loaded) cursor.load();

      if (cursor.loaded) {
        self.cursorContext.drawImage(
          cursor.image,
          0,
          0,
          14 * self.drawingScale,
          14 * self.drawingScale,
          self.input.mouse.x,
          self.input.mouse.y,
          14 * self.drawingScale,
          14 * self.drawingScale,
        );
      }
    }

    self.cursorContext.restore();
  }

  drawFPS() {
    const self = this;


    const currentTime = new Date();


    const timeDiff = currentTime - self.time;

    if (timeDiff >= 1000) {
      self.realFPS = self.frameCount;
      self.frameCount = 0;
      self.time = currentTime;
      self.fps = self.realFPS;
    }

    self.frameCount += 1;

    self.drawText(`FPS: ${self.realFPS}`, 10, 11, false, 'white');
  }

  drawPosition() {
    const self = this;
    const {
      player,
    } = self.game;

    self.drawText(
      `x: ${player.gridX} y: ${player.gridY}`,
      10,
      31,
      false,
      'white',
    );
  }

  drawPathing() {
    const self = this;
    const {
      pathingGrid,
    } = self.entities.grids;

    if (!pathingGrid) {
      return;
    }

    self.camera.forEachVisiblePosition((x, y) => {
      if (x < 0 || y < 0) return;

      if (pathingGrid[y][x] !== 0) self.drawCellHighlight(x, y, 'rgba(50, 50, 255, 0.5)');
    });
  }

  drawSelectedCell() {
    const self = this;

    if (!self.input.selectedCellVisible) {
      return;
    }

    const posX = self.input.selectedX;


    const posY = self.input.selectedY;

    // only draw the highlight cell if they are not adjacent
    // from character's current position
    if (!self.game.player.isPositionAdjacent(posX, posY)) {
      self.drawCellHighlight(posX, posY, self.input.mobileTargetColour);
    }
  }

  /**
   * Primitive drawing functions
   */

  drawTile(context, tileId, tileset, setWidth, gridWidth, cellId) {
    const self = this;

    if (tileId === -1) return;

    self.drawScaledImage(
      context,
      tileset,
      getX(tileId + 1, setWidth / self.drawingScale) * self.tileSize,
      Math.floor(tileId / (setWidth / self.drawingScale)) * self.tileSize,
      self.tileSize,
      self.tileSize,
      getX(cellId + 1, gridWidth) * self.tileSize,
      Math.floor(cellId / gridWidth) * self.tileSize,
    );
  }

  clearTile(context, gridWidth, cellId) {
    const self = this;


    const x = getX(cellId + 1, gridWidth) * self.tileSize * self.drawingScale;


    const y = Math.floor(cellId / gridWidth) * self.tileSize * self.drawingScale;


    const w = self.tileSize * self.scale;

    context.clearRect(x, y, w, w);
  }

  drawText(text, x, y, centered, colour, strokeColour) {
    const self = this;


    let strokeSize = 1;


    const context = self.textContext;

    if (self.scale > 2) strokeSize = 3;

    if (text && x && y) {
      context.save();

      if (centered) context.textAlign = 'center';

      context.strokeStyle = strokeColour || '#373737';
      context.lineWidth = strokeSize;
      context.strokeText(text, x * self.scale, y * self.scale);
      context.fillStyle = colour || 'white';
      context.fillText(text, x * self.scale, y * self.scale);

      context.restore();
    }
  }

  drawScaledImage(context, image, x, y, width, height, dx, dy) {
    const self = this;

    if (!context) return;

    context.drawImage(
      image,
      x * self.drawingScale,
      y * self.drawingScale,
      width * self.drawingScale,
      height * self.drawingScale,
      dx * self.drawingScale,
      dy * self.drawingScale,
      width * self.drawingScale,
      height * self.drawingScale,
    );
  }

  updateAnimatedTiles() {
    const self = this;

    if (!self.animateTiles) return;

    const newTiles = [];

    self.forEachVisibleTile((id, index) => {
      /**
       * We don't want to reinitialize animated tiles that already exist
       * and are within the visible camera proportions. This way we can parse
       * it every time the tile moves slightly.
       */

      if (!self.map.isAnimatedTile(id)) return;

      /**
       * Push the pre-existing tiles.
       */

      const tileIndex = self.animatedTiles.indexOf(id);

      if (tileIndex > -1) {
        newTiles.push(self.animatedTiles[tileIndex]);
        return;
      }

      const tile = new Tile(
        id,
        index,
        self.map.getTileAnimationLength(id),
        self.map.getTileAnimationDelay(id),
      );


      const position = self.map.indexToGridPosition(tile.index);

      tile.setPosition(position);

      newTiles.push(tile);
    }, 2);

    self.animatedTiles = newTiles;
  }

  checkDirty(rectOne, source, x, y) {
    const self = this;

    self.entities.forEachEntityAround(x, y, 2, (entityTwo) => {
      if (source && source.id && entityTwo.id === source.id) return;

      if (!entityTwo.isDirty && isIntersecting(rectOne, self.getEntityBounds(entityTwo))) {
        entityTwo.loadDirty();
      }
    });

    if (source && !source.hasOwnProperty('index')) { // eslint-disable-line
      self.forEachAnimatedTile((tile) => {
        if (!tile.isDirty && isIntersecting(rectOne, self.getTileBounds(tile))) {
          tile.dirty = true; // eslint-disable-line
        }
      });
    }

    if (!self.drawTarget && self.input.selectedCellVisible) {
      const targetRect = self.getTargetBounds();

      if (isIntersecting(rectOne, targetRect)) {
        self.drawTarget = true;
        self.targetRect = targetRect;
      }
    }
  }

  drawCellRect(x, y, colour) {
    const self = this;


    const multiplier = self.tileSize * self.drawingScale;

    self.context.save();

    self.context.lineWidth = 2 * self.drawingScale;

    self.context.translate(x + 2, y + 2);

    self.context.strokeStyle = colour;
    self.context.strokeRect(0, 0, multiplier - 4, multiplier - 4);

    self.context.restore();
  }

  drawCellHighlight(x, y, colour) {
    const self = this;

    self.drawCellRect(
      x * self.drawingScale * self.tileSize,
      y * self.drawingScale * self.tileSize,
      colour,
    );
  }

  drawTargetCell() {
    const self = this;

    if (
      self.mobile
      || self.tablet
      || !self.input.targetVisible
      || !self.input
      || !self.camera
    ) return;

    const location = self.input.getCoords();

    if (
      !(
        location.x === self.input.selectedX
        && location.y === self.input.selectedY
      )
    ) {
      self.drawCellHighlight(location.x, location.y, self.input.targetColour);
    }
  }

  /**
   * Primordial Rendering functions
   */

  forEachVisibleIndex(callback, offset) {
    const self = this;

    self.camera.forEachVisiblePosition((x, y) => {
      if (!self.map.isOutOfBounds(x, y)) callback(self.map.gridPositionToIndex(x, y) - 1);
    }, offset);
  }

  forEachVisibleTile(callback, offset) {
    const self = this;

    if (!self.map || !self.map.mapLoaded) return;

    self.forEachVisibleIndex((index) => {
      if (_.isArray(self.map.data[index])) {
        _.each(self.map.data[index], (id) => {
          callback(id - 1, index);
        });
      } else if (!isNaN(self.map.data[index] - 1)) { // eslint-disable-line
        callback(self.map.data[index] - 1, index);
      }
    }, offset);
  }

  forEachAnimatedTile(callback) {
    _.each(this.animatedTiles, (tile) => {
      callback(tile);
    });
  }

  forEachVisibleEntity(callback) {
    const self = this;

    if (!self.entities || !self.camera) {
      return;
    }

    const {
      grids,
    } = self.entities;

    self.camera.forEachVisiblePosition((x, y) => {
      if (!self.map.isOutOfBounds(x, y) && grids.renderingGrid[y][x]) {
        _.each(grids.renderingGrid[y][x], (entity) => {
          callback(entity);
        });
      }
    });
  }

  isVisiblePosition(x, y) {
    return (
      y >= this.camera.gridY
      && y < this.camera.gridY + this.camera.gridHeight
      && x >= this.camera.gridX
      && x < this.camera.gridX + this.camera.gridWidth
    );
  }

  getScale() {
    return this.game.getScaleFactor();
  }

  getDrawingScale() {
    const self = this;


    let scale = self.getScale();

    if (self.mobile) scale = 2;

    return scale;
  }

  getUpscale() {
    const self = this;


    let scale = self.getScale();

    if (scale > 2) scale = 2;

    return scale;
  }

  clearContext() {
    this.context.clearRect(
      0,
      0,
      this.screenWidth * this.scale,
      this.screenHeight * this.scale,
    );
  }

  clearText() {
    this.textContext.clearRect(
      0,
      0,
      this.textCanvas.width,
      this.textCanvas.height,
    );
  }

  restore() {
    this.forEachContext((context) => {
      context.restore();
    });
  }

  clearAll() {
    const self = this;

    self.forEachContext((context) => {
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    });
  }

  clearDrawing() {
    const self = this;

    self.forEachDrawingContext((context) => {
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    });
  }

  saveAll() {
    const self = this;

    self.forEachContext((context) => {
      context.save();
    });
  }

  restoreAll() {
    const self = this;

    self.forEachContext((context) => {
      context.restore();
    });
  }

  focus() {
    const self = this;

    self.forEachContext((context) => {
      context.focus();
    });
  }

  /**
   * Rendering Functions
   */

  updateView() {
    const self = this;

    self.forEachContext((context) => {
      self.setCameraView(context);
    });
  }

  updateDrawingView() {
    const self = this;

    self.forEachDrawingContext((context) => {
      self.setCameraView(context);
    });
  }

  setCameraView(context) {
    const self = this;

    if (!self.camera || self.stopRendering) return;

    context.translate(
      -self.camera.x * self.drawingScale,
      -self.camera.y * self.drawingScale,
    );
  }

  clearScreen(context) {
    context.clearRect(
      0,
      0,
      this.context.canvas.width,
      this.context.canvas.height,
    );
  }

  hasRenderedFrame() {
    const self = this;

    if (self.forceRendering) return false;

    if (!self.camera || self.stopRendering || !self.input) return true;

    return (
      self.renderedFrame[0] === self.camera.x
      && self.renderedFrame[1] === self.camera.y
    );
  }

  saveFrame() {
    const self = this;

    if (!self.hasRenderedFrame()) {
      self.renderedFrame[0] = self.camera.x;
      self.renderedFrame[1] = self.camera.y;
    }
  }

  adjustBrightness(level) {
    if (level < 0 || level > 100) {
      return;
    }

    this.textCanvas.css(
      'background',
      `rgba(0, 0, 0, ${0.5 - level / 200})`,
    );
  }

  loadStaticSprites() {
    const self = this;

    self.shadowSprite = self.entities.getSprite('shadow16');

    if (!self.shadowSprite.loaded) self.shadowSprite.load();

    self.sparksSprite = self.entities.getSprite('sparks');

    if (!self.sparksSprite.loaded) self.sparksSprite.load();
  }

  /**
   * Miscellaneous functions
   */

  forEachContext(callback) {
    _.each(this.contexts, (context) => {
      callback(context);
    });
  }

  forEachDrawingContext(callback) {
    _.each(this.contexts, (context) => {
      if (context.canvas.id !== 'entities') callback(context);
    });
  }

  forEachCanvas(callback) {
    _.each(this.canvases, (canvas) => {
      callback(canvas);
    });
  }

  checkDevice() {
    const self = this;

    self.mobile = self.game.app.isMobile();
    self.tablet = self.game.app.isTablet();
    self.firefox = Detect.isFirefox();
  }

  verifyCentration() {
    this.forceRendering = (this.mobile || this.tablet) && this.camera.centered;
  }

  isPortableDevice() {
    return this.mobile || this.tablet;
  }

  /**
   * Setters
   */

  setTileset(tileset) {
    this.tileset = tileset;
  }

  setMap(map) {
    this.map = map;
  }

  setEntities(entities) {
    this.entities = entities;
  }

  setInput(input) {
    this.input = input;
  }

  /**
   * Getters
   */

  getTileBounds(tile) {
    const self = this;


    const bounds = {};


    const cellId = tile.index;

    bounds.x = (getX(cellId + 1, self.map.width) * self.tileSize
        - self.camera.x)
      * self.drawingScale;
    bounds.y = (Math.floor(cellId / self.map.width) * self.tileSize - self.camera.y)
      * self.drawingScale;
    bounds.width = self.tileSize * self.drawingScale;
    bounds.height = self.tileSize * self.drawingScale;
    bounds.left = bounds.x;
    bounds.right = bounds.x + bounds.width;
    bounds.top = bounds.y;
    bounds.bottom = bounds.y + bounds.height;

    return bounds;
  }

  getEntityBounds(entity) {
    const self = this;
    const bounds = {};
    const {
      sprite,
    } = entity;

    // TODO - Ensure that the sprite over there has the correct bounds

    if (!sprite) log.error(`Sprite malformation for: ${entity.name}`);
    else {
      bounds.x = (entity.x + sprite.offsetX - self.camera.x) * self.drawingScale;
      bounds.y = (entity.y + sprite.offsetY - self.camera.y) * self.drawingScale;
      bounds.width = sprite.width * self.drawingScale;
      bounds.height = sprite.height * self.drawingScale;
      bounds.left = bounds.x;
      bounds.right = bounds.x + bounds.width;
      bounds.top = bounds.y;
      bounds.bottom = bounds.y + bounds.height;
    }

    return bounds;
  }

  getTargetBounds(x, y) {
    const self = this;


    const bounds = {};


    const tx = x || self.input.selectedX;


    const ty = y || self.input.selectedY;

    bounds.x = (tx * self.tileSize - self.camera.x) * self.drawingScale;
    bounds.y = (ty * self.tileSize - self.camera.y) * self.drawingScale;
    bounds.width = self.tileSize * self.drawingScale;
    bounds.height = self.tileSize * self.drawingScale;
    bounds.left = bounds.x;
    bounds.right = bounds.x + bounds.width;
    bounds.top = bounds.y;
    bounds.bottom = bounds.y + bounds.height;

    return bounds;
  }

  getTileset() {
    return this.tileset;
  }
}
