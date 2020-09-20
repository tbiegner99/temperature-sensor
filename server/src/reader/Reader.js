
class Reader{
    constructor(reporters) {
        this.reporters = reporters;
    }
    
    async readValues() {
        const readings = await this.takeReadings();
        this.reportReadings(readings)
    }
    
    reportReadings(readings) {
        let values = readings
        if(!Array.isArray(readings)) {
            values=[readings]
        }
        this.reporters.forEach(reporter=>{
            values.forEach(reading=>{
                reporter.reportReading(reading)
            })
        })
    }
}

module.exports= Reader;