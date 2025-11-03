import { Formatter } from './DefaultFormatter';
import { ReadingTypes } from '../../constants';
import { Reading, Temperature, TemperatureUnit, Unit } from '../../models';

export interface TemperatureFormatterConfig {
  unit?: string;
}

export class TemperatureFormatter extends Formatter {
  unit?: Unit<Temperature>;
  constructor(config: TemperatureFormatterConfig) {
    super();
    this.unit = config.unit ? TemperatureUnit.fromSymbol(config.unit) : undefined;
  }

  appliesTo(reading: Reading<any>) {
    return reading.type === ReadingTypes.TEMPERATURE;
  }

  format(reading: Reading<any>) {
    const displayValue = this.unit ? reading.reading.convertTo(this.unit) : reading.reading;
    return `Temperature: ${displayValue.toDisplayString(2)}`;
  }
}
