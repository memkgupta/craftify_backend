import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rating: Number,
  comment: String,
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);

export default Review;
