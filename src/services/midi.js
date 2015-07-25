import angular from 'angular';

const modName = 'app.services.midi';

class Midi {
  constructor() {
    this.init();
    this.inputs = [];
  }

  init() {
    navigator.requestMIDIAccess()
      .then(this.onMIDISuccess.bind(this), this.onMIDIFailure.bind(this));
  }

  onMIDISuccess(access) {
    const input = access.inputs.values();

    for (var o = input.next(); !o.done; o = input.next()) {
      this.inputs.push(o.value);
    }
    for (var cnt = 0; cnt < this.inputs.length; cnt++) {
      this.inputs[cnt].onmidimessage = this.onMIDIEvent;
    }
  }

  onMIDIFailure(msg) {
    console.log("oh... midi failed");
    console.log(msg);
  }

  onMIDIEvent(e) {
    const statusByte = e.data[0].toString(16).substring(0, 1);
    if (statusByte === "8") {
      console.log("note off");
    }
    if (statusByte === "9") {
      console.log("note on");
    }
  }
}

angular.module(modName, [])
.factory('midi', () => {
  return new Midi();
});

export default modName;
