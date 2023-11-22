import { Formatter } from './DefaultFormatter';
import { ReadingTypes } from '../../config/constants';
import { Reading } from '../../reading/Reading';

export class HumidityFormatter extends Formatter {
  appliesTo(reading: Reading): boolean {
    return reading.type === ReadingTypes.HUMIDITY;
  }

  format(reading: Reading): string {
    return `Humidity: ${reading.value.toFixed(2)} %`;
  }
}
