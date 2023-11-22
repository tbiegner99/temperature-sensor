import httpClient from 'axios';
import currentStatusManager from './service/CurrentConditionsManager';
import { ReporterFactory } from './reporter/ReporterFactory';
import { GpioPins, Timing } from './config/constants';
import { Reporter } from './reporter/Reporter';

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

export interface ReporterConfig {}

export class ConfigProcessor {
  config: Partial<ConfigFile>;
  constructor(config: Partial<ConfigFile>) {
    this.config = config;
  }

  static async createFromFile(file): Promise<ConfigProcessor> {
    try {
      const config = await import(file); // eslint-disable-line global-require, import/no-dynamic-require
      return new ConfigProcessor(config);
    } catch (err) {
      console.error(`Error loading config file: ${file}`, err);
      throw err;
    }
  }

  static async getReporters(config) {
    const env = {
      ...process.env,
      httpClient,
      currentStatusManager,
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
