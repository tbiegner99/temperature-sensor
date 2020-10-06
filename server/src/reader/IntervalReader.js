const Reader = require('./Reader');

class IntervalReader extends Reader {
  constructor(reporters, interval, reader) {
    super(reporters);
    this.reader = reader;
    this.interval = interval;
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
module.exports = IntervalReader;
