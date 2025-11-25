import { ReporterConfig } from './ReporterConfig';
import { Reporter } from './Reporter';
import { Formatter } from './formatter/DefaultFormatter';
import { FormatterConfig, FormatterFactory } from './formatter/FormatterFactory';
import { Reading } from '../models';

export interface LoggerReporterConfig extends ReporterConfig {
  host: string;
  zoneName?: string;
  reportingInterval: number;
  zoneDescription: string;
  formatters?: FormatterConfig[];
}

export class LoggerReporter extends Reporter {
  formatters: Formatter[];
  constructor(
    public config: LoggerReporterConfig,
    public env: any
  ) {
    super();
  }

  async reportError() {}

  getName() {
    return 'loggerReporter';
  }

  async init() {
    this.formatters = this.config.formatters
      ? await new FormatterFactory(this.config.formatters).constructFormatters()
      : [];
  }

  formatReading(reading: Reading<any>) {
    for (let i = 0; i < this.formatters.length; i++) {
      if (this.formatters[i].appliesTo(reading)) {
        return this.formatters[i].format(reading);
      }
    }
    return new Formatter().format(reading);
  }

  async reportReading(reading: Reading<any>) {
    console.log(this.formatReading(reading));
    if (reading.reading.extraData) {
      console.log('Attributes:', JSON.stringify(reading.reading.extraData));
    }
  }
}
