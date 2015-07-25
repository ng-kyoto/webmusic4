import angular from 'angular';

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
  <grid grid="main.grid" style="position: absolute; left: 100px; top: 500px; right: 0; bottom: 0;"></grid>
</div>
`;

class MainController {
  constructor($scope, $interval, numRow, numCol) {
    this.$scope = $scope;
    this.$interval = $interval;
    this.numRow = numRow;
    this.numCol = numCol;
    this.grid = new Array(numCol);

    for (let i = 0; i < numCol; ++i) {
      this.grid[i] = new Array(numRow);
      for (let j = 0; j < numRow; ++j) {
        this.grid[i][j] = {
          mask: Math.random() < 0.1 ? 1 : 0
        };
      }
    }
  }

  play() {
    const startTime = new Date();
    this.$interval(() => {
      const now = new Date();
      this.$scope.$broadcast('tick', now - startTime);
    }, 125, this.numCol, false);
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
    controllerAs: 'main'
  });
});

export default modName;
