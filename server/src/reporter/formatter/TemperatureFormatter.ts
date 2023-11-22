import { Formatter } from './DefaultFormatter';
import { ReadingTypes } from '../../config/constants';
import { Temperature, TemperatureUnit } from '../../config/units';
import { TemperatureConverter } from '../../unitConverter/TemperatureConverter';
import { Reading } from '../../reading/Reading';

export interface TemperatureFormatterConfig {
  unit?: TemperatureUnit;
}

export class TemperatureFormatter extends Formatter {
  unit?: TemperatureUnit;
  constructor(config: TemperatureFormatterConfig) {
    super();
    this.unit = config.unit ? (config.unit.toUpperCase() as TemperatureUnit) : undefined;
    if (!this.unit || Object.values(Temperature).indexOf(this.unit) < 0) {
      console.info(`unknown unit: ${config.unit}. Defaulting to celcius`);
      this.unit = Temperature.CELCIUS;
    }
  }

  appliesTo(reading: Reading) {
    return reading.type === ReadingTypes.TEMPERATURE;
  }

  format(reading: Reading) {
    const converter = new TemperatureConverter(reading.value, reading.unit);
    return `Temperature: ${converter.toUnit(this.unit).toFixed(2)} ${this.unit}`;
  }
}
