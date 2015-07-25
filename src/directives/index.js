import angular from 'angular';
import grid from './grid';
import visualizer from './visualizer';

const modName = 'app.directives';

angular.module(modName, [
  grid,
  visualizer
]);

export default modName;
