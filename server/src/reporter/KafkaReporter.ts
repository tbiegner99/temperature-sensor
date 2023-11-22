import { Kafka, Producer } from 'kafkajs';
import { ReadingTypes } from '../config/constants';
import { Reporter } from './Reporter';
import { ReporterConfig } from '../ConfigProcessor';
import { Reading } from '../reading/Reading';

export interface KafkaReporterConfig extends ReporterConfig {
  zoneName?: string;
  topic: string;
  reportingInterval: number;
  zoneDescription: string;
  brokers: string[];
  logLevel?: number;
  appName: string;
}

export class KafkaReporter extends Reporter {
  topic: string;
  brokers: string[];
  zoneName: string;
  zoneDescription: string;
  lastReported: number;
  reportingInterval: number;
  client: Kafka;
  producer: Producer;
  isConnected: boolean;

  constructor(config: KafkaReporterConfig, env: any) {
    super();
    this.isConnected = false;
    this.brokers = config.brokers;
    this.topic = config.topic;
    this.zoneName = config.zoneName || env.ZONE_NAME;
    this.zoneDescription = config.zoneDescription || env.ZONE_DESCRIPTION;
    this.lastReported = 0;
    this.reportingInterval = config.reportingInterval;
    this.client = new Kafka({
      brokers: this.brokers,
      logLevel: config.logLevel,
      clientId: config.appName,
    });
    this.producer = this.client.producer();
  }

  getName() {
    return 'kafkaReporter';
  }
  async reportError() {}

  async init() {
    try {
      await this.producer.connect();
      this.isConnected = true;
      console.log('Connected to Kafka');
    } catch (err) {
      console.error('Error connecting');
      console.error(err.message);
    }
  }

  shouldReportReading(reading: Reading) {
    if (this.isReporterActive()) {
      return reading.type === ReadingTypes.TEMPERATURE || reading.type === ReadingTypes.HUMIDITY;
    }
    return false;
  }

  isOutsideOfReportingInterval() {
    return (
      !this.lastReported ||
      !this.reportingInterval ||
      this.reportingInterval <= 0 ||
      Date.now() - this.lastReported > this.reportingInterval
    );
  }

  isReporterActive() {
    return this.isOutsideOfReportingInterval() && Boolean(this.zoneName);
  }

  async createReading(zoneName: string, type: string, value: any) {
    const timestamp = Date.now();
    console.info(`Sending ${type} reading to Kafka`);
    await this.producer.send({
      topic: this.topic,
      messages: [
        {
          value: JSON.stringify({
            timestamp,
            zoneName,
            type,
            value,
          }),
        },
      ],
    });
  }

  async reportReading(reading: Reading) {
    try {
      if (!this.isConnected) {
        await this.init();
      }
      const type = reading.type.toLowerCase();
      await this.createReading(this.zoneName, type, reading.value);
      this.lastReported = Date.now();
    } catch (err) {
      console.warn('Error saving reading to kafka', err);
    }
  }
}
