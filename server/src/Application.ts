import { Config } from './ConfigProcessor';
import { DHTModule } from '@tbiegner99/dhtxx';
import express from 'express';
import bodyParser from 'body-parser';
import { IntervalReader } from './reader/IntervalReader';
import { TemperatureHumidityReader } from './reader/TemperatureHumidityReader';

export class Application {
  app: any;
  contextRoot: string | undefined;
  baseRouter: any;
  constructor(private config: Config) {
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

    const reader = new IntervalReader(reporters, interval, new TemperatureHumidityReader(gpioPin!));

    DHTModule.setup();
    process.on('exit', () => {
      reader.stop();
      DHTModule.teardown();
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
        resolve(undefined);
      });
    });
  }
}
