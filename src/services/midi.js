import angular from 'angular';
import Converter from '../vendor/conv';

const modName = 'app.services.midi';

class Midi {
  constructor() {
    this.init();
    this.inputs = [];
    this.handler = null;
    this.status = {};
  }

  init() {
    navigator.requestMIDIAccess()
      .then(this.onMIDISuccess.bind(this), this.onMIDIFailure.bind(this));
    this.addHandler.bind(this);
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
    const converter = new Converter('major');
    const statusByte = e.data[0].toString(16).substring(0, 1);
    let interval = 0;

    if (statusByte === "8") {
      interval = e.timeStamp - this.noteOnStamp;
      this.noteOnStamp = null;
      if (interval < 1000) {
        converter.setNoteNumber(e.data[1]);
        this.status = {
          channel: Number(e.data[0].toString(16).substring(1)),
          velocity: e.data[2],
          rowIndex: converter.toRowIndex()
        };
      }
    }
    if (statusByte === "9") {
      this.noteOnStamp = e.timeStamp;
    }
  }

  addHandler(callback) {
    this.handler = callback(this.status);
  }
}

angular.module(modName, [])
.factory('midi', () => {
  return new Midi();
});

export default modName;
