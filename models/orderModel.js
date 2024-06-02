import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  total_amount: Number,
  artisan_id:{type:mongoose.Schema.Types.ObjectId,ref:'Artisan'},
  date:{ type:Date,required:true},
  paymentMethod:{type:String,enum:['COD','UPI','CARD'],default:'COD'},
  items:[{name:String,quantity:Number}],
  payment_id:{type:mongoose.Schema.Types.ObjectId,ref:'Payment'},
  address:{
    street: {
      type: String,
      required: [true, 'Street address is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
    },
    postalCode: {
      type: String,
      required: [true, 'Postal code is required'],
      trim: true,
      validate: {
        validator: function (v) {
          return /^\d{6}$/.test(v); // US ZIP Code format: 12345 or 12345-6789
        },
        message: props => `${props.value} is not a valid postal code!`,
      },
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
    },
  },
  status: { type: String, enum: ['pending', 'processing','dispatched', 'shipped', 'delivered', 'cancelled'] ,default:'pending'},
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

export default Order;
