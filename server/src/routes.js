const express = require('express');
const CurrentConditionsController = require('./controller/CurrentConditions');

const router = express.Router();

router.get('/currentConditions', CurrentConditionsController.getCurrentCondition);

module.exports = router;
