import { Percent, PercentUnit, Value, Reading,ReadingTypes } from '@tbiegner99/reporter';

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
