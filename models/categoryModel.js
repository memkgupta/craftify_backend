import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, unique: true },
  description: String,
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);

export default Category;
