class CurrentConditionsService {
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

  get zone() {
    return process.env.ZONE_NAME;
  }
}
module.exports = new CurrentConditionsService();
