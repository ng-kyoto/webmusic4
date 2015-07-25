import angular from 'angular';

const template = `
unko
`;

const modName = 'app.components.chart';

angular.module(modName, [])
.controller('ChartController', () => {
})
.config(($routeProvider) => {
  $routeProvider.when('/chart', {
    controller: 'ChartController',
    controllerAs: 'chart',
    template: template
  });
});

export default modName;
