const { QRC721s, Zones } = require("../models");
const log4js = require("../config/log4js");
const logger = log4js.getLogger("controllers/qrc721.js");
const { Op } = require("sequelize");

exports.getAllQRC721 = async (req, res) => {
  // #swagger.tags = ['QRC721']
  // #swagger.summary = 'Get all qrc721'
  /* #swagger.security = [{"bearerAuth": []}] */

  let { limit = 10, page = 1, search } = req.query; // Default limit to 10 and page to 1 if not provided

  try {
    // Calculate the offset based on the requested page and limit
    const offset = (page - 1) * limit;

    const whereCondition = search
      ? {
          [Op.or]: [
            { name: { [Op.iLike]: `%${search}%` } }, // Use Op.iLike for case-insensitive search
            { tokenSymbol: { [Op.iLike]: `%${search}%` } },
            { qrc721Address: { [Op.iLike]: `%${search}%` } },
            { deployer: { [Op.iLike]: `%${search}%` } },
          ],
        }
      : {};

    const qrc721 = await QRC721s.findAndCountAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      where: whereCondition,
      limit: parseInt(limit),
      offset: offset,
    });

    if (qrc721.count > 0) {
      res.status(200).json({
        data: qrc721.rows,
        totalCount: qrc721.count,
        totalPages: Math.ceil(qrc721.count / limit),
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
    logger.error("Fetching all qrc721 failed! ", error);
    res.status(500).json({
      error: {
        messages: "Fetching all qrc721 failed!",
      },
    });
  }
};

exports.getQRC721ByTokenAddress = async (req, res) => {
  // #swagger.tags = ['QRC721']
  // #swagger.summary = 'Get details by QRC721 address'
  /* #swagger.security = [{"bearerAuth": []}] */
  const { qrc721Address } = req.params;

  try {
    const response = await QRC721s.findOne({
      where: { qrc721Address },
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: Zones,
          attributes: ["name", "zoneId", "rpcEndpoint"],
        },
      ],
    });

    if (response) {
      res.status(200).json(response);
    } else {
      res.status(404).json({
        error: {
          messages: "Data not found!",
        },
      });
    }
  } catch (error) {
    logger.error("Fetching qrc721 failed! ", error);
    res.status(500).json({
      error: {
        messages: "Fetching qrc721 failed!",
      },
    });
  }
};

exports.getQRC721ByDeployer = async (req, res) => {
  // #swagger.tags = ['QRC721']
  // #swagger.summary = 'Get details QRC721 by deployer'
  /* #swagger.security = [{"bearerAuth": []}] */

  const { deployer } = req.params;
  const { page, limit, search } = req.query;

  // Default values for pagination if not provided
  const pageValue = page ? parseInt(page, 10) : 1;
  const limitValue = limit ? parseInt(limit, 10) : 10;

  const offset = (pageValue - 1) * limitValue;

  try {
    let whereCondition = { deployer };
    if (search) {
      whereCondition = {
        ...whereCondition,
        [Op.or]: [
          { name: { [Op.iLike]: `%${search}%` } }, // Use Op.iLike for case-insensitive search
          { tokenSymbol: { [Op.iLike]: `%${search}%` } },
          { qrc721Address: { [Op.iLike]: `%${search}%` } },
          // Add more fields to search as needed (e.g., deployer, externalUrl, etc.)
        ],
      };
    }

    const response = await QRC721s.findAndCountAll({
      where: whereCondition,
      attributes: { exclude: ["createdAt", "updatedAt"] },
      limit: limitValue,
      offset: offset,
      order: [["id", "DESC"]],
    });

    if (response.count > 0) {
      res.status(200).json({
        data: response.rows,
        totalCount: response.count,
        totalPages: Math.ceil(response.count / limitValue),
        currentPage: pageValue,
      });
    } else {
      res.status(404).json({
        error: {
          messages: "Data not found!",
        },
      });
    }
  } catch (error) {
    logger.error("Fetching qrc721 failed! ", error);
    res.status(500).json({
      error: {
        messages: "Fetching qrc721 failed!",
      },
    });
  }
};
