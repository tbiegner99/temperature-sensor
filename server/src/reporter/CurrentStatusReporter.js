
const Reporter = require("./Reporter")
const {ReadingTypes} = require("../config/constants")
class CurrentStatusReporter extends Reporter{
    constructor(currentStatusManager) {
        super();
        this.currentStatusManager=currentStatusManager
    }
    shouldReportReading() {
        return reading.name===ReadingTypes.TEMPERATURE || reading.name===ReadingTypes.HUMIDITY;
    }

    reportReading(reading) {
        switch(reading.name) {
            case ReadingTypes.TEMPERATURE:
                this.currentStatusManager.setCurrentTemperature(reading.value);
                break;
            case ReadingTypes.HUMIDITY:
                this.currentStatusManager.setCurrentHumidity(reading.value);
                break;
        }
    }
}

module.exports=CurrentStatusReporter;