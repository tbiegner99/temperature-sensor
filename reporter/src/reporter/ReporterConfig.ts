import { Timing } from '../constants';

export class ReporterConfig {
  static loadLoggerReporterFromEnvironment() {
    if (process.env.ENABLE_LOG_REPORTER !== 'true') {
      return {};
    }
    return {
      logger: {},
    };
  }

  static loadMqttReporterFromEnvironment() {
    if (process.env.ENABLE_MQTT_REPORTER !== 'true') {
      return {};
    }
    const topic = process.env.MQTT_TOPIC;
    const zoneName = process.env.ZONE_NAME;
    const appName = process.env.APP_NAME;
    const zoneDescription = process.env.ZONE_DESCRIPTION;
    const brokers = process.env.MQTT_BROKER;
    const reportingInterval = Number.parseInt(process.env.MQTT_REPORTING_INTERVAL, 10);
    let topics = undefined;
    Object.entries(process.env).forEach(([key, value]) => {
      var topicPrefix = 'MQTT_TOPIC_';
      if (key && key.startsWith(topicPrefix)) {
        if (!topics) {
          topics = {};
        }
        let topic = key.substring(topicPrefix.length);
        topics[topic] = value;
      }
    });

    if (!topic && !topics) {
      console.error('topic required');
      throw new Error('topic required');
    }
    if (!zoneName) {
      console.error('zone required');
      throw new Error('zoneName required');
    }
    if (!appName) {
      console.error('app required');
      throw new Error('appName required');
    }
    return {
      mqtt: {
        topic,
        topics,
        brokers,
        zoneName,
        zoneDescription,
        reportingInterval: !Number.isNaN(reportingInterval) ? reportingInterval : Timing.FIVE_MIN,
        appName,
      },
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

  static loadFromEnvironment() {
    return {
      ...ReporterConfig.loadLoggerReporterFromEnvironment(),
      ...ReporterConfig.loadKafkaReporterFromEnvironment(),
      ...ReporterConfig.loadMqttReporterFromEnvironment(),
    };
  }
}
