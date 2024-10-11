import mongoose from "mongoose";

export const connectDb = async () => {
    try {
        const db = await mongoose.connect(process.env.MONGO_URI!);
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