import  {Reading} from './Reading';
import { ReadingTypes }  from '../config/constants';
import  { Temperature, TemperatureUnit } from '../config/units';

export class TemperatureReading extends Reading {
  constructor(value:number, unit?:TemperatureUnit) {
    super(ReadingTypes.TEMPERATURE, value, unit || Temperature.CELCIUS);
  }
}
