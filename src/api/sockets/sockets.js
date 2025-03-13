module.exports = function(io, snap7Service) {
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

    socket.on("recipeLoaded", (data) => {
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
          await snap7Service.writeBooleanToDb(7, 0, 0, true).then(() => {
            setTimeout(() => {
              snap7Service.writeBooleanToDb(7, 0, 0, false);
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
      try {
        console.log("Setting sprinkler height: ", data);
        if (snap7Service.isPlcConnected()) {
          await snap7Service.writeBooleanToDb(7, 4, 1, true).then(() => {
            // setTimeout(() => {
            //   snap7Service.writeBoolean(7, 3, 0, false);
            // }, 1000);
          });
          await snap7Service.writeIntegerToDb(7, 2, data).then(() => {
            setTimeout(async () => {
              await snap7Service.writeIntegerToDb(7, 2, 0);
            }, 1000);
            io.emit("sprinklerHeightSet", data);
          });
        }
      } catch (error) {
        console.log("Error setting sprinkler height: ", error);
        io.emit("plcError", error);
      }
    });

    socket.on("resetOperation", async () => {
      try {
        if (snap7Service.isPlcConnected()) {
          await snap7Service.writeBooleanToDb(7, 4, 0, true).then(() => {
            setTimeout(() => {
              snap7Service.writeBooleanToDb(7, 4, 0, false);
            });
          });
          await snap7Service.writeBooleanToDb(7, 1, 0, true).then(() => {
            setTimeout(() => {
              snap7Service.writeBooleanToDb(7, 1, 0, false);
            }, 1000);
            io.emit("operationReset");
          });
        }
      } catch (error) {
        console.log("Error resetting operation: ", error);
        io.emit("plcError", error);
      }
    });
  });
};
