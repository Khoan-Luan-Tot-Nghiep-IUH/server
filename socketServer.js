const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('createBooking', (data) => {
        console.log('Received booking data:', data);

        io.emit('seatsBooked', {
            tripId: data.tripId,
            seatNumbers: data.seatNumbers,
            message: 'Seats have been booked.'
        });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`WebSocket server is running on port ${PORT}`);
});
