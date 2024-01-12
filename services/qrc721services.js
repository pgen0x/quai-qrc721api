const { QRC721s } = require("../models");
const { findQRC721Contracts } = require("../utils/findqrc721");
const log4js = require("../config/log4js");
const { getNFTNameSymbol } = require("../utils/getNameSymbol");
const logger = log4js.getLogger("services/qrc721services.js");

let isFetchingQRC721 = false; // Flag to track if a fetch process is already running

const qrc721services = async () => {
  if (isFetchingQRC721) {
    return;
  }

  isFetchingQRC721 = true;
  try {
    const existingQRC721s = await QRC721s.findAll();

    for await (const response of findQRC721Contracts()) {
      for (const resp of response.qrc721Contracts) {
        const existingQRC721 = existingQRC721s.find(
          (qrc721) =>
            qrc721.qrc721Address === resp.contractAddress &&
            qrc721.zoneId === resp.zoneId
        );
        const collectionData = {
          qrc721Address: resp.contractAddress,
          ContractType: resp.type,
          chainId: resp.chainId,
          zoneId: resp.zoneId,
          deployer: resp.deployer,
        };

        const nameSymbol = await getNFTNameSymbol(
          resp.contractAddress,
          resp.rpcEndpoint
        );
        if (nameSymbol) {
          collectionData.name = nameSymbol.Name;
          collectionData.tokenSymbol = nameSymbol.Symbol;
        }

        const apiUrl = `${resp.blockExplorer}/api?module=token&action=getTokenHolders&contractaddress=${resp.contractAddress}`;
        try {
          const apiResponse = await fetch(apiUrl);
          const responseData = await apiResponse.json();

          if (responseData && responseData.result) {
            collectionData.totalOwners = responseData.result.length;
            collectionData.totalItems = responseData.result.reduce(
              (acc, holder) => acc + parseInt(holder.value),
              0
            );
          }
        } catch (error) {
          logger.error(
            "Error fetching or parsing data in qrc721services:",
            error
          );
        }

        if (!existingQRC721) {
          await QRC721s.create(collectionData);
          logger.debug(
            "New QRC721s added to the database:",
            resp.contractAddress
          );
        } else {
          // Update the existing collection entry using the model's update method
          await QRC721s.update(collectionData, {
            where: {
              qrc721Address: resp.contractAddress,
              zoneId: resp.zoneId,
            },
          });
          logger.debug(
            "QRC721s updated in the database:",
            resp.contractAddress
          );
        }
      }
    }
  } catch (error) {
    logger.error("Error fetching and saving QRC721:", error);
  } finally {
    isFetchingQRC721 = false; // Reset the flag after the process is complete
  }
};

module.exports = {
  qrc721services,
};
