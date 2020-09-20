const Reader = require("./Reader")
const HumidityReading = require("../reading/HumidityReading")
const TemperatureReading = require("../reading/TemperatureReading")
const Sensor = require("dhtxx")
class TemperatureHumidityReader extends Reader {
    constructor(pinNumber,reporters) {
        super(reporters);
        this.pinNumber=pinNumber;
        this.paused=false
    }

    async takeReadings() {
        const {temperature,humidity} = await Sensor.readValue(this.pinNumber);
        return [
            new HumidityReading(humidity),
            new TemperatureReading(temperature)
        ]
    }


}
module.exports = TemperatureHumidityReader