const { LastProcessedBlock, Zones } = require("../models");
const { quais } = require("quais");
const log4js = require("../config/log4js");
const logger = log4js.getLogger("utils/findqrc721.js");

async function* findQRC721Contracts(startblock = 514930) {
  try {
    const QRC20_ABI = [
      "function decimals() external view returns (uint8)",
      "function totalSupply() external view returns (uint256)",
    ];

    const serviceName = "findQRC721Contracts";
    let qrc721Contracts = [];
    const zones = await Zones.findAll({
      attributes: ["rpcEndpoint", "zoneId", "blockExplorer"],
    });

    for (const zone of zones) {
      let latestProcessedBlock = await getLatestProcessedBlock(
        serviceName,
        zone.zoneId
      );
      const fromBlock = latestProcessedBlock || startblock;
      const providerUrl = zone.rpcEndpoint;
      const provider = new quais.providers.JsonRpcProvider(providerUrl);
      let currentBlock = fromBlock;
      let latestBlock = await provider.getBlockNumber();
      logger.info("Find QRC721 for zone", zone.zoneId, "from ", currentBlock);
      while (currentBlock <= latestBlock) {
        try {
          const block = await provider.getBlockWithTransactions(
            Number(currentBlock)
          );

          for (const transaction of block.transactions) {
            let contractAddress;
            if (transaction.to === null) {
              const txReceipt = await provider.getTransactionReceipt(
                transaction.hash
              );
              contractAddress = txReceipt.contractAddress;
              const contract = new quais.Contract(
                contractAddress,
                QRC20_ABI,
                provider
              );

              try {
                await contract.decimals();
                logger.debug("QRC-20");
              } catch (error) {
                qrc721Contracts.push({
                  contractAddress: contractAddress,
                  type: "QRC-721",
                  chainId: transaction.chainId,
                  zoneId: zone.zoneId,
                  rpcEndpoint: zone.rpcEndpoint,
                  deployer: txReceipt.from,
                  blockExplorer: zone.blockExplorer,
                });
              }
            }
          }

          let getLastProcessedBlocks = await LastProcessedBlock.findOne({
            where: { serviceName, zoneId: zone.zoneId },
          });
          if (!getLastProcessedBlocks) {
            await LastProcessedBlock.create({
              serviceName: serviceName,
              blockNumber: currentBlock,
              zoneId: zone.zoneId,
            });
          } else {
            await getLastProcessedBlocks.update({
              blockNumber: currentBlock,
              zoneId: zone.zoneId,
            });
          }

          yield {
            startBlock: startblock,
            endBlock: currentBlock,
            qrc721Contracts: [...qrc721Contracts],
          };
          qrc721Contracts = [];

          // Move to the next block
          currentBlock++;
        } catch (error) {
          console.error(`Provider error for ${providerUrl}: ${error.message}`);
        }
      }
    }
  } catch (error) {
    logger.error("findNFTContracts encountered an error: ", error.message);
    return undefined;
  }
}

async function getTransactionsInBatch(provider, startBlock, endBlock) {
  const batch = [];
  for (let blockNumber = startBlock; blockNumber <= endBlock; blockNumber++) {
    const block = await provider.getBlockWithTransactions(Number(blockNumber));
    batch.push(...block.transactions);
  }
  return batch;
}

async function updateLastProcessedBlock(serviceName, zoneId, blockNumber) {
  let getLastProcessedBlocks = await LastProcessedBlock.findOne({
    where: { serviceName, zoneId },
  });
  if (!getLastProcessedBlocks) {
    await LastProcessedBlock.create({
      serviceName: serviceName,
      blockNumber: blockNumber,
      zoneId: zoneId,
    });
  } else {
    await getLastProcessedBlocks.update({
      blockNumber: blockNumber,
      zoneId: zoneId,
    });
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

module.exports = {
  findQRC721Contracts,
};
