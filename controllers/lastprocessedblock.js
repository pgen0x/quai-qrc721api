const { LastProcessedBlock, Zones } = require("../models");
const log4js = require("../config/log4js");
const logger = log4js.getLogger("controllers/lastprocessedblocks.js");
const { Op } = require("sequelize");

exports.getLastProcessedBlock = async (req, res) => {
  // #swagger.tags = ['LastProcessedBlock']
  // #swagger.summary = 'Get All Last Processed Blocks'
  /* #swagger.security = [{"bearerAuth": []}] */
  let { limit = 10, page = 1, query } = req.query; // Default limit to 10 and page to 1 if not provided

  try {
    // Calculate the offset based on the requested page and limit
    const offset = (page - 1) * limit;

    // Build the where condition for the search query
    const whereCondition = query
      ? {
          [Op.or]: [
            { serviceName: { [Op.iLike]: `%${query}%` } },
            // Add more fields to search as needed
          ],
        }
      : {};

    const lastprocessedblock = await LastProcessedBlock.findAndCountAll({
      attributes: { exclude: ["id"] },
      where: whereCondition,
      limit: parseInt(limit),
      offset: offset,
      include: [
        {
          model: Zones,
          attributes: ["name", "zoneId", "rpcEndpoint"],
        },
      ],
    });

    if (lastprocessedblock.count > 0) {
      res.status(200).json({
        data: lastprocessedblock.rows,
        totalCount: lastprocessedblock.count,
        totalPages: Math.ceil(lastprocessedblock.count / limit),
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
    logger.error("Fetching all lastprocessedblock failed ", error);
    res.status(500).json({
      error: {
        messages: "Fetching all lastprocessedblock failed",
      },
    });
  }
};
