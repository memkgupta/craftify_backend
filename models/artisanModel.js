import mongoose from 'mongoose';

const artisanSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  shop_name: String,
  email:{type:String,required:true,unique:true},
  bio: String,
  profile_image: String,
}, { timestamps: true });

const Artisan = mongoose.model('Artisan', artisanSchema);

export default Artisan;
