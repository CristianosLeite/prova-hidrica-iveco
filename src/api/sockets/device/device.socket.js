module.exports = function (io, socket) {
  const devices = [];

  socket.on("sendDeviceData", (data) => {
    const existingDeviceIndex = devices.findIndex(
      (device) => device.deviceId === data.deviceId
    );

    if (existingDeviceIndex !== -1) {
      // Update existing device
      devices[existingDeviceIndex] = data;
    } else {
      // Add new device
      devices.push(data);
    }

    // Emit updated devices list to all clients
    io.emit("deviceDataReceived", devices);
  });
};
