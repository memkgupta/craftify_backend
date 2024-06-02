import mongoose from "mongoose";

const schema =new  mongoose.Schema({
    user_id:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    order_id:{type:mongoose.Schema.Types.ObjectId,ref:"Order"},
    order_item_id:{type:mongoose.Schema.Types.ObjectId,ref:"OrderItem"},
    reason:{type:String,required:true},
    artisan_id:{type:mongoose.Schema.Types.ObjectId,ref:"Artisan"},
    date:{type:Date},
    status:{type:String,enum:['requested','approved','rejected'],default:'requested'}
})

const CancellationRequest = mongoose.model("CancellationRequest",schema);
export default CancellationRequest;