const express = require('express');
const connectDB = require('./config/DB');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('./config/passportFacebook');
const googlePassport = require('./config/passportGoogle');

const app = express();

connectDB();

app.use(cors({
    origin: "*" || "http://localhost:3000",
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

// Import Routes
const routerUser = require('./routes/UserRoutes');
const tripRoutes = require('./routes/TripRoutes');
const locationRoutes = require('./routes/LocationRoutes');
const busTypeRoutes = require('./routes/BusTypeRoutes');
const feedbackRoutes = require('./routes/FeedbackRoutes');
const seatRoutes = require('./routes/SeatRoutes'); 
const companyRoutes = require('./routes/CompanyRoutes');
const bookingRoutes = require('./routes/BookingRoutes');
require('./utils/cron');

// Routes
app.use('/api/user', routerUser);
app.use('/api', tripRoutes);
app.use('/api', locationRoutes);
app.use('/api', busTypeRoutes);
app.use('/api', feedbackRoutes); 
app.use('/api', seatRoutes); 
app.use('/api/companies',companyRoutes);
app.use('/api',bookingRoutes);

app.get('/', (req, res) => {
    res.send('Server is running successfully!');
});


const PORT = process.env.PORT || 6789;
app.listen(PORT, () => {
    console.log(`Server is now running on PORT: ${PORT}`);
});
