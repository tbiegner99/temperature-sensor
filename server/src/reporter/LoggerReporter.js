const DefaultFormatter = require("./formatter/DefaultFormatter")
const Reporter = require("./Reporter")

class LoggerReporter extends Reporter{
    constructor(formatters) {
        super();
        this.formatters=formatters ||[];
    }
    formatReading(reading) {
        for(let i=0;i<this.formatters.length;i++) {
            if(this.formatters[i].appliesTo(reading)) {
                return this.formatters[i].format(reading)
            }
        }
        return new DefaultFormatter().format(reading);
    }

    reportReading(reading) {
        console.log(this.formatReading(reading))
        
    }
}

module.exports=LoggerReporter;