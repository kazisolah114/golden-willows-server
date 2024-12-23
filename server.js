import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { configDotenv } from 'dotenv';

const app = express();
const PORT = process.env.PORT || 5000; // Use the environment variable for PORT

// Middleware
configDotenv();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.xjdofai.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
    .then(() => console.log("MongoDb connected successfully!"))
    .catch((err) => console.log("Error connecting to MongoDB", err));

// Routes
app.get("/", (req, res) => {
    res.send("Golden willows server!");
});

// Contact Schema and Model
const contactSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    projectName: { type: String },
    unit: { type: String },
    phone: { type: String, required: true }
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

// Export the app to be used by Vercel
export default app;
