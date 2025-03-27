module.exports = function (io, snap7Service) {
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
          // Set
          snap7Service.writeBooleanToDb(7, 4, 1, true), // Active platform
          snap7Service.writeIntegerToDb(7, 2, height), // Set height
        ]).then(() => {
          setTimeout(async () => {
            // Reset
            if (isSensorInPosition1 || isSensorInPosition2 || isSensorInPosition3) {
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

    socket.on("logout", () => {
      io.emit("logout");
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

    socket.on("recipeLoaded", async (data) => {
      await setSprinklerHeight(data.SprinklerHeight);
      io.emit("recipeLoaded", data);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });

    socket.on("error", (error) => {
      io.emit("error", error);
    });

    socket.on("enableOperation", async () => {
      try {
        if (snap7Service.isPlcConnected()) {
          await Promise.all([
            // Set
            await snap7Service.writeBooleanToDb(7, 4, 0, true), // Reset alarms
            await snap7Service.writeBooleanToDb(7, 0, 0, true), // Start auto
          ]).then(() => {
            setTimeout(async () => {
              await Promise.all([
                // Reset
                await snap7Service.writeBooleanToDb(7, 4, 0, false),
                await snap7Service.writeBooleanToDb(7, 0, 0, false),
              ]);
            }, 1000);
            io.emit("operationEnabled");
          });
          // // Start auto
          // await snap7Service.writeBooleanToDb(7, 0, 0, true).then(() => {
          //   setTimeout(async () => {
          //     await snap7Service.writeBooleanToDb(7, 0, 0, false);
          //   }, 1000);

          //   io.emit("operationEnabled");
          // });
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
            // Set
            await snap7Service.writeBooleanToDb(7, 4, 2, true), // Stop auto
            await snap7Service.writeBooleanToDb(7, 4, 0, true), // Reset alarms
            await snap7Service.writeBooleanToDb(7, 0, 0, true), // Start auto
          ]).then(() => {
            setTimeout(async () => {
              await Promise.all([
                // Reset
                await snap7Service.writeBooleanToDb(7, 4, 2, false),
                await snap7Service.writeBooleanToDb(7, 4, 0, false),
                await snap7Service.writeBooleanToDb(7, 0, 0, false),
              ]);
            }, 1000);
            io.emit("operationReset");
          });
          // // Reset alarms
          // await snap7Service.writeBooleanToDb(7, 4, 0, true).then(() => {
          //   setTimeout(async () => {
          //     await snap7Service.writeBooleanToDb(7, 4, 0, false);
          //   });
          // }, 1000);
          // // Start auto
          // await snap7Service.writeBooleanToDb(7, 0, 0, true).then(() => {
          //   setTimeout(async () => {
          //     await snap7Service.writeBooleanToDb(7, 0, 0, false);
          //   }, 1000);
          //   io.emit("operationReset");
          // });
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
            // Set
            await snap7Service.writeBooleanToDb(7, 4, 2, true), // Stop auto
            await snap7Service.writeBooleanToDb(7, 4, 3, true), // End cycle
            setSprinklerHeight(1), // Set sprinkler height to 1 (default)
          ]).then(() => {
            setTimeout(async () => {
              await Promise.all([
                // Reset
                await snap7Service.writeBooleanToDb(7, 4, 2, false),
                await snap7Service.writeBooleanToDb(7, 4, 3, false),
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
  });
};
