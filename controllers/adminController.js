import Artisan from "../models/artisanModel.js";
import Category from "../models/categoryModel.js";
import ErrorHandler from "../utils/ErrorHandler.js"
import { profileVerificationSuccessMail } from "../utils/mail.js";

export const addCategory = async(req,res,next)=>{
    if(!req.isAdmin){
        return next(new ErrorHandler("Not Authorized",403));
    }
    const {name,description} = req.body;
 try {
    const category = await Category.create({
        name:name,description:description
            })
            res.status(200).json({success:true,message:"Category created successfully",id:category._id})
 } catch (error) {
    return next(new ErrorHandler("Bad request",401))
 }
}
export const approveArtisan = async(req,res,next)=>{
    if(!req.isAdmin){
        return next(new ErrorHandler("Not Authorized",403));
    }
    const {aid} = req.query;
    const artisan = await Artisan.findById(aid);
    if(!artisan){
        return next(new ErrorHandler("No artisan found",401));
    }
    artisan.isVerified = true;
    await artisan.save();
    try {
        await profileVerificationSuccessMail(artisan.email)
    } catch (error) {
        console.log(error);
        // return next(new ErrorHandler("Some error occured",500))
    }
    res.status(200).json({success:true,message:"Artisan verified"})
}
export const 