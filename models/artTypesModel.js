import mongoose from "mongoose";

const ArtTypeSchema = new mongoose.Schema({
    name:String
},{timestamps:true})
const ArtType = mongoose.model('ArtType',ArtTypeSchema);