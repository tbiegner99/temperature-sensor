class Reader {
  constructor(reporters) {
    this.reporters = reporters || [];
  }

  async readValues() {
    try {
      const readings = await this.takeReadings();
      return this.reportReadings(readings);
    } catch (err) {
      console.error('an error occurred while taking readings', err);
      return [];
    }
  }

  async reportReadings(readings) {
    let values = readings;
    if (!Array.isArray(readings)) {
      values = [readings];
    }
    const reportReadingForReporter = (reporter, reading) => async () => {
      try {
        await reporter.reportReading(reading);
      } catch (err) {
        console.log(`Reporter ${reporter.name} failed`, err);
      }
    };
    // eslint-disable-next-line no-restricted-syntax
    for (const reporter of this.reporters) {
      const promises = values.map((reading) => reportReadingForReporter(reporter, reading)());
      await Promise.all(promises); // eslint-disable-line no-await-in-loop
    }
  }
}

module.exports = Reader;
