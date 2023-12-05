const socketIO = require("socket.io");

let users = [];

module.exports = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log(
      `⚡: ${socket.id} user just connected with IP ${socket.handshake.address}!`
    );
    users.push(socket.id);
    console.log("USERS: ", users);

    socket.on("disconnect", () => {
      users = users.filter((x) => x != socket.id);
      console.log("🔥: A user disconnected");
      console.log("USERS: ", users);
    });
  });

  return io;
};
