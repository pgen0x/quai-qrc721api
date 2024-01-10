"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Zones",
      [
        {
          name: "Cyprus-1",
          zoneId: 1,
          chainId: 9000,
          rpcEndpoint: "https://cyprus1.colosseum.quaiscan.io/",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Cyprus-2",
          zoneId: 2,
          chainId: 9000,
          rpcEndpoint: "https://cyprus2.colosseum.quaiscan.io/",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Cyprus-3",
          zoneId: 3,
          chainId: 9000,
          rpcEndpoint: "https://cyprus3.colosseum.quaiscan.io/",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Paxos-1",
          zoneId: 4,
          chainId: 9000,
          rpcEndpoint: "https://paxos1.colosseum.quaiscan.io/",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Paxos-2",
          zoneId: 5,
          chainId: 9000,
          rpcEndpoint: "https://paxos2.colosseum.quaiscan.io/",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Paxos-3",
          zoneId: 6,
          chainId: 9000,
          rpcEndpoint: "https://paxos3.colosseum.quaiscan.io/",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Hydra-1",
          zoneId: 7,
          chainId: 9000,
          rpcEndpoint: "https://hydra1.colosseum.quaiscan.io/",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Hydra-2",
          zoneId: 8,
          chainId: 9000,
          rpcEndpoint: "https://hydra2.colosseum.quaiscan.io/",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Hydra-3",
          zoneId: 9,
          chainId: 9000,
          rpcEndpoint: "https://hydra3.colosseum.quaiscan.io/",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Zones", null, {});
  },
};
