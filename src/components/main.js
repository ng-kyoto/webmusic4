import angular from 'angular';

const template = `
<div style="position: absolute; left: 10px; bottom: 10px;">
  <md-button class="md-fab">
    <md-icon>play_arrow</md-icon>
  </md-button>
</div>

<visualizer style="position: absolute; left: 0; top: 0; right: 0; height: 500px;"/>
`;

class MainController {
  constructor() {
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
