import express from 'express'
import connectDB from './db/connection.js';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import loginRoute from './routes/loginRoute.js'
import cors from 'cors'

dotenv.config();

const app = express();
app.use(cors());

const PORT = process.env.PORT || 5000

app.use(express.json());

app.use('/api/auth',authRoutes);

app.use('/api/auth',loginRoute);


connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log(`🚀 Server running at http://localhost:${PORT}`);
    })
})