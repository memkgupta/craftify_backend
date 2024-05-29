import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  total_amount: Number,
  artisan_id:{type:mongoose.Schema.Types.ObjectId,ref:'Artisan'},
  date:{ type:Date,required:true},
  
  status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

export default Order;
