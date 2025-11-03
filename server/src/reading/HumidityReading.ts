import { Percent, PercentUnit, Value, Reading } from '@tbiegner99/reporter';
import { ReadingTypes } from '../config/constants';

export class HumidityReading implements Reading<Percent> {
  readonly type: string;
  readonly reading: Value<Percent>;
  readonly timestamp: Date;
  constructor(value: number) {
    this.timestamp = new Date();
    this.type = ReadingTypes.HUMIDITY;
    this.reading = new Value<Percent>(value, PercentUnit.PERCENT);
  }
}
