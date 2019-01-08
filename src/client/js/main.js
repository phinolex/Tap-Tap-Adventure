/* global document, window */
import $ from 'jquery';
import Detect from './utils/detect';
import App from './app';
import Game from './game';

export default class WTF {
  constructor() {
    this.app = null;
    this.body = null;
    this.chatInput = null;
    this.game = null;
  }

  load() {
    $(document).ready(() => {
      this.app = new App();
      this.body = $('body');
      this.chatInput = $('#chatInput');

      this.addClasses();
      this.initGame();
      this.addListeners();
    });
  }

  addClasses() {
    if (Detect.isWindows()) {
      this.body.addClass('windows');
    }

    if (Detect.isOpera()) {
      this.body.addClass('opera');
    }

    if (Detect.isFirefoxAndroid()) {
      this.chatInput.removeAttr('placeholder');
    }
  }

  addListeners() {
    const resizeCheck = $('#resizeCheck');

    document.addEventListener('touchstart', () => {}, false);
    document.addEventListener('touchmove', (e) => {
      e.preventDefault();
    });

    resizeCheck.bind('transitionend', this.app.resize.bind(this));
    resizeCheck.bind('webkitTransitionEnd', this.app.resize.bind(this));
    resizeCheck.bind('oTransitionEnd', this.app.resize.bind(this));

    $(window).on('orientationchange', () => {
      this.app.updateOrientation();
    });
  }

  initGame() {
    this.app.onReady(() => {
      this.app.sendStatus('Welcome, welcome...');

      const game = new Game(this.app);
      this.app.setGame(game);
    });
  }
}

const wtf = new WTF();
wtf.load();
