import { AxiosInstance } from 'axios';
import { ReadingTypes } from '../config/constants';
import { Reporter } from './Reporter';
import { ReporterConfig } from '../ConfigProcessor';

export interface DatabaseReporterConfig extends ReporterConfig {
  host: string;
  zoneName?: string;
  reportingInterval: number;
  zoneDescription: string;
}

export class DatabaseReporter extends Reporter {
  isZoneCreated: boolean;
  httpClient: AxiosInstance;
  reporterHost: string;
  zoneName: string;
  zoneDescription: string;
  lastReported: number | null;
  reportingInterval: number;
  constructor(config: DatabaseReporterConfig, env) {
    super();
    this.isZoneCreated = false;
    this.httpClient = env.httpClient;
    this.reporterHost = config.host;
    this.zoneName = config.zoneName || env.ZONE_NAME;
    this.zoneDescription = config.zoneDescription || env.ZONE_DESCRIPTION;
    this.lastReported = null;
    this.reportingInterval = config.reportingInterval;
  }

  shouldReportReading(reading) {
    if (this.isReporterActive()) {
      return reading.name === ReadingTypes.TEMPERATURE || reading.name === ReadingTypes.HUMIDITY;
    }
    return false;
  }

  isOutsideOfReportingInterval() {
    return (
      !this.lastReported ||
      !this.reportingInterval ||
      this.reportingInterval <= 0 ||
      Date.now() - this.lastReported >= this.reportingInterval
    );
  }

  isReporterActive() {
    return (
      this.isOutsideOfReportingInterval() && Boolean(this.zoneName) && Boolean(this.reporterHost)
    );
  }

  createZone(zoneName) {
    return this.httpClient.post(`${this.reporterHost}/api/sensors/zones`, {
      name: zoneName,
      description: this.zoneDescription,
    });
  }

  createReading(zoneName, type, value) {
    return this.httpClient.post(
      `${this.reporterHost}/api/sensors/zones/${zoneName}/readings/${type}`,
      {
        [type]: value,
      }
    );
  }

  async reportReading(reading) {
    if (!this.isZoneCreated) {
      await this.createZone(this.zoneName);
      this.isZoneCreated = true;
    }
    const type = reading.name.toLowerCase();
    this.lastReported = Date.now();
    await this.createReading(this.zoneName, type, reading.value);
  }
}
