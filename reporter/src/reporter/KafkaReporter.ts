import { Kafka, Producer } from 'kafkajs';
import { ReadingTypes } from '../constants';
import { Reporter } from './Reporter';
import { ReporterConfig } from './ReporterConfig';
import { Reading, Value } from '../models';

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

  shouldReportReading(reading: Reading<any>): boolean {
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

  async createReading(zoneName: string, reading: Reading<any>) {
    const timestamp = Date.now();
    console.info(`Sending ${reading.type} reading to Kafka`);
    await this.producer.send({
      topic: this.topic,
      messages: [
        {
          value: JSON.stringify({
            timestamp: reading.timestamp,
            zoneName,
            type: reading.type,
            extraData: reading.reading.extraData,
            unit: reading.reading.unit,
            value: reading.reading.value,
          }),
        },
      ],
    });
  }

  async reportReading(reading: Reading<any>) {
    try {
      if (!this.isConnected) {
        await this.init();
      }
      const type = reading.type.toLowerCase();
      await this.createReading(this.zoneName, reading);
      this.lastReported = Date.now();
    } catch (err) {
      console.warn('Error saving reading to kafka', err);
    }
  }
}
