'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('NFTs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      imageUri: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      qrc721Address: {
        type: Sequelize.STRING
      },
      tokenId: {
        type: Sequelize.INTEGER
      },
      zoneId: {
        type: Sequelize.INTEGER
      },
      ipfsHash: {
        type: Sequelize.STRING
      },
      properties: {
        type: Sequelize.JSON
      },
      owner: {
        type: Sequelize.STRING
      },
      externalUrl: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('NFTs');
  }
};