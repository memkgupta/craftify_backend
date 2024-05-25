import User from "../models/userModel.js";
// import { default_profile_pic_url } from "../config/config.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { upload } from "../utils/cloudinary.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { sendOTP } from "../utils/messaging.js";
import { validResetPasswordRequest, validUserUpdateRequest } from "../utils/validations.js";
import { sendPasswordRestMail } from "../utils/mail.js";
const getAllUsers = async (req, res) => {
  //   try {
  //     const users = await find();
  //     res.status(200).json(users);
  //   } catch (err) {
  //     res.status(500).json({ message: err.message });
  //   }
};

export const createUser = async (req, res, next) => {
  const { password, phone, full_name } = req.body;
 let profile_url = "https://res.cloudinary.com/de4ix6d6g/image/upload/v1716056171/uvdcer6yk88us5emowbi.png";
  const file = req.file;
  const isUserExists = await User.findOne({ $or: { phone: phone } });
  if (isUserExists) {
    return next(new ErrorHandler("User already exists", 401));
  }
  if (phone == null) {
    return next(new ErrorHandler("Please provide a phone number", 401));
  }
  if (file) {
  try {
    profile_url = await upload(file, next);
  } catch (error) {
    return next(new ErrorHandler(error.message,500))
  }
  }

 

  const user = await User.create({
   phone:phone,password,profile_pic:profile_url,full_name:full_name,role:'customer',
  });
  let otp 
  try {
 otp  = await sendOTP(user,next);
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Internal Server Error", 500));
  }
  const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'1d'});
  user.verification_token = token
  user.otp = otp.otp;
  await user.save();
res.status(200).json({success:true,message:"User created successfully",token:token});
};

export const loginUser = async(req,res,next)=>{
  const {phone,password }  = req.body;
const user  = await User.findOne({phone:phone});
if(!user){
  return next(new ErrorHandler("User not exists",404));
}
const isPasswordMatched = await bcrypt.compare(password,user.password);
if(!isPasswordMatched){
  return next(new ErrorHandler("Bad credentials",401));
}
const payload = {
  _id:user._id,

}
const token = await jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'7d'});
res.status(200).json({success:true,message:"Login Successfull",token:token});
}
export const updateUser = async(req,res,next)=>{
  const user = req.user;
  const {error} = validUserUpdateRequest(req.body);
  if(error){
    return next(new ErrorHandler(error.message,401));
  }
  try {
    let userUpdate = await User.findById(user._id);
    const {full_name,bio,email} = req.body;
    if(full_name) userUpdate.full_name = full_name;
    if(bio) userUpdate.bio = bio;
    if(req.file){
      try {
        let file = req.file;
        let profile_pic_url = await upload(file,next);
        userUpdate.profile_pic = profile_pic_url
      } catch (error) {
       console.log(error)
       return next(new ErrorHandler(error.message,500));
      }
    }
    if(email) userUpdate.email = email;
    await userUpdate.save()
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Some error occured",500));
  }
}
export const resetPasswordRequest = async(req,res,next)=>{
  const {error} = validResetPasswordRequest(req.body);
  if(error){
    return next(new ErrorHandler(error.message,401))
  }
  const {phone,email} = req.body;
  if(phone){
try {
  let user = await User.findOne({phone:phone});
  if(!user){
    return next(new ErrorHandler("User not found",401));
  }
  user.otp = await sendOTP(user,next);
  await user.save();
  res.status(200).json({success:true,verification_type:"otp"});
} catch (error) {
  console.log(error);
  return next(new ErrorHandler("Some error occured",500))
}
  }
  if(email){
try {
  let user = await User.findOne({email:email});
  if(!user){
    return next(new ErrorHandler("User not found",401));
  }
  user.access_token = await jwt.sign(user._id,process.env.JWT_SECRET,{expiresIn:'1d'});

  await user.save();
  const mailRes = await sendPasswordRestMail(user.email,user.access_token);
  if(mailRes.error){
    console.log(mailRes.error)
    return next(new ErrorHandler("Some error occured",500))
  }
  res.status(200).json({success:true,verification_type:"token"});
} catch (error) {
  console.log(error);
  return next(new ErrorHandler("Some error occured",500))
}
  }
}
export const verifyOtp = async(req,res,next)=>{
const {otp,token} = req.body;
const {id} =  jwt.verify(token,process.env.JWT_SECRET);
const user = await User.findById(id);
if(!user||(user.otp==null || user.otp=="")){
  return next(new ErrorHandler("Bad request",401));
}

if(otp==user.otp){
user.isVerified = true;
user.otp = null
user.verification_token = null;
try{
  await user.save()
}
catch(error){
  console.log(error)
  return next(new ErrorHandler("Some error occured",500))
}
}
else{
  return next(new ErrorHandler("OTP do not match",401))
}
res.status(200).json({success:true,message:"OTP verification done"})
}
