const { QRC721s, NFTs, Zones, LastProcessedBlock } = require("../models");
const { getNFTTokensInfo } = require("../utils/findNFTs");
const log4js = require("../config/log4js");
const extractDataFromIPFS = require("../utils/extractDataFromIPFS");
const logger = log4js.getLogger("services/nftservices.js");

const NFTServices = async () => {
  try {
    const qrc721Addresses = await getQRC721s();
    const startBlock = 537790;

    for (const qrc721Address of qrc721Addresses) {
      try {
        const nftTokensInfo = await getNFTTokensInfo(
          qrc721Address.qrc721Address,
          qrc721Address.lastBlockChecked || qrc721Address.deployedInBlock,
          qrc721Address.zones,
          async (result) => {
            if (!result.tokensInfo || result.tokensInfo.length === 0) {
              logger.error("Not found nftTokensInfo");
              return;
            }
            for (const tokenInfo of result.tokensInfo) {
              const ipfsHash = tokenInfo.tokenURI.startsWith("ipfs://")
                ? `https://ipfs.io/ipfs/${tokenInfo.tokenURI.replace(
                    "ipfs://",
                    ""
                  )}`
                : tokenInfo.tokenURI;

              const extractedData = ipfsHash
                ? await extractDataFromIPFS(ipfsHash)
                : null;

              const {
                name: nftName,
                description: nftDescription,
                image,
                external_url: nftExternalUrl,
                attributes: nftProperties,
              } = extractedData || {};

              const existingNFT = await NFTs.findOne({
                where: {
                  qrc721Address: qrc721Address.qrc721Address,
                  tokenId: tokenInfo.tokenId,
                },
              });

              const updateData = {
                owner: tokenInfo.owner,
                qrc721Address: qrc721Address.qrc721Address,
                tokenId: tokenInfo.tokenId,
                ipfsHash,
                zoneId: qrc721Address.zones.zoneId,
                name: nftName,
                description: nftDescription,
                imageUri: image
                  ? image.startsWith("ipfs://")
                    ? `https://ipfs.io/ipfs/${image.replace("ipfs://", "")}`
                    : image
                  : null,
                properties: nftProperties,
                external_url: nftExternalUrl,
              };

              if (!existingNFT) {
                await NFTs.create(updateData);
              } else {
                await NFTs.update(updateData, {
                  where: {
                    qrc721Address: qrc721Address.qrc721Address,
                    tokenId: tokenInfo.tokenId,
                    zoneId: qrc721Address.zones.zoneId,
                  },
                });
              }
            }
          }
        );
      } catch (error) {
        logger.error(
          `Error processing collection ${qrc721Address.qrc721Address} in zone ${qrc721Address.zones.zoneId}:`,
          error
        );
      }
    }
  } catch (error) {
    logger.error("Error fetching and saving nfts:", error);
  }
};

async function getQRC721s() {
  try {
    const collections = await QRC721s.findAll({
      order: [["id", "DESC"]],
      include: [
        {
          model: Zones,
          attributes: ["zoneId", "rpcEndpoint"],
        },
      ],
    });
    return collections.map((collection) => ({
      qrc721Address: collection.qrc721Address,
      deployedInBlock: collection.deployedInBlock,
      lastBlockChecked: collection.lastBlockChecked,
      zones: {
        zoneId: collection.Zone.zoneId,
        rpcEndpoint: collection.Zone.rpcEndpoint,
      },
    }));
  } catch (error) {
    logger.error("Error in getQRC721s:", error);
    return [];
  }
}

module.exports = { NFTServices };
