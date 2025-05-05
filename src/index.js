import express from 'express'
import connectDB from './db/connection.js';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000

app.use(express.json());

app.use('/api/auth',authRoutes);


connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log(`🚀 Server running at http://localhost:${PORT}`);
    })
})