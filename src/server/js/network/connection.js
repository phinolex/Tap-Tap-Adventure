import log from 'log';

export default class Connection {
  constructor(id, connection, server) {
    this.id = id;
    this.socket = connection;
    this._server = server; // eslint-disable-line
  }

  broadcast() {
    throw 'Invalid initialization.';
  }

  send() {
    throw 'Invalid initialization.';
  }

  sendUTF8() {
    throw 'Invalid initialization.';
  }

  close(reason) {
    if (reason) {
      log.info(reason);
    }

    this.socket.conn.close();
  }
}
