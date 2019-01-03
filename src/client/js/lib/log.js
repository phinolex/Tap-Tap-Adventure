/* global window, printStackTrace */

const Logger = (level) => {
  this.level = level;
};

Logger.prototype.info = () => {};
Logger.prototype.debug = () => {};
Logger.prototype.error = () => {};
Logger.prototype.info = (message) => {
  if (this.level === 'debug' || this.level === 'info') {
    if (window.console) {
      console.info(message); //eslint-disable-line
    }
  }
};

Logger.prototype.debug = (message) => {
  if (this.level === 'debug') {
    if (window.console) {
      console.log(message); //eslint-disable-line
    }
  }
};

Logger.prototype.error = (message, stacktrace) => {
  if (window.console) {
    console.error(message); // eslint-disable-line
    if (stacktrace !== undefined && stacktrace === true) {
      const trace = printStackTrace();
      console.error(trace.join('\n\n')); //eslint-disable-line
      console.error('-----------------------------'); //eslint-disable-line
    }
  }
};

export default new Logger('debug');
