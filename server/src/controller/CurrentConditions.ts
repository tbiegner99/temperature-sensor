import { CurrentConditions } from '../currentConditions/CurrentConditionsManager';
import { PercentUnit, TemperatureUnit } from '@tbiegner99/reporter';

const getCurrentCondition = (req, res) => {
  res.status(200).send({
    zoneName: CurrentConditions.zoneName,
    zoneDescription: CurrentConditions.zoneDescription,
    lastUpdated: CurrentConditions.lastUpdate,
    humidity: {
      value: CurrentConditions.getCurrentHumidity().humidity,
      unit: PercentUnit.PERCENT.symbol,
    },
    temperature: {
      value: CurrentConditions.getCurrentTemperature().temperature,
      unit: TemperatureUnit.CELSIUS.symbol,
    },
  });
};

export { getCurrentCondition };
