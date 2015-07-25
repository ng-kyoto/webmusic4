import angular from 'angular';
import route from 'angular-route';
import material from 'angular-material';
import firebase from 'angularfire';
import components from './components';
import directives from './directives';
import services from './services';

angular.module('app', [route, material, firebase, components, directives, services]);

angular.module('app').config(($routeProvider) => {
  $routeProvider.otherwise('/');
});
