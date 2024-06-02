import Delivery from "../models/deliveryModel"
import OrderItem from "../models/orderItem.model";
import Order from "../models/orderModel";
import ErrorHandler from "../utils/ErrorHandler";


export const initiateDelivery = async(order,items)=>{
const delivery = await Delivery.create({
    order_id:order._id,
    items:items,
    artisan_id:order.artisan_id,
    current_location:"Artisan",
    status:"processing",
});
return delivery;
}
export const pickup = async(req,res,next)=>{
    const order_item_id = req.query.oid;
    try {
const updateOrderItem = await OrderItem.findByIdAndUpdate(order_item_id,{$set:{status:"pickedup"}})
        res.status(200).json({
            success:true,message:"Order status updated successfully"
        })
    } catch (error) {
        return next(new ErrorHandler(error.message,401));
    }
}
 
export const itemArrivedAtCenter = async(req,res,next)=>{
    const order_item_id = req.query.oid;
    try {
const updateOrderItem = await OrderItem.findByIdAndUpdate(order_item_id,{$set:{status:"arrived at center"}})
        res.status(200).json({
            success:true,message:"Order status updated successfully"
        })
    } catch (error) {
        return next(new ErrorHandler(error.message,401));
    }
}
export const dispatchOrder = async(req,res,next)=>{
    const order_id = req.query.oid;
    try {
        const orderItems = await OrderItem.find({$and:[
            {order_id:order_id},{status:{$ne:"cancelled"}}
        ]});

        if(orderItems.some(orderItems=>orderItems.status!="arrived at center")){
            return next(new ErrorHandler("All order items not arrived at center yet",401));
        }
await Order.findByIdAndUpdate(order_id,{$set:{status:"dispatched"}});
await OrderItem.updateMany({
    $and:[
        {order_id:order_id},{status:{$ne:"cancelled"}}
    ]
},{$set:{status:"dispatched"}})


    } catch (error) {
        console.log(error);
        return next(new ErrorHandler("Some error occured",500))
    }
}
export const deliverOrder = async(req,res,next)=>{
    const order_id = req.query.oid;
    const orderItems = await OrderItem.find({$and:[
        {order_id:order_id},{status:{$ne:"cancelled"}}
    ]});
    try {

await Order.findByIdAndUpdate(order_id,{$set:{status:"delivered"}});
await OrderItem.updateMany({
    $and:[
        {order_id:order_id},{status:{$ne:"cancelled"}}
    ]
},{$set:{status:"delivered"}})


    } catch (error) {
        console.log(error);
        return next(new ErrorHandler("Some error occured",500))
    }
}