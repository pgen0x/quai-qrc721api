"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class QRC721s extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      QRC721s.belongsTo(models.Zones, {
        foreignKey: "zoneId", // Name of the foreign key in the Collections table
        targetKey: "zoneId", // Name of the source key in the Users table
      });
      QRC721s.hasMany(models.NFTs, { foreignKey: "qrc721Address" }); // One QRC721 address can have many NFTs
    }
  }
  QRC721s.init(
    {
      deployer: DataTypes.STRING,
      name: DataTypes.STRING,
      tokenSymbol: DataTypes.STRING,
      zoneId: DataTypes.INTEGER,
      qrc721Address: DataTypes.STRING,
      totalOwners: DataTypes.DECIMAL,
      totalItems: DataTypes.DECIMAL,
    },
    {
      sequelize,
      modelName: "QRC721s",
    }
  );
  return QRC721s;
};
