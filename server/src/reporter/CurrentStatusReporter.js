const Reporter = require('./Reporter');
const { ReadingTypes } = require('../config/constants');

class CurrentStatusReporter extends Reporter {
  constructor(config, env) {
    super();
    this.currentStatusManager = env.currentStatusManager;
  }

  shouldReportReading(reading) {
    return reading.name === ReadingTypes.TEMPERATURE || reading.name === ReadingTypes.HUMIDITY;
  }

  reportReading(reading) {
    this.currentStatusManager.setLastUpdate(new Date())
    switch (reading.name) {
      case ReadingTypes.TEMPERATURE:
        this.currentStatusManager.setCurrentTemperature(reading.value);
        break;
      case ReadingTypes.HUMIDITY:
        this.currentStatusManager.setCurrentHumidity(reading.value);
        break;
      default:
        break;
    }
  }
}

module.exports = CurrentStatusReporter;
