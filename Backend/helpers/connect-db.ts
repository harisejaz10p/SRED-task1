import mongoose from "mongoose";

export const connectDb = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            console.error('MongoDB connection string is missing. Exiting process.');
            process.exit(1); // Exit the application if no MongoDB URI is found
        }
        const db = await mongoose.connect(mongoUri);
        db.connection.on('error', (error) => {
            console.error('Error connecting to the database', error);
        });
        db.connection.on('disconnected', () => {
            console.error('Disconnected from the database');
        });
        db.connection.on('connected', () => {
            console.log('Connected to the database');
        });
        console.log('Connected to the database');
    } catch (error) {
        console.error('Error connecting to the database. Exiting the process', error);
    }
}