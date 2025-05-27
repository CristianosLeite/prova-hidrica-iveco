const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Server: HttpsServer } = require("https");
const { Server: SocketIOServer } = require("socket.io");
const fs = require("fs");
const { connect, createTables } = require("./database/database");
const { OperationController } = require("./controllers/operation.controller");
const { UsersController } = require("./controllers/users.controller");
const { RecipeController } = require("./controllers/recipes.controller");
const { SettingsController } = require("./controllers/settings.controller");
const { Snap7Service } = require("./services/snap7-service.js");
const setupSockets = require("./sockets/sockets");

function app() {
  const server = express();

  server.use(
    cors({
      origin: "*",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      preflightContinue: true,
      optionsSuccessStatus: 204,
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );
  server.use(express.json({ limit: "50mb" }));
  server.use(express.urlencoded({ limit: "50mb", extended: true }));
  server.use(bodyParser.json());

  // Set the prefix for the API
  server.use("/api", (req, res, next) => {
    next();
  });

  // Database connection
  connect().then(() => {
    // Create tables after successful connection
    createTables();
  });

  return { app: server };
}

async function run() {
  const port = process.env["PORT"] || 4000;
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Start up the Express server
  const { app: expressApp } = app();

  // Certificate paths - Different paths for development and production
  let certPath, keyPath;

  if (isDevelopment) {
    // In development mode, look for certificates in ./cert directory
    certPath = "./cert/client.crt";
    keyPath = "./cert/client.key";
    console.log("Development mode: Looking for certificates in local ./cert directory");
  } else {
    // In production mode, use container path
    certPath = "/usr/src/app/cert/client.crt";
    keyPath = "/usr/src/app/cert/client.key";
    console.log("Production mode: Looking for certificates in container path");
  }

  let server;

  // Check if certificates exist for HTTPS
  if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
    // Load SSL certificate and key
    const privateKey = fs.readFileSync(keyPath);
    const certificate = fs.readFileSync(certPath);

    const credentials = {
      key: privateKey,
      cert: certificate,
    };

    // Create a HTTPS server instance with the Express app
    server = new HttpsServer(credentials, expressApp);
    console.log("Starting server with HTTPS");
  } else {
    // Fallback to HTTP in development
    console.log("SSL certificates not found. Starting server with HTTP.");
    server = require('http').createServer(expressApp);
  }

  const io = new SocketIOServer(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type", "Authorization"],
    },
    transports: ["websocket", "polling"],
    // pingTimeout: 60000, // Increase ping timeout to 60 seconds
    pingInterval: 25000, // Increase ping interval to 25 seconds
    reconnection: true, // Enable reconnection
    reconnectionAttempts: Infinity, // Unlimited reconnection attempts
    reconnectionDelay: 3000, // Delay between reconnection attempts
  });

  // Start listening and processing PLC data
  const snap7Service = new Snap7Service(io);

  // Create controllers

  // Handle operation
  const operationController = new OperationController(io);
  expressApp.use("/api/operations", operationController.getRouter());

  // Handle users
  const usersController = new UsersController(io);
  expressApp.use("/api/users", usersController.getRouter());

  // Handle recipes
  const recipeController = new RecipeController(io);
  expressApp.use("/api/recipes", recipeController.getRouter());

  // Handle settings
  const settingsController = new SettingsController();
  expressApp.use("/api/settings", settingsController.getRouter());

  if (isDevelopment) {
    console.log("Running in DEVELOPMENT mode - PLC connection bypassed");
    // Create mock PLC connection for development
    snap7Service.mockConnection();
  } else {
    try {
      console.log("Running in PRODUCTION mode - Connecting to real PLC");
      await snap7Service.plcConnect("192.168.0.1");
      snap7Service.startConnectionMonitor(); // Start monitoring PLC connection
    } catch (error) {
      console.log("Error connecting to PLC: ", error);
      setTimeout(() => snap7Service.plcConnect("192.168.0.1"), 5000);
    }
  }

  // Setup sockets
  setupSockets(io, snap7Service);

  server.listen(port, () => {
    console.log(
      `Node Express server listening on https://localhost:${port}/api`
    );
  });

  server.on("connection", (socket) => {
    socket.setKeepAlive(true, 60000);
  });

  server.on("error", (error) => {
    console.error("Error starting server: ", error);
  });

  server.on("close", () => {
    console.log("Server closed");
  });

  server.on("request", (req, res) => {
    console.log("Request received");
  });
}

run();
