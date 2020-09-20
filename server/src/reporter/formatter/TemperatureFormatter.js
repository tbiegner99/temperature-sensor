const Formatter =require("./DefaultFormatter")
const {ReadingTypes} = require("../../config/constants")
const TemperatureConverter = require("../../unitConverter/TemperatureConverter")
class TemperatureFormatter extends Formatter{
    constructor(unit) {
        super();
        this.unit=unit || TemperatureFormatter.CELCIUS;
    }
    appliesTo(reading) {
        return reading.name === ReadingTypes.TEMPERATURE;
    }

    format(reading) {
        const converter = new TemperatureConverter(reading.value,reading.unit);
        return `Temperature: ${converter.toUnit(this.unit).toFixed(2)} ${this.unit}`
    }
}

module.exports = TemperatureFormatter