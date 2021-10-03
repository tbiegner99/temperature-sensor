const Sensor = require('@tbiegner99/dhtxx');
const express = require('express');
const bodyParser = require('body-parser');
const IntervalReader = require('./reader/IntervalReader');
const TemperatureHumidityReader = require('./reader/TemperatureHumidityReader');

module.exports = class Application {
  constructor(config) {
    this.config = config;
    this.contextRoot = config.contextRoot;
    this.app = express();
    this.app.use(bodyParser.json());

    this.baseRouter = express.Router();

    this.app.use(this.contextRoot, this.baseRouter);
  }

  addContext(context, additionalRoutes) {
    this.app.use(context, additionalRoutes);
    return this;
  }

  addRoutes(router) {
    this.baseRouter.use(router);
    return this;
  }

  initializeSensors() {
    const { reporters, gpioPin, interval } = this.config;

    const reader = new IntervalReader(reporters, interval, new TemperatureHumidityReader(gpioPin));

    Sensor.setup();
    process.on('exit', () => {
      reader.stop();
      Sensor.teardown();
    });

    reader.start();
  }

  start() {
    return new Promise((resolve, reject) => {
      try {
        this.initializeSensors();
      } catch (err) {
        reject(err);
        return;
      }
      this.app.listen(this.config.appPort, (err) => {
        if (err) {
          reject(err);
          return;
        }
        console.log(`Application listening on port ${this.config.appPort}`);
        resolve();
      });
    });
  }
};
