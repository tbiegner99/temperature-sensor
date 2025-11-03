import { Formatter } from './DefaultFormatter';
import { ReadingTypes } from '../../constants';
import { Reading } from '../../models';

export class HumidityFormatter extends Formatter {
  appliesTo(reading: Reading<any>): boolean {
    return reading.type === ReadingTypes.HUMIDITY;
  }

  format(reading: Reading<any>): string {
    return `Humidity: ${reading.reading.toDisplayString(2)}`;
  }
}
