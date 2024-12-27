import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { configDotenv } from 'dotenv';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
configDotenv();
app.use(express.json());
app.use(cors());

// MongoDB connection
let isConnected;

async function connectDB() {
    if (isConnected) {
        console.log('Using existing database connection');
        return;
    }
    console.log('Creating new database connection');
    try {
        const db = await mongoose.connect(
            `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.xjdofai.mongodb.net/?retryWrites=true&w=majority&serverSelectionTimeoutMS=30000`
        );
        isConnected = db.connections[0].readyState;
        console.log('MongoDB connected successfully!');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

// Ensure database connection for every request
app.use(async (req, res, next) => {
    await connectDB();
    next();
});

// Debugging connection
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to DB');
});
mongoose.connection.on('error', (err) => {
    console.log('Mongoose connection error:', err);
});
mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

// Routes
app.get("/", (req, res) => {
    res.send("Golden Willows server!");
});

// Contact Schema and Model
const contactSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    projectName: { type: String },
    unit: { type: String },
    phone: { type: String, required: true },
});

const Contact = mongoose.model('Contact', contactSchema);

// API route to handle form submission
app.post('/api/contact', async (req, res) => {
    const { fullName, projectName, unit, phone } = req.body;

    try {
        const newContact = new Contact({ fullName, projectName, unit, phone });
        await newContact.save();
        res.status(200).json({ success: true, message: 'Form submitted successfully!' });
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({ success: false, message: 'Error submitting form!' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});

// Export for serverless deployment (uncomment this for Vercel deployment)
export default app;
