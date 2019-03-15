import $ from 'jquery';
import Modules from '../utils/modules';
import Packets from '../network/packets';

/**
 * Manages the game's chat log window and chat history
 * @class
 */
export default class Chat {
  /**
   * Default constructor
   * @param {Game} game instance of the game class
   */
  constructor(game) {
    /**
     * Instance of the game object
     * @type {Game}
     */
    this.game = game;

    /**
     * A reference to the chat container
     * @type {Object}
     */
    this.chat = $('#chat');

    /**
     * A reference to the chat logs container
     * @type {Object}
     */
    this.log = $('#chatLog');

    /**
     * A reference to the chat input element
     * @type {Object}
     */
    this.input = $('#hud-chat-input');

    /**
     * A reference to the chat button
     * @type {Object}
     */
    this.button = $('#hud-chat');

    /**
     * The visibility of the chat containers
     * @type {Boolean}
     */
    this.visible = false;

    /**
     * The duration before the chat message starts to fade out
     * @type {Number}
     */
    this.fadingDuration = 5000;

    /**
     * A reference to the timeout for the chat message
     * @type {Object}
     */
    this.fadingTimeout = null;

    /**
     * On click handler for the chat button, toggles the visibility
     * @type {Function}
     */
    this.button.click(() => {
      this.button.blur();

      if (this.input.is(':visible')) {
        this.hideInput();
      } else {
        this.toggle();
      }
    });
  }

  add(source, text, labelColor, textColor) {
    const styleLabel = labelColor || 'white';
    const styleText = textColor || 'white';

    const element = $(
      `<p>
        <span style="color:${styleLabel}">${source}:</span>
        <span style="color: ${styleText}"> ${text}</span>
      </p>`,
    );

    this.showChat();

    if (!this.isActive()) {
      this.hideInput();
    }

    this.hideChat();

    this.log.append(element);
    this.log.scrollTop(99999);
  }

  key(data) {
    switch (data) {
      case Modules.Keys.Enter:
        if (this.input.val() === '') {
          this.toggle();
        } else {
          this.send();
        }

        break;
      default:
        break;
    }
  }

  send() {
    this.game.socket.send(Packets.Chat, [this.input.val()]);
    this.toggle();
  }

  toggle() {
    this.clean();

    if (this.visible && !this.isActive()) this.showInput();
    else if (this.visible) {
      this.hideInput();
      this.hideChat();
    } else {
      this.showChat();
      this.showInput();
    }
  }

  showChat() {
    this.chat.fadeIn('fast');

    this.visible = true;
  }

  showInput() {
    this.button.addClass('active');

    this.input.fadeIn('fast');
    this.input.val('');
    this.input.focus();

    this.clean();
  }

  hideChat() {
    if (this.fadingTimeout) {
      clearTimeout(this.fadingTimeout);
      this.fadingTimeout = null;
    }

    this.fadingTimeout = setTimeout(() => {
      if (!this.isActive()) {
        this.chat.fadeOut('slow');

        this.visible = false;
      }
    }, this.fadingDuration);
  }

  hideInput() {
    this.button.removeClass('active');

    this.input.val('');
    this.input.fadeOut('fast');
    this.input.blur();

    this.hideChat();
  }

  clean() {
    clearTimeout(this.fadingTimeout);
    this.fadingTimeout = null;
  }

  isActive() {
    return this.input.is(':focus');
  }
}
