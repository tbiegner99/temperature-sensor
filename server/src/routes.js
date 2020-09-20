const CurrentConditionsController = require("./controller/CurrentConditions");
const express = require("express");

const router = express.Router()

router.get("/currentConditions", CurrentConditionsController.getCurrentCondition);

module.exports = router