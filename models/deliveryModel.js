import mongoose from "mongoose";
const deliverySchema = new mongoose.Schema({
    order_id:{type:mongoose.Schema.Types.ObjectId,ref:'Order'},
    items:[{type:mongoose.Schema.Types.ObjectId,ref:'OrderItem'}],
    artisan_id:{type:mongoose.Schema.Types.ObjectId,ref:'Artisan'},
    current_location:{type:String},
    status:{type:String,enum:["processing","pickedup","dispatched","delivered"],default:"processing"}
});

const Delivery = mongoose.model("Delivery",deliverySchema);
export default Delivery;