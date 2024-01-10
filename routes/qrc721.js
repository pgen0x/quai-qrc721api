const express = require("express");
const QRC721Controller = require("../controllers/qrc721");

const router = express.Router();

router.get("/", QRC721Controller.getAllQRC721);
router.get("/:qrc721Address", QRC721Controller.getQRC721ByTokenAddress);
router.get("/deployer/:deployer", QRC721Controller.getQRC721ByDeployer);

module.exports = router;
