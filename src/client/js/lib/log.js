/* global window, printStackTrace */

class Logger {
  constructor(level) {
    this.level = level;
  }

  info(message) {
    if (this.level === 'debug' || this.level === 'info') {
      if (window.console) {
        console.info(message); //eslint-disable-line
      }
    }
  }

  debug(message) {
    if (this.level === 'debug') {
      if (window.console) {
        console.log(message); //eslint-disable-line
      }
    }
  }

  error(message, stacktrace) {
    if (window.console && this.level) {
      console.error(message); // eslint-disable-line
      if (stacktrace !== undefined && stacktrace === true) {
        const trace = printStackTrace();
        console.error(trace.join('\n\n')); //eslint-disable-line
        console.error('-----------------------------'); //eslint-disable-line
      }
    }
  }
}

export default new Logger('debug');
