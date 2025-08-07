import mongoose from 'mongoose';
import slugify from 'slugify';

const CourseSchema = new mongoose.Schema(
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

CourseSchema.pre('save',function (next){
  if(this.isModified('title')){
    this.slug = slugify(this.title,{lower:true, strict:true})
  }
  next();
})

const Course = mongoose.model('Course', CourseSchema);
export default Course;
