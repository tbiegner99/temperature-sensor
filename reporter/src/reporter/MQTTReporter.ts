import { Reporter } from './Reporter';
import { ReporterConfig } from './ReporterConfig';
import { Reading, Value } from '../models';
import MQTT from 'async-mqtt';
import { read } from 'fs';

export interface MqttReporterConfig extends ReporterConfig {
  zoneName?: string;
  topic?: string;
  reportingInterval: number;
  zoneDescription: string;
  user: string;
  password: string;
  broker: string;
  logLevel?: number;
  topics: { [x: string]: string } | undefined;
  appName: string;
}

export class MqttReporter extends Reporter {
  topic: string;
  broker: string;
  user: string;
  password: string;
  zoneName: string;
  zoneDescription: string;
  lastReported: number;
  reportingInterval: number;
  isConnected: boolean;
  topics: { [x: string]: string } | undefined;
  client: MQTT.AsyncClient;

  constructor(config: MqttReporterConfig, env: any) {
    super();
    this.isConnected = false;
    this.broker = config.broker || env.MQTT_BROKER;
    this.topic = config.topic || env.MQTT_TOPIC;
    this.topics = config.topics || {};
    if (!config.topics) {
      Object.entries(process.env).forEach(([key, value]) => {
        var topicPrefix = 'MQTT_TOPIC_';
        if (key && key.startsWith(topicPrefix)) {
          let topic = key.substring(topicPrefix.length);
          this.topics[topic] = value;
        }
      });
    }
    this.zoneName = config.zoneName || env.ZONE_NAME;
    this.zoneDescription = config.zoneDescription || env.ZONE_DESCRIPTION;
    this.lastReported = 0;
    this.reportingInterval = config.reportingInterval;
    this.user = config.user || env.MQTT_USER;
    this.password = config.password || env.MQTT_PASSWORD;
  }

  getName() {
    return 'mqttReporter';
  }
  async reportError() {}

  async init() {
    try {
      this.client = await MQTT.connectAsync(this.broker, {
        username: this.user,
        password: this.password,
      });
      this.isConnected = true;
      console.log('Connected to MQTT broker');
    } catch (err) {
      console.error('Error connecting to MQTT broker');
      console.error(err.message);
    }
  }

  shouldReportReading(reading: Reading<any>): boolean {
    if (this.isReporterActive()) {
      return Boolean(this.topic) || this.topics?.[reading.type] !== undefined;
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

  getTopicForType(type: string): string | undefined {
    if (!this.topics || !this.topics[type]) {
      return this.topic || undefined;
    }
    return this.topics[type];
  }

  async createReading(zoneName: string, reading: Reading<any>) {
    if (!this.isConnected) {
      await this.init();
    }
    const timestamp = Date.now();
    const topic = this.getTopicForType(reading.type);
    if (!topic) {
      console.debug(`No topic configured so not send reading of type ${reading.type} to MQTT`);
      return;
    }
    console.info(`Sending ${reading.type} reading to MQTT topic ${topic}`);

    await this.client.publish(
      topic,
      JSON.stringify({
        timestamp,
        zoneName,
        type: reading.type,
        value: reading.reading.value,
        unit: reading.reading.unit,
      })
    );
  }

  async reportReading(reading: Reading<any>) {
    try {
      await this.createReading(this.zoneName, reading);
      this.lastReported = Date.now();
    } catch (err) {
      console.warn('Error saving reading to mqtt', err);
    }
  }
}
