import mongoose from "mongoose";
const returnRequestSchema = new mongoose.Schema({
    request_id:{type:mongoose.Schema.Types.ObjectId,ref:"CancellationRequest"},
    order_id:{type:mongoose.Schema.Types.ObjectId,ref:'Order'},
    items:[{type:mongoose.Schema.Types.ObjectId,ref:'OrderItem'}],
    artisan_id:{type:mongoose.Schema.Types.ObjectId,ref:'Artisan'},
    
    status:{type:String,enum:["returned","pending","pickedup"],default:"pending"}
})
const ReturnRequest = mongoose.model("Returnrequest",returnRequestSchema);
export default ReturnRequest;