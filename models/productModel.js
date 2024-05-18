import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  artisan_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Artisan' },
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  name: String,
  description: String,
  price: Number,
  stock_quantity: Number,
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

export default Product;
