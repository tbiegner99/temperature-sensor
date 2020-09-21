const Sensor = require("dhtxx")
const {GpioPins,Timing} = require("./config/constants")
const {Temperature} = require("./config/units")
const IntervalReader = require("./reader/IntervalReader");
const TemperatureHumidityReader = require("./reader/TemperatureHumidityReader")
const CurrentStatusReporter = require("./reporter/CurrentStatusReporter")
const LoggerReporter = require("./reporter/LoggerReporter")
const DatabaseReporter = require("./reporter/DatabaseReporter")
const TemperatureFormatter=require("./reporter/formatter/TemperatureFormatter")
const HumidityFormatter=require("./reporter/formatter/HumidityFormatter");
const CurrentConditionsManager= require("./service/CurrentConditionsManager")
const routes = require("./routes")
const express = require("express");
const httpClient = require("axios")


const formatters= [
    new TemperatureFormatter(Temperature.CELCIUS),
    new HumidityFormatter()
]

const reporters = [
    new LoggerReporter(formatters),
    new CurrentStatusReporter(CurrentConditionsManager),
    new DatabaseReporter(httpClient)
]

const readerInterval=process.env.INTERVAL || Timing.ONE_MIN;
const gpio = process.env.GPIO_PIN || GpioPins.GPIO4;

const reader = new IntervalReader(reporters, readerInterval,  new TemperatureHumidityReader(gpio));

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
    console.log(`Application listening on port ${port}`)
})


