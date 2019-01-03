import _ from 'underscore';
import $ from 'jquery';
import Blob from '../renderer/bubbles/blob';

export default class Bubble {
  constructor(game) {
    this.game = game;
    this.bubbles = {};

    this.container = $('#bubbles');
  }

  create(id, message, time, duration) {
    if (this.bubbles[id]) {
      this.bubbles[id].reset(time);
      $(`#${id} p`).html(message);
    } else {
      const element = $(
        `<div id='${id}' class='bubble'>
          <p>${message}</p>
          <div class='bubbleTip'></div>
        </div>`,
      );

      $(element).appendTo(this.container);

      this.bubbles[id] = new Blob(id, time, element, duration);
    }

    return this.bubbles[id];
  }

  setTo(entity) {
    const bubble = this.get(entity.id);

    if (!bubble || !entity) {
      return;
    }

    const scale = this.game.renderer.getDrawingScale();
    const tileSize = 16 * scale;
    const x = (entity.x - this.game.getCamera().x) * scale;
    const width = parseInt(bubble.element.css('width'), 10) + 24;
    const offset = width / 2 - tileSize / 2;
    const offsetY = 10;
    const y = (entity.y - this.game.getCamera().y) * scale - tileSize * 2 - offsetY;

    bubble.element.css(
      'left',
      `${x - offset + (2 + this.game.renderer.scale)}px`,
    );
    bubble.element.css('top', `${y}px`);
  }

  update(time) {
    _.each(this.bubbles, (bubble) => {
      const entity = this.game.entities.get(bubble.id);

      if (entity) {
        this.setTo(entity);
      }

      if (bubble.isOver(time)) {
        bubble.destroy();
        delete this.bubbles[bubble.id];
      }
    });
  }

  get(id) {
    if (id in this.bubbles) {
      return this.bubbles[id];
    }

    return null;
  }

  clean() {
    _.each(this.bubbles, (bubble) => {
      bubble.destroy();
    });

    this.bubbles = {};
  }

  destroy(id) {
    const bubble = this.get(id);

    if (!bubble) {
      return;
    }

    bubble.destroy();

    delete this.bubbles[id];
  }
}
