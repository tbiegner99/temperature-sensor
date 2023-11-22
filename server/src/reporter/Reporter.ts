import { Reading } from "../reading/Reading";

export class Reporter {
  async init() : Promise<void>{}
  
  shouldReportReading(reading:Reading) {
    return true;
  }

  report(reading:Reading) {
    if (this.shouldReportReading(reading)) {
      this.reportReading(reading);
    }
  }

  reportReading(reading:Reading) {}

  reportError(error) {}
}

