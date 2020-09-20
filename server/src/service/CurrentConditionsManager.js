class CurrentConditionsService{

    setCurrentTemperature(temperature) {
                this._currentTemperature=temperature;
    }

    setCurrentHumidity(humidity) {
                this._currentHumidity=humidity;
    }

    getCurrentTemperature() {
        return {temperature: this._currentTemperature, zone:this.zone};
    }

    getCurrentHumidity() {
        return {humidity: this._currentHumidity, zone:this.zone};
    }

    get zone() {
        return process.env.ZONE_NAME
    }
}
module.exports=new CurrentConditionsService()