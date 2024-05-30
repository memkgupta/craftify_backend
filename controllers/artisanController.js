import Artisan from "../models/artisanModel.js";
import User from "../models/userModel.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { uploadMultipleFiles } from "../utils/cloudinary.js";
import { validAddProductRequest, validArtisanRegisterRequest, validArtisanUpdateRequest, validProductUpdateRequest } from "../utils/validations.js"
import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js"
import ProductImage from "../models/productImageModel.js";
import {stringToDate} from "../utils/helper.js"
import Order from "../models/orderModel.js";
import mongoose from "mongoose";
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
res.status(200).json({success:true,message:"Product added successfully",pid:product._id});
 } catch (error) {
   console.log(error)
   return next(new ErrorHandler("Some error occured",500))
 }
}
export const updateProduct = async(req,res,next)=>{
const pid = req.params.id;
// const updateType = req.query.ut;
const {error} = validProductUpdateRequest(req.body);
if(error){
  return next(new ErrorHandler(error.message,401));
}
const {name,description,price,stock_quantity} = req.body;
// currently only info update
const product = await Product.findById(pid);
if(name) product.name = name;
if(description) product.description = description;
if(price) product.price = Number(price);
if(stock_quantity) product.stock_quantity = stock_quantity;
try {
  await product.save();
} catch (error) {
  console.log(error);
  return next(new ErrorHandler("Some error occured",500))
}
res.status(200).json({success:true,message:"Product updated successfully"})
}
export const searchArtisan = async(req,res,next)=>{
const {keyword,location,ratings,art_type} = req.query;
const filters = []
let page = req.query.page;
if (location) {
  filters.push({ 'shop_address.city': { $regex: location, $options: 'i' } });
}
if(ratings){
  filters.push({ratings:{$gte: Number(ratings)}})
}
if(keyword){
  filters.push({shop_name:{$regex:keyword,$options:'i'}})
}
if(art_type){
  filters.push({art_type: mongoose.Types.ObjectId(art_type)})
}

const aggregation = 
  [
    {$match:filters.length?{ $and: filters }:{}},
    {
      $lookup: {
        from: 'arttypes', // the name of the ArtType collection
        localField: 'art_type',
        foreignField: '_id',
        as: 'art_type_info'
      }
    },
    { $unwind: '$art_type_info' },
  {$facet:
   { totalResults:{$count:"count"},
     artisans:[
      { $project:{
        _id:1,
         shop_name:1,
         shop_address:1,
         ratings:1,
         isVerified:1,
         profile_image:1,
         image:{ $arrayElemAt:["$images",0] },
    
        }}, { $skip: (page - 1) * 20 },
        { $limit: Number(20) }
     ]
  }
  },
  {
    $project:{
      totalResults:{$arrayElemAt:["$totalResults.count",0]},
      artisans:1
    }
  }
  ]
  try {
const result = await Artisan.aggregate(aggregation)
    res.status(200).json({success:true,...result})
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Some error occured",500));
  }
}
export const trashProduct  = async(req,res,next)=>{
   const pid = req.params.id;
   try {
    
    const artisan = await Artisan.findById(req.artisanAccount._id);
    if(!artisan){
      return next(new ErrorHandler("Bad request",401))
    }
    const product = await Product.findById(pid);
    if(!product.artisan_id.equals(artisan._id)){
      return next(new ErrorHandler("Not Authorized",401));
    }
    product.isTrashed = true;
    await product.save();
    res.status(200).json({success:true,message:"Product trashed successfully"});
   } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Some error occured",500))
   }
}
export const getOrders = async(req,res,next)=>{
    const artisan = await Artisan.findById(req.artisanAccount._id);
    if(!artisan){
      return next(new ErrorHandler("Bad request",403))
    }
    const {status,fromDate,toDate,sort,minPrice,maxPrice,product_name} = req.query;
    const filters = []
    const itemFilters=[]
    if(status){
      filters.push({
        status:status
      })
    }
    if(fromDate||toDate){
      filters.push({date:{
        ...(fromDate&&{$gte:stringToDate(fromDate)}),
        ...(toDate && {$lte:stringToDate(toDate)})
      }})
    }
if(minPrice||maxPrice){
filters.push({total_amount:{
  ...(minPrice&&{$gte:Number(minPrice)}),
  ...(maxPrice&&{$lte:Number(maxPrice)})
}})

}
const totalResults = await Order.aggregate([
  {$match:filters.length?{$and:filters}:{}},
  {$count:"totalResults"}
 
]);
console.log(totalResults);
   try {
    const orders  = await Order.aggregate([
      {$match:filters.length?{$and:filters}:{}},
      {$lookup:{
        from:"orderitems",
        localField:"_id",
        foreignField:"order_id",
        as:"item"
      }},
     
      {
        $unwind: "$item" // Unwind the items array
      },
      {
        $lookup:{
          from:"Product",
          localField:"item.product_id",
          foreignField:"_id",
          as:"product"
        }
      },
      {
        $project:{
          total_amount:1,
          date:1,
          status:1,
          items:{
            product_name:{$first:"$product.name"},
            qty:"$item.quantity",
            
          }
        }
      },
      {
        $group: {
          _id: "$_id",
          total_amount:{$first:"$total_amount"},
          date:{$first:"$date"},
          status:{$first:"$status"},
          items:{$push:'$item'}
          
        }
      }
     ]);
  res.status(200).json({success:true,totalResults:totalResults[0],orders:orders});
   } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Some error occured",500))
   }

}
export const getProducts = async(req,res,next)=>{
  try {
   
    const page = req.query.page;
  const artisan = await Artisan.findById(req.artisanAccount._id);
  
  const products = await Product.find({artisan_id:artisan._id}).skip((page-1)*10).limit(10);
  res.status(200).json({success:true,products:products,totalResults:products.length});
  } catch (error) {
    console.log(error)
    return next(new ErrorHandler("Some error occured",500))
  }
}
export const getProductDetails = async(req,res,next)=>{
  const artisan = await Artisan.findById(req.artisanAccount._id);
  if(!artisan){
    return next(new ErrorHandler("Bad request",403))
  }
  const pid = req.params.id;
  const product = await Product.findById(pid)
 try {
  const data = await Product.aggregate([
    {$match:{
      "_id":pid
    }},
    {$lookup:{
      from:"orderitems",
      localField:"_id",
      foreignField:"product_id",
      as:"orders"
    }},
    {
$unwind:"$orders"
    },
    {
      $group: {
        _id: {$first:"$_id"},
        // name:{$first:"$name"},
        // price:{$first:"$price"},
        
        // stock_quantity:{$first:"$stock_quantity"},
        // date: { $first: "$orders.date" },
        total_quantity: { $sum: "$orders.quantity" }
      }
    },
    {
      $project:{
        total_quantity:1
      }
    }
  ])

  res.status(200).json({success:true,product:product,data:data});
 } catch (error) {
  console.log(error)
  return next(new ErrorHandler("Some error occured",500))
 }
}