const DefaultFormatter = require('./formatter/DefaultFormatter');
const FormatterFactory = require('./formatter/FormatterFactory');
const Reporter = require('./Reporter');

class LoggerReporter extends Reporter {
  constructor(config, env) {
    super();
    this.formatters = config.formatters
      ? new FormatterFactory(config.formatters, env).constructFormatters()
      : [];
  }

  formatReading(reading) {
    for (let i = 0; i < this.formatters.length; i++) {
      if (this.formatters[i].appliesTo(reading)) {
        return this.formatters[i].format(reading);
      }
    }
    return new DefaultFormatter().format(reading);
  }

  reportReading(reading) {
    console.log(this.formatReading(reading));
  }
}

module.exports = LoggerReporter;
