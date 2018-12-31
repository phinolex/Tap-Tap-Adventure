import $ from 'jquery';
import log from './lib/log';
import Detect from './utils/detect';
import App from './app'
import Game from './game';

export default class WTF {
  constructor() {
    this.app = null;
    this.body = null;
    this.chatInput = null;
    this.game = null;
  }

  load() {
    $(document).ready(function() {
      this.app = new App();
      this.body = $("body");
      this.chatInput = $("#chatInput");

      this.addClasses();
      this.initGame();
      this.addListeners();
    });
  };

  addClasses() {

    if (Detect.isWindows()) {
      this.body.addClass("windows");
    }

    if (Detect.isOpera()) {
      this.body.addClass("opera");
    }

    if (Detect.isFirefoxAndroid()) {
      this.chatInput.removeAttr("placeholder");
    }
  };

  addListeners() {
    var resizeCheck = $("#resizeCheck");

    document.addEventListener("touchstart", function() {}, false);
    document.addEventListener("touchmove", function(e) {
      e.preventDefault();
    });

    resizeCheck.bind("transitionend", this.app.resize.bind(app));
    resizeCheck.bind("webkitTransitionEnd", this.app.resize.bind(app));
    resizeCheck.bind("oTransitionEnd", this.app.resize.bind(app));

    $(window).on("orientationchange", function(event) {
      this.app.updateOrientation();
    });
  };

  initGame() {
    this.app.onReady(function() {
      this.app.sendStatus("Welcome, welcome...");

      game = new Game(this.app);
      this.app.setGame(game);
    });
  };
};

const wtf = new WTF();
wtf.load();