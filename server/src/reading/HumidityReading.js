const Reading = require('./Reading');
const { ReadingTypes } = require('../config/constants');

class HumidityReading extends Reading {
  constructor(value) {
    super(ReadingTypes.HUMIDITY, value);
  }
}
module.exports = HumidityReading;
