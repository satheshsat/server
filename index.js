const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    // if(token=='abc' && socket.handshake.address=='::1'){
    if(token=='abc'){
        return next();
    }
    next(new Error('Unautherised'));
});

io.on('connection', (socket) => {
  console.log('Service B connected');

  // Listen for messages from Service B
  socket.on('message-from-b', (data) => {
    console.log('Received from B:', data);
    // Optionally send a response back
    socket.emit('message-from-a', 'Hello from Service A');
  });

  // Optionally handle disconnection
  socket.on('disconnect', () => {
    console.log('Service B disconnected');
  });
});

app.get('/', function(req, res) {
  res.send('test');
});

server.listen(3000, () => {
  console.log('Service A listening on port 3000');
});

// Export the Express API
module.exports = app;