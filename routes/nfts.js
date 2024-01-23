const express = require("express");
const NFTsController = require("../controllers/nft");

const router = express.Router();

router.get("/", NFTsController.getAllNFTs);
router.get("/qrc721/:qrc721Address", NFTsController.getNFTbyQRC721Address);
router.get("/owner/:ownerAddress", NFTsController.getNFTbyOwnerAddress);
router.get("/token/:qrc721Address/:tokenId", NFTsController.getNFTbyTokenId);

module.exports = router;
