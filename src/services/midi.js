/* global navigator */
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
    this.inputs = [];
    for (const device of access.inputs.values()) {
      device.onmidimessage = this.onMIDIEvent.bind(this);
      this.inputs.push(device);
    }
  }

  onMIDIFailure(msg) {
    console.log('oh... midi failed');
    console.log(msg);
  }

  onMIDIEvent(e) {
    const converter = new Converter('major');
    const statusByte = +e.data[0].toString(16).substring(0, 1);
    let interval = 0;

    console.log(statusByte, interval);
    if (statusByte === 8) {
      interval = e.timeStamp - this.noteOnStamp;
      this.noteOnStamp = null;
      if (interval < 1000) {
        converter.setNoteNumber(e.data[1]);
        this.handler({
          channel: Number(e.data[0].toString(16).substring(1)),
          velocity: e.data[2],
          rowIndex: converter.toRowIndex()
        });
      }
    }
    if (statusByte === 9) {
      this.noteOnStamp = e.timeStamp;
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
