const { LastProcessedBlock, QRC721s } = require("../models");
const { quais } = require("quais");
const log4js = require("../config/log4js");
const logger = log4js.getLogger("utils/findNFTs.js");

async function getNFTTokensInfo(
  qrc721Address,
  startblock,
  zone,
  eventCallback
) {
  try {
    const ABI = [
      "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
      "function ownerOf(uint256 tokenId) external view returns (address)",
      "function tokenURI(uint256 tokenId) external view returns (string)",
    ];

    const provider = new quais.providers.JsonRpcProvider(zone.rpcEndpoint);
    const contract = new quais.Contract(qrc721Address, ABI, provider);
    let currentBlock = startblock;
    let latestBlock = await provider.getBlockNumber();
    logger.info(
      "Find NFT for address",
      qrc721Address,
      "in zone",
      zone.zoneId,
      "in blockrange",
      currentBlock
    );
    const MAX_BLOCKS_PER_QUERY = 100;
    let currentToBlock = Math.min(
      Number(currentBlock) + MAX_BLOCKS_PER_QUERY - 1,
      latestBlock
    );

    while (Number(currentBlock) <= latestBlock) {
      const filter = contract.filters.Transfer(
        quais.constants.AddressZero,
        null,
        null
      );
      const events = await contract.queryFilter(
        filter,
        Number(currentBlock),
        currentToBlock
      );
      for (let event of events) {
        const tokenId = event.args[2].toString();
        const owner = await contract.ownerOf(tokenId);
        const uri = await contract.tokenURI(tokenId);

        const result = {
          qrc721Address: qrc721Address,
          lastBlockChecked: currentBlock,
          tokensInfo: [
            {
              owner,
              tokenId,
              tokenURI: uri,
            },
          ],
        };

        eventCallback(result);
      }

      currentBlock = currentToBlock + 1;
      currentToBlock = Math.min(
        currentBlock + MAX_BLOCKS_PER_QUERY - 1,
        latestBlock
      );

      await QRC721s.update(
        { lastBlockChecked: currentBlock },
        { where: { qrc721Address: qrc721Address } }
      );
    }
  } catch (error) {
    logger.error("getNFTTokensInfo encountered an error: ", error);
  }
}

async function getLatestProcessedBlock(serviceName, zoneId) {
  try {
    const latestServiceBlock = await LastProcessedBlock.findOne({
      attributes: ["blockNumber"],
      where: { serviceName, zoneId },
      order: [["createdAt", "DESC"]],
    });

    if (latestServiceBlock) {
      return latestServiceBlock.blockNumber;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching the latest processed block:", error);
    throw error;
  }
}

module.exports = { getNFTTokensInfo };
