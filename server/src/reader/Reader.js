
class Reader{
    constructor(reporters) {
        this.reporters = reporters;
    }
    
    async readValues() {
        const readings = await this.takeReadings();
        return this.reportReadings(readings)
    }
    
    
    async reportReadings(readings) {
        let values = readings
        if(!Array.isArray(readings)) {
            values=[readings]
        }
        const reportReadingForReporter = (reporter,reading) =>async () => {
            try {
                return await reporter.reportReading(reading)
            }catch(err) {
                console.log(`Reporter ${reporter.name} failed`,err)
            }
        }
        
        for(let reporter of this.reporters) {
            const promises = readings.map(reading=>reportReadingForReporter(reporter,reading)())
            await Promise.all(promises)
        }
       
    }
}

module.exports= Reader;