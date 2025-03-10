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
// const { plcConnect, listenAndProcess } = require("./services/snap7-service");

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

  server.use(express.urlencoded({ extended: true }));

  // Enable parsing of application/json and application/x-www-form-urlencoded
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));

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

function run() {
  const port = process.env["PORT"] || 4000;

  // Start up the Express server
  const { app: expressApp } = app();

  // Load SSL certificate and key
  const privateKey = fs.readFileSync("/usr/src/app/cert/client.key");
  const certificate = fs.readFileSync("/usr/src/app/cert/client.crt");

  const credentials = {
    key: privateKey,
    cert: certificate,
  };

  // Create a HTTPS server instance with the Express app
  const server = new HttpsServer(credentials, expressApp);
  const io = new SocketIOServer(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type", "Authorization"],
    },
    transports: ["websocket", "polling"],
  });

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

  io.on("connection", (socket) => {
    console.log("Client connected");

    socket.on("startBackgroundService", () => {
      io.emit("startBackgroundService");
    });

    socket.on("backgroundServiceInitialized", (data) => {
      io.emit("backgroundServiceInitialized", data);
    });

    socket.on("authenticate", () => {
      io.emit("authenticate");
    });

    socket.on("authenticated", (data) => {
      io.emit("authenticated", data);
    });

    socket.on("createUser", (user) => {
      io.emit("createUser", user);
    });

    socket.on("userCreated", (user) => {
      io.emit("userCreated", user);
    });

    socket.on("verificationCompleted", (data) => {
      io.emit("verificationCompleted", data);
    });

    socket.on("sendingBarcode", (data) => {
      io.emit("sendingBarcode", data);
    });

    socket.on("barcodeData", (data) => {
      io.emit("barcodeData", data);
    });

    socket.on("recipeLoaded", (data) => {
      io.emit("recipeLoaded", data);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });

    socket.on("error", (error) => {
      io.emit("error", error);
    });
  });

  server.listen(port, () => {
    console.log(
      `Node Express server listening on https://localhost:${port}/api`
    );
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

  // Start listening and processing PLC data
  // listenAndProcess();
}

run();
