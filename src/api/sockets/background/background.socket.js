let currentDoor = 1;
let openCount = 0;

module.exports = function (io, socket) {
  socket.on("startBackgroundService", () => {
    io.emit("startBackgroundService");
  });

  socket.on("backgroundServiceInitialized", (data) => {
    io.emit("backgroundServiceInitialized", data);
  });

  socket.on("openDoor", () => {
    io.emit("openDoor", currentDoor);
  });

  socket.on("doorOpened", (data) => {
    if (data === currentDoor) {
      openCount++; // Increase the counter when the door is opened
      if (openCount >= 2) {
        // If the door is opened twice, switch to the other door
        currentDoor = currentDoor === 1 ? 2 : 1;
        openCount = 0; // Reset the counter
      }
    }
    io.emit("doorOpened", data);
  });

  socket.on("doorClosed", (data) => {
    io.emit("doorClosed", data);
  });
};
