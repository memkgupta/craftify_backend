import User from "../models/userModel.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import jwt from 'jsonwebtoken'
 const auth = async function (req, res, next) {

    // Get token from the request header
    const header = req.header('Authorization');
  
    // Check if no token
    if (!header) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }
 const token = header.split(' ')[1];
 if(!token){
  return res.status(401).json({ msg: 'No token, authorization denied' });
 }
    // Verify token
    try {
    
      const decoded = await jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded)
      const user = await User.findById(decoded._id)
      if(!user){
        return next(new ErrorHandler("User not found",401))
      }
      req.user = user;
      next();
    } catch (err) {
      console.log(err)
      res.status(401).json({ msg: 'Token is not valid' });
    }
  };
  export default auth;