import { Reading, Reporter } from '@tbiegner99/reporter';

export class Reader<T> {
  reporters: Reporter[];
  constructor(reporters?: Reporter[]) {
    this.reporters = reporters || [];
  }

  async takeReadings(): Promise<Reading<T>[]> {
    throw new Error('Not implemented error');
  }

  async readValues() {
    try {
      const readings = await this.takeReadings();
      return this.reportReadings(readings);
    } catch (err) {
      console.error('an error occurred while taking readings', err);
      await this.reportError(err);
      return [];
    }
  }

  async reportError(error) {
    const reportErrorForReporter = (reporter, reading) => async () => {
      try {
        await reporter.reportError(reading);
      } catch (err) {
        console.log(`Error reporting for ${reporter.getName()} failed`, err);
      }
    };
    // eslint-disable-next-line no-restricted-syntax
    for (const reporter of this.reporters) {
      await reportErrorForReporter(reporter, error);
    }
  }

  async reportReadings(readings) {
    let values = readings;
    if (!Array.isArray(readings)) {
      values = [readings];
    }
    const reportReadingForReporter = (reporter: Reporter, reading: Reading<T>) => async () => {
      if (reporter.shouldReportReading(reading)) {
        try {
          await reporter.reportReading(reading);
        } catch (err) {
          console.log(`Reporter ${reporter.getName()} failed`, err);
        }
      }
    };
    // eslint-disable-next-line no-restricted-syntax
    for (const reporter of this.reporters) {
      const promises = values.map((reading) => reportReadingForReporter(reporter, reading)());
      await Promise.all(promises); // eslint-disable-line no-await-in-loop
    }
  }
}
