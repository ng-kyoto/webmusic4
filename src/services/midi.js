import angular from 'angular';
import Converter from '../converter';

const modName = 'app.services.midi';

class Midi {
  constructor() {
    this.init();
    this.inputs = [];
    this.handler = null;
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
    const converter = new Converter('major');
    if (statusByte === "8") {
      // interval = e.timeStamp - this.noteOnStamp;
      // this.noteOnStamp = e.timeStamp;
    }
    if (statusByte === "9") {
      converter.setNoteNumber(e.data[1]);
      console.log(converter.toRowIndex());
    }
  }

  addHandler(callback) {
    this.handler = callback;
  }
}

angular.module(modName, [])
.factory('midi', () => {
  return new Midi();
});

export default modName;
