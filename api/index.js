import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';
dotenv.config();  //for using .env file


mongoose.connect(process.env.MONGO, {
  w: 'majority', // Use 'majority' instead of 'majorit'
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

//to find a directory name
const __dirname = path.resolve();

//This creates an instance of the Express application.
const app = express();

//define static  folder structure to deploy and run
//import path
app.use(express.static(path.join(__dirname, '/client/dist')))

//when you get to any place inside cllient side, 
//send the file (run) index.html in client end.
app.get('*',(req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'))
})

// middleware setup
//This middleware is used to parse incoming JSON requests.
app.use(express.json());

//initialize cookie parser
app.use(cookieParser());

//The application starts listening on port 3000. 
//You'll be able to access the application at http://localhost:3000.
app.listen(3000, () => {
  console.log('Server listen to 3000');
});

//Defining API Routes:
//Routes are defined for handling user-related and authentication-related operations. 
//The actual route handling logic is likely defined in the user.route.js and auth.route.js files.
app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)

// This middleware handles errors that occur during the request-response cycle.
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error!";
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});