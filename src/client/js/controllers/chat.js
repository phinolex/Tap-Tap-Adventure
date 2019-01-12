import $ from 'jquery';
import Modules from '../utils/modules';
import Packets from '../network/packets';

/**
 * Manages the game's chat log window and chat history
 * @class
 */
export default class Chat {
  constructor(game) {
    this.game = game;

    this.chat = $('#chat');
    this.log = $('#chatLog');
    this.input = $('#hud-chat-input');
    this.button = $('#hud-chat');

    this.visible = false;

    this.fadingDuration = 5000;
    this.fadingTimeout = null;

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
