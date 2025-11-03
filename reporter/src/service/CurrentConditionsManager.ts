/* eslint-disable no-underscore-dangle */

export interface ZoneInfo {
  zoneName: string;
  zoneDescription: string;
}

export class CurrentConditionsManager {
  _zoneName: string;
  _zoneDescription: string;
  _errors: number;
  currentTemperature: number;
  currentHumidity: number;
  _lastUpdate: Date | null;
  _lastError: Error | null;

  setZoneInfo({ zoneName, zoneDescription }: ZoneInfo) {
    this._zoneName = zoneName;
    this._zoneDescription = zoneDescription;
    this._lastUpdate = null;
    this._lastError = null;
    this._errors = 0;
  }

  setCurrentTemperature(temperature) {
    this.currentTemperature = temperature;
  }

  setCurrentHumidity(humidity) {
    this.currentHumidity = humidity;
  }

  setLastUpdate(date) {
    this._lastUpdate = date;
  }

  clearErrors() {
    this._errors = 0;
    this._lastError = null;
  }

  setLastError(error) {
    this._lastError = error;
    this._errors++;
  }

  getCurrentTemperature() {
    return { temperature: this.currentTemperature, zone: this.zone };
  }

  getCurrentHumidity() {
    return { humidity: this.currentHumidity, zone: this.zone };
  }
  get zone(): ZoneInfo {
    return {
      zoneName: this.zoneName,
      zoneDescription: this._zoneDescription,
    };
  }

  get errorCount() {
    return this._errors;
  }

  get lastError() {
    return this._lastError;
  }

  get lastUpdate() {
    return this._lastUpdate;
  }

  get zoneName() {
    return this._zoneName || process.env.ZONE_NAME;
  }

  get zoneDescription() {
    return this._zoneDescription;
  }
}
