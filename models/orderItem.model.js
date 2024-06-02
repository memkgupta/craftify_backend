import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  quantity: Number,
  price: Number,
  status:{type:String,enum:["pickedup","delivered","cancelled","arrived at center","dispatched"]},
  date:{type:String,required:true}
}, { timestamps: true });

const OrderItem = mongoose.model('OrderItem', orderItemSchema);

export default OrderItem;
