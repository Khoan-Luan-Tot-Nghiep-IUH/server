// socketServer.js
const http = require('http');
const socketIo = require('socket.io');

const server = http.createServer();
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('A user connected');
  
  // Lắng nghe các sự kiện từ client
  socket.on('book_ticket', (data) => {
    console.log('Ticket booking request received:', data);
    // Xử lý logic đặt vé
    socket.emit('booking_response', { message: 'Booking successful' });
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const PORT = process.env.SOCKET_PORT || 8080;
server.listen(PORT, () => {
  console.log(`Socket server running on port: ${PORT}`);
});
