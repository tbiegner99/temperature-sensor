const Sensor = require("dhtxx")
const {GpioPins,Timing} = require("./config/constants")
const {Temperature} = require("./config/units")
const IntervalReader = require("./reader/IntervalReader");
const TemperatureHumidityReader = require("./reader/TemperatureHumidityReader")
const CurrentStatusReporter = require("./reporter/CurrentStatusReporter")
const LoggerReporter = require("./reporter/LoggerReporter")
const TemperatureFormatter=require("./reporter/formatter/TemperatureFormatter")
const HumidityFormatter=require("./reporter/formatter/HumidityFormatter");
const CurrentConditionsManager= require("./service/CurrentConditionsManager")
const routes = require("./routes")
const express = require("express")


const formatters= [
    new TemperatureFormatter(Temperature.CELCIUS),
    new HumidityFormatter()
]

const reporters = [
    new LoggerReporter(formatters),
    new CurrentStatusReporter(CurrentConditionsManager)
]

const readerInterval=process.env.INTERVAL || Timing.ONE_MIN;

const reader = new IntervalReader(reporters, readerInterval,  new TemperatureHumidityReader(GpioPins.GPIO4));

Sensor.setup();
process.on('exit', ()=> {
    reader.stop();
    Sensor.teardown();
})

reader.start();

const app = express();

app.use("/api",routes);

const port=process.env.APP_PORT || 8080

app.listen(port, ()=> {
    console.log("Application listening on port 8080")
})


