import { Reading, Temperature, TemperatureUnit, Value,ReadingTypes } from '@tbiegner99/reporter';


export class TemperatureReading implements Reading<Temperature> {
  readonly type: string;
  readonly reading: Value<Temperature>;
  readonly timestamp: Date;
  constructor(value: number) {
    this.timestamp = new Date();
    this.type = ReadingTypes.TEMPERATURE;
    this.reading = new Value<Temperature>(value, TemperatureUnit.CELSIUS);
  }
}
