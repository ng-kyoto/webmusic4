import angular from 'angular';

const modName = 'app.services.midi';

class Midi {
  constructor() {
    this.init();
  }

  init() {
    navigator.requestMIDIAccess()
      .then(this.onMIDISuccess, this.onMIDIFailure);
    this.inputs = null;
  }

  onMIDISuccess(access) {
    var midi = access;

    console.log(midi);
    this.inputs = midi.inputs();
  }

  onMIDIFailure(msg) {
    console.log("oh... midi failed");
    console.log(msg);
  }

  onMIDIEvent(e) {
    console.log("catch midi event");
    console.log(e);
  }
}

angular.module(modName, [])
.factory('midi', () => {
  return new Midi();
});

export default modName;
