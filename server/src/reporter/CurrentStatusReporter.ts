import { ReporterConfig } from '../ConfigProcessor';
import { ReadingTypes } from '../config/constants';
import { CurrentConditionsService } from '../service/CurrentConditionsManager';
import { Reporter } from './Reporter';
import { Reading } from '../reading/Reading';

export class CurrentStatusReporter extends Reporter {
  currentStatusManager: CurrentConditionsService;
  constructor(config: ReporterConfig, env) {
    super();
    this.currentStatusManager = env.currentStatusManager;
  }

  shouldReportReading(reading) {
    return reading.name === ReadingTypes.TEMPERATURE || reading.name === ReadingTypes.HUMIDITY;
  }

  async reportError(err) {
    this.currentStatusManager.setLastError(err);
  }

  getName() {
    return 'currentStatus';
  }

  async reportReading(reading: Reading) {
    this.currentStatusManager.setLastUpdate(new Date());
    this.currentStatusManager.clearErrors();
    switch (reading.type) {
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
