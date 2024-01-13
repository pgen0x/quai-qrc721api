const { LastProcessedBlock, Zones } = require("../models");
const { quais } = require("quais");
const log4js = require("../config/log4js");
const { nftABI } = require("../constants/NFTAbi");
const { QRC20ABI } = require("../constants/QRC20Abi");

const logger = log4js.getLogger("utils/findqrc721.js");

const zoneLocks = {};

async function* findQRC721Contracts(startblock = 514930, zone) {
  try {
    if (zoneLocks[zone.zoneId]) {
      logger.log(`Already processing for zone ${zone.zoneId}. Skipping.`);
      return;
    }

    zoneLocks[zone.zoneId] = true;

    const serviceName = "findQRC721Contracts";
    let qrc721Contracts = [];

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
    while (Number(currentBlock) <= latestBlock) {
      try {
        const block = await provider.getBlockWithTransactions(
          Number(currentBlock)
        );

        for (const transaction of block.transactions) {
          if (transaction.to === null) {
            const txReceipt = await provider.getTransactionReceipt(
              transaction.hash
            );
            const contractAddress = txReceipt.contractAddress;

            const isQRC20 = await isQRC20Contract(contractAddress, provider);
            const isQRC721 = await isQRC721Contract(contractAddress, provider);
            if (isQRC20) {
              logger.debug(contractAddress, ": is QRC-20");
            } else if (isQRC721) {
              logger.debug(contractAddress, ": is QRC-721");
              qrc721Contracts.push({
                contractAddress: contractAddress,
                type: "QRC-721",
                chainId: transaction.chainId,
                zoneId: zone.zoneId,
                rpcEndpoint: zone.rpcEndpoint,
                deployer: txReceipt.from,
                blockExplorer: zone.blockExplorer,
                deployedInBlock: transaction.blockNumber,
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
        logger.error(`Provider error for ${providerUrl}: ${error.message}`);
      }
    }
  } catch (error) {
    logger.error("findQRC721Contracts encountered an error: ", error.message);
    return undefined;
  } finally {
    // Reset the lock after the process is complete for the current zone
    zoneLocks[zone.zoneId] = false;
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
    logger.error("Error fetching the latest processed block:", error);
    throw error;
  }
}

async function isQRC20Contract(contractAddress, provider) {
  const contract = new quais.Contract(contractAddress, QRC20ABI, provider);

  try {
    // Check if the contract has key QRC-20 functions
    await Promise.all([
      contract.decimals("0x0000000000000000000000000000000000000000"),
    ]);

    return true;
  } catch (error) {
    return false; // If any function call fails, it's not an QRC-20 contract
  }
}

async function isQRC721Contract(contractAddress, provider) {
  const contract = new quais.Contract(contractAddress, nftABI, provider);

  try {
    // Check if the contract has key QRC-721 functions
    await Promise.all([contract.ownerOf(1)]);

    return true; // If all functions are present, it's likely an QRC-721 contract
  } catch (error) {
    return false; // If any function call fails, it's not an QRC-721 contract
  }
}

module.exports = {
  findQRC721Contracts,
};
