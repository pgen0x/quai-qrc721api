const app = require("./app");
const debug = require("debug")("node-react");
const http = require("http");
const log4js = require("./config/log4js");
const logger = log4js.getLogger("index.js");
const dotenv = require("dotenv");

dotenv.config();

const PORT =
  process.env.NODE_ENV === "production"
    ? process.env.PORT
    : process.env.PORTTESTNET;

const normalizePort = (val) => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

const onError = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
  switch (error.code) {
    case "EACCES":
      logger.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      logger.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
  debug("Listening on " + bind);
  logger.debug("Listening on " + bind);
};

const onClientError = (err, socket) => {
  if (err.code === "ECONNRESET" || !socket.writable) {
    return;
  }

  socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
};

const port = normalizePort(PORT);
app.set("port", port);
const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
server.on("clientError", onClientError);
server.listen(port);

module.exports = server;