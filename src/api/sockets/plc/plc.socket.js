module.exports = function (io, socket, snap7Service) {
  async function setSprinklerHeight(height) {
    try {
      if (snap7Service.isPlcConnected()) {
        const isSensorInPosition1 = (
          await snap7Service.readBooleanFromMemory(11, 7)
        ).value;
        const isSensorInPosition2 = (
          await snap7Service.readBooleanFromMemory(12, 0)
        ).value;
        const isSensorInPosition3 = (
          await snap7Service.readBooleanFromMemory(12, 1)
        ).value;
        await Promise.all([
          snap7Service.writeBooleanToDb(7, 4, 1, true), // Active platform
          snap7Service.writeIntegerToDb(7, 2, height), // Set height
        ]).then(() => {
          setTimeout(async () => {
            if (
              isSensorInPosition1 ||
              isSensorInPosition2 ||
              isSensorInPosition3
            ) {
              await snap7Service.writeBooleanToDb(7, 1, 0, false);
            }
          }, 15000);
        });
      }
      io.emit("sprinklerHeightSet", height);
    } catch (error) {
      console.log("Error setting sprinkler height: ", error);
      io.emit("plcError", error);
    }
  }

  socket.on("recipeLoaded", async (data) => {
    await setSprinklerHeight(data.SprinklerHeight);
    io.emit("recipeLoaded", data);
  });

  socket.on("enableOperation", async () => {
    try {
      if (snap7Service.isPlcConnected()) {
        await Promise.all([
          snap7Service.writeBooleanToDb(7, 4, 0, true), // Reset alarms
          snap7Service.writeBooleanToDb(7, 0, 0, true), // Start auto
        ]).then(() => {
          setTimeout(async () => {
            await Promise.all([
              snap7Service.writeBooleanToDb(7, 4, 0, false),
              snap7Service.writeBooleanToDb(7, 0, 0, false),
            ]);
          }, 1000);
          io.emit("operationEnabled");
        });
      }
    } catch (error) {
      console.log("Error enabling operation: ", error);
      io.emit("plcError", error);
    }
  });

  socket.on("setSprinklerHeight", async (data) => {
    await setSprinklerHeight(data);
  });

  socket.on("resetOperation", async () => {
    try {
      if (snap7Service.isPlcConnected()) {
        await Promise.all([
          snap7Service.writeBooleanToDb(7, 4, 2, true), // Stop auto
          snap7Service.writeBooleanToDb(7, 4, 0, true), // Reset alarms
          snap7Service.writeBooleanToDb(7, 0, 0, true), // Start auto
        ]).then(() => {
          setTimeout(async () => {
            await Promise.all([
              snap7Service.writeBooleanToDb(7, 4, 2, false),
              snap7Service.writeBooleanToDb(7, 4, 0, false),
              snap7Service.writeBooleanToDb(7, 0, 0, false),
            ]);
          }, 1000);
          io.emit("operationReset");
        });
      }
    } catch (error) {
      console.log("Error resetting operation: ", error);
      io.emit("plcError", error);
    }
  });

  socket.on("stopOperation", async () => {
    try {
      if (snap7Service.isPlcConnected()) {
        await Promise.all([
          snap7Service.writeBooleanToDb(7, 4, 2, true), // Stop auto
          snap7Service.writeBooleanToDb(7, 4, 3, true), // End cycle
          setSprinklerHeight(1), // Set sprinkler height to 1 (default)
        ]).then(() => {
          setTimeout(async () => {
            await Promise.all([
              snap7Service.writeBooleanToDb(7, 4, 2, false),
              snap7Service.writeBooleanToDb(7, 4, 3, false),
            ]);
          }, 1000);
          io.emit("operationStopped");
        });
      }
    } catch (error) {
      console.log("Error stopping operation: ", error);
      io.emit("plcError", error);
    }
  });
};
