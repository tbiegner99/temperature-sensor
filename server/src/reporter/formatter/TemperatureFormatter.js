const Formatter = require('./DefaultFormatter');
const { ReadingTypes } = require('../../config/constants');
const { Temperature } = require('../../config/units');
const TemperatureConverter = require('../../unitConverter/TemperatureConverter');

class TemperatureFormatter extends Formatter {
  constructor(config) {
    super();
    this.unit = config.unit ? config.unit.toUpperCase() : null;
    if (!this.unit || Object.values(Temperature).indexOf(this.unit) < 0) {
      console.info(`unknown unit: ${config.unit}. Defaulting to celcius`);
      this.unit = Temperature.CELCIUS;
    }
  }

  appliesTo(reading) {
    return reading.name === ReadingTypes.TEMPERATURE;
  }

  format(reading) {
    const converter = new TemperatureConverter(reading.value, reading.unit);
    return `Temperature: ${converter.toUnit(this.unit).toFixed(2)} ${this.unit}`;
  }
}

module.exports = TemperatureFormatter;
