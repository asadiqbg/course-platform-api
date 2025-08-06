import dotenv from 'dotenv'
dotenv.config()
import express from "express";
import authRouter from './routes/auth.js'
import mongoose from "mongoose";
import cookieParser from 'cookie-parser';
import errorHandlerMiddleware from './middleware/error-handling.js';

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use('/api/v1/auth', authRouter);
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log('mongoose connected')
    app.listen(5000, () => {
      console.log('Server is listening on port 5000');
    });
  } catch (err) {
    console.log('Server failed to start', err);
    process.exit(1);
  }
};

start();
