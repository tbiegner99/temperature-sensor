import CurrentConditionsManager from '../service/CurrentConditionsManager';
import  { Temperature } from'../config/units';

const getCurrentCondition = (req, res) => {
  res.status(200).send({
    zoneName: CurrentConditionsManager.zoneName,
    zoneDescription: CurrentConditionsManager.zoneDescription,
    lastUpdated: CurrentConditionsManager.lastUpdate,
    humidity: {
      value: CurrentConditionsManager.getCurrentHumidity().humidity,
      unit: '%',
    },
    temperature: {
      value: CurrentConditionsManager.getCurrentTemperature().temperature,
      unit: Temperature.CELCIUS,
    },
  });
};

export {
  getCurrentCondition,
};
