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
          rpcEndpoint: "https://rpc.cyprus1.colosseum.quaiscan.io",
          blockExplorer: "https://cyprus1.colosseum.quaiscan.io",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Cyprus-2",
          zoneId: 2,
          chainId: 9000,
          rpcEndpoint: "https://rpc.cyprus2.colosseum.quaiscan.io",
          blockExplorer: "https://cyprus2.colosseum.quaiscan.io",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Cyprus-3",
          zoneId: 3,
          chainId: 9000,
          rpcEndpoint: "https://rpc.cyprus3.colosseum.quaiscan.io",
          blockExplorer: "https://cyprus3.colosseum.quaiscan.io",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Paxos-1",
          zoneId: 4,
          chainId: 9000,
          rpcEndpoint: "https://rpc.paxos1.colosseum.quaiscan.io",
          blockExplorer: "https://paxos1.colosseum.quaiscan.io",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Paxos-2",
          zoneId: 5,
          chainId: 9000,
          rpcEndpoint: "https://rpc.paxos2.colosseum.quaiscan.io",
          blockExplorer: "https://paxos2.colosseum.quaiscan.io",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Paxos-3",
          zoneId: 6,
          chainId: 9000,
          rpcEndpoint: "https://rpc.paxos3.colosseum.quaiscan.io",
          blockExplorer: "https://paxos3.colosseum.quaiscan.io",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Hydra-1",
          zoneId: 7,
          chainId: 9000,
          rpcEndpoint: "https://rpc.hydra1.colosseum.quaiscan.io",
          blockExplorer: "https://hydra1.colosseum.quaiscan.io",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Hydra-2",
          zoneId: 8,
          chainId: 9000,
          rpcEndpoint: "https://rpc.hydra2.colosseum.quaiscan.io",
          blockExplorer: "https://hydra2.colosseum.quaiscan.io",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Hydra-3",
          zoneId: 9,
          chainId: 9000,
          rpcEndpoint: "https://rpc.hydra3.colosseum.quaiscan.io",
          blockExplorer: "https://hydra3.colosseum.quaiscan.io",
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
