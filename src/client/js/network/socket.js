import io from 'socket.io-client';
import log from '../lib/log';
import Messages from './messages';

export default class Socket {
  constructor(game) {
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

    log.info(`Opening WebSocket: ${url}`);

    this.connection = null;

    log.info(io);

    this.connection = io(url, {
      forceNew: true,
      reconnection: false,
      upgrade: false,
      transports: ['websocket'],
    });

    this.connection.on('error', (error) => {
      log.info('Socket Error', error);
    });

    this.connection.on('connect_error', (error) => {
      log.info(`Failed to connect to: ${this.config.ip}`);
      log.error(error);

      this.listening = false;

      this.game.app.toggleLogin(false);
      this.game.app.sendError(null, 'Could not connect to the game server.');
    });

    this.connection.on('connect', () => {
      this.listening = true;

      this.game.app.updateLoader('Preparing handshake...');
      this.connection.emit('client', {
        gVer: this.config.version,
        cType: 'HTML5',
      });
    });

    this.connection.on('message', (message) => {
      this.receive(message);
    });

    this.connection.on('disconnect', () => {
      this.game.handleDisconnection();
    });
  }

  receive(message) {
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
    const json = JSON.stringify([packet, data]);

    if (this.connection && this.connection.connected) {
      this.connection.send(json);
    }
  }
}
