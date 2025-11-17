import * as express from 'express';
import * as CurrentConditionsController from './controller/CurrentConditions';
import * as HealthController from "./controller/HealthController"
import { CurrentConditions as defaultManager } from './currentConditions/CurrentConditionsManager';
import { CurrentConditionsManager } from '@tbiegner99/reporter';

export const getSensorRoutes = ({
    conditionsManager
}: {conditionsManager?: CurrentConditionsManager} ={}) => {
    const router = express.Router();

    router.get('/currentConditions', CurrentConditionsController.getCurrentConditionRoute({
        conditionsManager:conditionsManager || defaultManager
    }));

    router.get("/health", HealthController.health)
    return router;
}

