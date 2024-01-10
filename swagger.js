const swaggerAutogen = require("swagger-autogen")({
  openapi: "3.0.0",
  autoQuery: true,
});
const outputFile = "./swagger_output.json";
const endpointsFiles = ["./app.js"];
const dotenv = require("dotenv");
dotenv.config();

const PORT =
  process.env.NODE_ENV === "production"
    ? process.env.PORT
    : process.env.PORTTESTNET;

let host = `http://localhost:${PORT}`;

const doc = {
  info: {
    version: "1.0.0",
    title: "QRC721 API - Quai Network",
    description: "QRC721 API - Quai Network documentation.",
  },
  host: host,
  basePath: "/",
  schemes: ["http", "https"],
  consumes: ["application/json"],
  produces: ["application/json"],
};

//swaggerAutogen(outputFile, endpointsFiles);
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require("./index.js");
});
