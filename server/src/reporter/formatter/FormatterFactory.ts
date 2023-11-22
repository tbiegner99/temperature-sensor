import { TemperatureFormatter } from './TemperatureFormatter';
import { HumidityFormatter } from './HumidityFormatter';
import { Formatter } from './DefaultFormatter';

type FormatterType = { new (config?: any): Formatter };
const registeredFormatters: { [x: string]: FormatterType } = {
  temperature: TemperatureFormatter,
  humidity: HumidityFormatter,
};

export interface FormatterConfig {}

export class FormatterFactory {
  config: FormatterConfig;
  constructor(config: FormatterConfig) {
    this.config = config;
  }

  async constructFormatters(): Promise<Formatter[]> {
    const formatterNames = Object.keys(this.config);
    const formatters: Formatter[] = [];
    for (var formatter of formatterNames) {
      let FormatterClass: FormatterType = registeredFormatters[formatter];
      const config = this.config[formatter];
      if (FormatterClass) {
        formatters.push(new FormatterClass(config));
      } else {
        try {
          FormatterClass = await import(formatter); // eslint-disable-line global-require, import/no-dynamic-require
          formatters.push(new FormatterClass());
        } catch (err) {
          console.warn(`Unknown Formatter: ${formatter}`);
        }
      }
    }
    return formatters;
  }
}
