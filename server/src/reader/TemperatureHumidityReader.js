const Sensor = require('@tjb/dhtxx');
const Reader = require('./Reader');
const HumidityReading = require('../reading/HumidityReading');
const TemperatureReading = require('../reading/TemperatureReading');

class TemperatureHumidityReader extends Reader {
  constructor(pinNumber, reporters) {
    super(reporters);
    this.pinNumber = pinNumber;
    this.paused = false;
  }

  async takeReadings() {
    try {
      const { temperature, humidity } = await Sensor.readValue(this.pinNumber);
      return [new HumidityReading(humidity), new TemperatureReading(temperature)];
    } catch (err) {
      throw new Error(
        `An error occurred while reading temperature on pin ${this.pinNumber}: \n${err.message}`
      );
    }
  }
}
module.exports = TemperatureHumidityReader;
