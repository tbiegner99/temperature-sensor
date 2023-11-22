import  {Reading} from './Reading';
import  { ReadingTypes }  from '../config/constants';

export class HumidityReading extends Reading {
  constructor(value) {
    super(ReadingTypes.HUMIDITY, value,"%");
  }
}
