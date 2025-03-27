module.exports = function (io, socket) {
  socket.on("sendingBarcode", (data) => {
    io.emit("sendingBarcode", data);
  });

  socket.on("barcodeData", (data) => {
    io.emit("barcodeData", data);
  });
};
