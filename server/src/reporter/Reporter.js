class Reporter {
    shouldReportReading() {
        return true;
    }

    report(reading) {
        if(this.shouldReportReading(reading)){
            this.reportReading();
        }
    }

    reportReading(reading) {}

    reportError(error){}
}

module.exports = Reporter;