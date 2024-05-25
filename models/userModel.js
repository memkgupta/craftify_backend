import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'
const userSchema = new mongoose.Schema({
  email:{type:String},
  password: {type:String,required:true},
  profile_pic:String,
  bio:String,
  phone:{type:String,unique:true,required:true},
  full_name: String,
  role: { type: String, enum: ['customer', 'artisan', 'admin'] },
  otp:{type:String},
  verification_token:{type:String},
  access_token:{type:String},
  isVerified:{type:Boolean,default:false}
}, { timestamps: true });
userSchema.pre('save',async function(){
    if(this.isModified('password')){
        const hashed = await bcrypt.hash(this.password,12);
        this.password = hashed;
        
    }
    })
const User = mongoose.model('User', userSchema);

export default User;
