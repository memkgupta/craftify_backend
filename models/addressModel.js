import mongoose from 'mongoose';

const shippingAddressSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  address_line1: String,
  address_line2: String,
  city: String,
  state: String,
  postal_code: String,
  country: String,
}, { timestamps: true });

const ShippingAddress = mongoose.model('ShippingAddress', shippingAddressSchema);

export default ShippingAddress;
