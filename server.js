require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./config/DB');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('./config/passportFacebook');
const googlePassport = require('./config/passportGoogle'); 

const app = express();
const server = http.createServer(app);

connectDB(); // Kết nối tới cơ sở dữ liệu

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5000',
    credentials: true,
}));

app.use((req, res, next) => {
    res.removeHeader("Cross-Origin-Opener-Policy");
    res.removeHeader("Cross-Origin-Embedder-Policy");
    next();
});
const helmet = require('helmet');
app.use(helmet({
    contentSecurityPolicy: false,
}));


app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Passport middleware
app.use(passport.initialize());
app.use(googlePassport.initialize());

const io = socketIo(server, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:5000',
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Socket.io Connection
io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Import Routes
const routerUser = require('./routes/UserRoutes');
const tripRoutes = require('./routes/TripRoutes');
const locationRoutes = require('./routes/LocationRoutes');
const busTypeRoutes = require('./routes/BusTypeRoutes');
const bookingRoutes = require('./routes/BookingRoutes')(io);
const feedbackRoutes = require('./routes/FeedbackRoutes');
const seatRoutes = require('./routes/SeatRoutes'); 
require('./utils/cron');

// Routes
app.use('/api/user', routerUser);
app.use('/api', tripRoutes);
app.use('/api', locationRoutes);
app.use('/api', busTypeRoutes);
app.use('/api', bookingRoutes);
app.use('/api', feedbackRoutes); 
app.use('/api', seatRoutes); 

const path = require('path');

app.use(express.static(path.join(__dirname, 'build')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
        
// Khởi động server
const PORT = process.env.PORT || 6789;
server.listen(PORT, () => {
    console.log(`Server is now running on PORT: ${PORT}`);
});

module.exports = { app, server};
