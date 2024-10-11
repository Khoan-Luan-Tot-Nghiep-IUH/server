require('dotenv').config();
const mongoose = require('mongoose');
const db = process.env.MONGODB_URL;
console.log('MongoDB URL:', process.env.MONGODB_URL);
const connectDB = async () => {
    try {
        mongoose.set('strictQuery', true);
        await mongoose.connect(process.env.MONGODB_URL,  {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000, 
            socketTimeoutMS: 45000 
        });
        console.log("MongoDB is connected...");
    } catch (err) {
        console.error(`MongoDB connection error: ${err.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
