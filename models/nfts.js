"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class NFTs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      NFTs.belongsTo(models.QRC721s, {
        foreignKey: "qrc721Address",
        targetKey: "qrc721Address",
      }); // Each NFT belongs to one QRC721 address
      NFTs.belongsTo(models.Zones, { foreignKey: "zoneId" }); // Each NFT belongs to one Zone
    }
  }
  NFTs.init(
    {
      imageUri: DataTypes.STRING,
      description: DataTypes.STRING,
      name: DataTypes.STRING,
      qrc721Address: DataTypes.STRING,
      tokenId: DataTypes.INTEGER,
      zoneId: DataTypes.INTEGER,
      ipfsHash: DataTypes.STRING,
      properties: DataTypes.JSON,
      owner: DataTypes.STRING,
      externalUrl: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "NFTs",
    }
  );
  return NFTs;
};
