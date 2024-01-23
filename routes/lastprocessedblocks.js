const express = require("express");
const LastProcessedBlockController = require("../controllers/lastprocessedblock");

const router = express.Router();

router.get("/", LastProcessedBlockController.getLastProcessedBlock);

module.exports = router;
