import mongoose, { Document, Model } from 'mongoose';
import slugify from 'slugify';

interface ICourse extends Document {
  title: string;
  description: string;
  price: number;
  thumbnail?: string;
  instructor: mongoose.Schema.Types.ObjectId;
  category: mongoose.Schema.Types.ObjectId;
  slug: string;
}

const CourseSchema = new mongoose.Schema<ICourse>(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Course description is required'],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    thumbnail: {
      type: String, // can be URL or Cloudinary path
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    slug: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

CourseSchema.pre<ICourse>('save', function (this:ICourse & mongoose.Document,next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

const Course: Model<ICourse> = mongoose.model<ICourse>('Course', CourseSchema);
export default Course;