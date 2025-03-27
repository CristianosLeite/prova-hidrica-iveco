module.exports = function (io, socket) {
  socket.on("startBackgroundService", () => {
    io.emit("startBackgroundService");
  });

  socket.on("backgroundServiceInitialized", (data) => {
    io.emit("backgroundServiceInitialized", data);
  });
};

