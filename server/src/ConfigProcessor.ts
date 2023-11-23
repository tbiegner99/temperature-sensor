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

  static loadLoggerReporterFromEnvironment() {
    if (process.env.ENABLE_LOG_REPORTER !== 'true') {
      return {};
    }
    return {
      logger: {},
    };
  }

  static loadKafkaReporterFromEnvironment() {
    if (process.env.ENABLE_KAFKA_REPORTER !== 'true') {
      return {};
    }
    const topic = process.env.KAFKA_TOPIC;
    const zoneName = process.env.ZONE_NAME;
    const appName = process.env.APP_NAME;
    const zoneDescription = process.env.ZONE_DESCRIPTION;
    const brokers = process.env.KAFKA_BROKERS.split(',');
    const reportingInterval = Number.parseInt(process.env.KAFKA_REPORTING_INTERVAL, 10);
    if (!topic) {
      throw new Error('topic required');
    }
    if (!zoneName) {
      throw new Error('zoneName required');
    }
    if (!appName) {
      throw new Error('appName required');
    }
    return {
      kafka: {
        topic,
        brokers,
        zoneName,
        zoneDescription,
        reportingInterval: !Number.isNaN(reportingInterval) ? reportingInterval : Timing.FIVE_MIN,
        appName,
      },
    };
  }

  static async createFromEnvironment(): Promise<ConfigProcessor> {
    const appPort = Number.parseInt(process.env.APP_PORT, 10);
    const gpioPin = Number.parseInt(process.env.GPIO, 10);
    const interval = Number.parseInt(process.env.INTERVAL, 10);
    return new ConfigProcessor({
      contextRoot: process.env.APP_ROOT || '/api',
      gpioPin: !Number.isNaN(gpioPin) ? gpioPin : GpioPins.GPIO4,
      appPort: !Number.isNaN(appPort) ? appPort : 8080,
      interval: !Number.isNaN(interval) ? interval : Timing.FIVE_MIN,
      reporters: {
        ...ConfigProcessor.loadLoggerReporterFromEnvironment(),
        ...ConfigProcessor.loadKafkaReporterFromEnvironment(),
      },
    });
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
