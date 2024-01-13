const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger_output.json");
const log4js = require("./config/log4js");
const logger = log4js.getLogger("app.js");
const { buildError } = require("express-ez-405");

// Routes
const qrc721Routes = require("./routes/qrc721");
const NFTsRoutes = require("./routes/nfts");
const ZonesRoutes = require("./routes/zones");

// Schedule service
const { qrc721services } = require("./services/qrc721services");
const { NFTServices } = require("./services/nftservices");

const app = express();
app.options("*", cors());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const allowedOrigins = ["http://127.0.0.1:3002", "http://localhost:3002"];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  next();
});

const awaitHandler = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};

app.get(
  "/health",
  awaitHandler(async (req, res) => {
    // #swagger.tags = ['Default']
    // #swagger.summary = 'Health check - can be called by load balancer to check health of REST API'
    logger.debug(`${req.protocol}, ${req.ip}, ${req.originalUrl}`);
    res.sendStatus(200);
  })
);
app.use("/api/qrc721", qrc721Routes);
app.use("/api/nfts", NFTsRoutes);
app.use("/api/zones", ZonesRoutes);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

/// 405 & 404 error catcher
app.use("", (req, _, next) => {
  const err = buildError(app, req);
  if (!err) return next();
  return next(err);
});

// Error handling
app.use((err, _, res, __) =>
  res.status(err.status).json({ message: err.message })
);

const executeService = async () => {
  await qrc721services();
  await NFTServices();
};

executeService();

module.exports = app;
