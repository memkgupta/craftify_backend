import User from "../models/userModel.js";
import ErrorHandler from "../utils/ErrorHandler.js";

const adminAuth = async(req,res,next)=>{
   
    try {
        const user = req.user;
        if(user.role!="admin"){
            return next(new ErrorHandler("Not authorized",403));
        }
        req.isAdmin = true;
        
        next();
    } catch (error) {
        console.log(error);
        return next(new ErrorHandler("Some error occured",500))
    }
   
}
export default adminAuth;