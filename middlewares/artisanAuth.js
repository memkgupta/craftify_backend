import Artisan from "../models/artisanModel.js";
import ErrorHandler from "../utils/ErrorHandler.js";

const artisanAuth = async(req,res,next)=>{
    const userId = req.user._id;
    try {
        const artisan = await Artisan.findOne({user_id:userId});
        if(!artisan){
            return next(new ErrorHandler("No artisan registered",401));
        }
        req.isArtisan = true;
        req.artisanAccount = artisan;
        next();
    } catch (error) {
        console.log(error);
        return next(new ErrorHandler("Some error occured",500))
    }
   
}
export default artisanAuth;