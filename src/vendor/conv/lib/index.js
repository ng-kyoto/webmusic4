'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Converter = (function () {
  /**
   * @param {string} scale
   */

  function Converter(scale) {
    _classCallCheck(this, Converter);

    this.scale = scale;
    this.key = 0; // C = 0, D = 2, B = 11
  }

  _createClass(Converter, [{
    key: 'setNoteNumber',
    value: function setNoteNumber(nn) {
      this.nn = nn;
      return this;
    }
  }, {
    key: 'setRowIndex',
    value: function setRowIndex(idx) {
      this.idx = idx;
      return this;
    }

    /**
     * @returns {number}
     */
  }, {
    key: 'toRowIndex',
    value: function toRowIndex() {
      if (this.nn <= 30) {
        return null;
      }

      var scaleArray = this.scaleArray();
      var pitchNumber = this.allPitch()[this.noteName()];

      var additionalIdx = scaleArray.findIndex(function (v) {
        return pitchNumber <= v;
      });

      if (5 <= pitchNumber) {
        additionalIdx -= 7;
      }

      // console.log(this.noteNameWithOctave(), pitchNumber, 'additionalIdx', additionalIdx);

      return this.octave() * 7 + additionalIdx;
    }
  }, {
    key: 'toNoteNumber',
    value: function toNoteNumber() {
      var lower = 31; // key C G0
      var octave = Math.floor(this.idx / this.scaleArray().length);
      var additionalIdx = this.idx % this.scaleArray().length;
      var additional = this.scaleArray()[additionalIdx];
      return lower + 12 * octave + additional;
    }
  }, {
    key: 'allPitch',
    value: function allPitch() {
      return {
        'G': 0,
        'G#': 1,
        'A': 2,
        'A#': 3,
        'B': 4,
        'C': 5,
        'C#': 6,
        'D': 7,
        'D#': 8,
        'E': 9,
        'F': 10,
        'F#': 11
      };
    }
  }, {
    key: 'scaleArray',
    value: function scaleArray() {
      var def = [0, 2, 4, 5, 7, 9, 11];

      if (this.scale === 'major') {
        return def;
      } else if (this.scale === 'naturalMinor') {
        return [0, 2, 3, 5, 7, 8, 10];
      } else if (this.scale === 'blues') {
        return [0, 3, 5, 6, 7, 10];
      }
      return def;
    }
  }, {
    key: 'noteNameWithOctave',
    value: function noteNameWithOctave() {
      var octave = Math.floor(this.nn / 12) - 2;
      return '' + this.noteName() + octave;
    }
  }, {
    key: 'octave',
    value: function octave() {
      return Math.floor(this.nn / 12) - 2;
    }
  }, {
    key: 'noteName',
    value: function noteName() {
      var noteName = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
      var relativePitch = this.nn % 12;
      return '' + noteName[relativePitch];
    }
  }]);

  return Converter;
})();

exports['default'] = Converter;
module.exports = exports['default'];