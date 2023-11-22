import  {Formatter} from './DefaultFormatter';
import  { ReadingTypes } from '../../config/constants';

export class HumidityFormatter extends Formatter {
  appliesTo(reading) : boolean {
    return reading.name === ReadingTypes.HUMIDITY;
  }

  format(reading) : string {
    return `Humidity: ${reading.value.toFixed(2)} %`;
  }
}

