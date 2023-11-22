import express from 'express';
import * as CurrentConditionsController from './controller/CurrentConditions';

const router = express.Router();

router.get('/currentConditions', CurrentConditionsController.getCurrentCondition);

export default router;
