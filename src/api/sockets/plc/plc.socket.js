// Description: This file contains the socket event handlers for PLC operations.
// It handles operations such as setting the sprinkler height, starting and stopping operations, and resetting the operation.
// The functions interact with the PLC through the snap7Service and emit events to the client using Socket.IO.

module.exports = function (io, socket, snap7Service) {
  async function setSprinklerHeight(height) {
    try {
      await Promise.all([
        snap7Service.writeBooleanToDb(7, 4, 1, true), // Activate platform
        snap7Service.writeIntegerToDb(7, 2, height), // Set height
      ]);
      io.emit("sprinklerHeightSet", height);
    } catch (error) {
      console.error("Error setting sprinkler height:", error);
      io.emit("error", error);
    }
  }

  async function startOperation() {
    try {
      // Set start auto
      await snap7Service.writeBooleanToDb(7, 0, 0, true);
      io.emit("operationEnabled");
    } catch (error) {
      console.error("Error starting operation:", error);
      io.emit("error", error);
    }
  }

  async function stopOperation() {
    try {
      // Set stop auto
      await snap7Service.writeBooleanToDb(7, 4, 2, true);
      // Set end cycle
      await snap7Service.writeBooleanToDb(7, 4, 3, true);
      // await setSprinklerHeight(1); // Reset sprinkler height
      io.emit("operationStopped");
    } catch (error) {
      console.error("Error stopping operation:", error);
      io.emit("error", error);
    }
  }

  async function resetOperation() {
    try {
      // Reset alarms
      await snap7Service.writeBooleanToDb(7, 4, 0, true);
      await startOperation();
      io.emit("operationReset");
    } catch (error) {
      console.error("Error resetting operation:", error);
      io.emit("error", error);
    }
  }

  socket.on("recipeLoaded", async (data) => {
    try {
      await setSprinklerHeight(data.SprinklerHeight);
      io.emit("recipeLoaded", data);
    } catch (error) {
      console.error("Error loading recipe:", error);
      io.emit("error", error);
    }
  });

  socket.on("enableOperation", async () => {
    await startOperation();
  });

  socket.on("setSprinklerHeight", async (data) => {
    await setSprinklerHeight(data);
  });

  socket.on("resetOperation", async () => {
    await resetOperation();
  });

  socket.on("stopOperation", async () => {
    await stopOperation();
  });

  socket.on("finishOperation", async () => {
    try {
      // setTimeout(async () => {
      //   await snap7Service.writeBooleanToDb(7, 4, 1, false); // Deactivate platform
      // }, 25000);
      io.emit("operationFinished");
    } catch (error) {
      console.error("Error during finishOperation timeout:", error);
      io.emit("error", error);
    }
  });
};
