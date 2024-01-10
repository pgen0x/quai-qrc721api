const express = require("express");
const ZonesController = require("../controllers/zone");

const router = express.Router();

router.get("/all", ZonesController.getAllZones);

module.exports = router;
