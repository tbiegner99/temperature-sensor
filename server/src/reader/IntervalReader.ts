import { Reader } from './Reader';

export class IntervalReader extends Reader {
  paused: boolean;
  intervalId?: NodeJS.Timeout;
  constructor(
    reporters,
    public interval,
    public reader
  ) {
    super(reporters);
    this.paused = false;
  }

  takeReadings() {
    return this.reader.takeReadings();
  }

  readValue() {
    if (!this.paused) {
      super.readValues();
    }
  }

  pause() {
    this.paused = true;
  }

  stop() {
    this.pause();
    clearInterval(this.intervalId);
  }

  start() {
    this.paused = false;
    if (!this.intervalId) {
      this.readValue();
      this.intervalId = setInterval(this.readValue.bind(this), this.interval);
    }
  }
}
