import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  amount: Number,
  payment_method: { type: String, enum: ['credit_card', 'paypal', 'bank_transfer'] },
  payment_status: { type: String, enum: ['pending', 'completed', 'failed'] },
  transaction_id: String,
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
