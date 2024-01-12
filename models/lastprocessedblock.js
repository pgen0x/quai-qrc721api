'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LastProcessedBlock extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  LastProcessedBlock.init({
    serviceName: DataTypes.STRING,
    blockNumber: DataTypes.DECIMAL,
    zoneId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'LastProcessedBlock',
  });
  return LastProcessedBlock;
};