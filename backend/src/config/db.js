const mongoose = require('mongoose')

const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        mongoose.connection.on('error', (err) => {
        console.error(`MongoDB Runtime Error: ${err}`);
        });

        mongoose.connection.on('disconnected', () => {
        console.warn('MongoDB Disconnected. Attempting to reconnect...');
        });
    }
    catch(error){
        console.error(`Critical Error: ${error.message}`);
        process.exit(1);
    }
}

module.exports = connectDB