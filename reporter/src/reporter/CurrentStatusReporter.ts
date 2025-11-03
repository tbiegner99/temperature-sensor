import { ReporterConfig } from './ReporterConfig';
import { ReadingTypes } from '../constants';
import { CurrentConditionsManager } from '../service/CurrentConditionsManager';
import { Reporter } from './Reporter';
import { Reading } from '../models';

export class CurrentStatusReporter extends Reporter {
  currentStatusManager: CurrentConditionsManager;
  constructor(config: ReporterConfig, env: any) {
    super();
    this.currentStatusManager = env.currentStatusManager;
  }

  shouldReportReading(reading: Reading<any>) {
    return reading.type === ReadingTypes.TEMPERATURE || reading.type === ReadingTypes.HUMIDITY;
  }

  async reportError(err: Error) {
    this.currentStatusManager.setLastError(err);
  }

  getName() {
    return 'currentStatus';
  }

  async reportReading(reading: Reading<any>) {
    this.currentStatusManager.setLastUpdate(new Date());
    this.currentStatusManager.clearErrors();
    switch (reading.type) {
      case ReadingTypes.TEMPERATURE:
        this.currentStatusManager.setCurrentTemperature(reading.reading.value);
        break;
      case ReadingTypes.HUMIDITY:
        this.currentStatusManager.setCurrentHumidity(reading.reading.value);
        break;
      default:
        break;
    }
  }
}
