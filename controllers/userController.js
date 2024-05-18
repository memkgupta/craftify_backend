import User from "../models/userModel.js";
import { default_profile_pic_url } from "../config/config.js";
import { upload } from "../utils/cloudinary.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { sendOTP } from "../utils/messaging.js";
const getAllUsers = async (req, res) => {
  //   try {
  //     const users = await find();
  //     res.status(200).json(users);
  //   } catch (err) {
  //     res.status(500).json({ message: err.message });
  //   }
};

const createUser = async (req, res, next) => {
  const { password, phone, full_name } = req.body;
  let profile_url = default_profile_pic_url;
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
      console.log(error);
      return next(new ErrorHandler("Internal Server Error", 500));
    }
  }
  let otp = ""
  try {
 otp  = await sendOTP(user,next);
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Internal Server Error", 500));
  }

  const user = await User.create({
   phone:phone,password,profile_pic:profile_url,full_name:full_name,role:'customer',otp:otp
  });
  const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'1d'});
  user.verification_token = token
  await user.save();
res.status(200).json({success:true,message:"User created successfully",token:token});
};

const loginUser = async(req,res,next)=>{
  
}

export default {
  getAllUsers,
  createUser,
};
