import Category from "../models/categoryModel.js";
import ErrorHandler from "../utils/ErrorHandler.js"

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