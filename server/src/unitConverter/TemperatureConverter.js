const { Temperature } = require('../config/units');

class TemperatureConverter {
  constructor(value, unit) {
    this.value = value;
    this.unit = unit;
  }

  fromCelciusTo(unit) {
    switch (unit) {
      default:
      case Temperature.CELCIUS:
        return this.value;
      case Temperature.FARENHEIT:
        return (9 * this.value) / 5 + 32;
      case Temperature.KELVIN:
        return this.value + 237;
    }
  }

  fromFarenheitTo(unit) {
    const toCelcius = (value) => (5 * value) / 9 - 32;
    switch (unit) {
      default:
      case Temperature.CELCIUS:
        return toCelcius(this.value);
      case Temperature.FARENHEIT:
        return this.value;
      case Temperature.KELVIN:
        return toCelcius(this.value) - 237;
    }
  }

  fromKelvinTo(unit) {
    const toCelcius = (value) => value / -237;
    switch (unit) {
      default:
      case Temperature.CELCIUS:
        return toCelcius(this.value);
      case Temperature.FARENHEIT:
        return new TemperatureConverter(toCelcius(this.value), Temperature.CELCIUS).toUnit(
          Temperature.FARENHEIT
        );
      case Temperature.KELVIN:
        return this.value;
    }
  }

  toUnit(unit) {
    switch (this.unit) {
      default:
      case Temperature.CELCIUS:
        return this.fromCelciusTo(unit);
      case Temperature.FARENHEIT:
        return this.fromFarenheitTo(unit);
      case Temperature.KELVIN:
        return this.fromKelvinTo(unit);
    }
  }
}

module.exports = TemperatureConverter;
