const Sensor = require('dhtxx');
const express = require('express');

const Getopt = require('node-getopt');
const IntervalReader = require('./reader/IntervalReader');
const TemperatureHumidityReader = require('./reader/TemperatureHumidityReader');
const routes = require('./routes');
const ConfigProcessor = require('./ConfigProcessor');

// Getopt arguments options
//   '=':   has argument
//   '[=]': has argument but optional
//   '+':   multiple option supported
const getopt = new Getopt([
  ['c', 'config=', 'location of the configuration file'],
  ['h', 'help'],
]).bindHelp();

const { options } = getopt.parse(process.argv.slice(2));

if (!options.config) {
  console.error('Config file is required. Pass --config');
  process.exit(1);
}
const configProcessor = new ConfigProcessor(options.config);

const {
  reporters,
  contextRoot,
  gpioPin,
  interval,
  appPort,
} = configProcessor.performInitialization();

const reader = new IntervalReader(reporters, interval, new TemperatureHumidityReader(gpioPin));

Sensor.setup();
process.on('exit', () => {
  reader.stop();
  Sensor.teardown();
});

reader.start();

const app = express();

app.use(contextRoot, routes);

app.listen(appPort, () => {
  console.log(`Application listening on port ${appPort}`);
});
