import express, { Application } from 'express';
import dotenv from 'dotenv';
import path from 'path'
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import errorHandlingMiddleware from './middleware/error-handling';
import authRoutes from './routes/auth';
import categoryRoutes from './routes/category';
import courseRoutes from './routes/courses';

dotenv.config({path:path.resolve(__dirname,'../.env')});

const app: Application = express();

app.use(express.json());
app.use(cookieParser())

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/courses', courseRoutes);

app.use(errorHandlingMiddleware);

const PORT = process.env.PORT || '5000';
const MONGO_URI = process.env.MONGO_URI;

const start = async () => {
  try {
    if (!MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }
    await mongoose.connect(MONGO_URI);
    console.log('Successfully connected to MongoDB');
    app.listen(Number(PORT), () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();
