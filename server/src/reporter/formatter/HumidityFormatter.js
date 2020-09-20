const Formatter =require("./DefaultFormatter")
const {ReadingTypes} = require("../../config/constants")
class HumidityFormatter extends Formatter{
    appliesTo(reading) {
        return reading.name === ReadingTypes.HUMIDITY;
    }

    format(reading) {
        return `Humidity: ${reading.value.toFixed(2)} %`
    }
}

module.exports = HumidityFormatter