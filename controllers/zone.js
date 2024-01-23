const { Zones } = require("../models");
const log4js = require("../config/log4js");
const logger = log4js.getLogger("controllers/zone.js");
const { Op } = require("sequelize");

exports.getAllZones = async (req, res) => {
  // #swagger.tags = ['Zones']
  // #swagger.summary = 'Get All Zones'
  /* #swagger.security = [{"bearerAuth": []}] */
  let { limit = 10, page = 1, query } = req.query; // Default limit to 10 and page to 1 if not provided

  try {
    // Calculate the offset based on the requested page and limit
    const offset = (page - 1) * limit;

    // Build the where condition for the search query
    const whereCondition = query
      ? {
          [Op.or]: [
            { name: { [Op.iLike]: `%${query}%` } },
            // Add more fields to search as needed
          ],
        }
      : {};

    const zones = await Zones.findAndCountAll({
      attributes: { exclude: ["id"] },
      where: whereCondition,
      limit: parseInt(limit),
      offset: offset,
    });

    if (zones.count > 0) {
      res.status(200).json({
        data: zones.rows,
        totalCount: zones.count,
        totalPages: Math.ceil(zones.count / limit),
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
    logger.error("Fetching all zones failed ", error);
    res.status(500).json({
      error: {
        messages: "Fetching all zones failed",
      },
    });
  }
};
