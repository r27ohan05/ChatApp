const users = require('./users');

module.exports = (socket, io) => {
  console.log('User connected:', socket.id);

  socket.on('join', ({ username }) => {
    users.addUser(socket.id, username);
    socket.broadcast.emit('user-status', { username, status: 'online' });
  });

  socket.on('chat message', (msgData) => {
    socket.broadcast.emit('chat message', msgData); // ✅ Fixed here
  });

  socket.on('typing', (username) => {
    socket.broadcast.emit('typing', username);
  });

  socket.on('chat message', (msgData) => {
  msgData.senderId = socket.id; // Attach sender ID
  socket.broadcast.emit('chat message', msgData);
});



  socket.on('disconnect', () => {
    const user = users.removeUser(socket.id);
    if (user) io.emit('user-status', { username: user.username, status: 'offline' });
    console.log('User disconnected:', socket.id);
  });
};
