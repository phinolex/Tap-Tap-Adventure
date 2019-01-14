/* global document, window */
import $ from 'jquery';
import Detect from './utils/detect';
import App from './app';
import Game from './game';

/**
 * Launch the WTF client application and start the game
 * @class
 */
export default class WTF {
  /**
   * Keep track of the instance of the app, document body, chat input and the game
   */
  constructor() {
    /**
    * Instance of the client application
    * @type {App}
    */
    this.app = null;

    /**
     * Instance of the DOM $('body') element
     * @type {Object}
     */
    this.body = null;

    /**
    * Instance of the DOM $('#chatInput') DOM element
    * @type {Object}
    */
    this.chatInput = null;

    /**
    * Instance of the game class running on the HTML5 Canvas
    * @type {Game}
    */
    this.game = null;
  }

  /**
   * Initialize the application and the game as soon as the DOM is ready
   */
  load() {
    $(document).ready(() => this.documentReady());
  }

  documentReady() {
    this.app = new App();
    this.body = $('body');
    this.chatInput = $('#chatInput');
    this.addClasses();
    this.initGame();
    this.addResizeListeners();
  }

  /**
   * Add classes to the body element after detecting the user's browser or device
   */
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

  /**
   * Adds event listeners for a resize check
   * @listens {touchstart} - touching start
   * @listens {touchmove} - touching move/drag
   * @listens {transitionend} - transition ends
   * @listens {webkitTransitionEnd} - webkit transition ends
   * @listens {oTransitionEnd} - opera transition ends
   * @listens {orientationchange} - device orientation change
   */
  addResizeListeners() {
    const resizeCheck = $('#resizeCheck');

    document.addEventListener('touchstart', () => {}, false);
    document.addEventListener('touchmove', (e) => {
      e.preventDefault();
      return false;
    });

    resizeCheck.bind('transitionend', this.app.resize.bind(this));
    resizeCheck.bind('webkitTransitionEnd', this.app.resize.bind(this));
    resizeCheck.bind('oTransitionEnd', this.app.resize.bind(this));

    $(window).on('orientationchange', () => {
      this.app.updateOrientation();
    });
  }

  /**
   * Initialize the game once the client application is ready
   * @listens {App.onReady} - when App is done loading
   */
  initGame() {
    this.app.onReady(() => {
      this.app.sendStatus('Welcome, welcome...');

      const game = new Game(this.app);
      this.app.setGame(game);
    });
  }
}

new WTF().load();
