import $ from 'jquery';
import _ from 'underscore';
import Pointer from '../renderer/pointers/pointer';
import Modules from '../utils/modules';
import log from '../lib/log';

/**
 * Handles the cursor on the HTML5 canvas
 * @class
 */
export default class Cursor {
  constructor(game) {
    this.game = game;
    this.pointers = {};
    this.scale = this.getScale();
    this.container = $('#bubbles');
  }

  create(id, type) {
    if (id in this.pointers) {
      return;
    }

    const element = $(`<div id="${id}" class="pointer"></div>`);

    this.setSize(element);

    this.container.append(element);

    this.pointers[id] = new Pointer(id, element, type);
  }

  resize() {
    _.each(this.pointers, (pointer) => {
      switch (pointer.type) {
        case Modules.Pointers.Relative:
          const scale = this.getScale(); // eslint-disable-line
          const x = pointer.x; // eslint-disable-line
          const y = pointer.y; // eslint-disable-line
          let offsetX = 0; // eslint-disable-line
          let offsetY = 0; // eslint-disable-line

          if (scale === 1) {
            offsetX = pointer.element.width() / 2 + 5;
            offsetY = pointer.element.height() / 2 - 4;
          }

          pointer.element.css('left', `${(x * scale) - offsetX}px`);
          pointer.element.css('top', `${(y * scale) - offsetY}px`);
          break;
        default:
          break;
      }
    });
  }

  setSize(element) {
    const width = 8;
    const height = width + (width * 0.2);
    const image = 'url("assets/img/common/hud-active.png")';

    this.updateScale();

    element.css({
      width: `${width * this.scale}px`,
      height: `${height * this.scale}px`,
      margin: 'inherit',
      'margin-top': `-${(height / 2) * this.scale}px`,
      'margin-left': '1px',
      top: `${height * this.scale}px`,
      background: image,
      'background-size': '100% 100%',
    });
  }

  clean() {
    _.each(this.pointers, (pointer) => {
      pointer.destroy();
    });

    this.pointers = {};
  }

  destroy(pointer) {
    delete this.pointers[pointer.id];
    pointer.destroy();
  }

  set(pointer, posX, posY) {
    this.updateScale();
    this.updateCamera();

    const tileSize = 16 * this.scale;
    const x = ((posX - this.camera.x) * this.scale);
    const width = parseInt(pointer.element.css('width') + 24, 10);
    const offset = (width / 2) - (tileSize / 2);
    const y = ((posY - this.camera.y) * this.scale) - tileSize;

    pointer.element.css('left', `${x - offset}px`);
    pointer.element.css('top', `${y}px`);
  }

  setToEntity(entity) {
    const pointer = this.get(entity.id);

    if (!pointer) {
      return;
    }

    log.info('set to entity', entity);
    this.set(pointer, entity.x, entity.y);
  }

  setToPosition(id, x, y) {
    const pointer = this.get(id);

    if (!pointer) {
      return;
    }

    pointer.setPosition(x, y);
    this.set(pointer, x, y);
  }

  setRelative(id, x, y) {
    const pointer = this.get(id);

    if (!pointer) {
      return;
    }

    const scale = this.getScale();
    let offsetX = 0;
    let offsetY = 0;

    /**
     * Must be set in accordance to the lowest scale.
     */

    if (scale === 1) {
      offsetX = pointer.element.width() / 2 + 5;
      offsetY = pointer.element.height() / 2 - 4;
    }

    pointer.setPosition(x, y);
    pointer.element.css('left', `${(x * scale) - offsetX}px`);
    pointer.element.css('top', `${(y * scale) - offsetY}px`);
  }

  update() {
    _.each(this.pointers, (pointer) => {
      switch (pointer.type) {
        case Modules.Pointers.Entity:
          const entity = this.game.entities.get(pointer.id); // eslint-disable-line

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
        default:
          break;
      }
    });
  }

  get(id) {
    if (id in this.pointers) {
      return this.pointers[id];
    }

    return null;
  }

  updateScale() {
    this.scale = this.getDrawingScale();
  }

  updateCamera() {
    this.camera = this.game.renderer.camera;
  }

  getScale() {
    return this.game.getScaleFactor();
  }

  getDrawingScale() {
    return this.game.renderer.getDrawingScale();
  }
}
