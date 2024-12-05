import CurrentConditionsManager from '../service/CurrentConditionsManager';
import  { Temperature } from'../config/units';

const health = (req, res) => {
  res.status(200).send({
    status: "OK",
    lastUpdate: CurrentConditionsManager.lastUpdate?.toISOString()
  });
};

export {
  health,
};
