/* global window, printStackTrace */
/* eslint-disable */
class Logger {
  constructor(level) {
    this.level = level;
    this.classMap = {};
  }

  randomColor() {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  }

  lightOrDark(color) {
    // Variables for red, green, blue values
    let r;
    let g;
    let b;
    let hsp;
    let colorMatch;

    // Check the format of the color, HEX or RGB?
    if (color.match(/^rgb/)) {
      // If HEX --> store the red, green, blue values in separate variables
      colorMatch = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);

      [r, b, g] = colorMatch;
    } else {
      // If RGB --> Convert it to HEX: http://gist.github.com/983661
      color = +(`0x${color.slice(1).replace(
        color.length < 5 && /./g, '$&$&',
      )}`);

      r = color >> 16;
      g = color >> 8 & 255;
      b = color & 255;
    }

    // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
    hsp = Math.sqrt(
      0.299 * (r * r)
    + 0.587 * (g * g)
    + 0.114 * (b * b),
    );

    // Using the HSP value, determine whether the color is light or dark
    if (hsp > 153 || color === '#ffffff') {
      return '#000';
    }

    return '#fff';
  }

  getColors(className) {
    let bgcolor;
    let textcolor;

    if (bgcolor = this.classMap[className]) {
      textcolor = this.lightOrDark(bgcolor);
    } else {
      bgcolor = this.randomColor();
      textcolor = this.lightOrDark(bgcolor);

      // set the color in the classMap
      this.classMap[className] = bgcolor;
    }

    return { bgcolor, textcolor };
  }

  consoleLog(message, rest) {
    const [className, ...msg] = message.split('-').map(value => value.trim());
    const { bgcolor, textcolor } = this.getColors(className);

    if (rest.length) {
      console.info(`%c${className}`, `padding:5px;background-color:${bgcolor};color:${textcolor};font-weight:bold;`, '-', ...msg, rest); //eslint-disable-line
    } else {
      console.info(`%c${className}`, `padding:5px;background-color:${bgcolor};color:${textcolor};font-weight:bold;`, '-', ...msg); //eslint-disable-line
    }
  }

  info(message, ...rest) {
    if (this.level === 'debug' || this.level === 'info') {
      if (window.console) {
        this.consoleLog(message, rest);
      }
    }
  }

  debug(message, ...rest) {
    if (this.level === 'debug') {
      if (window.console) {
        this.consoleLog(message, rest);
      }
    }
  }

  error(message, stacktrace, ...rest) {
    if (window.console && this.level) {
      console.error(message, rest); // eslint-disable-line
      if (stacktrace !== undefined && stacktrace === true) {
        const trace = printStackTrace();
        console.error(trace.join('\n\n')); //eslint-disable-line
        console.error('-----------------------------'); //eslint-disable-line
      }
    }
  }
}

export default new Logger('debug');
