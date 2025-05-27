const setupPlcSockets = require('./plc/plc.socket');
const setupUserSockets = require('./user/user.socket');
const setupBarcodeSockets = require('./barcode/barcode.socket');
const setupBackgroundSockets = require('./background/background.socket');
const setupDeviceSockets = require('./device/device.socket');

module.exports = function (io, snap7Service) {
  setInterval(() => {
    io.emit("keep-alive", { status: "active" });
  }, 15000);

  io.on("connection", (socket) => {
    console.log("Client connected");

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });

    socket.on("error", (error) => {
      io.emit("error", error);
    });

    // Delegate background-related logic to background.socket.js
    setupBackgroundSockets(io, socket);

    // Delegate PLC-related logic to plc.socket.js
    setupPlcSockets(io, socket, snap7Service);

    // Delegate user-related logic to user.socket.js
    setupUserSockets(io, socket);

    // Delegate barcode-related logic to barcode.socket.js
    setupBarcodeSockets(io, socket);

    // Delegate device-related logic to device.socket.js
    setupDeviceSockets(io, socket);
  });
};
