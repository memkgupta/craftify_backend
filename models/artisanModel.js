import mongoose from 'mongoose';

const artisanSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  shop_name: String,
 phone_number:{type:String,required:true},
  shop_address:{
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
  email:{type:String,required:true,unique:true},
  bio: String,
  profile_image: String,
  images:{type:[String],validate:{
    validator:(arr)=>{
      return arr.length>=3
    },
    message: 'Atleast 3 images are required for profile'
  }}
}, { timestamps: true });

const Artisan = mongoose.model('Artisan', artisanSchema);

export default Artisan;
