import { Reading } from '../models';

export abstract class Reporter {
  async init(): Promise<void> {}

  shouldReportReading(reading: Reading<any>): boolean {
    return true;
  }

  report(reading: Reading<any>) {
    if (this.shouldReportReading(reading)) {
      this.reportReading(reading);
    }
  }

  abstract getName(): string;

  abstract reportReading(reading: Reading<any>): Promise<any>;

  abstract reportError(error): Promise<any>;
}
