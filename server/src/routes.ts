import * as express from 'express';
import * as CurrentConditionsController from './controller/CurrentConditions';
import * as HealthController from "./controller/HealthController"

const router = express.Router();

router.get('/currentConditions', CurrentConditionsController.getCurrentCondition);

router.get("/health", HealthController.health)

export default router;
