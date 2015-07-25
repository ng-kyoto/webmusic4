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

  onMIDISuccess(midiAccess) {
    console.log('MIDI ready!');
    this.midi = midiAccess;
  }

  onMIDIFailure(msg) {
    console.log( "Failed to get MIDI access - " + msg );
  }

  noteon(notes) {
    console.log('noteon', notes);
    notes.forEach(note => {
      const nn = new Converter('major').setRowIndex(note.rowIndex).toNoteNumber();
      const noteon = 0x90;
      const channel = noteon + note.channel;
      const noteOnMessage = [channel, nn, note.velocity];

      const output = this.midi.outputs.get(portID);
      output.send(noteOnMessage);
    });

  }

  noteoff(notes) {
    console.log('noteoff', notes);
  }
}

angular.module(modName, []).service('Player', Player);

export default modName;
