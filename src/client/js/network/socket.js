import io from 'socket.io-client';
import log from '../lib/log';
import Messages from './messages';

export default class Socket {
  constructor(game) {
    log.debug('Socket - constructor()', game);

    this.game = game;
    this.config = this.game.app.config;
    this.connection = null;
    this.listening = false;
    this.disconnected = false;
    this.messages = new Messages(this.game.app);
  }

  connect() {
    const protocol = this.config.ssl ? 'wss' : 'ws';
    const url = `${protocol}://${this.config.ip}:${this.config.port}`;

    log.debug('Socket - connect()', url);

    this.connection = null;

    this.connection = io(url, {
      forceNew: true,
      reconnection: false,
      upgrade: false,
      transports: ['websocket'],
    });

    this.connection.on('error', (error) => {
      log.debug('Socket - connect() - error', error);
    });

    this.connection.on('connect_error', (error) => {
      log.debug('Socket - connect() - server connection error', this.config.ip);
      log.error(error);

      this.listening = false;

      this.game.app.toggleLogin(false);
      this.game.app.sendError(null, 'Could not connect to the game server.');
    });

    this.connection.on('connect', () => {
      log.debug('Socket - connect() - connecting to server', this.config.ip);
      this.listening = true;

      this.game.app.updateLoader('Preparing handshake...');
      this.connection.emit('client', {
        gVer: this.config.version,
        cType: 'HTML5',
      });
    });

    this.connection.on('message', (message) => {
      log.debug('Socket - connect() - message', message);
      this.receive(message);
    });

    this.connection.on('disconnect', () => {
      log.debug('Socket - connect() - disconnecting');
      this.game.handleDisconnection();
    });
  }

  receive(message) {
    log.debug('Socket - receive()', message);

    if (!this.listening) {
      return;
    }

    if (message.startsWith('[')) {
      const data = JSON.parse(message);

      if (data.length > 1) {
        this.messages.handleBulkData(data);
      } else {
        this.messages.handleData(JSON.parse(message).shift());
      }
    } else {
      this.messages.handleUTF8(message);
    }
  }

  send(packet, data) {
    log.debug('Socket - send()', packet, data);

    const json = JSON.stringify([packet, data]);

    if (this.connection && this.connection.connected) {
      this.connection.send(json);
    }
  }
}
