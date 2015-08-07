import angular from 'angular';
import Firebase from 'firebase';
import toMatrix from '../utils/to-matrix';

const template = `
<div>
  <div style="position: absolute; left: 10px; top: 500px;">
    <md-button class="md-fab" ng-click="main.togglePlay()">
      <md-icon>play_arrow</md-icon>
    </md-button>
    <md-button class="md-fab" ng-click="main.clearNotes()">
      <md-icon>clear</md-icon>
    </md-button>
    <md-button class="md-fab" ng-click="main.setScale('major')">
      <md-icon>filter_1</md-icon>
    </md-button>
    <md-button class="md-fab" ng-click="main.setScale('blues')">
      <md-icon>filter_2</md-icon>
    </md-button>
  </div>

  <visualizer style="position: absolute; left: 0; top: 0; height: 500px; width: 500px;"></visualizer>
  <grid grid="main.grid" style="position: absolute; left: 500px; top: 0; right: 0; bottom: 10px;"></grid>
</div>
`;

class MainController {
  constructor($scope, $window, midi, numRow, numCol, grid, Player) {
    this.$scope = $scope;
    this.$window = $window;
    this.numRow = numRow;
    this.numCol = numCol;
    this.playing = false;
    this.grid = grid;
    this.Player = Player;

    let colOffset = 0;
    midi.addHandler(({rowIndex, velocity, channel}) => {
      grid.$add({
        channel,
        col: colOffset,
        row: rowIndex,
        velocity
      });
      colOffset = (colOffset + 1) % numCol;
    });

    grid.$watch(() => {
      $scope.$broadcast('grid-update');
    });

    let lastTick = -1;
    $scope.$on('tick', (e, tick) => {
      const colIndex = (time) => Math.floor(time / 125),
        i0 = colIndex(lastTick),
        i = colIndex(tick);
      const matrix = toMatrix(grid, numCol, numRow);
      if (i !== i0) {
        const enter = [],
          exit = [];
        if (i === 0) {
          const col = matrix[i];
          for (let j = 0; j < numRow; ++j) {
            if (!col[j].empty) {
              enter.push(j);
            }
          }
        } else if (i >= numCol) {
          const col0 = matrix[i - 1];
          for (let j = 0; j < numRow; ++j) {
            if (!col0[j].empty) {
              exit.push(j);
            }
          }
        } else {
          const col0 = matrix[i - 1],
            col = matrix[i];
          for (let j = 0; j < numRow; ++j) {
            if (!col[j].empty && col0[j].empty) {
              enter.push(j);
            }
            if (col[j].empty && !col0[j].empty) {
              exit.push(j);
            }
          }
        }

        if (enter.length > 0) {
          $scope.$broadcast('note-on', {
            colIndex: i,
            notes: enter.map((j) => {
                return {
                  rowIndex: j,
                  velocity: Math.floor(Math.random() * 128),
                  channel: matrix[i][j].channel
                };
              })
          });
        }
        if (exit.length > 0) {
          $scope.$broadcast('note-off', {
            colIndex: i,
            notes: exit.map((j) => {
                return {
                  rowIndex: j,
                  channel: matrix[i - 1][j].channel
                };
              })
          });
        }
      }
      lastTick = tick;
    });

    this.addEventListener();
  }

  addEventListener() {
    this.$scope.$on('note-on', (ev, arg) => {
      this.Player.noteon(arg.notes);
    });

    this.$scope.$on('note-off', (ev, arg) => {
      this.Player.noteoff(arg.notes);
    });
  }

  togglePlay() {
    if (this.playing) {
      this.$window.cancelAnimationFrame(this.requestId);
    }
    this.playing = true;
    this.startTime = new Date();
    const tick = () => {
      const now = new Date(),
        delta = now - this.startTime;
      if (delta < 125 * this.numCol) {
        this.requestId = this.$window.requestAnimationFrame(tick);
      } else {
        this.playing = false;
      }
      this.$scope.$broadcast('tick', delta);
    };
    tick();
  }

  clearNotes() {
    for (let i = this.grid.length; i >= 0; --i) {
      this.grid.$remove(i);
    }
  }

  setScale(scale) {
    this.Player.setScale(scale);
  }
}

const modName = 'app.components.main';

angular.module(modName, [])
.controller('MainController', MainController)
.config(($routeProvider) => {
  $routeProvider.when('/', {
    template: template,
    controller: 'MainController',
    controllerAs: 'main',
    resolve: {
      grid: ($firebaseArray) => {
        const ref = new Firebase('https://ngkyoto-wm4.firebaseio.com/unko');
        return $firebaseArray(ref).$loaded();
      }
    }
  });
});

export default modName;
