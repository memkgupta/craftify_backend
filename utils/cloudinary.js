import dataUriParser from 'datauri/parser.js';
import path from 'path'
import cloudinary from 'cloudinary';
import ErrorHandler from './ErrorHandler.js';
export const upload = async(file,next)=>{
    const data_uri = getUri(file);
    let myCloud;
    try {
        myCloud = await cloudinary.v2.uploader.upload(data_uri.content);
        return myCloud.url;
    } catch (error) {
        console.log(error);
      throw new Error(error.message);
    }
}
const getUri = (file)=>{
    const parser = new dataUriParser();
    const extname = path.extname(file.originalname);
    return parser.format(extname,file.buffer);
}