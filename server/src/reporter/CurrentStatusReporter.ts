
import { ReadingTypes } from '../config/constants';
import {CurrentConditionsService} from '../service/CurrentConditionsManager';
import { Reporter } from './Reporter';

export class CurrentStatusReporter extends Reporter {
  currentStatusManager:CurrentConditionsService;
  constructor(config, env) {
    super();
    this.currentStatusManager = env.currentStatusManager;
  }

  shouldReportReading(reading) {
    return reading.name === ReadingTypes.TEMPERATURE || reading.name === ReadingTypes.HUMIDITY;
  }

  reportError(err) {
    this.currentStatusManager.setLastError(err);
  }

  reportReading(reading) {
    this.currentStatusManager.setLastUpdate(new Date());
    this.currentStatusManager.clearErrors();
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

