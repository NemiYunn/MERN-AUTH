import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
dotenv.config();


mongoose.connect(process.env.MONGO, {
    w: 'majority', // Use 'majority' instead of 'majorit'
  }).then(() => {
    console.log('Connected to MongoDB');
  }).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });
  
const app = express();

app.use(express.json());

app.listen(3000, () => {
    console.log('Server listen to 3000');
});

app.use('/api/user', userRoutes)
app.use('/api/auth',authRoutes)

app.use((err,req,res,next) => {
 const statusCode = err.statusCode || 500 ;
 const message = err.message || "Internal server error!";
 return res.status(statusCode).json({
  success :false,
  message,
  statusCode,
 });
});