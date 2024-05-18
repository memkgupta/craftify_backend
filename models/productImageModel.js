import mongoose from 'mongoose';

const productImageSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  image_url: String,
}, { timestamps: true });

const ProductImage = mongoose.model('ProductImage', productImageSchema);

export default ProductImage;
