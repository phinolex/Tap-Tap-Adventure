import $ from "jquery";
import Modules from "./utils/modules";
import log from "./lib/log";
import Detect from "./utils/detect";

export default class App {
  constructor() {
    

    log.info("Loading the main application...");

    this.config = null;

    this.body = $("body");
    this.wrapper = $("#content");
    this.container = $("#container");
    this.window = $(window);
    this.canvas = $("#canvasLayers");
    this.border = $("#border");

    this.intro = $("#modal");

    this.loginButton = $("#loginButton");
    this.createButton = $("#play");
    this.registerButton = $("#newCharacter");
    this.helpButton = $("#helpButton");
    this.cancelButton = $("#cancelButton");
    this.yes = $("#yes");
    this.no = $("#no");
    this.loading = $(".loader");
    this.loadingMsg = $(".loader.message");
    this.errorMsg = $(".error.message");

    this.respawn = $("#respawn");

    this.rememberMe = $("#rememberMe");
    this.guest = $("#guest");

    this.about = $("#toggle-about");
    this.credits = $("#toggle-credits");
    this.git = $("#toggle-git");

    this.loginFields = [$("#loginNameInput"), $("#loginPasswordInput")];

    this.registerFields = [];

    this.game = null;
    this.guestLogin = false;
    this.zoomFactor = 1;

    this.loggingIn = false;

    this.sendStatus("You should turn back now...");

    this.zoom();
    this.updateOrientation();
    this.load();
  }

  load() {
    

    this.loginButton.click(function() {
      this.login();
    });

    this.createButton.click(function() {
      this.login();
    });

    this.registerButton.click(function() {
      this.openScroll("loadCharacter", "createCharacter");
    });

    this.cancelButton.click(function() {
      this.openScroll("createCharacter", "loadCharacter");
    });

    this.wrapper.click(function() {
      if (
        this.wrapper.hasClass("about") ||
        this.wrapper.hasClass("credits") ||
        this.wrapper.hasClass("git")
      ) {
        this.wrapper.removeClass("about credits git");
        this.displayScroll("loadCharacter");
      }
    });

    this.about.click(function() {
      this.displayScroll("about");
    });

    this.credits.click(function() {
      this.displayScroll("credits");
    });

    this.git.click(function() {
      this.displayScroll("git");
    });

    // dismissing the welcome screen
    const welcomeContinue = function() {
      if (!this.game) return;

      // hide the welcome screen so it doesn't appear again
      this.game.storage.data.welcome = false;
      this.game.storage.save();

      this.body.removeClass("welcomeMessage");
    };

    this.yes.click(welcomeContinue);
    this.no.click(welcomeContinue);

    this.rememberMe.click(function() {
      if (!this.game || !this.game.storage) return;

      const active = this.rememberMe.hasClass("active");

      this.rememberMe.toggleClass("active");

      this.game.storage.toggleRemember(!active);
    });

    this.guest.click(function() {
      if (!this.game) return;

      this.guestLogin = true;
      this.login();
    });

    this.respawn.click(function() {
      if (!this.game || !this.game.player || !this.game.player.dead) return;

      this.game.respawn();
    });

    window.scrollTo(0, 1);

    this.window.resize(function() {
      this.zoom();
    });

    $.getJSON("data/config.json", function(json) {
      this.config = json;

      if (this.readyCallback) this.readyCallback();
    });

    $(document).bind("keydown", function(e) {
      if (e.which === Modules.Keys.Enter) return false;
    });

    $(document).keydown(function(e) {
      const key = e.which;

      if (!this.game) return;

      this.body.focus();

      if (key === Modules.Keys.Enter && !this.game.started) {
        this.login();
        return;
      }

      if (this.game.started) this.game.onInput(Modules.InputType.Key, key);
    });

    $(document).keyup(function(e) {
      const key = e.which;

      if (!this.game || !this.game.started) return;

      this.game.input.keyUp(key);
    });

    $(document).mousemove(function(event) {
      if (!this.game || !this.game.input || !this.game.started) return;

      this.game.input.setCoords(event);
      this.game.input.moveCursor();
    });

    this.canvas.click(function(event) {
      if (!this.game || !this.game.started || event.button !== 0) return;

      window.scrollTo(0, 1);

      this.game.input.handle(Modules.InputType.LeftClick, event);
    });

    $('input[type="range"]').on("input", function() {
      this.updateRange($(this));
    });
  }

  login() {
    

    if (
      this.loggingIn ||
      !this.game ||
      !this.game.loaded ||
      this.statusMessage ||
      !this.verifyForm()
    )
      return;

    this.toggleLogin(true);
    this.game.connect();
  }

  zoom() {
    

    const containerWidth = this.container.width(),
      containerHeight = this.container.height(),
      windowWidth = this.window.width(),
      windowHeight = this.window.height(),
      zoomFactor = windowWidth / containerWidth;

    if (containerHeight + 50 >= windowHeight) {
      zoomFactor = windowHeight / (containerHeight + 50);
    }

    if (this.getScaleFactor() === 3) zoomFactor -= 0.1;

    this.body.css({
      zoom: zoomFactor,
      "-moz-transform": "scale(" + zoomFactor + ")"
    });

    this.border.css("top", 0);

    this.zoomFactor = zoomFactor;
  }

  fadeMenu() {
    

    this.updateLoader(null);

    setTimeout(() => {
      this.body.addClass("game");
      this.body.addClass("started");
      this.body.removeClass("intro");
    }, 500);
  }

  showMenu() {
    

    this.body.removeClass("game");
    this.body.removeClass("started");
    this.body.addClass("intro");
  }

  showDeath() {}

  openScroll(origin, destination) {
    

    console.log("open scroll", origin, destination);

    if (!destination || this.loggingIn) return;

    this.cleanErrors();
    // this.wrapper.removeClass(origin).addClass(destination);
    $("#" + origin).css("display", "none");
    $("#" + destination).css("display", "block");
  }

  displayScroll(content) {
    const self = this,
      state = this.wrapper.attr("class");

    if (this.game.started) {
      this.wrapper.removeClass().addClass(content);

      this.body.removeClass("credits legal about").toggleClass(content);

      if (this.game.player) this.body.toggleClass("death");

      if (content !== "about") this.helpButton.removeClass("active");
    } else if (state !== "animate")
      this.openScroll(state, state === content ? "loadCharacter" : content);
  }

  verifyForm() {
    const self = this,
      activeForm = this.getActiveForm();

    if (activeForm === "null") {
      return;
    }

    switch (activeForm) {
      case "loadCharacter":
        const nameInput = $("#loginNameInput"),
          passwordInput = $("#loginPasswordInput");

        if (this.loginFields.length === 0)
          this.loginFields = [nameInput, passwordInput];

        if (!nameInput.val() && !this.isGuest()) {
          this.sendError(nameInput, "Please enter a username.");
          return false;
        }

        if (!passwordInput.val() && !this.isGuest()) {
          this.sendError(passwordInput, "Please enter a password.");
          return false;
        }

        break;

      case "createCharacter":
        const characterName = $("#registerNameInput"),
          registerPassword = $("#registerPasswordInput"),
          registerPasswordConfirmation = $(
            "#registerPasswordConfirmationInput"
          ),
          email = $("#registerEmailInput");

        if (this.registerFields.length === 0)
          this.registerFields = [
            characterName,
            registerPassword,
            registerPasswordConfirmation,
            email
          ];

        if (!characterName.val()) {
          this.sendError(characterName, "A username is necessary you silly.");
          return false;
        }

        if (!registerPassword.val()) {
          this.sendError(registerPassword, "You must enter a password.");
          return false;
        }

        if (registerPasswordConfirmation.val() !== registerPassword.val()) {
          this.sendError(
            registerPasswordConfirmation,
            "The passwords do not match!"
          );
          return false;
        }

        if (!email.val() || !this.verifyEmail(email.val())) {
          this.sendError(email, "An email is required!");
          return false;
        }

        break;
    }

    return true;
  }

  verifyEmail(email) {
    return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email
    );
  }

  sendStatus(message) {
    

    this.cleanErrors();

    this.statusMessage = message;

    if (!message) {
      this.loadingMsg.html("");
      this.loading.hide();
      return;
    }

    this.loading.show();
    this.loadingMsg.html(message);
  }

  sendError(field, error) {
    this.cleanErrors();
    console.log("Error: " + error);

    this.errorMsg.html(error);
    this.errorMsg.show();

    if (!field) return;

    field.addClass("field-error").select();
    field.bind("keypress", function(event) {
      field.removeClass("field-error");

      $(".validation-error").remove();

      $(this).unbind(event);
    });
  }

  cleanErrors() {
    const self = this,
      activeForm = this.getActiveForm(),
      fields =
        activeForm === "loadCharacter" ? this.loginFields : this.registerFields;

    for (let i = 0; i < fields.length; i++)
      fields[i].removeClass("field-error");

    $(".validation-error").remove();
    $(".status").remove();
  }

  getActiveForm() {
    return this.wrapper[0].className;
  }

  isRegistering() {
    return this.getActiveForm() === "createCharacter";
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
    return !!window.Worker;
  }

  getScaleFactor() {
    const width = window.innerWidth,
      height = window.innerHeight;

    /**
     * These are raw scales, we can adjust
     * for up-scaled rendering in the actual
     * rendering file.
     */

    return width <= 1000 ? 1 : width <= 1500 || height <= 870 ? 2 : 3;
  }

  revertLoader() {
    this.updateLoader("Connecting to server...");
  }

  updateLoader(message) {
    

    if (!message) {
      this.loading.hide();
      this.loadingMsg.html("");
      return;
    }

    this.loading.show();
    this.loadingMsg.html(message);
  }

  toggleLogin(toggle) {
    log.info("Logging in: " + toggle);

    

    this.revertLoader();

    this.toggleTyping(toggle);

    this.loggingIn = toggle;

    if (toggle) {
      this.loading.hide();

      this.loginButton.addClass("disabled");
      this.registerButton.addClass("disabled");
    } else {
      this.loading.hide();

      this.loginButton.removeClass("disabled");
      this.registerButton.removeClass("disabled");
    }
  }

  toggleTyping(state) {
    

    if (this.loginFields)
      _.each(this.loginFields, function(field) {
        field.prop("readonly", state);
      });

    if (this.registerFields)
      _.each(this.registerFields, function(field) {
        field.prop("readOnly", state);
      });
  }

  updateRange(obj) {
    const self = this,
      val = (obj.val() - obj.attr("min")) / (obj.attr("max") - obj.attr("min"));

    obj.css(
      "background-image",
      "-webkit-gradient(linear, left top, right top, " +
        "color-stop(" +
        val +
        ", #4d4d4d), " +
        "color-stop(" +
        val +
        ", #C5C5C5)" +
        ")"
    );
  }

  updateOrientation() {
    this.orientation = this.getOrientation();
  }

  getOrientation() {
    return window.innerHeight > window.innerWidth ? "portrait" : "landscape";
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
