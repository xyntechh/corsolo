let io;
const onlineUsers = new Map();

module.exports = {
  setIO: (socketIO) => {
    io = socketIO;
  },
  getIO: () => io,
  onlineUsers,
};