
const Reporter = require("./Reporter")
const {ReadingTypes} = require("../config/constants")
class DatabaseReporter extends Reporter{
    constructor(httpClient) {
        super();
        this.isZoneCreated=false
        this.httpClient=httpClient;
    }
    shouldReportReading() {
        if(this.isReporterActive()) {
            return reading.name===ReadingTypes.TEMPERATURE || reading.name===ReadingTypes.HUMIDITY;
        }
        return false;
    }

    isReporterActive() {
        const zoneName=process.env.ZONE_NAME;
        const reporterHost=process.env.REPORTER_HOST;
        return Boolean(zoneName) && Boolean(reporterHost)
    }

    createZone(zoneName) {
        return this.httpClient.post(`${process.env.REPORTER_HOST}/api/sensors/zones`, {
            name: zoneName,
            description: process.env.ZONE_DESCRIPTION
        })
    }

    createReading(zoneName, type,value) {
        return this.httpClient.post(`${process.env.REPORTER_HOST}/api/sensors/zones/${zoneName}/readings/${type}`, {
           [type]:value
        })
    }

    async reportReading(reading) {
        const zoneName=process.env.ZONE_NAME
        if(!this.isZoneCreated) {
            await this.createZone(zoneName)
            this.isZoneCreated=true;
        }
        let type=reading.name.toLowerCase();
        await this.createReading(zoneName,type,reading.value)
    }
}

module.exports=DatabaseReporter;