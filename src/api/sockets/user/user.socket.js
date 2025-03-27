module.exports = function (io, socket) {
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
};
