import $ from 'jquery';

export default class Page {
  constructor(element) {
    this.body = $(element);
    this.loaded = false;
  }

  show() {
    this.body.fadeIn('slow');
  }

  hide() {
    this.body.fadeOut('slow');
  }

  isVisible() {
    return this.body.css('display') === 'block';
  }

  load() {
    // @TODO
    log.debug('Page - load() - @TODO');
  }

  resize() {
    // @TODO
    log.debug('Page - resize() - @TODO');
  }

  update() {
    // @TODO
    log.debug('Page - update() - @TODO');
  }

  getImageFormat(scale, name) {
    if (!name || name === 'null') {
      return '';
    }

    return `url("assets/img/${scale}/item-${name}.png")`;
  }
}
