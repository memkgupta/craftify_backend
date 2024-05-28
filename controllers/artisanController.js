import Artisan from "../models/artisanModel.js";
import User from "../models/userModel.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { uploadMultipleFiles } from "../utils/cloudinary.js";
import { validAddProductRequest, validArtisanRegisterRequest, validArtisanUpdateRequest, validProductUpdateRequest } from "../utils/validations.js"
import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js"
import ProductImage from "../models/productImageModel.js";
export const registerAsArtisan = async(req,res,next)=>{
 let {
    shop_name,shop_address,bio
} = req.body
shop_address = JSON.parse(shop_address);
    const {error} = validArtisanRegisterRequest({shop_name,shop_address,bio});
   
    if(error){
        return next(new ErrorHandler(error.message));
    } 
    const user = await User.findById(req.user._id);
    
    
    if(!user.email){
return next(new ErrorHandler("Please update your email id",401))
    }
    if(!req.files||req.files.length<3){
    return next(new ErrorHandler("Atleast 3 images are required",401))
    }
  const artisan = new Artisan({
    user_id:user._id,
    
    shop_name:shop_name,
    phone_number:user.phone,
    shop_address:shop_address,
    email:user.email,
    bio:bio,
    profile_image:user.profile_pic
  });
  let images = []
  try {
    const fileUploadPromises = req.files.map(file=>uploadMultipleFiles(file))
 const results =  await Promise.all(fileUploadPromises)
 results.forEach(item=>{
    images.push(item.url);
 })

  } catch (error) {
    console.log(error)
    return next(new ErrorHandler("Some error occured",500))
  }
  artisan.images = images;
  try {
    await artisan.save()
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Bad request",401))
  }
  res.status(200).json({success:true,message:"Request for regestering as artist has been successfully registered",id:artisan._id})
}
export const getArtisan = async(req,res,next)=>{
  const id = req.params.id;
  
  try {
    const artisan = await Artisan.findById(id).select('-createdAt -updatedAt');

    if(!artisan){
      return next(new ErrorHandler("No artisan found",404))
    }
    res.status(200).json({success:true,artisan:artisan});
  } catch (error) {
    return next(new ErrorHandler("Some error occured",500));
  }
}
export const getArtisanDashboard = async(req,res,next)=>{
  // TODO : to be implemented yet
}
export const update = async(req,res,next)=>{
  let {shop_name,shop_address,bio}=req.body;
  shop_address = JSON.parse(shop_address);
  const {error} = validArtisanUpdateRequest({shop_name,shop_address,bio});
  if(error){
    return next(new ErrorHandler(error.message,401))
  }

  let artisan = await Artisan.findById(req.artisanAccount._id);
  if(!artisan){
    return next(new ErrorHandler("Artisan not found",404))
  }
  if(!artisan.isVerified){
    return next(new ErrorHandler("Artisan not verified yet",401))
  }
  const lastUpdateDate = artisan.updatedAt;
  const todayDate = new Date()
  if((todayDate.getMilliseconds()-lastUpdateDate.getMilliseconds())<30*24*60*60*1000){
    return next(new ErrorHandler("Can't update shop info as it is recently created or updated"))
  }
  if(shop_name) artisan.shop_name = shop_name;
  if(shop_address) artisan.shop_address = shop_address;
  if(bio) artisan.bio = bio;
try {
  await artisan.save()
} catch (error) {
  console.log(error);
  return next(new ErrorHandler("Some error occured",500))
}
}
export const addProduct = async(req,res,next)=>{
 const {error} = validAddProductRequest(req.body);
 if(error){
  return next(new ErrorHandler(error.message,401));
 }
if(!req.files||req.files.size<3){
  return next(new ErrorHandler("Atleast 3 product images are required",401))
}
 const {category_id,name,description,price,stock_quantity} = req.body;
 const category = await Category.findById(category_id)
 if(!category){
  return next(new ErrorHandler("Bad request",401));
 }
 const product = await Product.create({artisan_id:req.artisanAccount._id,
  category_id:category._id,name:name,description:description,price:price,stock_quantity:stock_quantity
 });
 let images = []
 try {
   const fileUploadPromises = req.files.map(file=>uploadMultipleFiles(file))
const results =  await Promise.all(fileUploadPromises)
results.forEach(async(item)=>{
  const image = await ProductImage.create({product_id:product._id,image_url:item.url})
   images.push(image);
})
product.images = images;
await product.save();
 } catch (error) {
   console.log(error)
   return next(new ErrorHandler("Some error occured",500))
 }
}
export const updateProduct = async(req,res,next)=>{
const pid = req.params.id;
const updateType = req.query.ut;
const {error} = validProductUpdateRequest(req.body);
if(error&&updateType!="img"){
  return next(new ErrorHandler(error.message,401));
}

const product = await Product.find
}
export const searchArtisan = async(req,res,next)=>{
  // TODO : to be implemented yet
}
export const removeProduct  = async(req,res,next)=>{
    // TODO : to be implemented yet

}
export const getOrders = async(req,res,next)=>{
    // TODO : to be implemented yet
}
