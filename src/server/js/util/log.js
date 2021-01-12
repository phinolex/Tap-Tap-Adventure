import Log from 'log';
import fs from 'fs';
import config from '../../config.json';

export default new Log(
  config.worlds > 1 ? 'notice' : config.debugLevel,
  config.localDebug ? fs.createWriteStream('runtime.log') : null,
);
