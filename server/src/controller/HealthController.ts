import { CurrentConditions } from '../currentConditions/CurrentConditionsManager';

const health = (req, res) => {
  res.status(200).send({
    status: 'OK',
    lastUpdate: CurrentConditions.lastUpdate?.toISOString(),
  });
};

export { health };
