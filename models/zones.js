"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Zones extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Zones.init(
    {
      name: DataTypes.STRING,
      zoneId: DataTypes.INTEGER,
      chainId: DataTypes.INTEGER,
      rpcEndpoint: DataTypes.STRING,
      blockExplorer: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Zones",
    }
  );
  return Zones;
};
