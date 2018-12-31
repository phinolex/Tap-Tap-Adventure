import _ from 'underscore';
import log from '../lib/log';
import AStar from '../lib/astar';

export default class Pathfinder {
  constructor(width, height) {
    const self = this;

    self.width = width;
    self.height = height;

    self.grid = null;
    self.blankGrid = [];
    self.ignores = [];

    self.load();
  }

  load() {
    const self = this;

    for (let i = 0; i < self.height; i += 1) {
      self.blankGrid[i] = [];

      for (let j = 0; j < self.width; j += 1) self.blankGrid[i][j] = 0;
    }

    log.info('Sucessfully loaded the pathfinder!');
  }

  find(grid, entity, x, y, incomplete) {
    const self = this;
    const start = [entity.gridX, entity.gridY];
    const end = [x, y];
    let path;

    self.grid = grid;
    self.applyIgnore(true);

    path = AStar(self.grid, start, end);

    if (path.length === 0 && incomplete) {
      path = self.findIncomplete(start, end);
    }

    return path;
  }

  findIncomplete(start, end) {
    const self = this;
    let incomplete = [];
    let x;
    let y;

    const perfect = AStar(self.blankGrid, start, end);

    for (let i = perfect.length - 1; i > 0; i -= 1) {
      x = perfect[i][0]; // eslint-disable-line
      y = perfect[i][1]; // eslint-disable-line

      if (self.grid[y][x] === 0) {
        incomplete = AStar(self.grid, start, [x.y]);
        break;
      }
    }

    return incomplete;
  }

  applyIgnore(ignored) {
    const self = this;
    let x;
    let y;

    _.each(self.ignores, (entity) => {
      x = entity.hasPath() ? entity.nextGridX : entity.gridX;
      y = entity.hasPath() ? entity.nextGridY : entity.gridY;

      if (x >= 0 && y >= 0) {
        self.grid[y][x] = ignored ? 0 : 1;
      }
    });
  }

  ignoreEntity(entity) {
    const self = this;

    if (!entity) {
      return;
    }

    self.ignores.push(entity);
  }

  clearIgnores() {
    const self = this;

    self.applyIgnore(false);
    self.ignores = [];
  }
}
