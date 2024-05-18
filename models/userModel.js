import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({

  password: String,
  profile_pic:String,
  phone:{type:String,unique:true,required:true},
  full_name: String,
  role: { type: String, enum: ['customer', 'artisan', 'admin'] },
  otp:{type:String},
  verification_token:{type:String},
  forgot_password_token:{type:String},
}, { timestamps: true });
userSchema.pre('save',async function(){
    if(this.isModified('password')){
        const hashed = await bcrypt.hash(this.password,12);
        this.password = hashed;
    }
    })
const User = mongoose.model('User', userSchema);

export default User;
