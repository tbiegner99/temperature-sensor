import { Reporter } from './Reporter';
import { DatabaseReporter } from './DatabaseReporter';
import { CurrentStatusReporter } from './CurrentStatusReporter';
import { LoggerReporter } from './LoggerReporter';
import { FormatterFactory } from './formatter/FormatterFactory';
import { Formatter } from './formatter/DefaultFormatter';
import { ReporterConfig } from '../ConfigProcessor';

export type ReporterType = { new (config: any, env: any): Reporter };
const registeredReporters: { [x: string]: ReporterType } = {
  database: DatabaseReporter,
  currentStatus: CurrentStatusReporter,
  logger: LoggerReporter,
};

export class ReporterFactory {
  config: any;
  env: { [x: string]: string };
  constructor(config, env) {
    this.config = config;
    this.env = env;
  }

  async constructReporters(): Promise<Reporter[]> {
    const reporterNames = Object.keys(this.config || []);
    const reporters: Reporter[] = [];
    for (var reporter of reporterNames) {
      let ReporterClass = registeredReporters[reporter];
      const config = this.config[reporter];
      if (ReporterClass) {
        var reporterObj = new ReporterClass(config, this.env);
        await reporterObj.init();
        reporters.push(reporterObj);
      } else {
        try {
          ReporterClass = await import(reporter); // eslint-disable-line global-require, import/no-dynamic-require
          var reporterObj = new ReporterClass(config, this.env);
          await reporterObj.init();
          reporters.push(reporterObj);
        } catch (err) {
          console.warn(`Unknown Reporter: ${reporter}`);
        }
      }
    }
    return reporters;
  }
}
