const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Server: HttpServer } = require("http");
const { connect, createTables } = require("./database/database");
const { OperationController } = require("./controllers/operation.controller");
const { UsersController } = require("./controllers/users.controller");
const { ActivityController } = require("./controllers/activities.controller");
const { SettingsController } = require("./controllers/settings.controller");
// const { plcConnect, listenAndProcess } = require("./services/snap7-service");

// The Express app is exported so that it can be used by serverless Functions.
function app() {
  const server = express();
  server.use(cors());
  server.use(express.json({ limit: "50mb" }));
  server.use(express.urlencoded({ limit: "50mb", extended: true }));
  server.use(bodyParser.json());

  server.use(express.urlencoded({ extended: true }));

  // Enable parsing of application/json and application/x-www-form-urlencoded
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));

  // Database connection
  connect().then(() => {
    // Create tables after successful connection
    createTables();
  });

  // Connect to plc
  // plcConnect('192.168.0.1');

  // Handle operation
  const operationController = new OperationController();
  server.use("/api/operations", operationController.getRouter());

  // Handle users
  const usersController = new UsersController();
  server.use("/api/users", usersController.getRouter());

  // Handle activities
  const activityController = new ActivityController();
  server.use("/api/activities", activityController.getRouter());

  // Handle settings
  const settingsController = new SettingsController();
  server.use("/api/settings", settingsController.getRouter());

  return { app: server };
}

function run() {
  const port = process.env["PORT"] || 4000;

  // Start up the Express server
  const { app: expressApp } = app();

  // Create a HTTP server instance with the Express app
  const server = new HttpServer(expressApp);
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });

    // Start listening and processing PLC data
    // listenAndProcess();
}

run();
