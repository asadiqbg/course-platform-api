import mongoose ,{Model} from 'mongoose';
import slugify from 'slugify';

interface ICategory {
  name:string,
  slug:string
}

const CategorySchema = new mongoose.Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

CategorySchema.pre('save', function (this:ICategory & mongoose.Document,next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

const Category: Model<ICategory> =  mongoose.model<ICategory>("Category",CategorySchema)

export default Category