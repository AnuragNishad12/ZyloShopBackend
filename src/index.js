import express from 'express'
import connectDB from './db/connection.js';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import loginRoute from './routes/loginRoute.js'
import CategoryRoute from './routes/CategoryRoute.js'
import CategoryAll from './routes/CategoryAll.js'
import ProductRoute from './routes/productRoute.js'
import Cart from './routes/cart.js'
import cors from 'cors'
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(cors());
app.use(cookieParser());

const PORT = process.env.PORT || 5000
app.use(express.json());

app.use(express.urlencoded({ extended: true }));


app.use('/api/auth',authRoutes);

app.use('/api/auth',loginRoute);
app.use('/api',CategoryRoute);
app.use('/api',CategoryAll);
app.use('/api',ProductRoute);
app.use('/api',Cart);



connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log(`🚀 Server running at http://localhost:${PORT}`);
    })
})