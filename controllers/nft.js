const { NFTs, QRC721s, Zones } = require("../models");
const log4js = require("../config/log4js");
const logger = log4js.getLogger("controllers/nft.js");
const { Op } = require("sequelize");

exports.getAllNFTs = async (req, res) => {
  // #swagger.tags = ['NFTs']
  // #swagger.summary = 'Get All NFTs'
  /* #swagger.security = [{"bearerAuth": []}] */
  let { limit = 10, page = 1, search } = req.query; // Default limit to 10 and page to 1 if not provided

  try {
    // Calculate the offset based on the requested page and limit
    const offset = (page - 1) * limit;

    // Build the where condition for the search query
    const whereCondition = search
      ? {
          [Op.or]: [
            { qrc721Address: { [Op.iLike]: `%${search}%` } }, // Adjust based on your model
            { "$QRC721.Zone.name$": { [Op.iLike]: `%${search}%` } },
            { name: { [Op.iLike]: `%${search}%` } }, // Case-insensitive search by name
            { description: { [Op.iLike]: `%${search}%` } }, // Case-insensitive search by description
            { owner: { [Op.iLike]: `%${search}%` } }, // Case-insensitive search by owner
            // Add more fields to search as needed
          ],
        }
      : {};

    const nfts = await NFTs.findAndCountAll({
      attributes: { exclude: ["id"] },
      limit: parseInt(limit),
      offset: offset,
      order: [["id", "DESC"]],
      include: [
        {
          model: QRC721s,
          attributes: [],
          include: [
            {
              model: Zones,
              attributes: ["name", "zoneId", "rpcEndpoint"],
            },
          ],
        },
      ],
      where: whereCondition,
    });

    if (nfts.count > 0) {
      res.status(200).json({
        nfts: nfts.rows,
        totalCount: nfts.count,
        totalPages: Math.ceil(nfts.count / limit),
        currentPage: parseInt(page),
      });
    } else {
      res.status(404).json({
        error: {
          messages: "Data not found!",
        },
      });
    }
  } catch (error) {
    logger.error("Fetching all NFT failed ", error);
    res.status(500).json({
      error: {
        messages: "Fetching all NFT failed",
      },
    });
  }
};

exports.getNFTbyQRC721Address = async (req, res) => {
  // #swagger.tags = ['NFTs']
  // #swagger.summary = 'Get NFTs by qrc721 address'
  /* #swagger.security = [{"bearerAuth": []}] */

  const { qrc721Address } = req.params;
  const { search, limit = 10, page = 1 } = req.query; // Default limit to 10 and page to 1 if not provided

  try {
    // Calculate the offset based on the requested page and limit
    const offset = (page - 1) * limit;

    // Define the default condition to select all NFTs if query is null or not provided
    const defaultCondition = {
      qrc721Address,
    };

    // Define the search condition if query is provided
    const searchCondition = search
      ? {
          qrc721Address,
          [Op.or]: [
            { name: { [Op.iLike]: `%${search}%` } }, // Case-insensitive search by name
            { description: { [Op.iLike]: `%${search}%` } }, // Case-insensitive search by description
            { owner: { [Op.iLike]: `%${search}%` } }, // Case-insensitive search by owner
            // Add more fields to search as needed (e.g., owner, externalUrl, etc.)
          ],
        }
      : defaultCondition;

    const nfts = await NFTs.findAndCountAll({
      where: searchCondition,
      attributes: { exclude: ["createdAt", "updatedAt", "id"] }, // Select all columns except the ones specified
      limit: parseInt(limit),
      offset: offset,
      order: [["id", "DESC"]],
      include: [
        {
          model: QRC721s,
          include: [
            {
              model: Zones,
              attributes: ["name", "zoneId", "rpcEndpoint"],
            },
          ],
        },
      ],
    });

    if (nfts.count > 0) {
      res.status(200).json({
        data: nfts.rows,
        totalCount: nfts.count,
        totalPages: Math.ceil(nfts.count / limit),
        currentPage: parseInt(page),
      });
    } else {
      res.status(404).json({
        error: {
          messages: "Data not found!",
        },
      });
    }
  } catch (error) {
    logger.error("Fetching nft failed!");
    res.status(500).json({
      error: {
        messages: "Fetching nft failed!",
      },
    });
  }
};

exports.getNFTbyOwnerAddress = async (req, res) => {
  // #swagger.tags = ['NFTs']
  // #swagger.summary = 'Get NFTs by owner address'
  /* #swagger.security = [{"bearerAuth": []}] */

  const { ownerAddress } = req.params;
  const { search, limit = 10, page = 1 } = req.query; // Default limit to 10 and page to 1 if not provided

  try {
    // Calculate the offset based on the requested page and limit
    const offset = (page - 1) * limit;

    // Define the base condition to filter by owner address
    const baseCondition = {
      owner: ownerAddress,
    };

    // Define the search condition if query is provided
    const searchCondition = search
      ? {
          [Op.and]: [
            baseCondition, // Include the base condition
            {
              [Op.or]: [
                { name: { [Op.iLike]: `%${search}%` } }, // Case-insensitive search by name
                { description: { [Op.iLike]: `%${search}%` } }, // Case-insensitive search by description
                { owner: { [Op.iLike]: `%${search}%` } }, // Case-insensitive search by owner
                // Add more fields to search as needed (e.g., owner, externalUrl, etc.)
              ],
            },
          ],
        }
      : baseCondition;

    const nfts = await NFTs.findAndCountAll({
      where: searchCondition,
      attributes: { exclude: ["createdAt", "updatedAt", "id"] },
      limit: parseInt(limit),
      offset: offset,
      order: [["updatedAt", "DESC"]],
      include: [
        {
          model: QRC721s,
          include: [
            {
              model: Zones,
              attributes: ["name", "zoneId", "rpcEndpoint"],
            },
          ],
        },
      ],
    });

    if (nfts.count > 0) {
      res.status(200).json({
        data: nfts.rows,
        totalCount: nfts.count,
        totalPages: Math.ceil(nfts.count / limit),
        currentPage: parseInt(page),
      });
    } else {
      res.status(404).json({
        error: {
          messages: "Data not found!",
        },
      });
    }
  } catch (error) {
    logger.error("Fetching nft by address failed ", error);
    res.status(500).json({
      error: {
        messages: "Fetching nft by address failed",
      },
    });
  }
};

exports.getNFTbyTokenId = async (req, res) => {
  // #swagger.tags = ['NFTs']
  // #swagger.summary = 'Get NFT by tokenId and QRC721 address'
  /* #swagger.security = [{"bearerAuth": []}] */

  const { qrc721Address, tokenId } = req.params;
  let { limit = 10, page = 1 } = req.query;

  try {
    // Calculate the offset based on the requested page and limit
    const offset = (page - 1) * limit;

    const nftData = await NFTs.findAndCountAll({
      where: { qrc721Address, tokenId },
      limit: parseInt(limit),
      offset: offset,
      include: [
        {
          model: QRC721s,
          include: [
            {
              model: Zones,
              attributes: ["name", "zoneId", "rpcEndpoint"],
            },
          ],
        },
      ],
    });

    if (nftData.count > 0) {
      res.status(200).json({
        nfts: nftData.rows,
        totalCount: nftData.count,
        totalPages: Math.ceil(nftData.count / limit),
        currentPage: parseInt(page),
      });
    } else {
      res.status(404).json({
        error: {
          messages: "Data not found!",
        },
      });
    }
  } catch (error) {
    logger.error("Fetching nft by id failed", error);
    res.status(500).json({
      error: {
        messages: "Fetching nft by id failed",
      },
    });
  }
};
