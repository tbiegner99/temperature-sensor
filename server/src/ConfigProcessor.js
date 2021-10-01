const httpClient = require('axios');
const currentStatusManager = require('./service/CurrentConditionsManager');
const ReporterFactory = require('./reporter/ReporterFactory');
const { GpioPins, Timing } = require('./config/constants');

class ConfigProcessor {
  constructor(config) {
    this.config = config;
  }

  static createFromFile(file) {
    try {
      const config = require(file); // eslint-disable-line global-require, import/no-dynamic-require
      return new ConfigProcessor(config);
    } catch (err) {
      console.error(`Error loading config file: ${file}`, err);
      throw err;
    }
  }

  static getReporters(config) {
    const env = {
      ...process.env,
      httpClient,
      currentStatusManager,
    };
    return new ReporterFactory(config.reporters, env).constructReporters();
  }

  performInitialization() {
    return {
      contextRoot: this.config.contextRoot || '/api',
      gpioPin: this.config.gpioPin || GpioPins.GPIO4,
      interval: this.config.interval || Timing.ONE_MIN,
      appPort: this.config.appPort || 8080,
      reporters: ConfigProcessor.getReporters(this.config),
    };
  }
}

module.exports = ConfigProcessor;
