'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('QRC721s', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      deployer: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      tokenSymbol: {
        type: Sequelize.STRING
      },
      zoneId: {
        type: Sequelize.INTEGER
      },
      qrc721Address: {
        type: Sequelize.STRING
      },
      totalOwners: {
        type: Sequelize.DECIMAL
      },
      totalItems: {
        type: Sequelize.DECIMAL
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('QRC721s');
  }
};