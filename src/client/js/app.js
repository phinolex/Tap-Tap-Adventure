/* global document, window */
import $ from 'jquery';
import _ from 'underscore';
import Modules from './utils/modules';
import log from './lib/log';
import Detect from './utils/detect';

export default class App {
  constructor() {
    log.info('Loading the main application...');

    this.config = null;

    this.body = $('body');
    this.wrapper = $('#content');
    this.container = $('#container');
    this.window = $(window);
    this.canvas = $('#canvasLayers');
    this.border = $('#border');

    this.intro = $('#modal');

    this.loginButton = $('#loginButton');
    this.createButton = $('#play');
    this.registerButton = $('#newCharacter');
    this.helpButton = $('#helpButton');
    this.cancelButton = $('#cancelButton');
    this.yes = $('#yes');
    this.no = $('#no');
    this.loading = $('.loader');
    this.loadingMsg = $('.loader.message');
    this.errorMsg = $('.error.message');

    this.respawn = $('#respawn');

    this.rememberMe = $('#rememberMe');
    this.guest = $('#guest');

    this.about = $('#toggle-about');
    this.credits = $('#toggle-credits');
    this.git = $('#toggle-git');

    this.loginFields = [$('#loginNameInput'), $('#loginPasswordInput')];

    this.registerFields = [];

    this.game = null;
    this.guestLogin = false;
    this.zoomFactor = 1;

    this.loggingIn = false;

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.sendStatus('You should turn back now...');

    this.zoom();
    this.updateOrientation();
    this.load();
  }

  load() {
    this.loginButton.click(() => {
      this.login();
    });

    this.createButton.click(() => {
      this.login();
    });

    this.registerButton.click(() => {
      this.openScroll('loadCharacter', 'createCharacter');
    });

    this.cancelButton.click(() => {
      this.openScroll('createCharacter', 'loadCharacter');
    });

    this.wrapper.click(() => {
      if (
        this.wrapper.hasClass('about')
        || this.wrapper.hasClass('credits')
        || this.wrapper.hasClass('git')
      ) {
        this.wrapper.removeClass('about credits git');
        this.displayScroll('loadCharacter');
      }
    });

    this.about.click(() => {
      this.displayScroll('about');
    });

    this.credits.click(() => {
      this.displayScroll('credits');
    });

    this.git.click(() => {
      this.displayScroll('git');
    });

    // dismissing the welcome screen
    const welcomeContinue = () => {
      if (!this.game) {
        return;
      }

      // hide the welcome screen so it doesn't appear again
      this.game.storage.data.welcome = false;
      this.game.storage.save();

      this.body.removeClass('welcomeMessage');
    };

    this.yes.click(welcomeContinue);
    this.no.click(welcomeContinue);

    this.rememberMe.click(() => {
      if (!this.game || !this.game.storage) {
        return;
      }

      const active = this.rememberMe.hasClass('active');

      this.rememberMe.toggleClass('active');

      this.game.storage.toggleRemember(!active);
    });

    this.guest.click(() => {
      if (!this.game) {
        return;
      }

      this.guestLogin = true;
      this.login();
    });

    this.respawn.click(() => {
      if (!this.game || !this.game.player || !this.game.player.dead) {
        return;
      }

      this.game.respawn();
    });

    window.scrollTo(0, 1);

    this.window.resize(() => {
      this.zoom();
    });

    $.getJSON('./assets/data/config.json', (json) => {
      this.config = json;

      if (this.readyCallback) {
        this.readyCallback();
      }
    });

    $(document).bind('keydown', (e) => {
      if (e.which === Modules.Keys.Enter) {
        return false;
      }
      return true;
    });

    $(document).keydown((e) => {
      const key = e.which;

      if (!this.game) {
        return;
      }

      this.body.focus();

      if (key === Modules.Keys.Enter && !this.game.started) {
        this.login();
        return;
      }

      if (this.game.started) {
        this.game.onInput(Modules.InputType.Key, key);
      }
    });

    $(document).keyup((e) => {
      const key = e.which;

      if (!this.game || !this.game.started) {
        return;
      }

      this.game.input.keyUp(key);
    });

    $(document).mousemove((event) => {
      if (!this.game || !this.game.input || !this.game.started) {
        return;
      }

      this.game.input.setCoords(event);
      this.game.input.moveCursor();
    });

    this.canvas.click((event) => {
      if (!this.game || !this.game.started || event.button !== 0) {
        return;
      }

      window.scrollTo(0, 1);

      this.game.input.handle(Modules.InputType.LeftClick, event);
    });

    $('input[type="range"]').on('input', () => {
      this.updateRange($(this));
    });
  }

  login() {
    if (
      this.loggingIn
      || !this.game
      || !this.game.loaded
      || this.statusMessage
      || !this.verifyForm()
    ) return;

    this.toggleLogin(true);
    this.game.connect();
  }

  zoom() {
    const containerWidth = this.container.width();
    const containerHeight = this.container.height();
    const windowWidth = this.window.width();
    const windowHeight = this.window.height();
    let zoomFactor = windowWidth / containerWidth;

    if (containerHeight + 50 >= windowHeight) {
      zoomFactor = windowHeight / (containerHeight + 50);
    }

    if (this.getScaleFactor() === 3) {
      zoomFactor -= 0.1;
    }

    this.body.css({
      zoom: zoomFactor,
      '-moz-transform': `scale(${zoomFactor})`,
    });

    this.border.css('top', 0);
    this.zoomFactor = zoomFactor;
  }

  fadeMenu() {
    this.updateLoader(null);

    setTimeout(() => {
      this.body.addClass('game');
      this.body.addClass('started');
      this.body.removeClass('intro');
    }, 500);
  }

  showMenu() {
    this.body.removeClass('game');
    this.body.removeClass('started');
    this.body.addClass('intro');
  }

  openScroll(origin, destination) {
    log.info('open scroll', origin, destination);

    if (!destination || this.loggingIn) {
      return;
    }

    this.cleanErrors();
    // this.wrapper.removeClass(origin).addClass(destination);
    $(`#${origin}`).css('display', 'none');
    $(`#${destination}`).css('display', 'block');
  }

  displayScroll(content) {
    const state = this.wrapper.attr('class');

    if (this.game.started) {
      this.wrapper.removeClass().addClass(content);

      this.body.removeClass('credits legal about').toggleClass(content);

      if (this.game.player) {
        this.body.toggleClass('death');
      }

      if (content !== 'about') {
        this.helpButton.removeClass('active');
      }
    } else if (state !== 'animate') {
      this.openScroll(state, state === content ? 'loadCharacter' : content);
    }
  }

  verifyForm() {
    const activeForm = this.getActiveForm();

    if (activeForm === 'null') {
      return true;
    }

    switch (activeForm) {
      default:
        break;
      case 'loadCharacter':
        const nameInput = $('#loginNameInput'); // eslint-disable-line
        const passwordInput = $('#loginPasswordInput'); // eslint-disable-line

        if (this.loginFields.length === 0) {
          this.loginFields = [nameInput, passwordInput];
        }

        if (!nameInput.val() && !this.isGuest()) {
          this.sendError(nameInput, 'Please enter a username.');
          return false;
        }

        if (!passwordInput.val() && !this.isGuest()) {
          this.sendError(passwordInput, 'Please enter a password.');
          return false;
        }
        break;

      case 'createCharacter':
        const characterName = $('#registerNameInput'); // eslint-disable-line
        const registerPassword = $('#registerPasswordInput'); // eslint-disable-line
        const email = $('#registerEmailInput'); // eslint-disable-line
        const registerPasswordConfirmation = $( // eslint-disable-line
          '#registerPasswordConfirmationInput',
        );

        if (this.registerFields.length === 0) {
          this.registerFields = [
            characterName,
            registerPassword,
            registerPasswordConfirmation,
            email,
          ];
        }

        if (!characterName.val()) {
          this.sendError(characterName, 'A username is necessary you silly.');
          return false;
        }

        if (!registerPassword.val()) {
          this.sendError(registerPassword, 'You must enter a password.');
          return false;
        }

        if (registerPasswordConfirmation.val() !== registerPassword.val()) {
          this.sendError(
            registerPasswordConfirmation,
            'The passwords do not match!',
          );
          return false;
        }

        if (!email.val() || !this.verifyEmail(email.val())) {
          this.sendError(email, 'An email is required!');
          return false;
        }

        break;
    }

    return true;
  }

  /* eslint-disable */
  verifyEmail(email) {
    return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email,
    );
  }
  /* eslint-enable */

  sendStatus(message) {
    this.cleanErrors();

    this.statusMessage = message;

    if (!message) {
      this.loadingMsg.html('');
      this.loading.hide();
      return;
    }

    this.loading.show();
    this.loadingMsg.html(message);
  }

  sendError(field, error) {
    this.cleanErrors();
    log.info(`Error: ${error}`);

    this.errorMsg.html(error);
    this.errorMsg.show();

    if (!field) return;

    field.addClass('field-error').select();
    field.bind('keypress', (event) => {
      field.removeClass('field-error');

      $('.validation-error').remove();

      $(this).unbind(event);
    });
  }

  cleanErrors() {
    const activeForm = this.getActiveForm();
    const fields = activeForm === 'loadCharacter' ? this.loginFields : this.registerFields;

    for (let i = 0; i < fields.length; i += 1) {
      fields[i].removeClass('field-error');
    }

    $('.validation-error').remove();
    $('.status').remove();
  }

  getActiveForm() {
    return this.wrapper[0].className;
  }

  isRegistering() {
    return this.getActiveForm() === 'createCharacter';
  }

  isGuest() {
    return this.guestLogin;
  }

  resize() {
    if (this.game) this.game.resize();
  }

  setGame(game) {
    this.game = game;
  }

  hasWorker() {
    return !!this.window.Worker;
  }

  getScaleFactor() {
    const mobile = 1;
    const desktop = 2;
    const tablet = 3;

    const tabletOrDesktop = this.width <= 1500 || this.height <= 870 ? desktop : tablet;

    /**
     * These are raw scales, we can adjust
     * for up-scaled rendering in the actual
     * rendering file.
     */

    return this.width <= 1000
      ? mobile
      : tabletOrDesktop;
  }

  revertLoader() {
    this.updateLoader('Connecting to server...');
  }

  updateLoader(message) {
    if (!message) {
      this.loading.hide();
      this.loadingMsg.html('');
      return;
    }

    this.loading.show();
    this.loadingMsg.html(message);
  }

  toggleLogin(toggle) {
    log.info(`Logging in: ${toggle}`);

    this.revertLoader();

    this.toggleTyping(toggle);

    this.loggingIn = toggle;

    if (toggle) {
      this.loading.hide();

      this.loginButton.addClass('disabled');
      this.registerButton.addClass('disabled');
    } else {
      this.loading.hide();

      this.loginButton.removeClass('disabled');
      this.registerButton.removeClass('disabled');
    }
  }

  toggleTyping(state) {
    if (this.loginFields) {
      _.each(this.loginFields, (field) => {
        field.prop('readonly', state);
      });
    }

    if (this.registerFields) {
      _.each(this.registerFields, (field) => {
        field.prop('readOnly', state);
      });
    }
  }

  updateRange(obj) {
    const val = (obj.val() - obj.attr('min')) / (obj.attr('max') - obj.attr('min'));

    obj.css(
      'background-image',
      `-webkit-gradient(linear, left top, right top, color-stop(${val}, #4d4d4d), color-stop(${val}, #C5C5C5)`,
    );
  }

  updateOrientation() {
    this.orientation = this.getOrientation();
  }

  getOrientation() {
    return this.height > this.width ? 'portrait' : 'landscape';
  }

  getZoom() {
    return this.zoomFactor;
  }

  onReady(callback) {
    this.readyCallback = callback;
  }

  isMobile() {
    return this.getScaleFactor() < 2;
  }

  isTablet() {
    return Detect.isIpad() || (Detect.isAndroid() && this.getScaleFactor() > 1);
  }
}
