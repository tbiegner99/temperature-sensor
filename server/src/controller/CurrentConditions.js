const CurrentConditionsManager = require("../service/CurrentConditionsManager")
const {Temperature} = require("../config/units")
const getCurrentCondition= (req,res,next)=> {

    res.status(200).send({
        zoneName: CurrentConditionsManager.zone,
        humidity:{
            value: CurrentConditionsManager.getCurrentHumidity().humidity,
            unit:"%"
        },
        temperature: {
            value: CurrentConditionsManager.getCurrentTemperature().temperature,
            unit: Temperature.CELCIUS
        }
    })
}

module.exports = {
    getCurrentCondition
}