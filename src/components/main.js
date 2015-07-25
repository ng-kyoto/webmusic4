import angular from 'angular';
import Firebase from 'firebase';

const template = `
<div>
  <div style="position: absolute; left: 10px; bottom: 10px;">
    <md-button class="md-fab" ng-click="main.togglePlay()">
      <md-icon>play_arrow</md-icon>
    </md-button>
  </div>
  <div style="position: absolute; left: 10px; top: 500px;">
    <md-button class="md-fab" ng-click="main.noteon()">
      <md-icon>add</md-icon>
    </md-button>
    <md-button class="md-fab" ng-click="main.noteoff()">
      <md-icon>remove</md-icon>
    </md-button>
    <md-button class="md-fab" ng-click="main.setScale('major')">
      <p>1</p>
    </md-button>
    <md-button class="md-fab" ng-click="main.setScale('blues')">
      <p>2</p>
    </md-button>
  </div>

  <visualizer style="position: absolute; left: 0; top: 0; right: 0; height: 500px;"></visualizer>
  <grid grid="main.grid" style="position: absolute; left: 100px; top: 500px; right: 0; bottom: 10px;"></grid>
</div>
`;

class MainController {
  constructor($scope, $window, numRow, numCol, grid, Player) {
    this.$scope = $scope;
    this.$window = $window;
    this.numRow = numRow;
    this.numCol = numCol;
    this.playing = false;
    this.grid = grid;
    this.Player = Player;

    let lastTick = -1;
    $scope.$on('tick', (e, tick) => {
      const colIndex = (time) => Math.floor(time / 125),
        i0 = colIndex(lastTick),
        i = colIndex(tick);
      if (i !== i0) {
        const enter = [],
          exit = [];
        if (i === 0) {
          const col = grid[i];
          for (let j = 0; j < numRow; ++j) {
            if (col[j].mask) {
              enter.push(j);
            }
          }
        } else if (i >= numCol) {
          const col0 = grid[i - 1];
          for (let j = 0; j < numRow; ++j) {
            if (col0[j].mask) {
              exit.push(j);
            }
          }
        } else {
          const col0 = grid[i - 1],
            col = grid[i];
          for (let j = 0; j < numRow; ++j) {
            if (col[j].mask && !col0[j].mask) {
              enter.push(j);
            }
            if (!col[j].mask && col0[j].mask) {
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
                  channel: grid[i][j].channel
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
                  channel: grid[i - 1][j].channel
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
    })

    this.$scope.$on('note-off', (ev, arg) => {
      this.Player.noteoff(arg.notes);
    })
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

  setScale(scale) {
    this.Player.setScale(scale);
  }

  noteon() {
    const data = [];
    for (let i = 0; i < this.numRow; ++i) {
      if (Math.random() < 0.1) {
        data.push({
          rowIndex: i,
          velocity: Math.floor(Math.random() * 128),
          channel: Math.floor(Math.random() * 16)
        });
      }
    }

    console.log('noteon');
    this.Player.noteon(data);
    this.$scope.$broadcast('note-on', {
      colIndex: Math.floor(Math.random() * 64),
      notes: data
    });
  }

  noteoff() {
    const data = [];
    for (let i = 0; i < this.numRow; ++i) {
      if (Math.random() < 0.1) {
        data.push({
          rowIndex: i,
          velocity: Math.floor(Math.random() * 128),
          channel: Math.floor(Math.random() * 16)
        });
      }
    }

    this.Player.noteoff(data);
    this.$scope.$broadcast('note-off', {
      colIndex: Math.floor(Math.random() * 64),
      notes: data
    });
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
        const ref = new Firebase('https://ngkyoto-wm4.firebaseio.com/hoge');
        return $firebaseArray(ref).$loaded();
      }
    }
  });
});

export default modName;
