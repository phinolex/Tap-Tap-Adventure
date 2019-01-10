/* global document, window */
import $ from 'jquery';
import _ from 'underscore';
import Modules from './utils/modules';
import log from './lib/log';
import Detect from './utils/detect';

/**
 * Controls the client side changes for the application and game
 * @class
 */
export default class App {
  /**
   * Load all the different windows/UI portions on the index page
   * relevant for use in the game, set the zoom factor, update the
   * orientation and then load the login screen
   */
  constructor() {
    log.info('Loading the main application...');

    /**
     * Configuration for the client application
     * loaded from ./assets/data/config.json
     * @type {Object}
     */
    this.config = null;

    /**
     * An instance of the DOM $('body') element
     * @type {Object}
     */
    this.body = $('body');

    /**
     * An instance of the DOM $('#content') element
     * @type {Object}
     */
    this.wrapper = $('#content');

    /**
     * An instance of the DOM $('#container') element
     * @type {Object}
     */
    this.container = $('#container');

    /**
     * An instance of the DOM $(window) element
     * @type {Object}
     */
    this.window = $(window);

    /**
     * An instance of the DOM $('#canvasLayers') element
     * @type {Object}
     */
    this.canvas = $('#canvasLayers');

    /**
     * An instance of the DOM $('#border') element
     * @type {Object}
     */
    this.border = $('#border');

    /**
     * An instance of the DOM $('#modal') element
     * @type {Object}
     */
    this.intro = $('#modal');

    /**
     * An instance of the DOM $('#loginButton') element
     * @type {Object}
     */
    this.loginButton = $('#loginButton');

    /**
     * An instance of the DOM $('#play') element
     * @type {Object}
     */
    this.createButton = $('#play');

    /**
     * An instance of the DOM $('#newCharacter') element
     * @type {Object}
     */
    this.registerButton = $('#newCharacter');

    /**
     * An instance of the DOM $('#helpButton') element
     * @type {Object}
     */
    this.helpButton = $('#helpButton');

    /**
     * An instance of the DOM $('#cancelButton') element
     * @type {Object}
     */
    this.cancelButton = $('#cancelButton');

    /**
     * An instance of the DOM $('#yes') element
     * @type {Object}
     */
    this.yes = $('#yes');

    /**
     * An instance of the DOM $('#no') element
     * @type {Object}
     */
    this.no = $('#no');

    /**
     * An instance of the DOM $('.loader') element
     * @type {Object}
     */
    this.loading = $('.loader');

    /**
     * An instance of the DOM $('.loader.message') element
     * @type {Object}
     */
    this.loadingMsg = $('.loader.message');

    /**
     * An instance of the DOM $('.error.message') element
     * @type {Object}
     */
    this.errorMsg = $('.error.message');

    /**
     * An instance of the DOM $('#respawn') element
     * @type {Object}
     */
    this.respawn = $('#respawn');

    /**
     * An instance of the DOM $('#rememberMe') element
     * @type {Object}
     */
    this.rememberMe = $('#rememberMe');

    /**
     * An instance of the DOM $('#guest') element
     * @type {Object}
     */
    this.guest = $('#guest');

    /**
     * An instance of the DOM $('#toggle-about') element
     * @type {Object}
     */
    this.about = $('#toggle-about');

    /**
     * An instance of the DOM $('#toggle-credits') element
     * @type {Object}
     */
    this.credits = $('#toggle-credits');

    /**
     * An instance of the DOM $('#toggle-git') element
     * @type {Object}
     */
    this.git = $('#toggle-git');

    /**
     * An instance of the DOM $('#loginNameInput') and $('#loginPasswordInput') element
     * @type {Object[]}
     */
    this.loginFields = [$('#loginNameInput'), $('#loginPasswordInput')];

    /**
     * Register fields
     * @type {Array}
     */
    this.registerFields = [];

    /**
     * An instance of Game class
     * @type {Game}
     */
    this.game = null;

    /**
     * Used to determine if the player is logging in as a guest or not
     * @type {Boolean}
     */
    this.guestLogin = false;

    /**
     * Zoom percentage from 0 to 1
     * @type {Number}
     */
    this.zoomFactor = 1;

    /**
     * Used to figure out whether or not to show the login screen
     * @type {Boolean}
     */
    this.loggingIn = false;

    /**
     * The width of the player's browser window
     * @type {Number}
     */
    this.width = window.innerWidth;

    /**
     * The height of the player's browser window
     * @type {Number}
     */
    this.height = window.innerHeight;

    /**
     * The orientation of the player's device
     * @type {String}
     */
    this.orientation = 'landscape';

    /**
     * Callback function when this class is done loading
     * @type {Function}
     */
    this.readyCallback = null;

    /**
     * Used to display loading status messages
     * @type {String}
     */
    this.statusMessage = null;

    this.sendStatus('You should turn back now...');

    this.zoom();
    this.updateOrientation();
    this.load();
  }

  /**
   * Add click listeners for the different parts of the UI
   */
  load() {
    this.loginButton.click(this.login);
    this.createButton.click(this.login);
    this.wrapper.click(this.loadCharacter);
    this.yes.click(this.welcomeContinue);
    this.no.click(this.welcomeContinue);
    this.rememberMe.click(this.rememberMe);
    this.guest.click(this.loginAsGuest);

    this.registerButton.click(() => this.displayScreen('loadCharacter', 'createCharacter'));
    this.cancelButton.click(() => this.displayScreen('createCharacter', 'loadCharacter'));
    this.about.click(() => this.displayScroll('about'));
    this.credits.click(() => this.displayScroll('credits'));
    this.git.click(() => this.displayScroll('git'));
    this.respawn.click(this.respawn);

    window.scrollTo(0, 1); // why do we do this?
    this.window.resize(this.zoom());

    $.getJSON('./assets/data/config.json', (json) => {
      this.config = json;

      if (this.readyCallback) {
        this.readyCallback();
      }
    });

    $(document).keydown(this.keydownEventListener);
    $(document).keyup(this.keyupEventListener);
    $(document).mousemove(this.mousemoveEventListener);
    this.canvas.click(this.canvasClickEventListener);

    $('input[type="range"]').on('input', () => {
      this.updateRange(this);
    });
  }

  /**
   * Dismissing the welcome screen when the application has
   * finished loading
   */
  welcomeContinue() {
    if (!this.game) {
      return;
    }

    // makes sure the welcome screen doesn't appear again
    this.game.storage.data.welcome = false;
    this.game.storage.save();
    this.body.removeClass('welcomeMessage');
  }

  /**
   * Try to connect and login to the game
   * @private
   */
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

  /**
   * Try to login as a guest
   * @private
   */
  loginAsGuest() {
    if (!this.game) {
      return;
    }

    this.guestLogin = true;
    this.login();
  }

  /**
   * Switch to the load character screen
   * @private
   */
  loadCharacter() {
    if (
      this.wrapper.hasClass('about')
      || this.wrapper.hasClass('credits')
      || this.wrapper.hasClass('git')
    ) {
      this.wrapper.removeClass('about credits git');
      this.displayScroll('loadCharacter');
    }
  }

  /**
   * Tells the game to toggle remembering this player,
   * if true will store player information in local storage
   *
   * @TODO update this to use the database instead
   * @private
   */
  rememberMe() {
    if (!this.game || !this.game.storage) {
      return;
    }

    const active = this.rememberMe.hasClass('active');

    this.rememberMe.toggleClass('active');
    this.game.storage.toggleRemember(!active);
  }

  /**
   * Tells the game to respawn the player
   * @private
   */
  respawn() {
    if (!this.game || !this.game.player || !this.game.player.dead) {
      return;
    }

    this.game.respawn();
  }

  /**
   * Handles key down presses
   * @param {Object} event keypress event
   */
  keydownEventListener(event) {
    const key = event.which;

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
  }

  /**
   * Handles key up presses
   * @param {Object} event keypress event
   */
  keyupEventListener(event) {
    const key = event.which;

    if (!this.game || !this.game.started) {
      return;
    }

    this.game.input.keyUp(key);
  }

  /**
   * Handles mouse movements
   * @param {Object} event mouse event
   */
  mousemoveEventListener(event) {
    if (!this.game || !this.game.input || !this.game.started) {
      return;
    }

    this.game.input.setCoords(event);
    this.game.input.moveCursor();
  }

  /**
   * Handles clicks on the HTML5 canvas
   * @param {Object} event click event
   */
  canvasClickEventListener(event) {
    if (!this.game || !this.game.started || event.button !== 0) {
      return;
    }

    window.scrollTo(0, 1);
    this.game.input.handle(Modules.InputType.LeftClick, event);
  }

  /**
   * Handles zooming the container to scale the
   * game to fit porportionally with the player's window size
   */
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

  /**
   * Fades the menu
   */
  fadeMenu() {
    this.updateLoader(null);

    setTimeout(() => {
      this.body.addClass('game');
      this.body.addClass('started');
      this.body.removeClass('intro');
    }, 500);
  }

  /**
   * Shows the menu
   */
  showMenu() {
    this.body.removeClass('game');
    this.body.removeClass('started');
    this.body.addClass('intro');
  }

  /**
   * Changes from one screen to another
   * @param {String} origin the old screen to hide
   * @param {String} destination the new screen to show
   */
  displayScreen(origin, destination) {
    log.info('open scroll', origin, destination);

    if (!destination || this.loggingIn) {
      return;
    }

    this.cleanErrors();
    // this.wrapper.removeClass(origin).addClass(destination);
    $(`#${origin}`).css('display', 'none');
    $(`#${destination}`).css('display', 'block');
  }

  /**
   * Display the given screen
   * @param {String} content - the screen to display
   */
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
      this.displayScreen(state, state === content ? 'loadCharacter' : content);
    }
  }

  /**
   * Verify the active form
   */
  verifyForm() {
    const activeForm = this.getActiveForm();

    if (activeForm === 'null') {
      return true;
    }

    switch (activeForm) {
      case 'loadCharacter': return this.verifyLoginForm();
      case 'createCharacter': return this.verifyJoinForm();
      default: break;
    }

    return true;
  }

  /**
   * Verify the input fields on the join form
   * @return {Boolean} true if valid
   */
  verifyJoinForm() {
    const characterName = $('#registerNameInput');
    const registerPassword = $('#registerPasswordInput');
    const email = $('#registerEmailInput');
    const registerPasswordConfirmation = $('#registerPasswordConfirmationInput');

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

    return true;
  }

  /**
   * Check to see if the player has entered a valid username and password
   * before attempting to login
   * @return {Boolean} true if valid
   */
  verifyLoginForm() {
    const nameInput = $('#loginNameInput');
    const passwordInput = $('#loginPasswordInput');

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

    return true;
  }

  /* eslint-disable */
  /**
   * Verify this is a valid email address
   * @param  {String} email player's email address
   * @return {Boolean} true if valid
   */
  verifyEmail(email) {
    return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email,
    );
  }
  /* eslint-enable */

  /**
   * Display a status message to the client
   * @param {String} message the message
   */
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

  /**
   * Set this input field as having an error
   * @param {Object} field the Jquery instance of the field that has the error
   * @param {String} error the error message to display telling the player
   * that this field has an issue
   */
  sendError(field, error) {
    this.cleanErrors();
    log.info(`Error: ${error}`);

    this.errorMsg.html(error);
    this.errorMsg.show();

    if (!field) {
      return;
    }

    field.addClass('field-error').select();
    field.bind('keypress', (event) => {
      field.removeClass('field-error');
      $('.validation-error').remove();
      $(this).unbind(event);
    });
  }

  /**
   * Clean up any current form validation errors
   * on the active form's input fields
   */
  cleanErrors() {
    const activeForm = this.getActiveForm();
    const fields = activeForm === 'loadCharacter'
      ? this.loginFields
      : this.registerFields;

    for (let i = 0; i < fields.length; i += 1) {
      fields[i].removeClass('field-error');
    }

    $('.validation-error').remove();
    $('.status').remove();
  }

  /**
   * Return the active form from the top wrapper's class name
   * @return {String} active form's ID
   */
  getActiveForm() {
    return this.wrapper && this.wrapper[0] && this.wrapper[0].className;
  }

  /**
   * Returns true if the join form is displayed
   * @return {Boolean} true if on the join form
   */
  isRegistering() {
    return this.getActiveForm() === 'createCharacter';
  }

  /**
   * Returns true if this player is playing as a guest
   * @return {Boolean} true if player is a guest
   */
  isGuest() {
    return this.guestLogin;
  }

  /**
   * Call the game's resizer function
   */
  resize() {
    if (this.game) {
      this.game.resize();
    }
  }

  /**
   * Set the app to use a new instance of the game
   */
  setGame(game) {
    this.game = game;
  }

  /**
   * Checks to see if the window has a web worker
   * @return {Boolean} returns true if the window has an active web worker
   */
  hasWorker() {
    return !!this.window.Worker;
  }

  /**
   * Figures out the current scale factor to use
   * for assets
   * @return {Number} 1 = mobile, 2 = desktop and 3 = tablet
   */
  getScaleFactor() {
    const mobile = 1;
    const tablet = 2;
    const desktop = 3;
    const tabletOrDesktop = this.width <= 1500 || this.height <= 870
      ? desktop
      : tablet;

    /**
     * These are raw scales, we can adjust
     * for up-scaled rendering in the actual
     * rendering file.
     */
    return this.width <= 1000
      ? mobile
      : tabletOrDesktop;
  }

  /**
   * Revert the loader message to it's default state
   * of 'Connecting to server...'
   */
  revertLoader() {
    this.updateLoader('Connecting to server...');
  }

  /**
   * Update the loader to show a specific message
   * @param  {String} message the loader message to display
   */
  updateLoader(message) {
    if (!message) {
      this.loading.hide();
      this.loadingMsg.html('');
      return;
    }

    this.loading.show();
    this.loadingMsg.html(message);
  }

  /**
   * Toggle displaying the login form
   * @param  {Boolean} toggle true to hide, false to show
   */
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

  /**
   * Toggle the read only attribute on the login fields
   * and form registration fields
   * @param  {String} state the state to update the fields to
   */
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

  /**
   * Update the range of and object
   * using a linear gradient on the background color
   */
  updateRange(field) {
    const obj = $(field);
    const val = (obj.val() - obj.attr('min')) / (obj.attr('max') - obj.attr('min'));

    obj.css(
      'background-image',
      `-webkit-gradient(linear, left top, right top, color-stop(${val}, #4d4d4d), color-stop(${val}, #C5C5C5)`,
    );
  }

  /**
   * Updates the orientation of the application
   * to match the orientation of the device the
   * player is using
   */
  updateOrientation() {
    this.orientation = this.getOrientation();
  }

  /**
   * Returns the orientation of the device the user is on
   * @return {String} portrait|landscape
   */
  getOrientation() {
    return this.height > this.width ? 'portrait' : 'landscape';
  }

  /**
   * Returns the zoom factor
   * @return {Number} a value from 0 to 1
   */
  getZoom() {
    return this.zoomFactor;
  }

  /**
   * The callback function when this app class is ready
   * and done loading
   * @param  {Function} callback the callback function when
   * this application class is done loading
   */
  onReady(callback) {
    this.readyCallback = callback;
  }

  /**
   * Check if the player is using a phone
   * @return {Boolean} true if a phone
   */
  isMobile() {
    return this.getScaleFactor() < 2;
  }

  /**
   * Check if the player is using a tablet
   * @return {Boolean} true if a tablet
   */
  isTablet() {
    return Detect.isIpad() || (Detect.isAndroid() && this.getScaleFactor() > 1);
  }
}
