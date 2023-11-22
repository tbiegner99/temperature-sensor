import  httpClient from 'axios';
import currentStatusManager from './service/CurrentConditionsManager';
import  {ReporterFactory}  from './reporter/ReporterFactory';
import { GpioPins, Timing } from './config/constants';

export interface Config{
  contextRoot:string,
  gpioPin:number,
  interval:number,
  appPort:number
}

export class ConfigProcessor {
  config:Config;
  constructor(config:Config) {
    this.config = config;
  }

  static async createFromFile(file) :Promise<ConfigProcessor> {
    try {
      const config = await import(file); // eslint-disable-line global-require, import/no-dynamic-require
      return new ConfigProcessor(config);
    } catch (err) {
      console.error(`Error loading config file: ${file}`, err);
      throw err;
    }
  }

  static getReporters(config) {
    const env = {
      ...process.env,
      httpClient,
      currentStatusManager,
    };
    return new ReporterFactory(config.reporters, env).constructReporters();
  }

  performInitialization() {
    return {
      contextRoot: this.config.contextRoot || '/api',
      gpioPin: this.config.gpioPin || GpioPins.GPIO4,
      interval: this.config.interval || Timing.ONE_MIN,
      appPort: this.config.appPort || 8080,
      reporters: ConfigProcessor.getReporters(this.config),
    };
  }
}

