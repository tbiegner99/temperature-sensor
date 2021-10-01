const TemperatureFormatter = require('./TemperatureFormatter');
const HumidityFormatter = require('./HumidityFormatter');

const registeredFormatters = {
  temperature: TemperatureFormatter,
  humidity: HumidityFormatter,
};

class FormatterFactory {
  constructor(config) {
    this.config = config;
  }

  constructFormatters() {
    const formatterNames = Object.keys(this.config);
    const formatters = [];
    formatterNames.forEach((formatter) => {
      let FormatterClass = registeredFormatters[formatter];
      const config = this.config[formatter];
      if (FormatterClass) {
        formatters.push(new FormatterClass(config));
      } else {
        try {
          FormatterClass = require(formatter); // eslint-disable-line global-require, import/no-dynamic-require
          formatters.push(new FormatterClass());
        } catch (err) {
          console.warn(`Unknown Formatter: ${formatter}`);
        }
      }
    });
    return formatters;
  }
}
module.exports = FormatterFactory;
