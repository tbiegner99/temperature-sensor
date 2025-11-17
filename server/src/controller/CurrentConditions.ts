
import {  CurrentConditionsManager, PercentUnit, TemperatureUnit } from '@tbiegner99/reporter';

export const getCurrentConditionRoute = ({conditionsManager}: {conditionsManager: CurrentConditionsManager}) => (req, res) => {
  
  res.status(200).send({
    zoneName: conditionsManager.zoneName,
    zoneDescription: conditionsManager.zoneDescription,
    lastUpdated: conditionsManager.lastUpdate,
    humidity: {
      value: conditionsManager.getCurrentHumidity().humidity,
      unit: PercentUnit.PERCENT.symbol,
    },
    temperature: {
      value: conditionsManager.getCurrentTemperature().temperature,
      unit: TemperatureUnit.CELSIUS.symbol,
    },
  });
};


