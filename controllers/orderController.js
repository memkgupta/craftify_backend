import Order from "../models/orderModel.js";
import ErrorHandler from "../utils/ErrorHandler.js"
import Artisan from "../models/artisanModel.js"
import { validCreateOrderRequest } from "../utils/validations.js";
import OrderItem from "../models/orderItem.model.js";
import Product from "../models/productModel.js"
import Payment from "../models/paymentModel.js";
import { sendOrderPlacedEmail } from "../utils/mail.js";
import CancellationRequest from "../models/orderCancellationModel.js";
import { initiateDelivery } from "./deliveryController.js";
export const createOrder = async(req,res,next)=>{
    
    const {error} = validCreateOrderRequest(req.body);
    if(error){
        return next(new ErrorHandler(error.message,401));
    }
const {artisan_id,date,payment_method,items,address} = req.body;

const artisan = await Artisan.findById(artisan_id);
if(!artisan){
    return next(new ErrorHandler("Artisan not found",401))
}

const order = await Order.create({
    user_id:req.user._id,
    artisan_id:artisan._id,
    date:date,
    paymentMethod:payment_method,
    address:address
});
var total_amount ;
const orderItems = []
total_amount = 0;
for(const item of items){
    const product = await Product.findById(item.p_id);
        if(!product){
            await order.deleteOne();
            return next(new ErrorHandler("Bad request invalid product",401));
        }
        total_amount += product.price*item.qty;
      const orderItem =   await OrderItem.create({
            order_id:order._id,
            product_id:product._id,
            quantity:item.qty,
            price:product.price,
            date:date,
        })
        orderItems.push({name:product.name,quantity:item.qty});
}

order.total_amount = total_amount;
order.items = orderItems;

await order.save();
res.status(200).json({success:true,message:"Order created complete payment",order_id:order._id});
}
export const completeOrder = async(req,res,next)=>{
    const {order_id,payment_id} = req.body;
    const order = await Order.findById(order_id);
    if(!order){
        return next(new ErrorHandler("Bad request",403));
    }
    const payment = await Payment.findById(payment_id);
    if(!payment){
        return next(new ErrorHandler("Bad request",403));
    }
    if(payment.payment_status=="completed"){
order.payment_id =payment._id;
order.status = 'processing'
await order.save();
const orderItems = await OrderItem.find({order_id:order._id});
for(const item of orderItems){
    await Product.findByIdAndUpdate(item.product_id,{$inc:{stock_quantity:-1*item.quantity}})
;}
const items = orderItems.map(item=>item._id);
const delivery = await initiateDelivery(order,items)
if(req.user.email){
    await sendOrderPlacedEmail(req.user.email)
}
res.status(200).json({success:true,message:"Order placed successfully",order_id:order._id,tracking_id:delivery._id});
    }
    else{
        return next(new ErrorHandler("Payment not completed yet",403));
    }
}
export const getOrderDetails = async(req,res,next)=>{
    const order_id = req.query.oid;
    const order = await Order.findById(order_id);
    if(!order){
        return next(new ErrorHandler("Order not found",401));
    }
 try {

    const order_data = await Order.aggregate([
        {
            $match:{
                _id:order._id,
                // status: {
                //     $in: [ 'processing', 'shipped', 'delivered', 'cancelled'],
                //     $ne: "pending"
                //   }
            }
        },
        {$lookup:{
            from:"payments",
            localField:"payment_id",
            foreignField:"_id",
            as:"payment_details"
        }},
        {
            $lookup:{
                from:"orderitems",
                foreignField:"order_id",
                localField:"_id",
                as:"item"
            }
        },
       
        {$unwind:"$item"},
        {$lookup:{
            from:"products",
            localField:"item.product_id",
            foreignField:"_id",
            as:"product"
        }},
        {$project:{
            total_amount:1,
            date:1,
           
            status:1,
            "item.quantity":1,
            "item.product":{
                product_name:{$first:"$product.name"},
                product_id:{$first:"$product._id"},
                product_image:{$arrayElemAt:["$product.images",0]}
            }
        }},
        {$group:{
            _id:"$_id",
            orderitems:{
                $push:"$item"
            },
            total_amount:{$first:"$total_amount"},
            date:{$first:"$date"},
            

            status:{$first:"$status"}
            
        }},
        {$project:{
           
          orderitems:1,
          total_amount:1,
          status:1,
          date:1
        }}
    ]) ;
    res.status(200).json({success:true,data:order_data[0]});
 } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Some error occured",500))
 }

}
export const orderCancellationRequest = async(req,res,next)=>{
   const order_item_id = req.query.oid;
   const {reason,date} = req.body;
   const orderItem = await OrderItem.findById(order_item_id).populate('product_id');
   
   if(!orderItem){
    return next(new ErrorHandler("Order item not found",401));
   } 
   const cancellationRequest = await CancellationRequest.create({
    user_id:req.user._id,
    order_id:orderItem.order_id,
    order_item_id:orderItem._id,
    artisan_id:orderItem.product_id.artisan_id,
    reason:reason,
    date:date
   }); 
   res.status(200).json({success:true,message:"Cancellation request has been submitted , will update you"});
}
export const returnItems = async(req,res,next)=>{

}