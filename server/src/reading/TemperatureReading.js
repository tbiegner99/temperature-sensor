const Reading = require("./Reading")
const {ReadingTypes} = require("../config/constants")
const {Temperature} = require("../config/units")
class TemperatureReading extends Reading {
    constructor(value, unit) {
        super(ReadingTypes.TEMPERATURE,value,unit || Temperature.CELCIUS)
    }
    
}
module.exports=TemperatureReading;