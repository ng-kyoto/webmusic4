import midi from './midi';
import player from './player';

const modName = 'app.services';

angular.module(modName, [
  midi,
  player
]);

export default modName;
