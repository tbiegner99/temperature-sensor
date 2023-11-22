import { Reading } from '../reading/Reading';

export abstract class Reporter {
  async init(): Promise<void> {}

  shouldReportReading(reading: Reading) {
    return true;
  }

  report(reading: Reading) {
    if (this.shouldReportReading(reading)) {
      this.reportReading(reading);
    }
  }

  abstract getName(): string;

  abstract reportReading(reading: Reading): Promise<any>;

  abstract reportError(error): Promise<any>;
}
