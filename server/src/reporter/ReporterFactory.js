const DatabaseReporter = require('./DatabaseReporter');
const CurrentStatusReporter = require('./CurrentStatusReporter');
const LoggerReporter = require('./LoggerReporter');

const registeredReporters = {
  database: DatabaseReporter,
  currentStatus: CurrentStatusReporter,
  logger: LoggerReporter,
};

class FormatterFactory {
  constructor(config, env) {
    this.config = config;
    this.env = env;
  }

  constructReporters() {
    const reporterNames = Object.keys(this.config || []);
    const reporters = [];
    reporterNames.forEach((reporter) => {
      let ReporterClass = registeredReporters[reporter];
      const config = this.config[reporter];
      if (ReporterClass) {
        reporters.push(new ReporterClass(config, this.env));
      } else {
        try {
          ReporterClass = require(reporter); // eslint-disable-line global-require, import/no-dynamic-require
          reporters.push(new ReporterClass(config, this.env));
        } catch (err) {
          console.warn(`Unknown Reporter: ${reporter}`);
        }
      }
    });
    return reporters;
  }
}
module.exports = FormatterFactory;
