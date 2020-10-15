/* eslint-disable no-underscore-dangle */
class CurrentConditionsService {
  setZoneInfo({ zoneName, zoneDescription }) {
    this._zoneName = zoneName;
    this._zoneDescription = zoneDescription;
  }

  setCurrentTemperature(temperature) {
    this.currentTemperature = temperature;
  }

  setCurrentHumidity(humidity) {
    this.currentHumidity = humidity;
  }

  getCurrentTemperature() {
    return { temperature: this.currentTemperature, zone: this.zone };
  }

  getCurrentHumidity() {
    return { humidity: this.currentHumidity, zone: this.zone };
  }

  get zoneName() {
    return this._zoneName || process.env.ZONE_NAME;
  }

  get zoneDescription() {
    return this._zoneDescription;
  }
}
module.exports = new CurrentConditionsService();
