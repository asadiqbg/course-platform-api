import express, { Application } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import errorHandlingMiddleware from './middleware/error-handling';
import authRoutes from './routes/auth';
import categoryRoutes from './routes/category';
import courseRoutes from './routes/courses';

dotenv.config();

const app: Application = express();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/courses', courseRoutes);

app.use(errorHandlingMiddleware);

const PORT = process.env.PORT || '5000';
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error('MONGO_URI is not defined in environment variables');
}

mongoose.connect(MONGO_URI)
  .then(() => {
    app.listen(Number(PORT), () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });
