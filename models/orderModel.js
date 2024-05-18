import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  total_amount: Number,
  status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

export default Order;
