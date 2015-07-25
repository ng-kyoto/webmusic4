import angular from 'angular';
import Converter from '../vendor/conv/index';

const modName = 'app.services.player';

class Player {
  constructor() {
    navigator.requestMIDIAccess().then(
      this.onMIDISuccess.bind(this),
      this.onMIDIFailure.bind(this)
    );
  }

  setScale(scale) {
    this.scale = scale;
  }

  onMIDISuccess(midiAccess) {
    console.log('MIDI ready!');
    this.midi = midiAccess;

    const outputIterator = this.midi.outputs.values();
    const outputs = [];
    for (var o = outputIterator.next(); !o.done; o = outputIterator.next()) {
      outputs.push(o.value)
    }

    const output = outputs[0];
    this.output = output;
  }

  onMIDIFailure(msg) {
    console.log( "Failed to get MIDI access - " + msg );
  }

  noteon(notes) {
    notes.forEach(note => {
      const nn = new Converter(this.scale).setRowIndex(note.rowIndex).toNoteNumber();
      const noteon = 0x90;
      const channel = noteon + note.channel;
      const noteOnMessage = [channel, nn, note.velocity];

      this.output.send(noteOnMessage);
    });
  }

  noteoff(notes) {
    notes.forEach(note => {
      const nn = new Converter(this.scale).setRowIndex(note.rowIndex).toNoteNumber();
      const noteoff = 0x80;
      const channel = noteoff + note.channel;
      const noteOffMessage = [channel, nn, note.velocity];

      this.output.send(noteOffMessage);
    });
  }
}

angular.module(modName, []).service('Player', Player);

export default modName;
