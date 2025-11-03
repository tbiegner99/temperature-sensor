import httpClient from 'axios';
import { GpioPins } from './config/constants';
import { ReporterConfig, Reporter, Timing, ReporterFactory } from '@tbiegner99/reporter';
import { CurrentConditions } from './currentConditions/CurrentConditionsManager';

export interface ConfigFile {
  contextRoot: string;
  gpioPin: number;
  interval: number;
  appPort: number;
  reporters: { [x: string]: ReporterConfig };
}

export interface Config {
  contextRoot: string;
  gpioPin: number;
  interval: number;
  appPort: number;
  reporters: Reporter[];
}

export class ConfigProcessor {
  config: Partial<ConfigFile>;
  constructor(config: Partial<ConfigFile>) {
    this.config = config;
  }

  static async createFromFile(file): Promise<ConfigProcessor> {
    try {
      const config = await import(file); // eslint-disable-line global-require, import/no-dynamic-require
      console.log('Loaded config from file', config.default);
      return new ConfigProcessor(config);
    } catch (err) {
      console.error(`Error loading config file: ${file}`, err);
      throw err;
    }
  }

  static async createFromEnvironment(): Promise<ConfigProcessor> {
    const appPort = Number.parseInt(process.env.APP_PORT, 10);
    const gpioPin = Number.parseInt(process.env.GPIO, 10);
    const interval = Number.parseInt(process.env.INTERVAL, 10);
    var config = {
      contextRoot: process.env.APP_ROOT || '/api',
      gpioPin: !Number.isNaN(gpioPin) ? gpioPin : GpioPins.GPIO2,
      appPort: !Number.isNaN(appPort) ? appPort : 8080,
      interval: !Number.isNaN(interval) ? interval : 15000,
      reporters: ReporterConfig.loadFromEnvironment(),
    };
    console.log('Loaded config from environment', config);
    return new ConfigProcessor(config);
  }

  static async getReporters(config) {
    const env = {
      ...process.env,
      httpClient,
      currentStatusManager: CurrentConditions,
    };
    return await new ReporterFactory(config.reporters, env).constructReporters();
  }

  async performInitialization(): Promise<Config> {
    return {
      contextRoot: this.config.contextRoot || '/api',
      gpioPin: this.config.gpioPin || GpioPins.GPIO4,
      interval: this.config.interval || Timing.ONE_MIN,
      appPort: this.config.appPort || 8080,
      reporters: await ConfigProcessor.getReporters(this.config),
    };
  }
}
