import angular from 'angular';
import Firebase from 'firebase';

const template = `
<div>
  <div style="position: absolute; left: 10px; bottom: 10px;">
    <md-button class="md-fab" ng-click="main.play()">
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
  </div>

  <visualizer style="position: absolute; left: 0; top: 0; right: 0; height: 500px;"></visualizer>
  <grid grid="main.grid" style="position: absolute; left: 100px; top: 500px; right: 0; bottom: 10px;"></grid>
</div>
`;

class MainController {
  constructor($scope, $window, numRow, numCol, grid) {
    this.$scope = $scope;
    this.$window = $window;
    this.numRow = numRow;
    this.numCol = numCol;
    this.playing = false;
    this.grid = grid;
  }

  play() {
    if (!this.playing) {
      this.playing = true;
      this.startTime = new Date();
      const tick = () => {
        const now = new Date(),
          delta = now - this.startTime;
        if (delta < 125 * this.numCol) {
          this.$window.requestAnimationFrame(tick);
        } else {
          this.playing = false;
        }
        this.$scope.$broadcast('tick', delta);
      };
      tick();
    }
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
